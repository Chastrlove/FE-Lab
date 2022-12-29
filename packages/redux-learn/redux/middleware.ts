import { createStoreRaw } from "./store";

export const applyMiddleware =
  (...middlewares) =>
  (createStore) =>
  (reducers) => {
    const oldStore = createStore(reducers);
    const next = oldStore.dispatch;
    const middlewareChain = middlewares.map((middleware) => middleware(oldStore));
    oldStore.dispatch = compose(middlewareChain)(next);
    return oldStore;
  };

const compose = (middlewares) => {
  return middlewares.reduce((a, b) => {
    return (...args) => {
      return a(b(...args));
    };
  });
};
