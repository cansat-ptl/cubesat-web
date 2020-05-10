[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![code style][style]][style-url]
[![chat][chat]][chat-url]

<div align="center">
  <img width="140" height="120" title="Load Options" vspace="20"
    src="https://posthtml.github.io/posthtml-load-options/logo.svg"
  <a href="https://github.com/posthtml/posthtml">
    <img width="220" height="200" title="PostHTML" hspace="20"  src="http://posthtml.github.io/posthtml/logo.svg">
  </a>
  <h1>Load Options</h1>
  <p>Autoload Options for PostHTML<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D posthtml-load-options
```

<h2 align="center">Usage</h2>

### `package.json`

Create a **`posthtml`** section in **`package.json`**.

```
Root
  |– client
  |– public
  |
  |- package.json
```

```json
{
  "dependencies": {
    "posthtml-sugarml": "^1.0.0"
  },
  "posthtml": {
    "parser": "posthtml-sugarss",
    "from": "path/to/src/file.html",
    "to": "path/to/dest/file.html"
  }
}
```

### `.posthtmlrc`

Create a **`.posthtmlrc`** file.

```
Root
  |– client
  |– public
  |
  |-.posthtmlrc
  |- package.json
```

```json
{
  "parser": "posthtml-sugarss",
  "from": "path/to/src/file.html",
  "to": "path/to/dest/file.html"
}
```

### `posthtml.config.js`

Create a **`posthtml.config.js`** file.

```
Root
  |– client
  |– public
  |
  |- posthtml.config.js
  |- package.json
```

```js
module.exports = (ctx) => {
  return {
    parser: ctx.ext ==='.sml' ? 'posthtml-sugarss' : false,
    from: 'path/to/src/file.html',
    to: 'path/to/dest/file.html'
  }
}
```

<h2 align="center">Options</h2>

**`parser`**:

```js
parser: 'posthtml-sugarss'
```

**`from`**:

```js
from: 'path/to/dest/file.html'
```

**`to`**:

```js
to: 'path/to/dest/file.html'
```

**`render`**:

```js
render: 'posthtml-jsx'
```

### Context

When using a function in `(posthtml.config.js)`, it's possible to pass context to `posthtml-load-options`, which will be evaluated before loading your options. By default `ctx.env (process.env.NODE_ENV)` and `ctx.cwd (process.cwd())` are available.

<h2 align="center">Example</h2>

**posthtml.config.js**
```js
export default config = (ctx) => {
  return {
    parser: ctx.ext === '.sml' ? 'posthtml-sugarml' : false,
    from: 'client/index.html',
    to: 'public/index.html'
  }
}
```

### <img width="80" height="80" src="https://worldvectorlogo.com/logos/nodejs-icon.svg">

```js
import { dirname } from 'path'
import { readFileSync } from 'fs'

import posthtml from 'posthtml'
import optionsrc from 'posthtml-load-options'

const sml = readFileSync('./client/index.sml', 'utf8')

const ctx = { ext: dirname(sml) }

optionsrc(ctx).then((options) => {
  posthtml()
    .process(sml, options)
    .then((result) => console.log(result.html))
}))
```

<h2 align="center">Maintainer</h2>

<table>
  <tbody>
   <tr>
    <td align="center">
      <img width="150 height="150"
      src="https://avatars.githubusercontent.com/u/5419992?v=3&s=150">
      <br />
      <a href="https://github.com/michael-ciniawsky">Michael Ciniawsky</a>
    </td>
  </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/posthtml-load-options.svg
[npm-url]: https://npmjs.com/package/posthtml-load-options

[node]: https://img.shields.io/node/v/posthtml-load-options.svg
[node-url]: https://nodejs.org/

[deps]: https://david-dm.org/michael-ciniawsky/posthtml-load-options.svg
[deps-url]: https://david-dm.org/michael-ciniawsky/posthtml-load-options

[tests]: http://img.shields.io/travis/michael-ciniawsky/posthtml-load-options.svg
[tests-url]: https://travis-ci.org/michael-ciniawsky/posthtml-load-options

[cover]: https://coveralls.io/repos/github/michael-ciniawsky/posthtml-load-options/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/michael-ciniawsky/posthtml-load-options?branch=master

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[chat]: https://badges.gitter.im/posthtml/posthtml.svg
[chat-url]: https://gitter.im/posthtml/posthtml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
