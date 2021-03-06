const React = require("react");
const { connect } = require("react-redux");
const { changeSearchValue } = require("../../store/actions");

class ClubsSearch extends React.Component {
  state = {
    value: ""
  };

  inputChangedHandler = value => {
    this.setState({ value: value });
  };

  _handleKeyPress = e => {
    if (e.key === "Enter" && this.state.value !== "") {
      this.props.searchClubs(this.state.value);
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div className="FupaClubSearch">
        <input
          value={value}
          onChange={event => this.inputChangedHandler(event.target.value)}
          onKeyPress={this._handleKeyPress}
          placeholder={this.props.t("Enter club name")}
        />
        <button
          className="OkButton"
          onClick={() =>
            this.state.value !== "" && this.props.searchClubs(this.state.value)
          }
        >
          <span className="icon printqicon-search" />
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
