const React = require("react");
const assign = require("object-assign");
const Renderer = require("./FabricRenderer/containers/Fabric");

class FabricRenderer extends React.Component {
  render() {
    return (
      <div className="renderContainer">
        <Renderer />
      </div>
    );
  }
}

module.exports = {
  FabricRenderer: assign(FabricRenderer),
  reducers: {},
  epics: {}
};
