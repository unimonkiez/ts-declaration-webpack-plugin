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
}

module.exports = class DtsBundlePlugin {
	constructor({ test = /\.tsx?$/, name = '[name].d.ts' } = {}) {
		this.test = test;
		this.name = name;
	}

	apply(compiler) {
		compiler.plugin('emit', (compilation, callback) => {
			compilation.chunks.forEach((chunk) => {
				for (const module of chunk.modulesIterable) {
					if (module.issuer && module.issuer.depth === 0 && runTest(this.test, module.resource)) {
						const dts = generateDtsBundle(module.resource);
						const dtsName = loaderUtils.interpolateName(
							{
								resourcePath: `./${chunk.name}.js`,
							},
							this.name,
							{},
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
        		}
     		});
      		callback();
		});
	}
};