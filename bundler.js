const createBundler = require('@airtable/blocks-webpack-bundler').default;


/**
 * 
 * @typedef { import("./node_modules/@airtable/blocks-webpack-bundler/dist/webpack_config").BaseWebpackConfig
 * } BaseWebpackConfig
 */

/**
 * 
 * @param {BaseWebpackConfig} baseConfig 
 * @returns 
 */
function createConfig(baseConfig) {
  baseConfig.module.rules.push({
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream'),
      }
    }
  })

  return baseConfig;
}

exports.default = () => {
  return createBundler(createConfig);
};