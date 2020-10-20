```bash
yarn add mosearch
```

# Motivation

Searching/filtering/finding records is one of the most common frontend tasks. However, it remains one of the more tedious and cognitively heavy aspects of building an app.

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
Mo(records).search({ description: "/purple/i" });
```

#### Conditions

```js
Mo(records).search([{ name: "/athletic/i" }, { description: "/athletic/i" }], {
  conditions: "any",
});
```

#### Memoized

Queries are **globally** memoized. MoSearch is designed to be called liberally across an app without affecting performance.

```js
const a = Mo(records).search({ name: "Purple Socks" });
const b = Mo(records).search({ name: "Purple Socks" });

a === b;
// true
```

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
