const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const { head } = require("ramda");
require("./ProductSumary.css");
const {
  getProductNameSelector
} = require("../../../../core/stores/selectors/productinformation");
const {
  getPanelsOrderSelector,
  getPanelsSelector
} = require("../store/selectors/lpf");
const { findIndex } = require("ramda");
const {
  getPrintOptionsSelector,
  getPrintOptionsInformation,
  getRelatedProductsInfoSelector,
  getRelatedProductsSelector
} = require("../../../../core/stores/selectors/productinformation");
const PanelIformation = require("./components/PanelInformation");
const PrintOptionsInformation = require("./components/PrintOptionsInformation");
class ProductSumary extends React.Component {
  render() {
    const { printOptions, printOptionsInformation } = this.props;
    let rpInfo = null;
    const poInfo = printOptions.PP.map((key, index) => {
      const productPartCode = "PP_" + key;
      return Object.keys(printOptions[productPartCode]).map(
        (po_code, index) => {
          if (printOptionsInformation[productPartCode][po_code]) {
            const selectedValue = head(printOptions[productPartCode][po_code]);
            const printOpInfo =
              printOptionsInformation[productPartCode][po_code];
            if (printOpInfo["show_in_sumary"]) {
              return (
                <PrintOptionsInformation
                  name={printOpInfo.name}
                  values={[printOpInfo.options[selectedValue].name]}
                  key={productPartCode + selectedValue}
                />
              );
            }
          }
          return null;
        }
      );
    });

    const rpValues = this.props.relatedPoducts.map(item => {
      const info = this.props.relatedProductsInfo;
      const relatedItemIndex = findIndex(relatedItem => {
        return relatedItem.id === item;
      }, info);
      const relatedProduct = info[relatedItemIndex];
      const relatedItemValue =
        relatedProduct.selectedQty +
        "x " +
        relatedProduct.name +
        " (" +
        parseInt(relatedProduct.selectedQty) * parseInt(relatedProduct.price) +
        ")";
      return relatedItemValue;
    });
    if (this.props.relatedPoducts.length)
      rpInfo = (
        <PrintOptionsInformation
          name={this.props.t("Related products")}
          values={rpValues}
          key="related_product"
        />
      );

    return (
      <div className="productSumaryContainer">
        <div className="productTitle">{this.props.productName}</div>
        <PanelIformation
          panels={this.props.panels}
          panelsOrder={this.props.panelsOrder}
        />
        {poInfo}
        {rpInfo}
      </div>
    );
  }
}
const mapStateToProps = (state, _) => {
  return {
    productName: getProductNameSelector(state),
    panelsOrder: getPanelsOrderSelector(state),
    panels: getPanelsSelector(state),
    printOptions: getPrintOptionsSelector(state),
    printOptionsInformation: getPrintOptionsInformation(state),
    relatedProductsInfo: getRelatedProductsInfoSelector(state),
    relatedPoducts: getRelatedProductsSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};
const ProductSumaryPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("productSumary")(ProductSumary));

module.exports = {
  ProductSumary: ProductSumaryPlugin
};
