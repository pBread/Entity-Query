# Entity Query

Filtering & searching records is one of the most common (and tedious) tasks in web-development. Entity Query lets you query records in your store in a simple and performant manner.

- [Features](#features)
- [Install](#install)
- [Usage](#usage)

  - [Simple Query](#simple-query)
  - [RegExp] (#regexp)
  - [Nested Queries](#nested-queries)
  - [Conditions](#conditions)

- [Examples](#examples)
  - [With Redux](#with-redux)
  - [With React Query](#with-react-query)

## Features

- [x] Perform queries on serialized (i.e. `{ [record.id]: record }`) state entities
- [x] Simple query language
- [x] Advanced query conditions
- [x] All internal cache is memory safe

## Install

```bash
yarn add @breadman/entity-query
```

## Usage

#### Simple Query

```js
EQ(products).search({ name: "Purple Socks" });
```

#### RegExp

```js
EQ(products).search({ name: "/purple/i" });
// all products w/"purple" in name
```

#### Nested Queries

```js
EQ(products).search({ metadata: { material: "wool" } });
```

```js
EQ(products).search({ "/^*./i": { material: "wool" } });
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

### Examples

#### With Redux

```jsx
import EQ from "@breadman/entity-query";
import { useSelector } from "react-redux";

function PresidentsList({ lastName = "Roosevelt" }) {
  const eq = EQ(useSelector((state) => state.entities.presidents));
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
