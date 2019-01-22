const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const UploadFile = require("../../core/components/UploadFile/UploadFile");

const ACCEPTED_FILES = ".pdf";
const TYPE = "pdf";

const Gallery = require("../../core/components/Gallery/Gallery");
class AddPdf extends React.Component {
  render() {
    return (
      <div className="uploadContainer">
        <UploadFile
          uploadFile={this.props.uploadPdfStart}
          acceptedFiles={ACCEPTED_FILES}
          type={TYPE}
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

const AddPdfPlugin = connect(
  null,
  null
)(withNamespaces("addPdf")(AddPdf));

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
