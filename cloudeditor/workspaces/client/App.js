import React from "react";
import ReactDOM from "react-dom";
import burgerLogo from "./burger-logo.png";
import json from "./test.json";
class App extends React.Component {
  state = {
    test2: 11
  };
  constructor(props) {
    super(props);
    this.state = {
      test: 1
    };
  }
  render() {
    return (
      <div>
        <p>
          {json.test} {this.state.test2}
          <img src={burgerLogo} />
        </p>
      </div>
    );
  }
}
export default App;
ReactDOM.render(<App />, document.getElementById("app"));

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept();
}
