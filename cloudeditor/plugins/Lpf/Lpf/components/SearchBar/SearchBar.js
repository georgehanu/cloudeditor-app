const React = require("react");
const { withNamespaces } = require("react-i18next");
const Selectbox = require("../Selectbox/Selectbox");
const UncontrolledInput = require("../UncontrolledInput/UncontrolledInput");
require("./SearchBar.css");
class SearchBar extends React.Component {
  shouldComponentUpdate(prevProps) {
    return prevProps.displayedValue !== this.props.displayedValue;
  }
  render() {
    const searchBarItems = this.props.items.map(item => {
      let inputItem = null;
      switch (item.type) {
        case "input":
          inputItem = (
            <UncontrolledInput
              type="text"
              defaultValue={item.selectedValue}
              displayedValue={item.selectedValue}
              changeInput={item.changeInput}
            />
          );
          break;
        case "select":
          inputItem = (
            <Selectbox
              items={item.items}
              defaultValue={item.selectedValue}
              displayedValue={item.selectedValue}
              changeInput={item.changeInput}
            />
          );
          break;
        default:
          break;
      }
      return (
        <div className="searchItem">
          <div className="searchItemLabel">{item.label}</div>
          <div className="inputContainer">{inputItem}</div>
        </div>
      );
    });
    return <div className="searchBarContainer">{searchBarItems}</div>;
  }
}

module.exports = withNamespaces("translate")(SearchBar);
