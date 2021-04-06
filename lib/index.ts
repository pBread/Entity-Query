import difference from "lodash.difference";
import intersection from "lodash.intersection";
import isObj from "lodash.isplainobject";

let iCache = new Map(); // index cache
const qCache = new WeakMap(); // query cache

interface MoOptions {
  cacheSize?: number; // the number of memoized values
  conditions?: "all" | "any" | "diff" | "none"; // default conditions
  key?: string; // the record identifier, defaults to "id"
}

interface QueryOptions {
  conditions?: Conditions;
}

type Conditions = "all" | "any" | "diff" | "none";

type Query<R extends { [key: string]: any }> = {
  [K in keyof R]: R[K];
};

export function Mo<T extends Array<R>, R extends { [key: string]: any }>(
  records: T,
  options: MoOptions = {}
) {
  return {
    search(query: Query<R> | Query<R>[], opts: QueryOptions = {}) {
      return search(records, query, { ...options, ...opts });
    },
  };
}

/****************************************************
 Search
****************************************************/
function search<T extends Array<R>, R extends { [key: string]: any }>(
  records: T,
  query: Query<R> | Query<R>[],
  options: MoOptions
): number[] | string[] {
  const opts = buildOptions(options);

  const sets = (Array.isArray(query) ? query : [query]).map((query) =>
    toPaths(query)
  );

  return [];
}

/****************************************************
 Index Builder
****************************************************/
function getIndex<T extends { [key: string]: any }>(
  records: T[],
  path: string,
  opts: ReturnType<typeof buildOptions>
): { [key: string]: string } {
  if (iCache.has(records)) return iCache.get(docs);
}

/****************************************************
 Index Lookup
****************************************************/
function getIn<T extends { [key: string]: any }>(
  records: T[],
  path: string,
  opts: ReturnType<typeof buildOptions>
) {
  const index = getIndex(records, path, opts);
}

/****************************************************
 Utilities
****************************************************/
type NestedObj<T> = { [k: string]: NestedObj<T> | T };

function buildNestedObj<T>(value: T, path: string[]): NestedObj<T> {
  return path.reduceRight(
    (acc, cur, index) =>
      path.length - 1 <= index ? { [cur]: value } : { [cur]: acc },
    {}
  );
}

function buildOptions(options: MoOptions) {
  return {
    cacheSize: options?.cacheSize ?? 100,
    conditions: options?.conditions || "all",
    key: options?.key || "id",
  };
}

// Same as Java's hashCode()
function hashCode(...args: any[]): number {
  const json = JSON.stringify(args);

  for (var i = 0, hashed = 0; i < json.length; i++)
    hashed = (Math.imul(31, hashed) + json.charCodeAt(i)) | 0;

  return hashed;
}

function toPaths<R extends { [key: string]: any }>(
  query: Query<R>,
  root?: string
): NestedObj<string>[] {
  return (
    Object.entries(query)
      // @ts-ignore
      .flatMap(([key, val]) => {
        const path = root ? `${root}__.${key}` : key;
        return isObj(val) ? toPaths(val, path) : `${path}__.${val}`;
      })
  );
}
