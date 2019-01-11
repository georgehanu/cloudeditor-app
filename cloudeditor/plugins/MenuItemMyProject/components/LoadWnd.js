const React = require("react");
const HeaderWnd = require("./HeaderWnd");
const { connect } = require("react-redux");
const Backdrop = require("../../../core/components/Backdrop/Backdrop");
const { withNamespaces } = require("react-i18next");
const LoadProjects = require("./LoadProjects");
const SweetAlert = require("sweetalert-react").default;
require("sweetalert/dist/sweetalert.css");

const {
  projProjectIdSelector,
  projLoadLoadingSelector,
  projLoadErrorMessageSelector,
  projLoadLoadedProjectsSelector
} = require("../../../core/stores/selectors/project");

const {
  projLoadStart,
  projLoadClearMessage
} = require("../../../core/stores/actions/project");
const { authUserIdSelector } = require("../../ProjectMenu/store/selectors");

class LoadWnd extends React.Component {
  state = {
    showAlert: false
  };

  componentDidMount() {
    this.loadProjects();
  }

  loadProjects = () => {
    this.props.projLoadStart(this.props.userId, "", "");
  };

  onOkButton = () => {};

  loadProjectHandler = projectId => {};

  deleteProjectHandler = projectId => {
    this.setState({ showAlert: true });
  };

  confirmtSweetAlert() {}

  render() {
    return (
      <React.Fragment>
        <div className="loginContainer">
          <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
          <div className="loginWnd loadWnd">
            <div className="loginWndContainer">
              <HeaderWnd
                modalClosed={this.props.modalClosed}
                title={this.props.t("Load project")}
              />
              <LoadProjects
                delete={this.deleteProjectHandler}
                load={this.loadProjectHandler}
                loading={this.props.loading}
                loadedProjects={this.props.loadedProjects}
                errorMessage={this.props.errorMessage}
              />
              <div className="loginWndButtons">
                <button onClick={this.props.modalClosed}>
                  {this.props.t("Close")}
                </button>
              </div>
            </div>
          </div>

          <SweetAlert
            show={this.state.showAlert}
            type="warning"
            title={this.props.t("Warning")}
            text={this.props.t("Are you sure you want to delete the project ?")}
            showCancelButton={true}
            onConfirm={() => this.confirmtSweetAlert()}
            onCancel={() => this.setState({ showAlert: false })}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: projLoadLoadingSelector(state),
    errorMessage: projLoadErrorMessageSelector(state),
    projectId: projProjectIdSelector(state),
    userId: authUserIdSelector(state),
    loadedProjects: projLoadLoadedProjectsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    projLoadStart: (userId, productId, templateId) =>
      dispatch(projLoadStart({ userId, productId, templateId })),
    projLoadClearMessage: () => dispatch(projLoadClearMessage())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(LoadWnd));
