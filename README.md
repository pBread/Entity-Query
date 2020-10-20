```bash
npm install mosearch

yarn add mosearch
```

# Motivation

Searching/filtering/finding records is one of the most common frontend tasks. And yet, one of the most common causes of bugs and performance issues – especially w/frameworks, like React, where the UI is driven from state.

MoSearch is designed to allow developers to search/filter/find records in a simple, performant and unobtrusive manner.

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
Mo(records).search({ name: "/purple/i" });
```

#### Conditions

```js
Mo(records).search([{ name: "/athletic/i" }, { description: "/athletic/i" }], {
  conditions: "any",
});
```

#### Memoized

Queries are memoized **globally**. MoSearch is designed to be called liberally without affecting performance.

```js
const a = Mo(records).search({ name: "Purple Socks" });
const b = Mo(records).search({ name: "Purple Socks" });

a === b;
// true
```

## Example

Consider building a product catalog. We start with an array of product records, like so...

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
