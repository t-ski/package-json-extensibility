# `package.json` Extensibility

This package enables extensibility of hierarchically nested `package.json` files in monorepo architectures. The package resolves `npm` workspaces and thus requires the global root package to enable workspaces.

## Installation

``` cli
npm i -D tski/package-json-extensibility
```

## Setup

Upon usage, effective `package.json` files are emitted. The project is supposed to provide a `package.shared.json` in the root directory. This object will be shared across all extending packages. In each workspace package root, as well as the global package root, a `package.extends.json` may provide respectively local objects extending the shared object.

> Since the global package directory may also utilise extensibility, the workspace configuration may also be stated within the extending object.

### Example

<sub>./package.shared.json</sub>
``` json
{
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "test": "test example"
  },
  "author": "Jane Doe",
  "license": "ISC"
}
```

<sub>./packages/package-a/package.extends.json</sub>
``` json
{
  "name": "test-package-a",
  "version": "0.0.1",
  "description": "Package A"
}
```

<sub><b>EMITTED</b> → ./packages/package-a/package.json</sub>
``` json
{
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "test": "test example"
  },
  "author": "Jane Doe",
  "license": "ISC",
  "name": "test-package-a",
  "description": "Package A"
}
```

## Usage

Effective `package.json` files can be emitted from two interfaces:

### via CLI

``` cli
npx emit-epj [path=.] [--arg|-arg-shorthand]*
```

| Flag | Description |
| :--- | :--- |
| `--force`, `-f` | Override existing `package.json` files |
| `--help`, `-h` | Display help |

### via API

#### Syntax

``` ts
emitExtendedPackageJSON(path: string, options: {
  force?: boolean,
  indent: number
}): string[]
```

#### Example

``` js
const { emitExtendedPackageJSON } = require("tski/package-json-extensibility");

const emittedFiles = emitExtendedPackageJSON("./", {
  force: true,
  indent: 8     // Number of spaces per indentation level in formatted JSONs
});
```

## 

<sub>© Thassilo Martin Schiepanski</sub>