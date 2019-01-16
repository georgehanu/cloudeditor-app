const React = require("react");
const IframeComm = require("react-iframe-comm").default;
const { pathOr } = require("ramda");

class TinyMcePreTable extends React.Component {
  state = {
    table: {
      width: -1,
      height: -1
    }
  };
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
      this.setState({
        ...this.state,
        table: {
          ...table
        }
      });
    }
  };
  onReady = () => {};

  render() {
    let children = null;
    if (this.state.table.width > -1 && this.state.table.height > -1) {
      children = this.props.children(this.state.table);
    }

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
        {children}
      </React.Fragment>
    );
  }
}

module.exports = TinyMcePreTable;
