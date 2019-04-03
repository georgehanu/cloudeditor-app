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
const {
  getPrintOptionsSelector,
  getPrintOptionsInformation
} = require("../../../../core/stores/selectors/productinformation");
const PanelIformation = require("./components/PanelInformation");
const PrintOptionsInformation = require("./components/PrintOptionsInformation");
class ProductSumary extends React.Component {
  render() {
    const { printOptions, printOptionsInformation } = this.props;
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
                  value={printOpInfo.options[selectedValue].name}
                  key={productPartCode + selectedValue}
                />
              );
            }
          }
          return null;
        }
      );
    });
    return (
      <div className="productSumaryContainer">
        <div className="productTitle">{this.props.productName}</div>
        <PanelIformation
          panels={this.props.panels}
          panelsOrder={this.props.panelsOrder}
        />
        {poInfo}
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
    printOptionsInformation: getPrintOptionsInformation(state)
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
