const React = require("react");
const ModalWnd = require("../../../core/components/Modal/ModalWnd");

class ManualWnd extends React.Component {
  state = {
    manualHelpMessage: "Manual & Help - missing"
  };

  componentDidMount() {
    const manual = document.getElementById("ManualHelp");
    if (manual !== null) this.setState({ manualHelpMessage: manual.innerHTML });
  }

  render() {
    return (
      <React.Fragment>
        <ModalWnd
          className="loginWnd manualWnd"
          clicked={this.props.modalClosed}
          show={true}
          title={this.props.t("Manual & Help")}
        >
          <div
            className="manualWndContainer"
            dangerouslySetInnerHTML={{ __html: this.state.manualHelpMessage }}
          />
        </ModalWnd>
      </React.Fragment>
    );
  }
}

module.exports = ManualWnd;
