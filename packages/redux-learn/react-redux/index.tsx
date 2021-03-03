import * as React from "react";
import { useContext, useEffect, useMemo } from "react";


const ReactReduxContext = React.createContext(null)

export const Provider = ({ store, children }) => {
    const contextValue = useMemo(() => {
        return store
    }, [store])
    const Context = ReactReduxContext;
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export const connect = (mapStateToProps, mapDispatchToProps) => {
    return (ReactComponent) => {
        return (props) => {
            const [, forceUpdate] = React.useReducer(x => x + 1, 0);
            const context = useContext(ReactReduxContext)

            useEffect(() => {
                const unsubscribe = context.subscribe(forceUpdate);
                return () => {
                    unsubscribe()
                }
            }, [context])
            return <ReactComponent {...{
                ...props,
                ...mapStateToProps(context.getState()),
                ...mapDispatchToProps(context.dispatch)
            }} context={context}/>
        }
    }
}
