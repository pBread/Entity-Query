MoSearch allows developers to search/filter/find records in a simple, performant and unobtrusive manner.

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
  - [Simple Query](#simple-query)
  - [Nested Queries](#nested-queries)
  - [Regex](#regex)
  - [Conditions](#conditions)
  - [Memos](#memos)

## Features

- [x] Simple yet powerful record queries
- [x] Index-based search, ideal for large data sets
- [x] Memory safe caching
- [x] Memoized return values for simple equivalency checks (prevents unnecessary React re-renders)

## Install

```bash
yarn add @breadman/mosearch
```

#### Simple Query

```js
Mo(records).search({ name: "Purple Socks" });
```

#### Nested Queries

```js
Mo(records).search({ metadata: { material: "wool" } });
```

#### Regex

```js
Mo(records).search({ description: "/purple/i" }); // all records w/"purple" in description
Mo(records).search({ "/^desc/i": "/purple/i" }); // all records w/"purple" in a property starting w/"desc"
Mo(records).search({ "/^.*/": "/purple/i" }); // all records w/"purple" in any property
Mo(records).search({ "/^.*/": { material: "wool" } }); // all records w/a nested property "material" equal to "wool"
```

#### Conditions

```js
Mo(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "all",
}); // all records w/"purple" in name or description

Mo(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "any",
}); // any records w/"purple" in name or description

Mo(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "diff",
}); // records with purple in name or description, but not both

Mo(records).search({ description: "/purple/i" }, { conditions: "none" }); // all records w/out "purple" in description
```

#### Memos

MoSearch is designed to be used _liberally_ across your app. Under the hood, incremetal [Memoization](https://en.wikipedia.org/wiki/Memoization) (specifically [weak](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) memoization) is used to cache the "expensive" task of indexing a dataset.

Firstly, this makes it extremely cheap to run multiple queries on a dataset.

```js
Mo(lotsOfRecords).search({ name: "Purple Socks" }); // "expensive" data indexing is cached
Mo(lotsOfRecords).search({ metadata: { material: "wool" } }); // no indexing
```

Secondly, the same query on the same dataset will return the same result, which is helpful to prevent rerendering.

```js
const a = Mo(records).search({ name: "Purple Socks" });
const b = Mo(records).search({ name: "Purple Socks" });

a === b;
// true
```

Thirdly, cache is global thus these benefits are enjoyed across your app.
