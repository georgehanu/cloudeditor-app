const React = require("react");
const { connect } = require("react-redux");
const { changeSearchValue } = require("../../store/actions");

class ClubsSearch extends React.Component {
  state = {
    value: "Bayern"
  };

  inputChangedHandler = value => {
    this.setState({ value: value });
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.searchClubs(this.state.value);
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <input
          value={value}
          onChange={event => this.inputChangedHandler(event.target.value)}
          onKeyPress={this._handleKeyPress}
        />
        <button
          className="OkButton"
          onClick={() => this.props.searchClubs(this.state.value)}
        >
          Go>>
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    searchClubs: value => dispatch(changeSearchValue(value))
  };
};

module.exports = connect(
  null,
  mapDispatchToProps
)(ClubsSearch);
