import * as React from 'react';

/** Check that value is function */
const isFunction = (value: any): value is Function => typeof value === 'function';

/** Private fields signature */
export interface PrivatesDefault extends Object {
    [key: string]: any;
}

/** Signature of internal enhancer setter for private fields */
export type SetValues<Privates extends PrivatesDefault = PrivatesDefault> = (values: Partial<Privates>) => void;

/** Setter signature */
export type Setter = (...args: any[]) => void;

/** Setter factory function. Creates setter by actual properties values. */
export type SetterFactory<Props, Privates extends PrivatesDefault = PrivatesDefault> = (
    props: Props,
    setValues: SetValues<Privates>,
) => Setter;

/** Setters default signature */
export type SettersDefault = {
    [key: string]: Setter;
};

/** Setters properties default signature */
export type SettersFactories<
    Props,
    Setters extends SettersDefault = SettersDefault,
    Privates extends PrivatesDefault = PrivatesDefault
> = { [K in keyof Setters]: SetterFactory<Props, Privates> };

/** Getter signature */
export type Getter = (...args: any[]) => any;

/** Getter factory function. Creates getter by actual properties values. */
export type GetterFactory<Props, Privates extends PrivatesDefault = PrivatesDefault> = (
    props: Props,
    privates: Privates,
) => Getter;

/** Getters default signature */
export type GettersDefault = {
    [key: string]: Getter;
};

/** Getters properties default signature */
export type GettersFactories<
    Props,
    Getters extends GettersDefault = GettersDefault,
    Privates extends PrivatesDefault = PrivatesDefault
> = { [K in keyof Getters]: GetterFactory<Props, Privates> };

/** Private variables High-Order Component */
export type WithPrivatesHOC<
    Props,
    Setters extends SettersDefault = SettersDefault,
    Getters extends GettersDefault = GettersDefault
> = (component: React.ComponentClass<Props & Setters & Getters>) => React.ComponentClass<Props>;

/** Entity of some type or function which maps this entity by initial component props */
export type TypeOrTypeMapper<Props, Type> = ((initialProps: Props) => Type) | Type;

/** Private variables High-Order Component creator */
export default function withPrivates<
    Props,
    Privates extends PrivatesDefault = PrivatesDefault,
    Setters extends SettersDefault = SettersDefault,
    Getters extends GettersDefault = GettersDefault
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
    return function(component: React.ComponentClass<Props & Setters & Getters>) {
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
                this.initItems();
            }
            /** @override */
            public componentWillReceiveProps(newProps: Props) {
                this.initItems();
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
                this.privates = {
                    ...(<any>this.privates),
                    ...(<any>values),
                };
            }
            /** Re-init items */
            private initItems(): void {
                this.privates = isFunction(privates) ? privates(this.props) : privates;
                this.settersFactories = isFunction(setters) ? setters(this.props) : setters;
                this.gettersFactories = isFunction(getters) ? getters(this.props) : getters;
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
