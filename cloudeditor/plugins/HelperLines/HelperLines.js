const React = require("react");
const { withNamespaces } = require("react-i18next");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { pathOr } = require("ramda");
const { createSelector } = require("reselect");

const {
  activePageIdSelector,
  pageColumnsNoSelector,
  allowLayoutColumnsSelector,
  allowMagneticSelector
} = require("../../core/stores/selectors/project");

const {
  updatePageProps,
  changeMagnetic
} = require("../../core/stores/actions/project");

require("./HelperLines.css");
const SubmenuPoptext = require("../MenuItemHeaderFooter/components/SubmenuPoptext");

class HelperLines extends React.PureComponent {
  state = {
    submenuOpened: false,
    poptextPages: {
      items: ["2 Columns", "3 Columns", "4 Columns", "None"],
      mapItems: [2, 3, 4, 0],
      open: false
    }
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { columnsNo } = nextProps;

    let active = "None";
    if (columnsNo > 1 && columnsNo <= 4) {
      active = columnsNo + " Columns";
    }
    return { poptextPages: { ...state.poptextPages, active: active } };
  }

  togglePoptextHandler = (type, hide = false) => {
    if (type === "pages") {
      this.setState({
        poptextPages: {
          ...this.state.poptextPages,
          open: hide ? false : !this.state.poptextPages.open
        }
      });
    }
  };

  toggleSelectPoptext = (type, value) => {
    if (type === "pages") {
      this.setState({
        poptextPages: {
          ...this.state.poptextPages,
          open: false
        }
      });

      const payload = {
        id: this.props.pageId,
        props: {
          columnsNo: this.state.poptextPages.mapItems[
            this.state.poptextPages.items.indexOf(value)
          ]
        }
      };

      this.props.updatePagePropsHandler(payload);
    }
  };
  onChangeHandler = event => {
    this.props.changeMagenticHandler({
      allowMagnetic: Number(event.target.value)
    });
  };

  render() {
    return (
      <div className="helperLinesContainer">
        <div className="magneticLines">
          <input
            type="checkbox"
            className="magneticLinesCheckbox"
            checked={this.props.useMagentic}
            onChange={this.onChangeHandler}
          />
          <span className="magneticLinesDescription">
            {this.props.t("Magnetic helper lines")}
          </span>
        </div>

        <div className="helperLinesLayout">
          <SubmenuPoptext
            activeItem={this.state.poptextPages.active}
            togglePoptext={this.togglePoptextHandler}
            toggleSelectPoptext={this.toggleSelectPoptext}
            items={this.state.poptextPages.items}
            open={this.state.poptextPages.open}
            t={this.props.t}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    pageId: activePageIdSelector(state),
    columnsNo: pageColumnsNoSelector(state),
    allowColumns: allowLayoutColumnsSelector(state),
    useMagentic: allowMagneticSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePagePropsHandler: payload => dispatch(updatePageProps(payload)),
    changeMagenticHandler: payload => dispatch(changeMagnetic(payload))
  };
};

const HelperLinesPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("helperLines")(HelperLines));

module.exports = {
  HelperLines: assign(HelperLinesPlugin)
};
