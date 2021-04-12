# Entity Query

Entity Query allows developers to query state records (entities) in a simple, performant and unobtrusive manner.

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
  - [Simple Query](#simple-query)
  - [Nested Queries](#nested-queries)
  - [Regex](#regex)
  - [Conditions](#conditions)
  - [Memos](#memos)

## Features

- [x] Simple query language
- [x] Advanced conditions
- [x] Index-based searching (ideal for large data sets)

## Install

```bash
yarn add @breadman/entity-query
```

## Usage

#### Simple Query

```js
EQ(records).search({ name: "Purple Socks" });
```

#### Nested Queries

```js
EQ(records).search({ metadata: { material: "wool" } });
```

#### Conditions

```js
EQ(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "all",
}); // all records w/"purple" in name or description

EQ(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "any",
}); // any records w/"purple" in name or description

EQ(records).search([{ name: "/purple/i" }, { description: "/purple/i" }], {
  conditions: "diff",
}); // records with purple in name or description, but not both

EQ(records).search({ description: "/purple/i" }, { conditions: "none" }); // all records w/out "purple" in description
```
