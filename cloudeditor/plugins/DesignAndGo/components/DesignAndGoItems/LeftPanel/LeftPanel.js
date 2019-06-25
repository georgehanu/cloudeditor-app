const React = require("react");
const Fields = require("../LayoutItems/Fields");
const Title = require("../LayoutItems/Title");
const Description = require("../LayoutItems/Description");
const Continue = require("../LayoutItems/Continue");
const { withNamespaces } = require("react-i18next");
const SliderCarousel = require("../SliderCarousel/SliderCarousel");
const {
  dagDataTitleSelector,
  dagDataDescriptionSelector
} = require("../../../store/selectors");

const { connect } = require("react-redux");

class LeftPanel extends React.Component {
  getTool = tool => {
    return tool.plugin;
  };

  renderTools = () => {
    return this.props.tools.map((tool, i) => {
      const Tool = this.getTool(tool);
      return (
        <Tool
          addContainerClasses={tool.addContainerClasses}
          cfg={tool.cfg || {}}
          items={tool.items || []}
          key={i}
          index={i}
        />
      );
    });
  };

  render() {
    return (
      <div className="LeftPanel">
        {
          <div className="MenuButtonContainer">
            <a className="MenuButton" onClick={this.props.onMenuOpenHandler}>
              {this.props.t("MENU")}
            </a>
          </div>
        }
        <div className="LeftPaneHorizontal">
          <div className="LeftPaneHorizontalStyled">
            <Title
              {...this.props.title}
              onMenuOpenHandler={this.props.onMenuOpenHandler}
            />
            <Description items={this.props.description} />
            {this.props.showSlider && (
              <React.Fragment>
                <SliderCarousel
                  products={this.props.products}
                  onDataOpenHandler={this.props.onDataOpenHandler}
                  onZoomImageHandler={this.props.onZoomImageHandler}
                />
                <div className="EditLabelButtonContainer">
                  <a
                    href="javascript:void(0)"
                    className="EditLabelButton"
                    onClick={this.props.onDataOpenHandler}
                  >
                    {this.props.t("Edit labels")}
                  </a>
                </div>
              </React.Fragment>
            )}
            <Fields
              onCropImageModalOpenHandler={
                this.props.onCropImageModalOpenHandler
              }
            />
            {this.renderTools()}
            <Continue addContainerClasses={this.props.addContainerClasses} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    title: dagDataTitleSelector(state),
    description: dagDataDescriptionSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(LeftPanel));
