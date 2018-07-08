# Azure Function App + TypeScript + Webpack

Here is a quick example of an Azure Function App with support for TypeScript, tested with Jest and bundled with Webpack for improved cold start time.

There is no dependency on the Azure Function runtime version and the build output will run in either.

## Installation

```
git clone https://github.com/sellmeadog/babel-7-typescript-node-boilerplate.git [project_directory]
yarn install
```

_Since this is a boilerplate, you can clone to an optional `[project_directory]` initially instead of renaming the repo later._

## Development

```
yarn start
```

This is intended to be used with the Azure Function Core Tools [Version 2.x](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#v2) and will run `func start` in the build output directory.

If you are using [Version 1.x](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#v1) of the core tools, you can either modify the `start` script in `package.json` or rely on `yarn build` and a manual `func run [functionname]`.

## Test

```
yarn test [--watch]
```

This boilerplate is configured to use Jest for unit testing since function output can easily be verified in snapshots with minimal effort.

Here is an example of a simple test to validate an HTTP Trigger:

```
test('HttpTriggerJS should accept `name` in query string', () => {
  let context = { log: jest.fn(), done: jest.fn() };
  let request = { query: { name: 'Kennie' } };
  HttpTriggerJS(context, request);

  expect(context).toMatchSnapshot();
  expect(context.done).toHaveBeenCalledTimes(1);
});
```

_You can review the full sample unit test and snapshots in the `/src/HTTPTrigerJS` directory._

## Build

```
yarn build
```

This will generate a production bundle to be deployed to Azure.

## Webpack

A few notes on how and why Webpack is being used over Azure Functions Pack.

### TypeScript

This boilerplate enables you to develop and test functions in TypeScript. Babel is used to transpile the source with this simple configuration Webpack configuration:

```
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
        },
      },
    ],
  },
```

_This does rely on `Babel 7` which is still in beta._

### Bundle per Function

Webpack has been configured to generate a single script per function. This is in contrast to the Azure Functions Pack paradigm of generating a single bundle referenced by all functions in the application.

I have chosen to generate a bundle per function because it seems more idiomatic. Code can and should be cleanly shared during development keeping the source DRY and maintainable, whereas the bundled functions remain disprate.

### Dynamic Bundling Configuration

Here is the `output` configuration from the Webpack configuration file. Whenever you add a new function folder to the `src` directory, Webpack will automatically start generating a bundle for that function in the `build` directory.

```
output: {
  path: path.resolve(__dirname, 'build'),
  filename: '[name]/index.js',
  libraryTarget: 'commonjs',
}
```

Additionally, the `function.json` file for each discreet function is required to accompany the bundle in each corresponding folder. This simple copy configuration handles that:

```
new CopyWebpackPlugin([
  { context: 'src', from: '**/function.json', to: '' },
  ...
]),
```

### Externals

Normally, you do not want to bundle your `node_modules` into server side code and would rely on a package like `webpack-node-externals` to exclude them. However, to minimize the cold start time of an Azure Function App, you do want to reverse this paradigm and bundle as much as possible.

Binary dependencies are always the exception and if you know that you have binary dependencies, be sure to add them to the `externals` configuration section in both the `webpack.dev.js` and `webpack.prd.js` files.

### Why not Azure Functions Pack?

Azure Functions Pack uses Webpack under the hood, so why not just use that?

As mentioned earlier, I personally disagree with the paradigm and prefer a single, discreet bundle per function. Bundling an entire Function App into a single file and dynamically modifying the `function.json` file of each disparate function with an entry file and function name seems less idiomatic.
