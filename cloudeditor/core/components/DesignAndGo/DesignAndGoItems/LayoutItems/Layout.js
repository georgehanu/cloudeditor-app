import React from "react";

import LeftPanel from "../LeftPanel/LeftPanel";
import RightPanel from "../RightPanel/RightPanel";
import SliderCarousel from "../SliderCarousel/SliderCarousel";
import { dagSliderDataSelector } from "../../../../stores/selectors/designAndGo";

const { connect } = require("react-redux");

const MobileBreakpoint = 842;

class Layout extends React.Component {
  state = {
    width: 0
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    return (
      <React.Fragment>
        <div className="Layout">
          <div className="MainContainer">
            <div className="StyledSplitPane">
              <LeftPanel
                data={this.props.data}
                onMenuOpenHandler={this.props.onMenuOpenHandler}
                onDataOpenHandler={this.props.onDataOpenHandler}
                sliderData={this.props.sliderData}
                showSlider={this.state.width > MobileBreakpoint ? false : true}
              />
              <RightPanel />
            </div>
            {this.state.width > MobileBreakpoint && (
              <SliderCarousel sliderData={this.props.sliderData} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    sliderData: dagSliderDataSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
