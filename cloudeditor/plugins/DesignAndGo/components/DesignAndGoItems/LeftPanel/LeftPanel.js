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

const {
  dagChangeDimmensions
} = require("../../../../DesignAndGo/store/actions");

const { connect } = require("react-redux");

class LeftPanel extends React.Component {
  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.onChangeDimmensionsHandler({
        [e.target.name]: e.target.value
      });
    }
  };
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
                  products={this.props.products}
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
            <Fields />
          </div>
        </div>

        <div className="Dimmensions">
          <label>
            Width:
            <input
              type="text"
              name="width"
              defaultValue="500"
              onKeyPress={this._handleKeyPress}
            />
          </label>
          <label>
            Height:
            <input
              type="text"
              name="height"
              defaultValue="733"
              onKeyPress={this._handleKeyPress}
            />
          </label>
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
  return {
    onChangeDimmensionsHandler: payload => {
      dispatch(dagChangeDimmensions(payload));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(LeftPanel));
