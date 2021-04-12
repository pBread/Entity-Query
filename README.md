# Entity Query

Entity Query allows developers to query state entities in a simple, performant and unobtrusive manner.

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
  - [Simple Query](#simple-query)
  - [Nested Queries](#nested-queries)
  - [Regex](#regex)
  - [Conditions](#conditions)
  - [Memos](#memos)

## Features

- [x] Perform queries on normalized state entities
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
