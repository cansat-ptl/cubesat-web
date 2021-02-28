module.exports = {
    cache: false,
    mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    entry: {
      map: './src/js/map.js',
      docs: './src/js/docs.js',
      devices: './src/js/devices.js'
    },
    output: {
        filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
      ],
    }
};