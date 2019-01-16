const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

const Duplicate = require("./components/Duplicate/Duplicate");
const HeaderPoptext = require("./components/HeaderPoptext/HeaderPoptext");
const UploadOneImage = require("./components/UploadOneImage/UploadOneImage");
const Input = require("./components/Input/Input");

require("./LayoutEditorHeader.css");

const poptext = (props, name, onPoptextChange, t) => {
  return (
    <HeaderPoptext
      className={name + " headerSubContainer"}
      title={t(props.title)}
      options={props.options}
      selectedOption={props.selectedOption}
      name={name}
      onChange={onPoptextChange}
    />
  );
};

class LayoutEditorHeader extends React.Component {
  state = {
    duplicateChecked: false,
    isDefaultPoptext: {
      options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
      selectedOption: { value: "yes", label: "Yes" },
      title: "Project is Default"
    },
    projectPagePoptext: {
      options: [
        { value: "Front page", label: "Front page" },
        { value: "First page", label: "First page" },
        { value: "Second page", label: "Second page" },
        { value: "Last Page", label: "Last Page" }
      ],
      selectedOption: { value: "Front page", label: "Front page" },
      title: "Project Page"
    },
    projectCategoryPoptext: {
      options: [
        { value: "Layouts 1", label: "Layouts 1" },
        { value: "Layouts 2", label: "Layouts 2" },
        { value: "Layouts 3", label: "Layouts 3" }
      ],
      selectedOption: { value: "Layouts 1", label: "Layouts 1" },
      title: "Project Category"
    },
    projectStatusPoptext: {
      options: [
        { value: "Active", label: "Active" },
        { value: "Inctive", label: "Inctive" }
      ],
      selectedOption: { value: "Active", label: "Active" },
      title: "Project Status"
    },
    projectTitle: "",
    projectDescription: "",
    projectOrder: ""
  };

  onChange = event => {
    if (event.target.name === "duplicate")
      this.setState({ duplicateChecked: !this.state.duplicateChecked });
    else if (event.target.name === "projectTitle")
      this.setState({ projectTitle: event.target.value });
    else if (event.target.name === "projectDescription")
      this.setState({ projectDescription: event.target.value });
    else if (event.target.name === "projectOrder")
      this.setState({ projectOrder: event.target.value });
  };

  onPoptextChange = (name, selectedOption) => {
    if (name === "isDefault") {
      this.setState({
        isDefaultPoptext: {
          ...this.state.isDefaultPoptext,
          selectedOption
        }
      });
    } else if (name === "projectPage") {
      this.setState({
        projectPagePoptext: {
          ...this.state.projectPagePoptext,
          selectedOption
        }
      });
    } else if (name === "projectCategory") {
      this.setState({
        projectCategoryPoptext: {
          ...this.state.projectCategoryPoptext,
          selectedOption
        }
      });
    } else if (name === "projectStatus") {
      this.setState({
        projectStatusPoptext: {
          ...this.state.projectStatusPoptext,
          selectedOption
        }
      });
    }
  };

  render() {
    const isDefaultPoptext = poptext(
      this.state.isDefaultPoptext,
      "isDefault",
      this.onPoptextChange,
      this.props.t
    );
    const projectPagePoptext = poptext(
      this.state.projectPagePoptext,
      "projectPage",
      this.onPoptextChange,
      this.props.t
    );
    const projectCategoryPoptext = poptext(
      this.state.projectCategoryPoptext,
      "projectCategory",
      this.onPoptextChange,
      this.props.t
    );
    const projectStatusPoptext = poptext(
      this.state.projectStatusPoptext,
      "projectStatus",
      this.onPoptextChange,
      this.props.t
    );
    return (
      <div className="layoutEditorHeaderContainer">
        <div className="layouHeaderTop">
          <Duplicate
            checked={this.state.duplicateChecked}
            label={this.props.t("Duplicate")}
            onChange={this.onChange}
            name="duplicate"
          />
          {isDefaultPoptext}
          {projectPagePoptext}
          <Input
            type="text"
            className="projectTitle"
            name="projectTitle"
            text={this.state.projectTitle}
            onChange={this.onChange}
            label={this.props.t("Project Title")}
          />
          <Input
            type="text"
            className="projectHeaderDescription"
            name="projectDescription"
            text={this.state.projectDescription}
            onChange={this.onChange}
            label={this.props.t("Description")}
          />
          {projectCategoryPoptext}
          <UploadOneImage t={this.props.t} />
          {projectStatusPoptext}
          <Input
            type="number"
            className="projectOrder"
            name="projectOrder"
            text={this.state.projectOrder}
            onChange={this.onChange}
            label={this.props.t("Order")}
          />
        </div>
        <div className="layouHeaderBottom">
          <button>{this.props.t("Save Project")}</button>
          <button>{this.props.t("Close")}</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    //projectTitle: titleSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const LayoutEditorHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layoutEditorHeader")(LayoutEditorHeader));

module.exports = {
  LayoutEditorHeader: assign(LayoutEditorHeaderPlugin)
};
