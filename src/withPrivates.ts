import * as React from 'react';

/** Check that value is function */
const isFunction = (value: any): value is Function => typeof value === 'function';

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
export type WithPrivatesHOC<Props, Setters = SettersDefault, Getters = GettersDefault> = (
    component: React.ComponentType<Props & Setters & Getters>,
) => React.ComponentType<Props>;

/** Entity of some type or function which maps this entity by initial component props */
export type TypeOrTypeMapper<Props, Type> = ((initialProps: Props) => Type) | Type;

/** Private variables High-Order Component creator */
export default function withPrivates<
    Props,
    Privates = PrivatesDefault,
    Setters = SettersDefault,
    Getters = GettersDefault
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
): WithPrivatesHOC<Props, Setters, Getters> {
    return function(component: React.ComponentType<Props & Setters & Getters>) {
        /** High-Order Component class */
        return class WithPrivatesComponent extends React.Component<Props> {
            /** Private variables set */
            private privates: Privates;
            /** Setters factories */
            private settersFactories: SettersFactories<Props, Setters, Privates>;
            /** Getters factories */
            private gettersFactories: GettersFactories<Props, Getters, Privates>;
            /** @constructor */
            public constructor(props: Props, context?: any) {
                super(props, context);
                this.setValues = this.setValues.bind(this);
                this.initItems(this.props);
            }
            /** @override */
            public render() {
                const getters: Getters = <Getters>{};
                Object.keys(this.gettersFactories).forEach(key => {
                    getters[key] = this.gettersFactories[key](this.props, this.privates);
                });
                const setters: Setters = <Setters>{};
                Object.keys(this.settersFactories).forEach(key => {
                    setters[key] = this.settersFactories[key](this.props, this.setValues);
                });
                return React.createElement(component, {
                    ...(<any>this.props),
                    ...(<any>getters),
                    ...(<any>setters),
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
