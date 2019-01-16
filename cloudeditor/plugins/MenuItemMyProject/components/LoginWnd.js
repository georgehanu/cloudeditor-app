const React = require("react");
const HeaderWnd = require("./HeaderWnd");
const { connect } = require("react-redux");
const Input = require("./Input");
const Backdrop = require("../../../core/components/Backdrop/Backdrop");
const MessageForm = require("./MessageForm");
const posed = require("react-pose").default;

const Box = posed.div({
  visible: {
    top: "50%"
  },
  hidden: {
    top: "0%"
  }
});

require("./LoginWnd.css");
const { withNamespaces } = require("react-i18next");

const {
  authLoadingSelector,
  authErrorMessageSelector,
  authLoggedInSelector
} = require("../../ProjectMenu/store/selectors");

const {
  authSigninStart,
  authSigninClearMessage
} = require("../../ProjectMenu/store/actions");

class LoginWnd extends React.Component {
  state = {
    email: "",
    password: "",
    invalidMessage: null
  };

  componentDidMount() {
    this.setState({ poseState: "hidden" });
  }

  onInputChange = event => {
    if (event.target.name === "email") {
      this.setState({ email: event.target.value });
    } else if (event.target.name === "password") {
      this.setState({ password: event.target.value });
    }
  };

  validateEmail = email => {
    let message = null;
    if (email.length === 0) {
      message = this.props.t("Please fill the email field");
    } else {
      if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
        message = this.props.t("Invalid email field");
      }
    }
    this.setState({ invalidMessage: message });
    return message === null;
  };
  validatePassword = password => {
    let message = null;
    if (password.length === 0) {
      message = this.props.t("Please fill the password field");
    }
    this.setState({ invalidMessage: message });
    return message === null;
  };

  onLoginButton = () => {
    if (
      this.validateEmail(this.state.email) &&
      this.validatePassword(this.state.password)
    ) {
      this.props.signIn(this.state.email, this.state.password);
    }
  };

  render() {
    const errorMessage =
      this.state.invalidMessage !== null
        ? this.state.invalidMessage
        : this.props.errorMessage;

    if (this.props.loggedIn) return null;

    return (
      <React.Fragment>
        <div className="loginContainer">
          <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
          <Box className="loginWnd" initialPose="hidden" pose="visible">
            <div className="loginWndContainer">
              <HeaderWnd
                modalClosed={this.props.modalClosed}
                title={this.props.t("Login")}
              />
              <div className="loginFields">
                <Input
                  label={this.props.t("Email")}
                  onInputChange={this.onInputChange}
                  text={this.state.email}
                  name="email"
                />
                <Input
                  label={this.props.t("Password")}
                  type="password"
                  onInputChange={this.onInputChange}
                  text={this.state.password}
                  name="password"
                />
              </div>
              <div className="messageForm">
                <MessageForm
                  errorMessage={errorMessage}
                  loading={this.props.loading}
                />
              </div>
              <div className="loginWndButtons">
                <button onClick={this.props.modalClosed}>
                  {this.props.t("Register")}
                </button>
                <button onClick={this.onLoginButton}>
                  {this.props.t("Login")}
                </button>
                <button onClick={this.props.modalClosed}>
                  {this.props.t("Close")}
                </button>
              </div>
            </div>
          </Box>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: authLoadingSelector(state),
    errorMessage: authErrorMessageSelector(state),
    loggedIn: authLoggedInSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: (email, password) => dispatch(authSigninStart({ email, password })),
    signinClearMessage: () => dispatch(authSigninClearMessage())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(LoginWnd));
