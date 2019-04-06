const React = require("react");
const { head } = require("ramda");
const { withNamespaces } = require("react-i18next");
const Selectbox = require("../../components/Selectbox/Selectbox");

const relatedproduct = props => {
  const classes = [
    "printOptionContainer",
    props.relatedProducts.indexOf(props.id) > -1 ? "isActive" : ""
  ].join(" ");
  let qtyDropDown = null;
  const onChangeInput = value => {
    props.onChangeOptionHandler({
      type: "change_related_qty",
      related_product: props.id,
      qty: value
    });
  };
  if (props.quantityCanBeChanged) {
    qtyDropDown = (
      <Selectbox
        items={props.avaibleQty}
        label={"Qty:"}
        displayedValue={props.selectedQty}
        defaultValue={props.selectedQty}
        changeInput={onChangeInput}
      />
    );
  }
  return (
    <div
      className={classes}
      onClick={() => {
        props.onChangeOptionHandler({
          related_product: props.id,
          type: "related_products"
        });
      }}
    >
      <div className="imageContainer">
        <img src={props.image_src} />
      </div>
      <div className="descriptionContainer">
        <div className="title">{props.name}</div>
        <div className="description">
          {props.description}
          <span className="selectedQty">
            {" "}
            {props.selectedQty} {props.t("qty")}
          </span>
        </div>
        {qtyDropDown}
      </div>
    </div>
  );
};

module.exports = withNamespaces("relatedproduct")(relatedproduct);
