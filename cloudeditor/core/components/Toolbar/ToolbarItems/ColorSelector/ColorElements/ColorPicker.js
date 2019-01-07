const React = require("react");

class ColorPicker extends React.Component {
  state = {
    hexColor: "#ff0000"
  };
  componentDidMount() {
    $("#colorPickerColorId").chromoselector({
      target: "#colorPickerId",
      autoshow: false,
      create: function() {
        $(this).chromoselector("show", 0);
      },
      width: 150
    });
  }
  onChangeColorHandler = event => {
    console.log(event.target.value);
  };
  render() {
    return (
      <div className="colorPickerContainer">
        <div id="colorPickerId">
          <input
            id="colorPickerColorId"
            type="text"
            value={this.state.hexColor}
            onChange={this.onChangeColorHandler}
          />
        </div>
      </div>
    );
  }
}

module.exports = ColorPicker;
