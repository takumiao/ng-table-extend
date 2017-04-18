var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: '#source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ng-table-extend.js',
    library: 'ng-table-extend',
    libraryTarget: 'umd',
    umdNamedDefine: false
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({ 
    //   compress: { warnings: false } 
    // })
  ],
  module: {
  },
  externals: {
    angular: 'angular'
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
