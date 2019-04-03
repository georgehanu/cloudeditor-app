const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const Selection = require("../../core/components/UI/Selection");
const { keys } = require("ramda");

require("./Settings.css");
const {
  displyedOptionsSelector,
  getContentCode,
  getPrintOptionsSelector,
  getQtySelector
} = require("../../core/stores/selectors/productinformation");
const {
  changeOptions
} = require("../../core/stores/actions/productInformation");
class Settings extends React.Component {
  changePoptextValue = event => {
    this.props.onChangeOptions({
      code: event.target.name,
      value: event.target.value
    });
  };
  render() {
    if (!Object.keys(this.props.print_options).length) return null;
    const fields = keys(this.props.fields).map(el => {
      return (
        <Selection
          label={this.props.t(this.props.fields[el].label)}
          name={el}
          key={el}
          value={
            el === "quantity"
              ? "qty_" + this.props.qty
              : this.props.print_options[this.props.contentCode][el][0]
          }
          options={this.props.fields[el].options}
          className={"settingsSelection"}
          changePoptextValue={this.changePoptextValue}
        />
      );
    });
    return (
      <div className="settingsContainer">
        <div className="settingsContainerTitle">
          {this.props.t("Product configurations")}
        </div>
        <div className="settingsFields">{fields}</div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    fields: displyedOptionsSelector(state),
    print_options: getPrintOptionsSelector(state),
    contentCode: getContentCode(state),
    qty: getQtySelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onChangeOptions: params => dispatch(changeOptions(params))
  };
};

const SettingsPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("settings")(Settings));

module.exports = {
  Settings: assign(SettingsPlugin, {
    SideBar: {
      position: 10,
      priority: 1,
      text: "Settings",
      icon: "fupa-settings",
      showMore: false
    }
  })
};
