import * as React from "react";
import ReactDOM from "react-dom";
import { createStore } from "./redux/store";
import { reducer } from "./redux/reducer";
import { Provider } from "./react-redux";
import App  from "./App";

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
