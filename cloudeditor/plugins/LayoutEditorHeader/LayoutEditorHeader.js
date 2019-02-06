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
  getCheckedDuplicateSelector,
  getIsDefaultPoptextSelector,
  getProjectPagePoptextSelector,
  getProjectCategoryPoptextSelector,
  getProjectStatusPoptextSelector,
  projectTitleSelector,
  projectDescriptionSelector,
  projectOrderSelector,
  projectIconSelector,
  projectIconSrcSelector,
  projectLoadingSelector,
  projectShowAlertSelector,
  projectMessageSelector
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
const {
  updateLayoutTemplate,
  saveLayoutTemplateStart,
  saveIconTemplateStart
} = require("../../core/stores/actions/layout_template");

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
  onChange = event => {
    if (event.target.name === "duplicateChecked")
      this.props.updateLayoutTemplateHandler({
        [event.target.name]: !this.props.duplicateChecked
      });
    else
      this.props.updateLayoutTemplateHandler({
        [event.target.name]: event.target.value
      });
  };

  onPoptextChange = (name, selectedOption) => {
    if (name === "isDefault") {
      this.props.updateLayoutTemplateHandler({
        isDefaultPoptext: { selectedOption }
      });
    } else if (name === "projectPage") {
      this.props.onChangePageHandler({ page_id: selectedOption.value.id });
      this.props.updateLayoutTemplateHandler({
        projectPagePoptext: { selectedOption }
      });
    } else if (name === "projectCategory") {
      this.props.updateLayoutTemplateHandler({
        projectCategoryPoptext: { selectedOption }
      });
    } else if (name === "projectStatus") {
      this.props.updateLayoutTemplateHandler({
        projectStatusPoptext: { selectedOption }
      });
    }
  };

  saveProjectHandler = () => {
    if (this.props.projectTitle === "") {
      this.props.updateLayoutTemplateHandler({
        showAlert: true,
        message: this.props.t("Title is required")
      });
      return;
    } else if (this.props.projectDescription === "") {
      this.props.updateLayoutTemplateHandler({
        showAlert: true,
        message: this.props.t("Description is required")
      });
      return;
    } else if (this.props.projectOrder === "") {
      this.props.updateLayoutTemplateHandler({
        showAlert: true,
        message: this.props.t("Order is required")
      });
      return;
    }

    let serverData = {
      id: "1",
      title: this.props.projectTitle,
      description: this.props.projectDescription,
      category_id: "1",
      page_no: this.props.projectPagePoptext.selectedOption.value.index,
      pdf_file: "pdf",
      icon: this.props.projectIcon,
      sort_order: this.props.projectOrder,

      is_default: this.props.isDefaultPoptext.selectedOption.value,
      status: this.props.projectStatusPoptext.selectedOption.value,
      template_id: "1",
      duplicate: this.props.duplicateChecked ? "1" : "0",

      saved_data: JSON.stringify({
        activePage: this.props.activePage
      })
    };

    this.props.saveLayoutTemplateHandler(serverData);
  };

  closeSweetAlert = () => {
    this.props.updateLayoutTemplateHandler({
      showAlert: false
    });
  };

  uploadIconHandler = file => {
    let serverData = {
      qqfile: file
    };

    this.props.saveIconTemplateHandler(serverData);
  };

  render() {
    const isDefaultPoptext = poptext(
      this.props.isDefaultPoptext,
      "isDefault",
      this.onPoptextChange,
      this.props.t
    );
    const projectPagePoptext = poptext(
      this.props.projectPagePoptext,
      "projectPage",
      this.onPoptextChange,
      this.props.t
    );
    const projectCategoryPoptext = poptext(
      this.props.projectCategoryPoptext,
      "projectCategory",
      this.onPoptextChange,
      this.props.t
    );
    const projectStatusPoptext = poptext(
      this.props.projectStatusPoptext,
      "projectStatus",
      this.onPoptextChange,
      this.props.t
    );

    return (
      <React.Fragment>
        <SweetAlert
          show={this.props.showAlert}
          type="warning"
          title={this.props.t("Warning")}
          text={this.props.message}
          onConfirm={() => this.closeSweetAlert()}
        />
        {this.props.loading && (
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
              name="duplicateChecked"
            />
            {isDefaultPoptext}
            {projectPagePoptext}
            <Input
              type="text"
              className="projectTitle"
              name="projectTitle"
              text={this.props.projectTitle}
              onChange={this.onChange}
              label={this.props.t("Project Title")}
            />
            <Input
              type="text"
              className="projectHeaderDescription"
              name="projectDescription"
              text={this.props.projectDescription}
              onChange={this.onChange}
              label={this.props.t("Description")}
            />
            {projectCategoryPoptext}
            <UploadOneImage
              t={this.props.t}
              uploadIcon={this.uploadIconHandler}
              tooltip={
                this.props.projectIconSrc === null
                  ? null
                  : { imageSrc: this.props.projectIconSrc }
              }
            />
            {projectStatusPoptext}
            <Input
              type="number"
              className="projectOrder"
              name="projectOrder"
              text={this.props.projectOrder}
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
    activePage: activePageWithObjectsSelector(state),
    isDefaultPoptext: getIsDefaultPoptextSelector(state),
    projectPagePoptext: getProjectPagePoptextSelector(state),
    projectCategoryPoptext: getProjectCategoryPoptextSelector(state),
    projectStatusPoptext: getProjectStatusPoptextSelector(state),
    projectTitle: projectTitleSelector(state),
    projectDescription: projectDescriptionSelector(state),
    projectOrder: projectOrderSelector(state),
    projectIcon: projectIconSelector(state),
    projectIconSrc: projectIconSrcSelector(state),
    loading: projectLoadingSelector(state),
    showAlert: projectShowAlertSelector(state),
    message: projectMessageSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePageHandler: payload => dispatch(changePage(payload)),
    updateLayoutTemplateHandler: payload =>
      dispatch(updateLayoutTemplate(payload)),
    saveLayoutTemplateHandler: payload =>
      dispatch(saveLayoutTemplateStart(payload)),
    saveIconTemplateHandler: payload => dispatch(saveIconTemplateStart(payload))
  };
};

const LayoutEditorHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layoutEditorHeader")(LayoutEditorHeader));

module.exports = {
  LayoutEditorHeader: assign(LayoutEditorHeaderPlugin),
  epics: require("../../core/stores/epics/layout_template")
};
