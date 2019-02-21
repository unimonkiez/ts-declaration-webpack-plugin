const { generateDtsBundle } = require('dts-bundle-generator');
const loaderUtils = require('loader-utils');

const runTest = (test, value) => {
    if (test instanceof RegExp) {
        return test.test(value);
    } else if (typeof test === 'function') {
        return test(value);
    } else {
        throw new Error('options.test needs to be regex or function.');
    }
};

module.exports = class DtsBundlePlugin {
    constructor({ test = /\.tsx?$/, name = '[name].d.ts' } = {}) {
        this.test = test;
        this.name = name;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            compilation.entrypoints.forEach(entrypoint => {
                entrypoint.origins.forEach(element => {
                    if (runTest(this.test, element.request)) {
                        const dts = generateDtsBundle(element.request);
                        const name = this.name;
                        const dtsName = loaderUtils.interpolateName(
                            {
                                resourcePath: `./${name}.js`
                            },
                            this.name,
                            {}
                        );

                        compilation.assets[dtsName] = {
                            source() {
                                return dts;
                            },
                            size() {
                                return dts.length;
                            }
                        };
                    }
                });
            });

            callback();
        });
    }
};
