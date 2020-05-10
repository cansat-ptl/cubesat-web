// ------------------------------------
// #POSTHTML - LOAD CONFIG - INDEX
// ------------------------------------

'use strict'

const assign = Object.assign

const config = require('cosmiconfig')

const loadPlugins = require('./lib/plugins.js')
const loadOptions = require('posthtml-load-options/lib/options.js')

/**
 * @author Michael Ciniawsky (@michael-ciniawsky) <michael.ciniawsky@gmail.com>
 * @description Autoload Config for PostHTML
 * @license MIT
 *
 * @module posthtml-load-config
 * @version 1.0.0
 *
 * @requires comsiconfig
 * @requires posthtml-load-options
 * @requires posthtml-load-plugins
 *
 * @method posthtmlrc
 *
 * @param  {Object} ctx Context
 * @param  {String} path Config Directory
 * @param  {Object} options Config Options
 *
 * @return {Promise} config  PostHTML Plugins, PostHTML Options
 */
module.exports = function posthtmlrc (ctx, path, options) {
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
      if (!result) {
        console.log(
          'PostHTML Config could not be loaded. Please check your PostHTML Config.'
        )
      }

      return result ? result.config : {}
    })
    .then((config) => {
      if (typeof config === 'function') {
        config = config(ctx)
      } else {
        config = assign(config, ctx)
      }

      if (!config.plugins) {
        config.plugins = []
      }

      return {
        plugins: loadPlugins(config),
        options: loadOptions(config)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
