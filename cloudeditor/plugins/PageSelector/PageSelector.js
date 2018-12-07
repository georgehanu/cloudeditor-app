const React = require("react");
const { PagesContainer } = require("./components/PagesContainer");
const PageHeader = require("./components/PageHeader");
const { hot } = require("react-hot-loader");

class PageSelector extends React.Component {
  state = {
    size: "Normal"
  };

  extend = () => {
    if (this.state.size === "Normal") {
      this.props.addContainerClasses("PageSelector", ["PageSelectorExtended"]);
      this.setState({ size: "Extended" });
    } else {
      this.props.addContainerClasses("PageSelector", ["PageSelectorNormal"]);
      this.setState({ size: "Normal" });
    }
  };

  minimize = () => {
    if (this.state.size === "Normal") {
      this.props.addContainerClasses("PageSelector", ["PageSelectorMinimized"]);
      this.setState({ size: "Minimized" });
    } else {
      this.props.addContainerClasses("PageSelector", ["PageSelectorNormal"]);
      this.setState({ size: "Normal" });
    }
  };

  render() {
    return (
      <div className="PageSelector">
        <PageHeader
          minimize={this.minimize}
          extend={this.extend}
          status={this.state.size}
          showExtend={this.state.size !== "Extended"}
          showMinimized={this.state.size !== "Minimized"}
        />
        <PagesContainer />
      </div>
    );
  }
}

const PageSelectorPlugin = hot(module)(PageSelector);

module.exports = {
  PageSelector: PageSelectorPlugin
};
