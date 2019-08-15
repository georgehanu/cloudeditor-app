const React = require("react");
const ModalWnd = require("../../../core/components/Modal/ModalWnd");
const { connect } = require("react-redux");
const Input = require("./UI/Input");
const Textarea = require("./UI/Textarea");
const Backdrop = require("../../../core/components/Backdrop/Backdrop");
const MessageForm = require("./UI/MessageForm");

const { withNamespaces } = require("react-i18next");

const {
  titleSelector,
  projDescriptionSelector,
  projProjectIdSelector,
  projSaveLoadingSelector,
  projSaveErrorMessageSelector,
  showAlertSelector
} = require("../../../core/stores/selectors/project");

const {
  projSaveStart,
  projSaveClearMessage,
  projectIdSelector
} = require("../../../core/stores/actions/project");

const { authUserIdSelector } = require("../../ProjectMenu/store/selectors");

const SweetAlert = require("sweetalert-react").default;
require("sweetalert/dist/sweetalert.css");

class SaveWnd extends React.Component {
  state = {
    projectName: "",
    projectDescription: "",
    invalidMessage: null
  };

  componentDidMount() {
    this.setState({
      projectName: this.props.title,
      projectDescription: this.props.description
    });
  }

  onInputChange = event => {
    if (event.target.name === "projectName") {
      this.setState({ projectName: event.target.value });
    } else if (event.target.name === "projectDescription") {
      this.setState({ projectDescription: event.target.value });
    }
  };

  validateProjectName = projectName => {
    let message = null;
    if (projectName.length === 0) {
      message = this.props.t("Please fill the project name field");
    }
    this.setState({ invalidMessage: message });
    return message === null;
  };

  onSaveButton = () => {
    if (this.validateProjectName(this.state.projectName)) {
      this.props.projSaveStart(
        this.props.userId,
        this.state.projectName,
        this.state.projectDescription,
        this.props.projectId,
        0
      );
    }
  };
  onActualizeProject = () => {
    this.props.projSaveStart(
      this.props.userId,
      this.state.projectName,
      this.state.projectDescription,
      this.props.projectId,
      1
    );
  };

  componentWillUnmount() {
    this.props.projSaveClearMessage();
  }

  render() {
    const errorMessage =
      this.state.invalidMessage !== null
        ? this.state.invalidMessage
        : this.props.errorMessage;
    const actualizeButtonStyle = {
      display: this.props.projectId ? "inline-block" : "none"
    };
    return (
      <React.Fragment>
        <ModalWnd
          className="loginWnd saveWnd"
          clicked={this.props.modalClosed}
          show={this.props.show}
          title={this.props.t("Save project")}
        >
          <div className="loginFields">
            <Input
              label={this.props.t("Project name")}
              onInputChange={this.onInputChange}
              text={this.props.projectId ? this.props.title : ""}
              placeholder={this.props.t("Empty project")}
              name="projectName"
            />
            <Textarea
              label={this.props.t("Project description")}
              onInputChange={this.onInputChange}
              text={this.props.projectId ? this.props.description : ""}
              projectId={this.props.projectId}
              placeholder={this.props.t("Description")}
              name="projectDescription"
            />
          </div>
          <div className="messageForm">
            <MessageForm
              errorMessage={errorMessage}
              loading={this.props.loading}
            />
          </div>
          <div className="loginWndButtons">
            <button onClick={this.onSaveButton}>{this.props.t("Save")}</button>
            <button
              style={actualizeButtonStyle}
              onClick={this.onActualizeProject}
            >
              {this.props.t("Actualize")}
            </button>
            <button onClick={this.props.modalClosed}>
              {this.props.t("Close")}
            </button>
          </div>
        </ModalWnd>
        <SweetAlert
          show={this.props.showAlert}
          type="warning"
          title={this.props.t("Warning")}
          text={this.props.t(this.props.errorMessage)}
          showCancelButton={true}
          onConfirm={() => {
            this.onActualizeProject();
          }}
          onCancel={() => {
            this.props.projSaveClearMessage();
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: projSaveLoadingSelector(state),
    errorMessage: projSaveErrorMessageSelector(state),
    title: titleSelector(state),
    description: projDescriptionSelector(state),
    projectId: projProjectIdSelector(state),
    userId: authUserIdSelector(state),
    showAlert: showAlertSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    projSaveStart: (userId, name, description, id, overwrite) =>
      dispatch(projSaveStart({ userId, name, description, id, overwrite })),
    projSaveClearMessage: () => dispatch(projSaveClearMessage())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(SaveWnd));
