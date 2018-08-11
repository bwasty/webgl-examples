const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

if (process.env.ANALYZE) {
  const analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  module.exports.cache = false;
  module.exports.plugins.push(new analyzer());
}
