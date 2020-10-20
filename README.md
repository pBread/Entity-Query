```bash
yarn add mosearch
```

## Motivation

Searching/filtering/finding records is one of the most common frontend tasks. However, it remains one of the more tedious and cognitively heavy aspects of building an app.

MoSearch allows developers to search/filter/find records in a simple, performant and unobtrusive manner.

## Features

#### Queries

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
Mo(records).search({ "/^.*/i": "/purple/i" }); // all records w/"purple" in any property
Mo(records).search({ "/^.*/": { material: "wool" } }); // all records w/a nested property "material" equal to "wool"
```

#### Conditions

```js
Mo(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "any",
}); // any records w/"purple" in name or description

Mo(records).search({ description: "/purple/i" }, { conditions: "none" }); // all records w/out "purple" in description
```

#### Incremental & Global Caching

MoSearch is designed to be called _liberally_ across your app. Under the hood, incremetal [Memoization](https://en.wikipedia.org/wiki/Memoization) (specifically [weak](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) memoization) is used to cache (1) the "expensive" task of indexing a dataset and (2) each query result.

Firstly, this means running multiple queries on a single dataset is extremely cheap.

```js
Mo(lotsOfRecords).search({ name: "Purple Socks" }); // "expensive" data indexing is cached
Mo(lotsOfRecords).search({ metadata: { material: "wool" } }); // no indexing
```

Secondly, this means the same query will return the previous result, which is helpful to prevent rerendering.

```js
const a = Mo(records).search({ name: "Purple Socks" });
const b = Mo(records).search({ name: "Purple Socks" });

a === b;
// true
```

Thirdly, this cache is global thus these benefits are enjoyed across your app.

## Example

Consider building a product catalog. An array of product records is fetched from an API and stored in state.

```json5
[
  {
    id: "1",
    name: "Purple Dress Socks",
    family: "Dress Socks",
    description: "Really stylish dress socks. Great for businessing.",
    availability: {
      inStock: true,
    },
    metadata: { material: "wool" },
  },
  {
    id: "2",
    name: "White Running Socks",
    family: "Athletic Socks",
    description: "Breathable cotton running socks.",
    availability: {
      inStock: true,
    },
    metadata: { material: "cotton" },
  },
  // ... hundreds of records
]
```

To filter all wool socks...

```js
import Mo from "mosearch";

const woolSocks = Mo(records).filter({ metadata: { material: "wool" } });
// Returns array of records
// [
//   {
//     "id": "1",
//     "name": "Purple Dress Socks",
//     "family": "Dress Socks",
//     "description": "Really stylish dress socks. Great for businessing.",
//     "availability": {
//       "inStock": true
//     },
//     "metadata": { "material": "wool" }
//   }
// ]
```

To search for products with "running" in the name or description...

```js
import Mo from "mosearch";

const runningSocks = Mo(records).search(
  [{ name: "/athletic/i" }, { description: "/athletic/i" }],
  { conditions: "any" }
);
// Returns array of record ids
// ["2"]
```
