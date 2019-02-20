const React = require("react");

require("./BlockMessage.css");
const { equals, omit } = require("ramda");
class BlockMessage extends React.Component {
  state = { visible: 1 };
  constructor(props) {
    super(props);
    this.state = { visible: 1, ...props };
  }
  componentDidMount = () => {
    this.setTimer();
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(omit(["visible"], nextProps), omit(["visible"], prevState)))
      return { visible: 1, ...nextProps };
    return null;
  }
  componentDidUpdate() {
    if (this.state.visible) {
      this.setTimer();
    }
  }
  onRemoveWarningHandler = () => {
    this.setState({
      visible: 0
    });
  };
  componentDidMount = () => {
    this.setTimer();
  };
  setTimer = () => {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this.setState({ visible: 0 });
      this._timer = null;
    }, this.props.delay);
  };
  componentWillUnmount = () => {
    clearTimeout(this._timer);
  };
  render() {
    const { type, left, top, width, viewOnly } = this.props;
    const { visible } = this.state;
    if (
      !type ||
      viewOnly ||
      !visible ||
      this.props.objectKeys.indexOf(this.props.id) === -1
    ) {
      return null;
    }
    const messageStyle = {
      left,
      top,
      width
    };
    let errorBody = null;
    switch (type) {
      case 1:
        errorBody = (
          <div className={"errorBody"}>
            <span>
              {this.props.t(
                "Dieses Element liegt im Sicherheitsbereich des Beschnitts und kann angeschnitten werden. Für randlos zu druckende Bereiche oder Bilder kann diese Info ignoriert werden."
              )}
            </span>
          </div>
        );
        break;
      case 2:
        errorBody = (
          <div className={"errorBody"}>
            <span>
              {this.props.t(
                "Dieses Element befindet sich außerhalb des Druckbereiches."
              )}
            </span>
          </div>
        );
        break;
      default:
        break;
    }
    return (
      <div className={"errorMessage"} style={messageStyle}>
        {errorBody}
        <span onClick={this.onRemoveWarningHandler} className={"removeWarning"}>
          x
        </span>
      </div>
    );
  }
}

module.exports = BlockMessage;
