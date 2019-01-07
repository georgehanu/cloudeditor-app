const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

const { zoomSelector } = require("../../core/stores/selectors/ui");
const { changeZoom } = require("../../core/stores/actions/ui");
const { withHandlers, compose } = require("recompose");

require("./Zoom.css");

const STEP = 0.1;

const Zoom = props => {
  return (
    <div className="zoom">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon awesome-plus" />
        </div>
        <div className="iconTitle">{"Zoom In"}</div>
      </SidebarButton>
      <div className="zoomMiddle">
        <div className="zoomValue">
          {(props.zoomValue * 100).toFixed(0) + "%"}
        </div>
      </div>

      <SidebarButton clicked={props.zoomOut}>
        <div className="iconContainer">
          <div className="icon awesome-minus" />
        </div>
        <div className="iconTitle">{"Zoom Out"}</div>
      </SidebarButton>
      <div className="zoomButtons">
        <button className="zoomButtonTop" onClick={() => props.setZoomValue(1)}>
          100%
        </button>
        <button
          className="zoomButtonMiddle"
          onClick={() => props.setZoomValue(1.5)}
        >
          150%
        </button>
        <button
          className="zoomButtonBottom"
          onClick={() => props.setZoomValue(2)}
        >
          200%
        </button>
      </div>
    </div>
  );
};

const enhance = compose(
  withHandlers({
    zoomIn: props => event => {
      props.changeZoom(props.zoomValue + STEP);
    },
    zoomOut: props => event => {
      if (props.zoomValue > 1) props.changeZoom(props.zoomValue - STEP);
    },
    setZoomValue: props => value => {
      props.changeZoom(value);
    }
  })
);

const mapStateToProps = state => {
  return {
    zoomValue: zoomSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeZoom: zoomValue => dispatch(changeZoom(zoomValue))
  };
};

const ZoomPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(enhance(Zoom));

module.exports = {
  Zoom: assign(ZoomPlugin, {
    SideBar: {
      position: 5,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  }),
  reducers: { ui: require("../../core/stores/reducers/ui") }
};
