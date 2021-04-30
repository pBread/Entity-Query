# Entity Query

Filtering & searching records is one of the most common (and tedious) tasks in web-development. Entity Query allows you to retrieve records from your store w/simple & perfomant queries.

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
  - [Simple Query](#simple-query)
  - [Nested Queries](#nested-queries)
  - [RegExp](#regexp)
  - [Conditions](#conditions)
  - [With Redux](#with-redux)
  - [With React Query](#with-react-query)
- [Examples](#examples)
  - [Copy-Paste Example](#copy-paste-example)

## Features

- [x] Perform queries on serialized (i.e. `{ [record.id]: record }`) state entities
- [x] Simple query language w/RegEx support
- [x] Advanced query conditions
- [x] All internal cache is memory safe

## Install

```bash
yarn add @breadman/entity-query
```

## Usage

Try out queries w/[Entity-Query-Builder](#https://entity-query-builder.vercel.app/).

#### Simple Query

```js
EQ(products).search({ name: "Purple Socks" });
```

#### Nested Queries

```js
EQ(products).search({ metadata: { material: "wool" } });
```

#### RegExp

```js
EQ(products).search({ name: "/purple/i" });
// all products w/"purple" in name
```

```js
EQ(products).search({ "/^.*/g": { material: "wool" } });
// return all products with a nested object that has { material: "wool" }
```

#### Conditions

```js
EQ(products).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "all",
}); // all products w/"purple" in name or description

EQ(products).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "any",
}); // any products w/"purple" in name or description

EQ(products).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "diff",
}); // products with purple in name or description, but not both

EQ(products).search({ description: "/purple/i" }, { conditions: "none" }); // all products w/out "purple" in description
```

#### With Redux

```jsx
import EQ from "@breadman/entity-query";
import { useSelector } from "react-redux";

function PresidentsList({ name = "Theodore Roosevelt" }) {
  const eq = EQ(useSelector((state) => state.entities.presidents));
  const presidents = eq.filter({ name });

  return (
    <ul>
      {presidents.map((record) => (
        <li key={record.id}>
          {record.firstName} {record.lastName}
        </li>
      ))}
    </ul>
  );
}
```

#### With React Query

```jsx
import EQ from "@breadman/entity-query";
import { useQuery } from "react-query";

function PresidentsList({ lastName = "Roosevelt" }) {
  const { isLoading, data } = useQuery("presidents", () =>
    fetch("https://example.com/api/us-presidents")
      .then((res) => res.json())
      // must serialize entities
      .then((arr) => arr.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}))
  );

  const eq = EQ(isLoading ? {} : data);
  const presidents = eq.filter({ lastName });

  return (
    <ul>
      {presidents.map((record) => (
        <li key={record.id}>
          {record.firstName} {record.lastName}
        </li>
      ))}
    </ul>
  );
}
```

### Examples

#### Copy-Paste Example

```js
import EQ from "@breadman/entity-query";

const state = {
  entities: {
    presidents: {
      16: {
        firstName: "Abraham",
        id: "16",
        lastName: "Lincoln",
        party: "Republican Party",
      },
      26: {
        firstName: "Theodore",
        id: "26",
        lastName: "Roosevelt",
        party: "Republican Party",
      },
      32: {
        firstName: "Franklin",
        id: "32",
        lastName: "Roosevelt",
        party: "Democratic Party",
      },
    },
  },
};

const eq = EQ(state.entities.presidents);

console.log(eq.search({ lastName: "/roosevelt/gi" }));
// ["26","32"]

console.log(eq.filter({ party: "Republican Party" }));
// [
//   {
//     firstName: "Abraham",
//     id: "16",
//     lastName: "Lincoln",
//     party: "Republican Party",
//   },
//   {
//     firstName: "Theodore",
//     id: "26",
//     lastName: "Roosevelt",
//     party: "Republican Party",
//   },
// ];
```
