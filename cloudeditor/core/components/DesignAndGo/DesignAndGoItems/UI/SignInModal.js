import React, { Component } from "react";
import MenuHeader from "./MenuModalItems/MenuHeader";
import Input from "../LayoutItems/Input";
import Backdrop from "./Backdrop";
import { withNamespaces } from "react-i18next";

import {
  dagLoadingSignInSelector,
  dagErrorMessageSignInSelector
} from "../../../../stores/selectors/designAndGo";
//import { dagSignInStart } from "../../../../stores/actions/designAndGo";

const {
  dagSigninStart,
  dagSigninClearMessage
} = require("../../../../stores/actions/designAndGo");

const { connect } = require("react-redux");

class SignInModal extends Component {
  state = {
    email: "",
    password: "",
    invalidMessage: null
  };

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

  onSignInButton = () => {
    if (
      this.validateEmail(this.state.email) &&
      this.validatePassword(this.state.password)
    ) {
      this.props.signIn(this.state.email, this.state.password);
    }
  };

  componentWillUnmount() {
    this.props.signinClearMessage();
  }

  render() {
    const errorMessage =
      this.state.invalidMessage !== null
        ? this.state.invalidMessage
        : this.props.errorMessage;
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div className="SignInModal">
          {this.props.loading && (
            <div className="SignInLoading">
              <div className="sk-circle">
                <div className="sk-circle1 sk-child" />
                <div className="sk-circle2 sk-child" />
                <div className="sk-circle3 sk-child" />
                <div className="sk-circle4 sk-child" />
                <div className="sk-circle5 sk-child" />
                <div className="sk-circle6 sk-child" />
                <div className="sk-circle7 sk-child" />
                <div className="sk-circle8 sk-child" />
                <div className="sk-circle9 sk-child" />
                <div className="sk-circle10 sk-child" />
                <div className="sk-circle11 sk-child" />
                <div className="sk-circle12 sk-child" />
              </div>
            </div>
          )}

          <div className="SignInContainer">
            <MenuHeader
              modalClosed={this.props.modalClosed}
              title={this.props.t("Members Login")}
            />
            <div className="SignInFields">
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
            <div className="InvalidForm">{errorMessage}</div>
            <div className="SingInButton">
              <button onClick={this.onSignInButton}>
                {this.props.t("Log In")}
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: dagLoadingSignInSelector(state),
    errorMessage: dagErrorMessageSignInSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: (email, password) => dispatch(dagSigninStart({ email, password })),
    signinClearMessage: () => dispatch(dagSigninClearMessage())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(SignInModal));
