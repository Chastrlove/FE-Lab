//最简单的redux

import { countReducer } from "./reducer";
import { applyMiddleware } from "./middleware";

export const createStoreRaw = (reducer) => {
  const listeners = [];
  let currentState;
  const getState = () => {
    return currentState;
  };

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };
  dispatch({
    type: "@INIT",
  });

  return {
    getState,
    dispatch,
    subscribe,
  };
};

const logMiddleware = (store) => (next) => (action) => {
  console.log("log1",store);
  next(action);
};

const log2Middleware = (store) => (next) => (action) => {
  console.log("log2",store);
  next(action);
};
export const createStore = applyMiddleware(log2Middleware, logMiddleware)(createStoreRaw);

// const store = createStore(reducer)
//
// store.dispatch({
//     type:"add",
//     payload:{
//         count:1
//     }
// })
// console.log(store.getState())
