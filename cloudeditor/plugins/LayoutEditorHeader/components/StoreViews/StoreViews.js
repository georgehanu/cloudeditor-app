const React = require("react");
const uuidv4 = require("uuid/v4");

const Storeviews = props => {
  const className = "headerPoptext " + (props.className || "");
  const options = props.options.map(website => {
    let stores = null;
    if (Array.isArray(website.value))
      stores = website.value.map(store => {
        return (
          <option key={store.value} value={store.value}>
            {store.label}
          </option>
        );
      });
    return (
      <optgroup key={uuidv4()} label={website.label}>
        {stores}
      </optgroup>
    );
  });
  return (
    <div className={className}>
      <div className="headerPoptextTitle">{props.title}</div>
      <select
        value={props.selectedOption}
        onChange={event => props.onChange(props.name, $(event.target).val())}
        className={"storeViewSelect"}
        multiple={true}
      >
        {options}
      </select>
    </div>
  );
};

module.exports = Storeviews;
