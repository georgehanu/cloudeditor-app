const React = require("react");
const ModalWnd = require("../../../core/components/Modal/ModalWnd");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const LoadProjects = require("./LoadProjects");
const SweetAlert = require("sweetalert-react").default;
const MessageForm = require("./MessageForm");

require("sweetalert/dist/sweetalert.css");

const {
  projProjectIdSelector,
  projLoadLoadingSelector,
  projLoadErrorMessageSelector,
  projLoadLoadedProjectsSelector,
  projLoadLoadingDeleteSelector,
  projLoadErrorMessageDeleteSelector,
  projLoadLoadingProjectSelector,
  projLoadErrorMessageProjectSelector
} = require("../../../core/stores/selectors/project");

const {
  projLoadStart,
  projLoadClearMessage,
  projLoadDeleteStart,
  projLoadDeleteClearMessage,
  projLoadProjectStart,
  projLoadProjectClearMessage
} = require("../../../core/stores/actions/project");
const {
  getProductIdSelector
} = require("../../../core/stores/selectors/productinformation");

class LoadWnd extends React.Component {
  state = {
    showAlert: false,
    projectId: null,
    action: null
  };

  componentDidMount() {
    this.loadProjects();
  }

  loadProjects = () => {
    this.props.projLoadStart("", "");
  };

  onOkButton = () => {};

  loadProjectHandler = projectId => {
    this.setState({ showAlert: true, projectId, action: "load" });
  };

  deleteProjectHandler = projectId => {
    this.setState({ showAlert: true, projectId, action: "delete" });
  };

  confirmtSweetAlert() {
    this.setState({ showAlert: false });
    if (this.state.action === "delete") {
      this.props.deleteStart(this.state.projectId, this.props.productId);
    } else if (this.state.action === "load") {
      this.props.projectLoadStart(this.state.projectId, this.props.productId);
    }
  }

  render() {
    const actionError =
      this.props.errorMessageDelete || this.props.errorMessageProject;
    const actionLoading = this.props.loadingDelete || this.props.loadingProject;

    let saTitle = this.props.t("Warning");
    let saType = "warning";
    let saText = "";
    if (this.state.action === "delete") {
      saText = this.props.t("Are you sure you want to delete the project ?");
    } else if (this.state.action === "load") {
      saText = this.props.t(
        "Are you sure you want to load the project ?\nCurrent changes will be lost"
      );
    }

    return (
      <React.Fragment>
        <ModalWnd
          className="loginWnd loadWnd"
          clicked={this.props.modalClosed}
          show={this.props.show}
          title={this.props.t("Load project")}
        >
          <LoadProjects
            delete={this.deleteProjectHandler}
            load={this.loadProjectHandler}
            loading={this.props.loading}
            loadedProjects={this.props.loadedProjects}
            errorMessage={this.props.errorMessage}
          />

          <div className="messageForm">
            <MessageForm errorMessage={actionError} loading={actionLoading} />
          </div>

          <div className="loginWndButtons">
            <button onClick={this.props.modalClosed}>
              {this.props.t("Close")}
            </button>
          </div>
        </ModalWnd>
        <SweetAlert
          show={this.state.showAlert}
          type={saType}
          title={saTitle}
          text={saText}
          showCancelButton={true}
          onConfirm={() => this.confirmtSweetAlert()}
          onCancel={() => this.setState({ showAlert: false })}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: projLoadLoadingSelector(state),
    errorMessage: projLoadErrorMessageSelector(state),
    projectId: projProjectIdSelector(state),
    productId: getProductIdSelector(state),
    loadedProjects: projLoadLoadedProjectsSelector(state),
    loadingDelete: projLoadLoadingDeleteSelector(state),
    errorMessageDelete: projLoadErrorMessageDeleteSelector(state),
    loadingProject: projLoadLoadingProjectSelector(state),
    errorMessageProject: projLoadErrorMessageProjectSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    projLoadStart: (productId, templateId) =>
      dispatch(projLoadStart({ productId, templateId })),
    projLoadClearMessage: () => dispatch(projLoadClearMessage()),
    deleteStart: (projectId, productId) =>
      dispatch(projLoadDeleteStart({ projectId, productId })),
    deleteClearMessage: () => dispatch(projLoadDeleteClearMessage()),
    projectLoadStart: (projectId, productId) =>
      dispatch(projLoadProjectStart({ projectId, productId })),
    projectClearMessage: () => dispatch(projLoadProjectClearMessage())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(LoadWnd));
