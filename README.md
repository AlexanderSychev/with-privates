# with-privates

High-Order Component (HOC) which provides private variables with
setters and getters. Private variables changing not will fire re-rendering process.

## Usage

```jsx harmony
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import withPrivates from 'withPrivates';

const SomeFunctionalComponents = (props) => <div>
    <button type="button" onClick={() => {
        alert(`foo = ${props.getFoo()}\bbar = ${props.getBar()}`);
    }}>
        SHOW PRIVATE VARIABLES
    </button>
</div>;

const EnhancedSomeFunctionalComponents = withPrivates(
    (props) => ({
        foo: props.foo,
        bar: 'bar'
    }),
    {
        setFoo: (props, setValues) => (foo) => setValues({ foo }),
        setBar: (props, setValues) => (bar) => setValues({ bar }),
    },
    {
        getFoo: (props, privates) => () => (privates.foo),
        getBar: (props, privates) => () => (privates.bar),
    },
);

const root = document.getElementById('root');
ReactDOM.render(
    <EnhancedSomeFunctionalComponents foo="foo" />,
    root
);
```
