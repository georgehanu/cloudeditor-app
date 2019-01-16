const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");

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
)(Layouts);

module.exports = {
  Layouts: assign(LayoutsPlugin, {
    SideBar: {
      position: 4,
      priority: 1,
      text: "Layouts",
      icon: "fupa-layout",
      showMore: true,
      tooltip: { title: "Layouts", description: "Layouts" }
    }
  })
};
