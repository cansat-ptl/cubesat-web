// ------------------------------------
// #POSTHTML - LOAD PLUGINS - PLUGINS
// ------------------------------------

'use strict'

/**
 * @method plugins
 *
 * @param {Object} config PostHTML Config
 *
 * @return {Array} plugins PostHTML Plugins
 */
module.exports = function plugins (config) {
  var plugins = []

  if (Array.isArray(config.plugins)) {
    plugins = config.plugins

    if (plugins.length && plugins.length > 0) {
      plugins.forEach((plugin) => {
        if (plugin.default) {
          plugin = plugin.default
        }

        if (typeof plugin !== 'function') {
          throw new TypeError(
            `${plugin.name} is not a valid PostHTML plugin, did you require() it ?`
          )
        }
      })
    }

    return plugins
  } else {
    config = config.plugins

    const load = (plugin, options) => {
      if (options === null || Object.keys(options).length === 0) {
        try {
          return require(plugin)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          return require(plugin)(options)
        } catch (err) {
          console.log(err)
        }
      }
    }

    Object.keys(config)
      .filter((plugin) => {
        return config[plugin] !== false ? plugin : ''
      })
      .forEach((plugin) => {
        plugin = load(plugin, config[plugin])

        if (plugin.default) {
          plugin = plugin.default
        }

        return plugins.push(plugin)
      })

    return plugins
  }
}
