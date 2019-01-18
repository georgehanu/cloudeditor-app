const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

const Duplicate = require("./components/Duplicate/Duplicate");
const HeaderPoptext = require("./components/HeaderPoptext/HeaderPoptext");
const UploadOneImage = require("./components/UploadOneImage/UploadOneImage");
const Input = require("./components/Input/Input");
const axios = require("axios");

const SweetAlert = require("sweetalert-react").default;
require("sweetalert/dist/sweetalert.css");

require("./LayoutEditorHeader.css");

const SAVE_LAYOUT_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/saveProject";

const LOAD__TEMPLATES_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/getTemplateProjects";

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
      options: [{ value: "1", label: "Yes" }, { value: "no", label: "No" }],
      selectedOption: { value: "0", label: "Yes" },
      title: "Project is Default"
    },
    projectPagePoptext: {
      options: [
        { value: "0", label: "Front page" },
        { value: "1", label: "First page" },
        { value: "2", label: "Second page" },
        { value: "3", label: "Last Page" }
      ],
      selectedOption: { value: "0", label: "Front page" },
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
        { value: "1", label: "Active" },
        { value: "0", label: "Inctive" }
      ],
      selectedOption: { value: "Active", label: "Active" },
      title: "Project Status"
    },
    projectTitle: "",
    projectDescription: "",
    projectOrder: "",
    showAlert: false,
    saText: ""
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

  componentDidMount() {
    this.loadTemplateProjects();
  }

  loadTemplateProjects = () => {
    let serverData = new FormData();
    axios
      .post(LOAD__TEMPLATES_URL, serverData)
      .then(resp => resp.data)
      .then(data => {
        console.log(data, "DATA");
      })
      .catch(error => {
        console.log(error, "ERROR");
      });
  };

  saveProjectHandler = () => {
    // call if we are sure ...
    // test title and description are not empty... and other fields
    if (this.state.projectTitle === "") {
      this.setState({
        showAlert: true,
        saText: this.props.t("Title is required")
      });
      return;
    } else if (this.state.projectDescription === "") {
      this.setState({
        showAlert: true,
        saText: this.props.t("Description is required")
      });
      return;
    }
    let serverData = new FormData();
    serverData.append("id", "1");
    serverData.append("title", this.state.projectTitle);
    serverData.append("description", this.state.projectDescription);
    serverData.append("category_id", "1");
    serverData.append(
      "page_no",
      this.state.projectPagePoptext.selectedOption.value
    );
    serverData.append("pdf_file", "pdf");
    serverData.append("icon", "icon");
    serverData.append("sort_order", this.state.projectOrder);
    serverData.append(
      "is_default",
      this.state.isDefaultPoptext.selectedOption.value
    );
    serverData.append(
      "status",
      this.state.projectStatusPoptext.selectedOption.value
    );
    serverData.append("saved_data", "date");
    serverData.append("template_id", "1");
    serverData.append("duplicate", this.state.duplicateChecked ? "1" : "0");

    axios
      .post(SAVE_LAYOUT_URL, serverData)
      .then(resp => resp.data)
      .then(data => {
        console.log(data, "DATA");
      })
      .catch(error => {
        console.log(error, "ERROR");
      });
  };

  closeSweetAlert = () => {
    this.setState({ SweetAlert: false });
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
      <React.Fragment>
        <SweetAlert
          show={this.state.showAlert}
          type="warning"
          title={this.props.t("Warning")}
          text={this.state.saText}
          showCancelButton={true}
          onConfirm={() => this.closeSweetAlert()}
          onCancel={() => this.setState({ showAlert: false })}
        />
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
            <div className="headerSubContainer buttonContainer">
              <button onClick={this.saveProjectHandler}>
                {this.props.t("Save Project")}
              </button>
            </div>
            <div className="headerSubContainer buttonContainer">
              <button>{this.props.t("Close")}</button>
            </div>
          </div>
        </div>
      </React.Fragment>
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
