const React = require("react");
const HeaderWnd = require("./HeaderWnd");
const { connect } = require("react-redux");
const Input = require("./Input");
const Textarea = require("./Textarea");
const Backdrop = require("../../../core/components/Backdrop/Backdrop");
const InvalidForm = require("./InvalidForm");

const { withNamespaces } = require("react-i18next");

const {
  titleSelector,
  projDescriptionSelector,
  projProjectIdSelector,
  projSaveLoadingSelector,
  projSaveErrorMessageSelector
} = require("../../../core/stores/selectors/project");

const {
  projSaveStart,
  projSaveClearMessage
} = require("../../../core/stores/actions/project");

const { authUserIdSelector } = require("../../ProjectMenu/store/selectors");

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
        this.props.projectId
      );
    }
  };

  componentWillUnmount() {
    this.props.projSaveClearMessage();
  }

  render() {
    const errorMessage =
      this.state.invalidMessage !== null
        ? this.state.invalidMessage
        : this.props.errorMessage;

    return (
      <React.Fragment>
        <div className="loginContainer">
          <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
          <div className="loginWnd saveWnd">
            <div className="loginWndContainer">
              <HeaderWnd
                modalClosed={this.props.modalClosed}
                title={this.props.t("Save project")}
              />
              <div className="loginFields">
                <Input
                  label={this.props.t("Project name")}
                  onInputChange={this.onInputChange}
                  text={this.state.projectName}
                  name="projectName"
                />
                <Textarea
                  label={this.props.t("Project description")}
                  onInputChange={this.onInputChange}
                  text={this.state.projectDescription}
                  name="projectDescription"
                />
              </div>
              <div className="invalidForm">
                <InvalidForm
                  errorMessage={errorMessage}
                  loading={this.props.loading}
                />
              </div>
              <div className="loginWndButtons">
                <button onClick={this.onSaveButton}>
                  {this.props.t("Save")}
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
    loading: projSaveLoadingSelector(state),
    errorMessage: projSaveErrorMessageSelector(state),
    title: titleSelector(state),
    description: projDescriptionSelector(state),
    projectId: projProjectIdSelector(state),
    userId: authUserIdSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    projSaveStart: (userId, name, description, id) =>
      dispatch(projSaveStart({ userId, name, description, id })),
    projSaveClearMessage: () => dispatch(projSaveClearMessage())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(SaveWnd));
