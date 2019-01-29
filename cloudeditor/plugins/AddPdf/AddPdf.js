const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const UploadFile = require("../../core/components/UploadFile/UploadFile");
const isEqual = require("react-fast-compare");

const ACCEPTED_FILES = ".pdf";
const TYPE = "pdf";

const Gallery = require("../../core/components/Gallery/Gallery");
class AddPdf extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  render() {
    return (
      <div className="uploadContainer">
        <UploadFile
          uploadFile={this.props.uploadPdfStart}
          acceptedFiles={ACCEPTED_FILES}
          type={TYPE}
          t={this.props.t}
        />
        <Gallery
          items={this.props.uploadedPdfs}
          type={TYPE}
          selectImage={this.selectImageHandler}
          addContainerClasses={this.props.addContainerClasses}
        />
      </div>
    );
  }
}

const AddPdfPlugin = withNamespaces("addPdf")(AddPdf);

module.exports = {
  AddPdf: assign(AddPdfPlugin, {
    disablePluginIf:
      "{store().getState().project.title==='Empty Project!!@!!@!@'}",
    SideBar: {
      position: 3,
      priority: 1,
      text: "Pdf",
      icon: "printqicon-layouts",
      showMore: true,
      tooltip: { title: "Add Pdf", description: "Add a new pdf block" }
    }
  })
};
