const { generateDtsBundle } = require('dts-bundle-generator');
const loaderUtils = require('loader-utils');

const runTest = (test, value) => {
  if (test instanceof RegExp) {
    return test.test(value);
  } if (typeof test === 'function') {
    return test(value);
  }
  throw new Error('options.test needs to be regex or function.');
};

module.exports = class DtsBundlePlugin {
  constructor({ test = /\.tsx?$/, name = '[name].d.ts' } = {}) {
    this.test = test;
    this.name = name;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('Emiter', (compilation, callback) => {
      compilation.entrypoints.forEach((entrypoint) => {
        entrypoint.origins.forEach((element) => {
          if (runTest(this.test, element.request)) {
            const dts = generateDtsBundle([{ filePath: element.request }]);
            const { name } = this;
            const dtsName = loaderUtils.interpolateName(
              {
                resourcePath: `./${name}.js`,
              },
              this.name,
              {},
            );

            // The way webpack's api is designed
            // eslint-disable-next-line no-param-reassign
            compilation.assets[dtsName] = {
              source() {
                return dts;
              },
              size() {
                return dts.length;
              },
            };
          }
        });
      });

      callback();
    });
  }
};
