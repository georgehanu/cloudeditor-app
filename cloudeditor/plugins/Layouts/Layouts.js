const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");

const TYPE = "layout";

const Gallery = require("../../core/components/Gallery/Gallery");
require("./Layouts.css");

class Layouts extends React.Component {
  render() {
    return (
      <div className="LayoutsContainer">
        <Gallery
          type={TYPE}
          hideActions={true}
          addContainerClasses={this.props.addContainerClasses}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

const LayoutsPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layouts")(Layouts));

module.exports = {
  Layouts: assign(LayoutsPlugin, {
    SideBar: {
      position: 4,
      priority: 1,
      text: "Layouts",
      icon: "printqicon-layouts",
      showMore: true,
      tooltip: { title: "Layouts", description: "Layouts" }
    }
  })
};
