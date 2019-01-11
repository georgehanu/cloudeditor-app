const React = require("react");
const HeaderWnd = require("./HeaderWnd");
const { connect } = require("react-redux");
const Backdrop = require("../../../core/components/Backdrop/Backdrop");
const { withNamespaces } = require("react-i18next");

const {
  /*  titleSelector,
  projDescriptionSelector,
  projProjectIdSelector,
  projSaveLoadingSelector,
  projSaveErrorMessageSelector*/
} = require("../../../core/stores/selectors/project");

const {
  /*projSaveStart,
  projSaveClearMessage*/
} = require("../../../core/stores/actions/project");

class LoadWnd extends React.Component {
  state = {};

  componentDidMount() {}

  onOkButton = () => {};

  render() {
    return (
      <React.Fragment>
        <div className="loginContainer">
          <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
          <div className="loginWnd">
            <div className="loginWndContainer">
              <HeaderWnd
                modalClosed={this.props.modalClosed}
                title={this.props.t("Load project")}
              />
              <div className="loginFields" />
              <div className="loginWndButtons">
                <button onClick={this.onSaveButton}>
                  {this.props.t("Ok")}
                </button>
                <button onClick={this.props.modalClosed}>
                  {this.props.t("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    /*loading: projSaveLoadingSelector(state),
    errorMessage: projSaveErrorMessageSelector(state),
    title: titleSelector(state),
    description: projDescriptionSelector(state),
    projectId: projProjectIdSelector(state),
    userId: authUserIdSelector(state)*/
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*    projSaveStart: (userId, name, description, id) =>
      dispatch(projSaveStart({ userId, name, description, id })),
    projSaveClearMessage: () => dispatch(projSaveClearMessage())*/
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(SaveWnd));
