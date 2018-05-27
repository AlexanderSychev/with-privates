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

```typescript jsx
import * as React from 'react';

/** Check that value is function */
const isFunction = (value: any): value is Function => typeof value === 'function';

/** With privates component instance */
export type IWithPrivatesComponent<Props> = React.Component<Props & React.Attributes>;

/** Refs for enhanced component and source component */
export type WithRefs<Props, T = React.ReactInstance> = {
    /** Reference to enhanced component */
    ref?: React.Ref<IWithPrivatesComponent<Props>>;
    /** Reference to source component */
    innerRef?: React.Ref<T>;
};

/** Private fields signature */
export interface PrivatesDefault extends Object {
    [key: string]: any;
}

/** Signature of internal enhancer setter for private fields */
export type SetValues<Privates = PrivatesDefault> = (values: Partial<Privates>) => void;

/** Setter signature */
export type Setter = (...args: any[]) => void;

/** Setter factory function. Creates setter by actual properties values. */
export type SetterFactory<Props, Privates = PrivatesDefault> = (props: Props, setValues: SetValues<Privates>) => Setter;

/** Setters default signature */
export type SettersDefault = {
    [key: string]: Setter;
};

/** Setters properties default signature */
export type SettersFactories<Props, Setters = SettersDefault, Privates = PrivatesDefault> = {
    [K in keyof Setters]: SetterFactory<Props, Privates>
};

/** Getter signature */
export type Getter = (...args: any[]) => any;

/** Getter factory function. Creates getter by actual properties values. */
export type GetterFactory<Props, Privates = PrivatesDefault> = (props: Props, privates: Privates) => Getter;

/** Getters default signature */
export type GettersDefault = {
    [key: string]: Getter;
};

/** Getters properties default signature */
export type GettersFactories<Props, Getters = GettersDefault, Privates = PrivatesDefault> = {
    [K in keyof Getters]: GetterFactory<Props, Privates>
};

/** Private variables High-Order Component */
export type WithPrivatesHOC<
    Props,
    Setters = SettersDefault,
    Getters = GettersDefault,
    Instance = React.Component<Props>
> = (
    component: React.ComponentType<Props & Setters & Getters>,
) => React.ComponentType<Props & WithRefs<Props, Instance> & React.Attributes>;

/** Entity of some type or function which maps this entity by initial component props */
export type TypeOrTypeMapper<Props, Type> = ((initialProps: Props) => Type) | Type;

/** Private variables High-Order Component creator */
export default function withPrivates<
    Props,
    Privates = PrivatesDefault,
    Setters = SettersDefault,
    Getters = GettersDefault,
    Instance = React.Component<Props>
>(
    privates: TypeOrTypeMapper<Props, Privates> = <Privates>{},
    setters: TypeOrTypeMapper<Props, SettersFactories<Props, Setters, Privates>> = <SettersFactories<
        Props,
        Setters,
        Privates
    >>{},
    getters: TypeOrTypeMapper<Props, GettersFactories<Props, Getters, Privates>> = <GettersFactories<
        Props,
        Getters,
        Privates
    >>{},
): WithPrivatesHOC<Props, Setters, Getters, Instance> {
    return function(
        component: React.ComponentType<Props & Setters & Getters & React.Attributes & WithRefs<Props, Instance>>,
    ): React.ComponentType<Props & React.Attributes & WithRefs<Props, Instance>> {
        /** High-Order Component class */
        return class WithPrivatesComponent extends React.Component<
            Props & WithRefs<Props, Instance> & React.Attributes
        > implements IWithPrivatesComponent<Props> {
            /** Private variables set */
            private privates: Privates;
            /** Setters factories */
            private settersFactories: SettersFactories<Props, Setters, Privates>;
            /** Getters factories */
            private gettersFactories: GettersFactories<Props, Getters, Privates>;
            /** @constructor */
            public constructor(props: Props & React.Attributes & WithRefs<Props, Instance>, context?: any) {
                super(props, context);
                this.setValues = this.setValues.bind(this);
                this.initItems(<any>this.props);
            }
            /** @override */
            public render() {
                const getters: Getters = <Getters>{};
                Object.keys(this.gettersFactories).forEach(key => {
                    getters[key] = this.gettersFactories[key](<any>this.props, this.privates);
                });
                const setters: Setters = <Setters>{};
                Object.keys(this.settersFactories).forEach(key => {
                    setters[key] = this.settersFactories[key](<any>this.props, this.setValues);
                });
                return React.createElement(component, {
                    ...(<any>this.props),
                    ...(<any>getters),
                    ...(<any>setters),
                    ref: this.props.innerRef,
                });
            }
            /** Set new values to privates */
            private setValues(values: Partial<Privates>): void {
                Object.keys(values).forEach(key => (this.privates[key] = values[key]));
            }
            /** Re-init items */
            private initItems(props: Props): void {
                this.privates = isFunction(privates) ? privates(props) : privates;
                this.settersFactories = isFunction(setters) ? setters(props) : setters;
                this.gettersFactories = isFunction(getters) ? getters(props) : getters;
            }
        };
    };
}

/** "withPrivates" function type */
export type withPrivatesType = typeof withPrivates;

// Declare Decision Table constructor in global namespace
declare global {
    interface Window {
        withPrivates: withPrivatesType;
    }
    const withPrivates: withPrivatesType;
}
```

## Bundling with Webpack

You can use one of browser bundles of this package:
* `with-privates/dist/with-privates.dev.js` - uncompressed library (for development);
* `with-privates/dist/with-privates.prod.js` - compressed library (for production).

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
