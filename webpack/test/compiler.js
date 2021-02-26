import path from "path";
import webpack from "webpack";

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    mode: "production",
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
    },
    optimization: {
      minimize:false
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: {
            loader: path.resolve(__dirname, "../loader/index.js"),
            options,
          },
        },
      ],
    },
  });

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

      resolve(stats.toJson({source: true}));
    });
  });
};
