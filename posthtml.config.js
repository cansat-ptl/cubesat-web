module.exports = {
  plugins: {
    'posthtml-include': {
      root: __dirname + '/src',
    },
    'posthtml-extend': {
      root: __dirname + '/src',
    }
  }
}
