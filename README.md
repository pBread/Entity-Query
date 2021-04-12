# Entity Query

Entity Query allows developers to query state entities in a simple, performant and unobtrusive manner.

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
  - [Simple Query](#simple-query)
  - [Nested Queries](#nested-queries)
  - [Conditions](#conditions)
  - [With Redux](#with-redux)

## Features

- [x] Perform queries on serialized (i.e. `{ [record.id]: record }`) state entities
- [x] Simple query language
- [x] Advanced query conditions

## Install

```bash
yarn add @breadman/entity-query
```

## Usage

#### Simple Query

```js
EQ(products).search({ name: "Purple Socks" });
```

#### Nested Queries

```js
EQ(products).search({ metadata: { material: "wool" } });
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
      .then((arr) => arr.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}))
  );

  const eq = isLoading ? EQ(data) : null;
  const presidents = eq?.filter({ lastName });

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
