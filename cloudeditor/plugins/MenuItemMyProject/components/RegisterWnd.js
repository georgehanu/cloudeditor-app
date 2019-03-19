const React = require("react");
const ModalWnd = require("../../../core/components/Modal/ModalWnd");
const { connect } = require("react-redux");
const Input = require("./UI/Input");
const MessageForm = require("./UI/MessageForm");
const Selection = require("./UI/Selection");
const Checkbox = require("./UI/Checkbox");

require("./LoginWnd.css");
const { withNamespaces } = require("react-i18next");

const {
  authLoadingSelector,
  authErrorMessageSelector,
  authLoggedInSelector
} = require("../../ProjectMenu/store/selectors");

const {
  authRegisterStart,
  authRegisterClearMessage
} = require("../../ProjectMenu/store/actions");

class RegisterWnd extends React.Component {
  state = {
    salutation: "",
    salutationOption: {
      "": "",
      f: "Ms",
      m: "Mr"
    },
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repassword: "",
    checkNewsletter: false,
    checkAccept: false,
    invalidMessage: null,
    validate: false
  };

  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
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
  validatePassword = () => {
    let message = null;
    if (this.state.password.length === 0) {
      message = this.props.t("Please fill the password field");
    } else if (this.state.repassword.length === 0) {
      message = this.props.t("Please fill the confirm password field");
    } else if (this.state.password !== this.state.repassword) {
      message = this.props.t("Passwords do not match");
    }
    this.setState({ invalidMessage: message });
    return message === null;
  };

  validateInputs = () => {
    let message = null;
    if (this.state.salutation === "") {
      message = this.props.t("Please select salutation formula");
    } else if (this.state.firstName === "") {
      message = this.props.t("Please fill the first name field");
    } else if (this.state.lastName === "") {
      message = this.props.t("Please fill the last name field");
    }

    this.setState({ invalidMessage: message });
    return message === null;
  };

  onRegisterButton = () => {
    if (
      this.validateInputs() &&
      this.validateEmail(this.state.email) &&
      this.validatePassword() &&
      this.validateAccept()
    ) {
      this.props.register(this.state.email, this.state.password);
    }
    this.setState({ validate: true });
  };

  validateAccept = () => {
    let message = null;
    if (!this.state.checkAccept) {
      message = this.props.t("Please read and accept the privacy policy");
    }
    this.setState({ invalidMessage: message });
    return message === null;
  };

  changePoptextValue = event => {
    this.setState({ salutation: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  componentWillUnmount() {
    this.props.registerClearMessage();
  }

  render() {
    const errorMessage =
      this.state.invalidMessage !== null
        ? this.state.invalidMessage
        : this.props.errorMessage;

    if (this.props.loggedIn) return null;

    return (
      <React.Fragment>
        <ModalWnd
          className="loginWnd registerWnd"
          clicked={this.props.modalClosed}
          show={this.props.show}
          title={this.props.t("Register")}
        >
          <div className="loginFields">
            <Selection
              label={this.props.t("Salutation*")}
              options={this.state.salutationOption}
              name="salutation"
              value={this.state.salutation}
              changePoptextValue={this.changePoptextValue}
              empty={this.state.validate && this.state.salutation === ""}
            />
            <Input
              label={this.props.t("Title")}
              onInputChange={this.onInputChange}
              text={this.state.title}
              name="title"
              empty={false}
            />
            <Input
              label={this.props.t("First name*")}
              onInputChange={this.onInputChange}
              text={this.state.firstName}
              name="firstName"
              empty={this.state.validate && this.state.firstName === ""}
            />
            <Input
              label={this.props.t("Last name*")}
              onInputChange={this.onInputChange}
              text={this.state.lastName}
              name="lastName"
              empty={this.state.validate && this.state.lastName === ""}
            />
            <Input
              label={this.props.t("Email*")}
              onInputChange={this.onInputChange}
              text={this.state.email}
              name="email"
              empty={this.state.validate && this.state.email === ""}
            />
            <Input
              label={this.props.t("Password*")}
              type="password"
              onInputChange={this.onInputChange}
              text={this.state.password}
              name="password"
              empty={this.state.validate && this.state.password === ""}
            />
            <Input
              label={this.props.t("Confirm password*")}
              type="password"
              onInputChange={this.onInputChange}
              text={this.state.repassword}
              name="repassword"
              empty={this.state.validate && this.state.repassword === ""}
            />
            <Checkbox
              label={this.props.t("Subscribe to the newsletter")}
              checked={this.state.checkNewsletter}
              name="checkNewsletter"
              onChangeCheckbox={this.onChangeCheckbox}
            />
            <Checkbox
              label={this.props.t(
                "I have read the privacy policies and I agree."
              )}
              checked={this.state.checkAccept}
              name="checkAccept"
              onChangeCheckbox={this.onChangeCheckbox}
            />
          </div>
          <div className="messageForm">
            <MessageForm
              errorMessage={errorMessage}
              loading={this.props.loading}
            />
          </div>
          <div className="loginWndButtons">
            <button onClick={this.onRegisterButton}>
              {this.props.t("Register")}
            </button>
            <button onClick={this.props.modalClosed}>
              {this.props.t("Close")}
            </button>
          </div>
        </ModalWnd>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: authLoadingSelector(state),
    errorMessage: authErrorMessageSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: (email, password) =>
      dispatch(authRegisterStart({ email, password })),
    registerClearMessage: () => dispatch(authRegisterClearMessage())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(RegisterWnd));
