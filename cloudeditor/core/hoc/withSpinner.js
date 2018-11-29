import React from "react";
import "./withSpinner.css";
import { NamespacesConsumer } from "react-i18next";

const withSpinner = WrappedComponent => props => {
  if (props.loading)
    return (
      <NamespacesConsumer ns="hoc">
        {(t, { i18n, ready }) => (
          <div className="Loader">
            <span className="SpinnerText">{t("Loading...")}</span>
          </div>
        )}
      </NamespacesConsumer>
    );

  return (
    <React.Fragment>
      <WrappedComponent {...props} />
    </React.Fragment>
  );
};

export default withSpinner;
