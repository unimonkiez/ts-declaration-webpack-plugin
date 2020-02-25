/** @format */

const { generateDtsBundle } = require("dts-bundle-generator");
const loaderUtils = require("loader-utils");

const checkIsDirectoryValid = dir => dir.match(/\/$/);
const checkIsFileExtensionValid = fileExtension =>
  fileExtension.match(/\.tsx?$/);

const generateDeclarationFile = ({
  entrypointOrigin,
  compilation,
  name,
  dir
}) => {
  if (!checkIsFileExtensionValid(entrypointOrigin.request)) {
    throw new Error("Only .ts or .tsx files are allowed");
  }
  const dts = generateDtsBundle(entrypointOrigin.request);
  const dtsName = loaderUtils.interpolateName(
    {
      resourcePath: `./${name}.js`
    },
    `${dir}${name}.d.ts`,
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
  console.log("Generated declaration: ", dtsName);
};
module.exports = class DtsBundlePlugin {
  constructor(entriesToDeclare) {
    this.entriesToDeclare = entriesToDeclare;
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      compilation.entrypoints.forEach(entrypoint => {
        // if an array props were passed, create declaration file
        // just for the matching files.
        if (
          Array.isArray(this.entriesToDeclare) &&
          Boolean(this.entriesToDeclare.length)
        ) {
          const entryToDeclare = this.entriesToDeclare.find(
            entryToDeclare => entryToDeclare.name === entrypoint.options.name
          );
          if (entryToDeclare) {
            const { dir = "./", name } = entryToDeclare;
            if (!checkIsDirectoryValid(dir)) {
              throw new Error(
                `${dir} is not a valid. Directory path must end with "/"`
              );
            }
            entrypoint.origins.forEach(entrypointOrigin =>
              generateDeclarationFile({
                compilation,
                entrypointOrigin,
                name,
                dir
              })
            );
          }
          // Default - create declaration for all entries
        } else {
          const name = entrypoint.options.name;
          const dir = "./";
          entrypoint.origins.forEach(entrypointOrigin =>
            generateDeclarationFile({
              compilation,
              entrypointOrigin,
              name,
              dir
            })
          );
        }
      });
      callback();
    });
  }
};
