import React from "react";
import Fields from "../LayoutItems/Fields";
import Title from "../LayoutItems/Title";
import Description from "../LayoutItems/Description";
import { withNamespaces } from "react-i18next";
import SliderCarousel from "../SliderCarousel/SliderCarousel";
import {
  dagDataTitleSelector,
  dagDataDescriptionSelector
} from "../../../../stores/selectors/designAndGo";

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(LeftPanel));
