# dts-webpack-bundler

This Webpack plugin generate a single TypeScript *.d.ts declaration file per entry.

### Installation

```shell
$ npm install dts-webpack-bundler --save-dev
```

### Usage

* Simply add the plugin to `webpack.config.js`:

    ```javascript
    const DtsWebpackBundler = require('dts-webpack-bundler');

    module.exports = {
        entry: {
            app: './src/main.ts',
            component: './src/component.tsx',
        },
        output: {
            path: path.resolve('./dist'),
            filename: '[name].js'
        },
        plugins: [
            new DtsWebpackBundler()
        ]
    }
    ```
* Done! will generate `app.d.ts` and `component.d.ts` next to the `js` files in `dist` folder!

### Options
```js
new DtsWebpackBundler({
    name: '[name].d.ts', // Not required, '[name].d.ts' by default (to match output fileName)
    test: /\.tsx$/, // Not required, filters '.ts' and '.tsx' by default
})
```


### Have Fun!