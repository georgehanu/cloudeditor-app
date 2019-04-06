const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const {
  getRelatedProductsInfoSelector,
  getRelatedProductsSelector
} = require("../../../../core/stores/selectors/productinformation");
const {
  startChangePrintOptions
} = require("../../../../core/stores/actions/productInformation");
const RelatedProduct = require("./components/RelatedProduct");

class RelatedProductsConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  render() {
    const relatedProducts = this.props.relatedProductsInfo.map(
      (value, index) => {
        return (
          <RelatedProduct
            {...value}
            key={value.id}
            relatedProducts={this.props.relatedProducts}
            onChangeOptionHandler={this.props.onStartChangeOptions}
          />
        );
      }
    );
    return (
      <div className="printOptionsConfiguratorContainer">{relatedProducts}</div>
    );
  }
}
const mapStateToProps = state => {
  return {
    relatedProductsInfo: getRelatedProductsInfoSelector(state),
    relatedProducts: getRelatedProductsSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onStartChangeOptions: payload => dispatch(startChangePrintOptions(payload))
  };
};

const RelatedProductsConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("RelatedProductsConfigurator")(RelatedProductsConfigurator));

module.exports = {
  RelatedProductsConfigurator: assign(RelatedProductsConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "related_products"
    }
  })
};
