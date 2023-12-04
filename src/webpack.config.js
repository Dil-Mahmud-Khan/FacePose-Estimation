module.exports = {
    entry: './src/index.js',
    output: {
      path: './dist',
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.opencv.js$/,
          loader: 'opencv-loader',
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        cv: 'opencv.js',
      }),
    ],
  };
  