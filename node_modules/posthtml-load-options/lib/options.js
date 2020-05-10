// ------------------------------------
// #POSTHTML - LOAD OPTIONS - OPTIONS
// ------------------------------------

'use strict'

/**
 * @method options
 *
 * @param  {Object} options PostHTML Config
 *
 * @return {Object} options PostHTML Options
 */
module.exports = function options (options) {
  if (options.parser && typeof options.parser === 'string') {
    options.parser = require(options.parser)()
  }

  if (options.parser && typeof options.parser === 'object') {
    const parser = options.parser

    options.parser = require(parser.name)(parser.options)
  }

  if (options.render && typeof options.render === 'string') {
    options.render = require(options.render)
  }

  if (options.render && typeof options.render === 'object') {
    const render = options.render

    options.render = require(render.name)(render.options)
  }

  if (options.plugins) {
    delete options.plugins
  }

  return options
}
