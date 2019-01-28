const React = require("react");
const { Provider } = require("react-redux");
const StoreWrapper = require("./StoreWrapper");
const { hot } = require("react-hot-loader");

const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

class Editor extends React.Component {
  render() {
    //console.log("editor");
    return (
      <Provider store={this.props.store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <StoreWrapper
            mode="desktop"
            plugins={this.props.plugins}
            pluginsConfig={this.props.pluginsConfig}
            component={this.props.component}
            className={this.props.className}
            id={this.props.id}
          />
        </DragDropContextProvider>
      </Provider>
    );
  }
}

module.exports = Editor;
