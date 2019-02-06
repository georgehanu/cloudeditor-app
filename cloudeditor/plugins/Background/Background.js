const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");
const { changeBackground } = require("../../core/stores/actions/project");
const {
  selectedObjectSelector
} = require("../../core/stores/selectors/project");
const { pipe, keys, head } = require("ramda");

require("./Background.css");
const Background = props => {
  const selectedItem = pipe(
    keys,
    head
  )(props.selectedObject.objects);
  let selected = false;
  if (
    selectedItem !== undefined &&
    props.selectedObject.objects[selectedItem].backgroundblock
  ) {
    selected = true;
  }

  return (
    <div
      className="backgroundContainer"
      onClick={() => {
        let background = document.getElementsByClassName("backgroundblock ");
        if (background.length) {
          props.clicked(props.index, true, () => {
            props.showPane === false
              ? background[0].click()
              : setTimeout(() => {
                  background[0].click();
                }, 20);
          });
        }
      }}
    >
      <SidebarButton
        tooltip={{
          title: "Background",
          description: "Change the background"
        }}
        selected={selected}
      >
        <div className="iconContainer">
          <div className="icon fupa-background" />
        </div>
        <div className="iconTitle">{props.t("Background")}</div>
      </SidebarButton>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    selectedObject: selectedObjectSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onChangeBackgroundHandler: payload => dispatch(changeBackground(payload))
  };
};
const BackgroundPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("background")(Background));

module.exports = {
  Background: assign(BackgroundPlugin, {
    SideBar: {
      position: 8,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
