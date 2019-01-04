const React = require("react");

const submenuPoptext = props => {
  const items = props.items.map((el, index) => {
    if (el !== props.activeItem)
      return (
        <li
          key={index}
          onClick={() => props.toggleSelectPoptext(props.poptextName, el)}
        >
          {el}
        </li>
      );
  });
  return (
    <div className="submenuPoptextContainer">
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

      {props.open && <ul>{items}</ul>}
    </div>
  );
};

module.exports = submenuPoptext;
