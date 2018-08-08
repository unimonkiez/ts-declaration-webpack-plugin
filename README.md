# ts-declaration-webpack-plugin

This Webpack plugin generate a single TypeScript *.d.ts declaration file per entry.

### Installation

```shell
$ npm install ts-declaration-webpack-plugin --save-dev
```

### Usage

* Simply add the plugin to `webpack.config.js`:

    ```javascript
    const TsDeclarationWebpackPlugin = require('ts-declaration-webpack-plugin');

    module.exports = {
        entry: {
            app: './src/main.ts',
            component: './src/component.tsx',
        },
        output: {
            path: path.resolve('./dist'),
            filename: '[name].js',
        },
        plugins: [
            new TsDeclarationWebpackPlugin(),
        ]
    }
    ```
* Done! will generate `app.d.ts` and `component.d.ts` next to the `js` files in `dist` folder!

### Options
```js
new TsDeclarationWebpackPlugin({
    name: '[name].d.ts', // Not required, '[name].d.ts' by default (to match output fileName)
    test: /\.tsx$/, // Not required, filters '.ts' and '.tsx' by default
})
```


### Have Fun!