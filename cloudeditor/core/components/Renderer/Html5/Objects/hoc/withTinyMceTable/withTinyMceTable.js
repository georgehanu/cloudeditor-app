const React = require("react");
const PropTypes = require("prop-types");
const IframeComm = require("react-iframe-comm").default;
const { pathOr } = require("ramda");

require("./withTinyMceTable.css");

const withTinyMceTable = WrappedComponent => {
  return class extends React.Component {
    attributes = {
      src:
        "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/cloudeditorScripts/tinyMceIframe.php",
      width: "0",
      height: "0",
      frameBorder: 0
    };
    onReceiveMessage = message => {
      const table = pathOr(null, ["data", "table"], message);
      if (table) {
        if (table.width === -1 || table.height === -1)
          if (
            this.props.tableWidth === table.width &&
            this.props.tableHeight === table.height
          )
            return;
        this.props.onUpdateProps({
          id: this.props.id,
          props: {
            tableWidth: table.width,
            tableHeight: table.height
          }
        });
      }
    };
    onReady = () => {};

    render() {
      let tableParser = (
        <IframeComm
          attributes={this.attributes}
          postMessageData={this.props.content}
          handleReady={this.onReady}
          handleReceiveMessage={this.onReceiveMessage}
        />
      );

      return (
        <React.Fragment>
          {tableParser}
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  };
};

module.exports = withTinyMceTable;
