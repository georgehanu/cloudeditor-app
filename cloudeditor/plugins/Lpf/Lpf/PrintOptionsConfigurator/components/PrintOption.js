const React = require("react");
const { head } = require("ramda");

const printoption = props => {
  const { printOptions } = props;
  const activeOption = head(printOptions[props.pp][props.po]);
  const classes = [
    "printOptionContainer",
    activeOption === props.code ? "isActive" : ""
  ].join(" ");
  return (
    <div
      className={classes}
      onClick={() => {
        props.onChangeOptionHandler({
          pp_code: props.pp,
          po_code: props.po,
          po_value: props.code
        });
      }}
    >
      <div className="imageContainer">
        <img src={props.image_src} />
      </div>
      <div className="descriptionContainer">
        <div className="title">{props.name}</div>
        <div className="description">{props.description}</div>
      </div>
    </div>
  );
};

module.exports = printoption;
