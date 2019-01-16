const React = require("react");

class SimpleDiv extends React.Component {
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "25%",
          border: "1px solid red",
          padding: "20px",
          margin: "20px"
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

module.exports = SimpleDiv;
