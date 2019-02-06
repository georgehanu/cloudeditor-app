const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

const Duplicate = require("./components/Duplicate/Duplicate");
const HeaderPoptext = require("./components/HeaderPoptext/HeaderPoptext");
const UploadOneImage = require("./components/UploadOneImage/UploadOneImage");
const Input = require("./components/Input/Input");
const Loading = require("./components/Loading/Loading");
const axios = require("axios");

const SweetAlert = require("sweetalert-react").default;
require("sweetalert/dist/sweetalert.css");

require("./LayoutEditorHeader.css");

const {
  getCheckedDuplicateSelector
} = require("../../core/stores/selectors/layout_template");
const {
  pagesOrderSelector,
  pagesSelector,
  activePageWithObjectsSelector
} = require("../../core/stores/selectors/project");
const {
  createDeepEqualSelector: createSelector
} = require("../../core/rewrites/reselect/createSelector");
const { changePage } = require("../../core/stores/actions/project");

const pagesLabelSelector = createSelector(
  pagesOrderSelector,
  pagesSelector,
  (pagesOrder, pages) => {
    let pageNumber = 1;
    let pagesLabel = [];
    for (let index in pagesOrder) {
      const pageId = pagesOrder[index];
      pagesLabel.push({
        longLabel: pages[pageId]["label"].replace("%no%", pageNumber),
        page_id: pagesOrder[index]
      });
      pageNumber++;
    }
    return pagesLabel;
  }
);

const SAVE_LAYOUT_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/saveProject";

const LOAD_TEMPLATES_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/getTemplateProjects";

const STORE_ICON_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/cloudeditorlayout/uploadProjectIcon";

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
      options: [],
      selectedOption: { value: "", label: "" },
      title: "Project Page"
    },
    projectCategoryPoptext: {
      options: [],
      selectedOption: { value: "", label: "" },
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
    saText: "",
    projectIcon: null,
    projectIconSrc: null,
    loading: false
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
      this.props.onChangePageHandler({ page_id: selectedOption.value.id });
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

    const options = this.props.pagesLabel.map((el, index) => {
      return { value: { id: el.page_id, index }, label: el.longLabel };
    });

    this.setState({
      projectPagePoptext: {
        ...this.state.projectPagePoptext,
        options,
        selectedOption: {
          value: options[0].value,
          label: options[0].label
        }
      }
    });
  }

  loadTemplateProjects = () => {
    let serverData = new FormData();
    axios
      .post(LOAD_TEMPLATES_URL, serverData)
      .then(resp => resp.data)
      .then(data => {
        if (data.success) {
          const options = data.data.map((el, index) => {
            return { value: el.id, label: el.name };
          });
          this.setState({
            projectCategoryPoptext: {
              ...this.state.projectCategoryPoptext,
              options,
              selectedOption: {
                value: options[0].value,
                label: options[0].label
              }
            }
          });
        } else {
          console.log(data, "FAIL LOADING layouts");
        }
      })
      .catch(error => {
        console.log(error, "ERROR");
      });
  };

  saveProjectHandler = () => {
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
    } else if (this.state.projectOrder === "") {
      this.setState({
        showAlert: true,
        saText: this.props.t("Order is required")
      });
      return;
    }
    this.setState({ loading: true });

    let serverData = new FormData();
    serverData.append("id", "1");
    serverData.append("title", this.state.projectTitle);
    serverData.append("description", this.state.projectDescription);
    serverData.append("category_id", "1");
    serverData.append(
      "page_no",
      this.state.projectPagePoptext.selectedOption.value.index
    );
    serverData.append("pdf_file", "pdf");
    serverData.append("icon", this.state.projectIcon);
    serverData.append("sort_order", this.state.projectOrder);
    serverData.append(
      "is_default",
      this.state.isDefaultPoptext.selectedOption.value
    );
    serverData.append(
      "status",
      this.state.projectStatusPoptext.selectedOption.value
    );
    serverData.append("template_id", "1");
    serverData.append("duplicate", this.state.duplicateChecked ? "1" : "0");

    serverData.append(
      "saved_data",
      JSON.stringify({
        activePage: this.props.activePage
      })
    );

    axios
      .post(SAVE_LAYOUT_URL, serverData)
      .then(resp => resp.data)
      .then(data => {
        console.log(data, "DATA");
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error, "ERROR");
        this.setState({ loading: false });
      });
  };

  closeSweetAlert = () => {
    this.setState({ SweetAlert: false });
  };

  uploadIconHandler = file => {
    let serverData = new FormData();
    serverData.append("qqfile", file);
    this.setState({ loading: true });

    axios
      .post(STORE_ICON_URL, serverData)
      .then(resp => resp.data)
      .then(data => {
        if (data.success) {
          this.setState({
            projectIcon: data.fileName,
            projectIconSrc: data.fileSrc,
            loading: false
          });
        } else {
          console.log(data, "FAIL uploading icon ");
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        console.log(error, "ERROR");
        this.setState({ loading: false });
      });
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
        {this.state.loading && (
          <div className="layoutEditorLoadingContainer">
            <Loading loading={true} />
          </div>
        )}
        <div className="layoutEditorHeaderContainer">
          <div className="layouHeaderTop">
            <Duplicate
              checked={this.props.duplicateChecked}
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
            <UploadOneImage
              t={this.props.t}
              uploadIcon={this.uploadIconHandler}
              tooltip={
                this.state.projectIconSrc === null
                  ? null
                  : { imageSrc: this.state.projectIconSrc }
              }
            />
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
    duplicateChecked: getCheckedDuplicateSelector(state),
    pagesLabel: pagesLabelSelector(state),
    pagesOrder: pagesOrderSelector(state),
    activePage: activePageWithObjectsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePageHandler: payload => dispatch(changePage(payload))
  };
};

const LayoutEditorHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layoutEditorHeader")(LayoutEditorHeader));

module.exports = {
  LayoutEditorHeader: assign(LayoutEditorHeaderPlugin)
};
