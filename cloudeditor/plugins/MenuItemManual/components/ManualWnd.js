const React = require("react");
const ModalWnd = require("../../../core/components/Modal/ModalWnd");
const { helperBlockSelector } = require("../../../core/stores/selectors/ui");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
class ManualWnd extends React.Component {
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
            dangerouslySetInnerHTML={{ __html: this.props.helperBlock }}
          />
        </ModalWnd>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    helperBlock: helperBlockSelector(state)
  };
};
module.exports = connect(
  mapStateToProps,
  null
)(withNamespaces("translate")(ManualWnd));
