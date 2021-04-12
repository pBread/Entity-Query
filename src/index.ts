import difference from "lodash.difference";
import intersection from "lodash.intersection";
import isObj from "lodash.isplainobject";
import mergeWith from "lodash.mergewith";

/****************************************************
 Constants
****************************************************/
const ignore = Symbol(); // used so ignores can be queried
const indexMap = new WeakMap();

/****************************************************
 Main
****************************************************/
export function EntityQuery<T extends { [key: string]: R }, R extends Obj>(
  entities: T // normalized entities
) {
  return {
    search(query?: Query, options?: QueryOptions) {
      return search(entities, query, makeOptions(options));
    },
  };
}

function search<T extends { [key: string]: R }, R extends Obj>(
  entities: T,
  query: Query | Query[] | typeof ignore = ignore,
  opts: QueryOpts
): string[] {
  if (query === ignore) return Object.keys(entities);

  const index =
    (indexMap.get(entities) as Index) ||
    (indexMap.set(entities, buildIndex(entities)).get(entities) as Index);

  const idSets = (Array.isArray(query) ? query : [query]).map((query) =>
    queryIndex(index, query)
  );

  switch (opts.conditions) {
    case "all":
      return intersection(...idSets);

    case "any":
      return [...new Set(...idSets)];

    case "diff":
      return difference(Object.keys(entities), ...idSets);

    default:
      return intersection(...idSets);
  }
}

/****************************************************
 Index Builder
****************************************************/
function buildIndex<T extends { [key: string]: R }, R extends Obj>(
  root: T
): Index {
  return Object.values(root)
    .flatMap((rec) => buildRecordIndex(rec))
    .reduce(
      (acc, cur) =>
        mergeWith(acc, cur, (a, b) => {
          if (Array.isArray(a)) return a.concat(b);
        }),
      {}
    );
}

function buildRecordIndex<R extends Obj>(rec: R) {
  return buildIndexPaths(rec).map((path) =>
    buildNestedObject([rec.id], path.split("__."))
  );
}

function buildIndexPaths({ id, ...obj }: Obj, acc?: string): string[] {
  return Object.entries(obj).flatMap(([key, val]) =>
    isObj(val)
      ? buildIndexPaths(val, maybeJoin(key, acc))
      : maybeJoin(`${key}__.${val}`, acc)
  );
}

/****************************************************
 Index Query Handler
****************************************************/
function queryIndex(index: Index, query: Query): string[] {
  return intersection(
    ...buildQueryPaths(query).map((queryPath) =>
      traverseIndex(
        index,
        Object.keys(queryPath)[0].split("__."),
        Object.values(queryPath)[0]
      )
    )
  );
}

function buildQueryPaths(query: Query, acc?: string): QueryPath[] {
  return Object.keys(query).flatMap((key) =>
    isObj(query[key])
      ? buildQueryPaths(query[key], maybeJoin(key, acc))
      : { [maybeJoin(key, acc)]: query[key] }
  );
}

function traverseIndex(
  index: Index,
  path: string[],
  value: boolean | number | string
): string[] {
  if (!path.length) return index[`${value}`] as string[];

  const [cur, ..._path] = path;
  const _index = index[cur];

  if (!_index) return [];

  return traverseIndex(_index as Index, _path, value);
}

/****************************************************
 Types
****************************************************/
interface Index {
  [key: string]: Index | string[];
}

type Obj = { id: string; [key: string]: any };
export type Query = { [key: string]: any };
type QueryPath = { [key: string]: boolean | number | string };
type QueryOptions = { conditions?: "all" | "any" | "diff" };
type QueryOpts = ReturnType<typeof makeOptions>;

function makeOptions(options?: QueryOptions) {
  return { conditions: options?.conditions };
}

/****************************************************
 Utilities
****************************************************/
function buildNestedObject(value: any, path: string[]) {
  return path.reduceRight(
    (acc, cur, index) =>
      path.length - 1 <= index ? { [cur]: value } : { [cur]: acc },
    {}
  );
}

function maybeJoin(
  a: boolean | number | string,
  b: typeof ignore | boolean | number | string = ignore
) {
  return b === ignore ? `${a}` : `${b}__.${a}`;
}