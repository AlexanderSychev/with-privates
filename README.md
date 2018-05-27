# with-privates

High-Order Component (HOC) which provides private variables with
setters and getters. Private variables changing not will fire re-rendering process.

## Installation

Package requires React 16.0.26 and higher as peer dependency.

```bash
# by Yarn
yarn add react with-privates --save
# by NPM
npm install react with-privates --save
```

## Usage

See example at ["showCase.tsx"](https://github.com/AlexanderSychev/with-privates/blob/master/src/showCase.tsx).

## Bundling with Webpack

### Use ready bundles

You can use one of browser bundles of this package:
* `with-privates/lib/with-privates.dev.js` - uncompressed library (for development);
* `with-privates/lib/with-privates.prod.js` - compressed library (for production).

Both libraries provides "withPrivates" function as global variable.

In Webpack configuration file add to externals:

```javascript
module.exports = {
    // ...
    // Your configuration
    // ...
    externals: {
        // Note that "React" and "ReactDOM" externals
        // are REQUIRED for browser bundles
        'react': 'React',
        'react-dom': 'ReactDOM',
        './withPrivates': 'withPrivates',
    }
};
```

At your page:
```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<script src="node_modules/with-privates/dist/with-privates.dev.js"></script>
<script src="path/to/your/bundle"></script>
```

#### Use ES6 modules

You can use version of modules, which use ECMAScript 6 Modules (see subdirectory `es6-module` of module directory).
It's may be useful for tree-shaking support:

```javascript
module.exports = {
    // ...
    // Your configuration
    // ...
    resolve: {
        // ...
        // Your resolving options
        // ...
        alias: {
            // ...
            // Your aliases
            // ...
            'with-privates': 'with-privates/es6-module/withPrivates.js'
        },
    }
};
```
