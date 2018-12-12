const React = require("react");
const { withNamespaces } = require("react-i18next");
const { connect } = require("react-redux");
const { getEmptyObject } = require("../../../../../core/utils/ProjectUtils");

require("./InsertInProduction.css");
const {
  addObjectToPage
} = require("../../../../../core/stores/actions/project");

const emptyImage = getEmptyObject({
  type: "tinymce",
  width: 200,
  height: 200,
  left: 100,
  top: 100
});

const InsertInProduction = props => {
  return (
    <div className="InsertInProductionContainer">
      <button
        onClick={() => props.addObjectToPage(emptyImage, props.activePage)}
      >
        {props.t("Insert in production")}
      </button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activePage: state.project.activePage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addObjectToPage: (object, pageId) =>
      dispatch(addObjectToPage({ object, pageId }))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("fupa")(InsertInProduction));
