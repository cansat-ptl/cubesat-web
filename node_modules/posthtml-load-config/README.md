[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![code style][style]][style-url]
[![chat][chat]][chat-url]

<div align="center">
  <img width="140" height="120" title="Load Options" src="http://posthtml.github.io/posthtml-load-options/logo.svg">
  <a href="https://github.com/posthtml/posthtml">
    <img width="220" height="200" title="PosHTML"           src="http://posthtml.github.io/posthtml/logo.svg" hspace="20">
  </a>
  <img width="140" height="120" title="Load Plugins" src="http://michael-ciniawsky.github.io/postcss-load-plugins/logo.svg">
  <h1>Load Config</h1>
  <p>Autoload Config for PostHTML<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D posthtml-load-config
```

<h2 align="center">Usage</h2>

```
npm i -S|-D posthtml-plugin posthtml-plugin ...
```

Install plugins and save them to your ***package.json***

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
  "posthtml": {
    "parser": "posthtml-sugarml",
    "from": "/path/to/src/file.sml",
    "to": "/path/to/dest/file.html",
    "plugins": {
      "posthtml-plugin": {}
    }
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
  "parser": "posthtml-sugarml",
  "from": "/path/to/src/file.sml",
  "to": "/path/to/dest/file.html",
  "plugins": {
    "posthtml-plugin": {}
  }
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
    parser: ctx.ext === '.sml' ? 'posthtml-sugarml' : false,
    from: ctx.from,
    to: ctx.to,
    plugins: {
      'posthtml-plugin': ctx.plugin
    }
  }
}
```

Plugins can be loaded either using an `{Object}` or an `{Array}` in `config.plugins`.

##### `{Object}`

```js
module.exports = (ctx) => {
  return {
    ...options,
    plugins: {
      'posthtml-plugin': ctx.plugin
    }
  }
}
```

##### `{Array}`

```js
module.exports = (ctx) => {
  return {
    ...options,
    plugins: [
      require('posthtml-plugin')(ctx.plugin)
    ]
  }
}
```

> :warning: When using an Array, make sure to `require()` them.

<h2 align="center">Options</h2>

**`parser`**:

```js
parser: 'posthtml-sugarml'
```

**`from`**:

```js
from: 'path/to/src/file.sml'
```

**`to`**:

```js
to: 'path/to/dest/file.html'
```

**`render`**:

```js
render: 'posthtml-jsx'
```

<h2 align="center">Plugins</h2>

### Options

**`{} || null`**: Plugin loads with defaults.

```js
'posthtml-plugin': {} || null
```
> :warning: `{}` must be an **empty** object

**`[Object]`**: Plugin loads with given options.

```js
'posthtml-plugin': { option: '', option: '' }
```

**`false`**: Plugin will not be loaded.

```js
'posthtml-plugin': false
```

### Order

Plugin **order** is determined by declaration in the plugins section.

```js
{
  plugins: {
    'posthtml-plugin': {}, // plugins[0]
    'posthtml-plugin': {}, // plugins[1]
    'posthtml-plugin': {}  // plugins[2]
  }
}
```

<h2 align="center">Context</h2>

When using a function `(posthtml.config.js)`, it is possible to pass context to `posthtml-load-config`, which will be evaluated while loading your config. By default `ctx.env (process.env.NODE_ENV)` and `ctx.cwd (process.cwd())` are available.

<h2 align="center">Examples</h2>

**posthtml.config.js**

```js
module.exports = (ctx) => ({
  parser: ctx.ext === '.sml' ? 'posthtml-sugarml' : false,
  from: ctx.from,
  to: ctx.to,
  plugins: {
    posthtml-include: {},
    posthtml-expressions: { locals: ctx.locals },
    htmlnano: ctx.env === 'production' ? {} : false
  }
})
```

### <img width="80" height="80" src="https://worldvectorlogo.com/logos/nodejs-icon.svg">

```json
"scripts": {
  "build": "NODE_ENV=production node posthtml",
  "start": "NODE_ENV=development node posthtml"
}
```

```js
import { readFileSync } = require('fs')

const posthtml = require('posthtml')
const posthtmlrc = require('posthtml-load-config')

const sml = readFileSync('index.sml', 'utf8')

const ctx = { ext: '.sml' }

posthtmlrc(ctx).then(({ plugins, options }) => {
  posthtml(plugins)
    .process(sml, options)
    .then((result) => console.log(result.html))
})
```

### <img width="80" height="80" src="https://worldvectorlogo.com/logos/gulp.svg">

```bash
npm i -D gulp-posthtml
```

**package.json**
```json
"scripts": {
  "build": "NODE_ENV=production gulp",
  "start": "NODE_ENV=development gulp"
}
```

**gulpfile.js**
```js
import { task, src, dest } from 'gulp'
import plugins from 'gulp-load-plugins'

task('pug', () => {
  const ctx = { locals: {} }

  return src('src/*.pug')
    .pipe(posthtml(ctx))
    .pipe(rename({ ext: '.html' }))
    .pipe(dest('dest'))
})

task('sml', () => {
  return src('src/*.sml')
    .pipe(posthtml())
    .pipe(rename({ ext: '.html' }))
    .pipe(dest('dest'))
})

task('html', () => {
  return src('src/*.html')
    .pipe(posthtml())
    .pipe(dest('dest'))
})
```

### <img width="80" height="80" src="https://worldvectorlogo.com/logos/webpack.svg">

```bash
npm i -D html-loader posthtml-loader
```

**package.json**
```json
"scripts": {
  "build": "NODE_ENV=production webpack",
  "start": "NODE_ENV=development webpack-dev-server"
}
```

**webpack.config.js**
```js
module.exports = (env) => {
  module: {
    rules: [
      {
        test: /\.html$/
        use: [
          'html-loader',
          'posthtml-loader'
        ]
      }
    ]
  }
}
```

<h2 align="center">Maintainer</h2>

<table>
  <tbody>
   <tr>
    <td align="center">
      <img width="150 height="150"  src="https://avatars.githubusercontent.com/u/5419992?v=3&s=150">
      <br>
      <a href="https://github.com/michael-ciniawsky">Michael Ciniawsky</a>
    </td>
   </tr>
  <tbody>
</table>

<h2 align="center">Contributors</h2>

<table>
  <tbody>
   <tr></tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/posthtml-load-config.svg
[npm-url]: https://npmjs.com/package/posthtml-load-config

[node]: https://img.shields.io/node/v/posthtml-load-plugins.svg
[node-url]: https://nodejs.org/

[deps]: https://david-dm.org/posthtml/posthtml-load-config.svg
[deps-url]: https://david-dm.org/posthtml/posthtml-load-config

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[tests]: http://img.shields.io/travis/posthtml/posthtml-load-config.svg?branch=master
[tests-url]: https://travis-ci.org/posthtml/posthtml-load-config?branch=master

[cover]: https://coveralls.io/repos/github/posthtml/posthtml-load-config/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/posthtml/posthtml-load-config?branch=master

[chat]: https://badges.gitter.im/posthtml/posthtml.svg
[chat-url]: https://gitter.im/posthtml/posthtml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
