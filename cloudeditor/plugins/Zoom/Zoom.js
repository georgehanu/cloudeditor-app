const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/components/sidebar/SidebarButton");

const { zoomValueSelector } = require("../../core/stores/selectors/ui");
const { changeZoom } = require("../../core/stores/actions/ui");
const { withHandlers, compose } = require("recompose");
const STEP = 0.04;

const Zoom = props => {
  return (
    <div className="Zoom">
      <SidebarButton clicked={props.zoomIn}>
        <div className="IconContainer">
          <div className="icon printqicon-zoom_in" />
        </div>
        <div className="IconTitle">{"Zoom In"}</div>
      </SidebarButton>
      <div className="ZoomMiddle">
        <div className="icon printqicon-rotate_handler" onClick={props.reset} />
        <div className="ZoomValue">{props.zoomValue.toFixed(2) + "%"}</div>
      </div>

      <SidebarButton clicked={props.zoomOut}>
        <div className="IconContainer">
          <div className="icon printqicon-zoom_out" />
        </div>
        <div className="IconTitle">{"Zoom Out"}</div>
      </SidebarButton>
    </div>
  );
};

const enhance = compose(
  withHandlers({
    zoomIn: props => event => {
      props.changeZoom(props.zoomValue + STEP);
    },
    zoomOut: props => event => {
      if (props.zoomValue > STEP) props.changeZoom(props.zoomValue - STEP);
    },
    reset: props => event => {
      props.changeZoom(1);
    }
  })
);

const mapStateToProps = state => {
  return {
    zoomValue: zoomValueSelector(state)
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
      text: "Zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  }),
  reducers: { ui: require("../../core/stores/reducers/ui") }
};
