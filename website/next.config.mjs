import nextra from "nextra";

import enhancedResolve from "enhanced-resolve";
import process from "process";
import path from "path"

const CWD = process.cwd();

const resolve = enhancedResolve.create.sync({
  symlinks: true,
  extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
  mainFields: ["main", "module", "source"],
  // Is it right? https://github.com/webpack/enhanced-resolve/issues/283#issuecomment-775162497
  conditionNames: ["require"],
  exportsFields: [], // we do that because 'package.json' is usually not present in exports
});

const createWebpackMatcher = (modulesToTranspile) => {
  // create an array of tuples with each passed in module to transpile and its node_modules depth
  // example: ['/full/path/to/node_modules/button/node_modules/icon', 2]
  const modulePathsWithDepth = modulesToTranspile.map((modulePath) => [
    modulePath,
    (modulePath.match(/node_modules/g) || []).length,
  ]);

  return (filePath) => {
    const nodeModulesDepth = (filePath.match(/node_modules/g) || []).length;

    return modulePathsWithDepth.some(([modulePath, moduleDepth]) => {
      // Ensure we aren't implicitly transpiling nested dependencies by comparing depths of modules to be transpiled and the module being checked
      const transpiled = filePath.startsWith(modulePath) && nodeModulesDepth === moduleDepth;
      return transpiled;
    });
  };
};

const getPackageRootDirectory = (module) => {
  try {
    const packageLookupDirectory = resolve(CWD, path.join(module, "package.json"));
    return path.dirname(packageLookupDirectory);
  } catch (err) {
    throw new Error(
      `next-transpile-modules - an unexpected error happened when trying to resolve "${module}". Are you sure the name of the module you are trying to transpile is correct, and it has a package.json with a "main" or an "exports" field?\n${err}`,
    );
  }
};
const modulePath = getPackageRootDirectory("@algorithm/learn");

const matcher = createWebpackMatcher([modulePath]);

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  latex: true,
  flexsearch: {
    codeblocks: false,
  },
  defaultShowCopyCode: true,
});

export default withNextra({
  reactStrictMode: true,
  eslint: {
    // Eslint behaves weirdly in this monorepo.
    ignoreDuringBuilds: true,
  },
  webpack(config, context) {
    config.resolve.symlinks = true;
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.+(js|jsx|mjs|ts|tsx)$/,
      include: matcher,
      type: 'javascript/auto',
      use: [
        context.defaultLoaders.babel,
        {
          loader: "nextra/loader",
          options:{
            theme: "nextra-theme-docs",
            themeConfig: "./theme.config.tsx",
            staticImage: true,
            latex: true,
            flexsearch: {
              codeblocks: false,
            },
            defaultShowCopyCode: true,
          }
        },
        {
          loader: "codeMd-loader",
        },
      ],
    });
  },
});
