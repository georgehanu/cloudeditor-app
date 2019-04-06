const React = require("react");
const { withNamespaces } = require("react-i18next");
require("./Selectbox.css");
class UncontrolledSelectbox extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.displayedValue !== this.props.displayedValue;
  }
  componentDidMount() {
    if (this.input) {
      const $input = this.input.current;
      $input.value = this.checkUpdatedValue();
      $input.addEventListener("change", event => {
        this.updateOnChange(event);
      });
      $input.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  }
  checkUpdatedValue() {
    let value = this.props.displayedValue;
    if (value === null) {
      value = this.props.defaultValue;
    }
    return value;
  }
  componentDidUpdate() {
    if (this.input) {
      const $input = this.input.current;
      $input.value = this.checkUpdatedValue();
    }
  }
  componentWillUnmount() {
    if (this.input) {
      const $input = this.input.current;
      $input.removeEventListener("change", {});
      $input.removeEventListener("click", {});
    }
  }
  updateOnChange(event) {
    let val = event.target.value;
    if (val === null) {
      val = this.props.defaultValue;
    }
    this.props.changeInput(val);
  }
  render() {
    const selectItems = this.props.items.map((item, index) => {
      return (
        <option value={item.value} key={item.value}>
          {this.props.t(item.label)}
        </option>
      );
    });
    return (
      <div className="uncontrolledSelectboxContainer">
        <div className="selectBoxContainer">{this.props.label}</div>
        <select ref={this.input}>{selectItems}</select>
      </div>
    );
  }
}

module.exports = withNamespaces("translate")(UncontrolledSelectbox);
