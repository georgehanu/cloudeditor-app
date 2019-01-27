const React = require("react");
const { Editor } = require("@tinymce/tinymce-react");
const IframeComm = require("../../../../../rewrites/react-iframe-comm/IframeComm");
const { pathOr } = require("ramda");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");

class Tinymce extends React.Component {
  constructor(props) {
    super(props);
    this.tinyEditor = null;
    this.currentEditor = null;
    this.coverRef = React.createRef();
  }

  attributes = {
    src:
      "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/cloudeditorScripts/tinyMceIframe.php",
    name: "measureTableIframe"
  };
  onReceiveMessage = message => {
    if (
      message.source.hasOwnProperty("tinyMceIframe") &&
      message.source.tinyMceIframe
    ) {
      const table = pathOr(null, ["data", "table"], message);
      console.log("onReceiveMessage", message);
      if (table) {
        // if (table.width === -1 || table.height === -1)
        //   if (
        //     this.props.tableWidth === table.width &&
        //     this.props.tableHeight === table.height
        //   )
        //     return;
        // this.props.onUpdateProps({
        //   id: this.props.id,
        //   props: {
        //     tableWidth: table.width,
        //     tableHeight: table.height
        //   }
        // });
      }
    }
  };

  render() {
    return (
      <IframeComm
        attributes={this.attributes}
        postMessageData={this.props.tableContent}
        handleReceiveMessage={this.onReceiveMessage}
      />
    );
  }
}

module.exports = Tinymce;
