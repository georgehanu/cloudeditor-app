const React = require("react");
const withSpinner = require("../../../core/hoc/withSpinner/withSpinner");
const { withNamespaces } = require("react-i18next");

const loadProjects = props => {
  const header = (
    <li key="-1">
      <div className="projIndex">{props.t("Index")}</div>
      <div className="projName">{props.t("Name")}</div>
      <div className="projDescription">{props.t("Description")}</div>
      <div className="projDate">{props.t("Date")}</div>
      <div className="projLoad">{props.t("Load")}</div>
      <div className="projDelete">{props.t("Delete")}</div>
    </li>
  );

  const rows = props.loadedProjects.map((el, index) => {
    return (
      <li key={index}>
        <div className="projIndex">{index + 1}</div>
        <div className="projName">{el.name}</div>
        <div className="projDescription">{el.description}</div>
        <div className="projDate">{el.date}</div>
        <div className="projLoad">
          <button onClick={() => props.load(el.projectId)}>
            {props.t("Load")}
          </button>
        </div>
        <div className="projDelete">
          <button onClick={() => props.delete(el.projectId)}>
            {props.t("Delete")}
          </button>
        </div>
      </li>
    );
  });

  if (props.errorMessage !== null) {
    return <div className="loadProjectsContainer">{props.errorMessage}</div>;
  }

  return (
    <div className="loadProjectsContainer">
      <ul>
        {header}
        {rows}
      </ul>
    </div>
  );
};

module.exports = withSpinner(withNamespaces("menuItemMyProject")(loadProjects));
