const React = require("react");
const Select = require("react-select").default;

const layoutsHeader = ({ className = "", ...props }) => {
  const layoutClassName = "layoutHeaderContainer " + className;
  return (
    <div className={layoutClassName}>
      <div className="headerPoptextTitle">{props.title}</div>
      <div className="headerPoptextCategories">
        <Select
          value={props.selectedOption}
          onChange={option => props.onChange(option)}
          options={props.options}
          classNamePrefix="headerPoptextSelect"
          style={{ boxShadow: "none" }}
        />
      </div>
    </div>
  );
};

module.exports = layoutsHeader;
