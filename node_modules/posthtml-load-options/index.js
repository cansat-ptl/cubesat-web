// ------------------------------------
// #POSTHTML - LOAD OPTIONS
// ------------------------------------

'use strict'

const assign = Object.assign

const config = require('cosmiconfig')

const loadOptions = require('./lib/options')

/**
 * @author Michael Ciniawsky (@michael-ciniawsky) <michael.ciniawsky@gmail.com>
 * @description Autoload Options for PostHTML
 * @license MIT
 *
 * @module posthtml-load-options
 * @version 1.0.0
 *
 * @requires cosmiconfig
 * @requires lib/options
 *
 * @method optionsrc
 *
 * @param  {Object} ctx Context
 * @param  {String} path Directory
 * @param  {Object} options Options
 * @return {Object} options PostHTML Options
 */
module.exports = function optionsrc (ctx, path, options) {
  const defaults = { cwd: process.cwd(), env: process.env.NODE_ENV }

  ctx = assign(defaults, ctx)
  path = path || process.cwd()
  options = assign({}, options)

  if (ctx.env === undefined) {
    process.env.NODE_ENV = 'development'
  }

  return config('posthtml', options)
    .load(path)
    .then((result) => {
      if (result === undefined) {
        console.log(`
          PostHTML Options could not be loaded. Please check your PostHTML Config (posthtml.config.js)
        `
        )
      }

      return result ? result.config : {}
    })
    .then((options) => {
      if (typeof options === 'function') {
        options = options(ctx)
      }

      if (typeof options === 'object') {
        options = assign(options, ctx)
      }

      return options
    })
    .then((options) => {
      return loadOptions(options)
    })
    .catch((err) => {
      console.log(err)
    })
}
