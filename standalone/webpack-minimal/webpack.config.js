const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    overlay: true,
    host: '0.0.0.0',
  },
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
