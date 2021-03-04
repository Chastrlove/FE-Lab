import * as React from "react";
import { connect } from "./react-redux";

const addCountAction = {
  type: "add",
};

const mapStateToProps = (state) => {
  return {
    count: state.count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCount: () => {
      dispatch(addCountAction);
    },
  };
};

class App extends React.Component<any> {
  render() {
    return (
      <div className="App">
        {this.props.count}
        <button onClick={() => this.props.addCount()}>增加</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
