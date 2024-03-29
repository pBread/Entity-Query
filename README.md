# Entity Query

Filtering & searching records is one of the most common (and tedious) tasks in web-development. Entity Query allows you to retrieve records from your store w/simple & perfomant queries.

[Demo & Query-Builder](https://entity-query-builder.vercel.app/)

## Table of Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
  - [Simple Query](#simple-query)
  - [RegExp](#regexp)
  - [Nested Queries](#nested-queries)
  - [Multiple Query Properties](#multiple-query-properties)
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

#### Simple Query

```js
EQ(presidents).search({ party: "Democratic" });
```

#### RegExp

```js
EQ(presidents).search({ party: "/Democrat/gi" });
```

#### Nested Queries

```js
EQ(presidents).search({ vice: { lastName: "Johnson" } });
```

```js
EQ(presidents).search({ vice: { "/(.*?)/gi": "/John/" } });
```

#### Multiple Query Properties

```js
EQ(presidents).search({ term: { startDay: "Thursday", endDay: "Saturday" } });
```

#### Conditions

```js
EQ(presidents).search(
  [{ term: { startDay: "Thursday" } }, { term: { endDay: "Saturday" } }],
  { conditions: "all" }
);

EQ(presidents).search(
  [{ term: { startDay: "Thursday" } }, { term: { endDay: "Saturday" } }],
  { conditions: "any" }
);

EQ(presidents).search([{ party: "/Democrat/gi" }, { party: "Democratic" }], {
  conditions: "diff",
});

EQ(presidents).search([{ party: "Republican" }, { party: "Democratic" }], {
  conditions: "none",
});
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
