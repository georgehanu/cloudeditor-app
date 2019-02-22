const React = require("react");
const { connect } = require("react-redux");
const {
  changeHeaderFooterLayout
} = require("../../../core/stores/actions/project");
const submenuLayout = props => {
  const items = props.items.map((el, index) => {
    return (
      <li
        className="importImageItem"
        key={index}
        onClick={() => {
          props.toggleSelectPoptext(props.poptextName, el);
          props.onChangeHeaderFooterLayoutHandler({ layout: el });
        }}
      >
        <div className="itemImage">
          <img src={el.src} />
        </div>
        <label className="itemLabel">{props.filename}</label>
      </li>
    );
  });

  return (
    <div
      className="submenuLayoutContainer"
      onMouseLeave={() => props.togglePoptext(props.poptextName, true)}
    >
      <div className="activeItemContainer">
        <span
          className="activeItem"
          onClick={() => props.togglePoptext(props.poptextName)}
        >
          {props.activeItem}
        </span>

        <span
          className="icon stadion-down stadion-icon"
          onClick={() => props.togglePoptext(props.poptextName)}
        />
      </div>

      {props.open && <ul>{items}</ul>}
    </div>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onChangeHeaderFooterLayoutHandler: payload =>
      dispatch(changeHeaderFooterLayout(payload))
  };
};

module.exports = connect(
  null,
  mapDispatchToProps
)(submenuLayout);
