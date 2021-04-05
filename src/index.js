import difference from "lodash.difference";
import intersection from "lodash.intersection";
import isObj from "lodash.isplainobject";
import mergeWith from "lodash.mergeWith";

let iCache = new Map();
const qCache = new WeakMap();

/**
 * Constructs an object w/Mo methods
 * @name Mo
 * @function
 * @returns { { filter: function(): Object[], find: function(): Object, search: function(): string[] } } - Object w/Mo methods
 *
 * @param { Object[] } docs - Array of JSON objects
 *
 * @param { Object } [options] - Default options. Can be overriden in method args.
 * @param { boolean | integer } [options.cache=10] - Controls how many
 * @param { string } [options.key="id"] - Indentifying key for docs
 * @param { ( "all" | "any" | "diff" | "none") } [options.conditions="all"] - Determines behavior of the query.
 */

export function Mo(docs, options = {}) {
  return {
    filter(query, opts = {}) {
      return filter(docs, query, { ...options, ...opts });
    },

    find(query, opts = {}) {
      return find(docs, query, { ...options, ...opts });
    },

    search(query, opts = {}) {
      return search(docs, query, { ...options, ...opts });
    },
  };
}

export default Mo;

/****************************************************
 Filter
****************************************************/
export function filter(docs, query, options) {
  const opts = toOpts(options);
  const ids = search(docs, query, opts);
  return docs.filter((doc) => ids.some((id) => doc[opts.key] === id));
}

/****************************************************
 Find
****************************************************/
function find(docs, query, options) {
  const opts = toOpts(options);
  const ids = search(docs, query, opts);
  return docs.find((doc) => ids.some((id) => doc[opts.key] === id));
}

/****************************************************
 Search
****************************************************/
export function search(docs, query, options) {
  const opts = toOpts(options);
  const queryArr = Array.isArray(query) ? query : [query];

  const setMap = queryArr
    .map(({ _key, ...query }, idx) => ({
      [_key || idx]: intersection(
        ...toPaths(query)
          .flat(Infinity)
          .map((path) => getIn(docs, path.split("__."), options))
      ),
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }));

  const sets = Object.values(setMap);

  if (/^\s*all\s*$/i.test(opts.conditions)) return intersection(...sets);
  if (/^\s*any\s*$/i.test(opts.conditions)) return [...new Set(...sets)];
  if (/^\s*diff\s*$/i.test(opts.conditions)) return difference(...sets);
  if (/^\s*none\s*$/i.test(opts.conditions))
    return difference([...sets], getIn(docs, [opts.key, "/^.*/i"], opts));
}

/****************************************************
 Lookup Ids in Index
****************************************************/
function getIn(docs, path, opts) {
  const index = getIndex(docs, path, opts);
  const qMap = qCache.get(index) || new Map();

  const pathArr = Array.isArray(path) ? path : [path];
  const pathHash = toHash(pathArr);
  if (qMap.has(pathHash)) return qMap.get(pathHash); // Return cached query result

  const ids = [...new Set(traverse(index, pathArr).flat(Infinity))];
  if (opts.cache)
    qCache.set(
      index,
      qCache.has(index)
        ? new Map([...qCache.get(index), ...qMap.set(pathHash, ids)])
        : qMap.set(pathHash, ids)
    );

  return ids;
}

function traverse(index, path) {
  return path.reduce((acc, cur, idx) => {
    if (obj(acc))
      if (cur in acc) return acc[cur];
      else if (toReg(cur))
        return Object.entries(acc).map(([key, val]) =>
          toReg(cur).test(key) ? traverse(val, path.slice(idx + 1)) : []
        );

    if (Array.isArray(acc)) return acc;
    return [];
  }, index);
}

/****************************************************
 Build Index
****************************************************/
function getIndex(docs, opts) {
  if (iCache.has(docs)) return iCache.get(docs);

  const docIndex = toIndex(docs, opts);
  setICache(docs, docIndex, opts);

  return docIndex;
}

function toIndex(docs, opts) {
  return docs
    .map((doc) => create(doc, doc[opts.key]))
    .flat(Infinity)
    .reduce(
      (acc, cur) =>
        mergeWith(acc, cur, (a, b) => {
          if (Array.isArray(a)) return a.concat(b);
        }),
      {}
    );

  function create(doc, id, path = []) {
    return Object.entries(doc).map(([key, val]) => {
      const obj = isObj(val) ? val : Array.isArray(val) ? { ...val } : null;

      if (obj) {
        if (!Object.keys(obj).length) return toObj([id], [...path, key, "{}"]);
        if (isObject(val)) return create(val, id, [...path, key]);
        if (Array.isArray(val)) return create({ ...val }, id, [...path, key]);
      }

      return toObj([id], [...path, key, val]);
    });
  }
}

/****************************************************
 Helpers
****************************************************/
function setICache(key, value, opts) {
  if (/false/i.test(opts.cache)) return null;

  iCache = new Map(
    [[key, value], ...[...iCache].filter(([k]) => k !== key)].slice(
      0,
      parseInt(opts.cache)
    )
  );
}

function toHash(item) {
  const opts = { algorithm: "md5", encoding: "base64" };
  if (Array.isArray(item)) return hash(item, opts);
  else return hash(item, opts);
}

function toObj(value, path) {
  return path.reduceRight(
    (acc, cur, index) =>
      path.length - 1 <= index ? { [cur]: value } : { [cur]: acc },
    {}
  );
}

function toOpts(options) {
  return {
    cache: options?.cache ?? 10,
    conditions: options?.conditions || "all",
    key: options?.key || "id",
  };
}

function toPaths(query, root) {
  return Object.entries(query).map(([key, val]) => {
    const path = root ? `${root}__.${key}` : key;
    return isObj(val) ? toPaths(val, path) : `${path}__.${val}`;
  });
}
