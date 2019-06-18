//inspired from here -> https://codepen.io/anon/pen/dELaPX
const React = require("react");
require("./withSpinner.css");
require("./withSpinner.scss");
const { NamespacesConsumer } = require("react-i18next");

const withSpinner = WrappedComponent => props => {
  if (props.loading) {
    return (
      <NamespacesConsumer ns="translate">
        {(t, { i18n, ready }) => (
          <div className="spinnerContainer">
            <div className="loadingSpinner">
              <div className="spinner">
                <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    className="length"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="28"
                  />
                </svg>
                <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="28"
                  />
                </svg>
                <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="28"
                  />
                </svg>
                <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="28"
                  />
                </svg>
              </div>
              <span className="spinnerText">{t("Loading") + "..."}</span>
            </div>
          </div>
        )}
      </NamespacesConsumer>
    );
  }

  return (
    <React.Fragment>
      <WrappedComponent {...props} />
    </React.Fragment>
  );
};

module.exports = withSpinner;
