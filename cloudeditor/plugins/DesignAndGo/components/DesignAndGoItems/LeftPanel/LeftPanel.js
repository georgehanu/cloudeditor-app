const React = require("react");
const Fields = require("../LayoutItems/Fields");
const Title = require("../LayoutItems/Title");
const Description = require("../LayoutItems/Description");
const { withNamespaces } = require("react-i18next");
const SliderCarousel = require("../SliderCarousel/SliderCarousel");
const {
  dagDataTitleSelector,
  dagDataDescriptionSelector
} = require("../../../store/selectors");

const { connect } = require("react-redux");

class LeftPanel extends React.Component {
  render() {
    return (
      <div className="LeftPanel">
        <div className="MenuButtonContainer">
          <a className="MenuButton" onClick={this.props.onMenuOpenHandler}>
            {this.props.t("MENU")}
          </a>
        </div>
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
                  sliderData={this.props.sliderData}
                  onDataOpenHandler={this.props.onDataOpenHandler}
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
            <Fields sliderData={this.props.sliderData} />
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
