const {
  FupaSimpleImage,
  RefreshTable,
  FupaText,
  FupaDownArrow
} = require("./toolbarItems");
const Types = require("../ToolbarConfig/types");

const fupa = {
  groups: [
    {
      location: Types.Position.TOP,
      position: 1,
      className: "fupaImageLogoGroup",
      items: [FupaSimpleImage]
    },
    {
      location: Types.Position.TOP,
      position: 2,
      className: "fupaTextGroup",
      items: [FupaText, FupaDownArrow]
    },
    {
      location: Types.Position.TOP,
      className: "fupaRefreshTableGroup",
      position: 3,
      items: [RefreshTable]
    }
  ],
  style: {
    backgroundColor: "white"
  }
};

module.exports = fupa;
