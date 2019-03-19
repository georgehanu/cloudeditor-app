const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const Selection = require("../../core/components/UI/Selection");
const { keys } = require("ramda");

require("./Settings.css");

class Settings extends React.Component {
  state = {
    fields: {
      Quantity: {
        label: "Quantity",
        value: "5",
        options: {
          5: "5",
          10: "10",
          15: "15",
          25: "25"
        }
      },
      Paper: {
        label: "Paper",
        value: "0",
        options: {
          0: "Paper type 1",
          1: "Paper type 2",
          2: "Paper type 3"
        }
      }
    }
  };

  changePoptextValue = event => {
    console.log(event.target.name);
    console.log(event.target.value);
  };
  render() {
    const fields = keys(this.state.fields).map(el => {
      return (
        <Selection
          label={this.state.fields[el].label}
          name={el}
          options={this.state.fields[el].options}
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

const SettingsPlugin = withNamespaces("settings")(Settings);

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
