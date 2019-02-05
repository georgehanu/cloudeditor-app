const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const LayoutContainer = require("./components/LayoutsContainer");
const { activePageIdSelector } = require("../../core/stores/selectors/project");
const {
  assetsLayoutLoadingSelector
} = require("../../core/stores/selectors/assets");

const { assetsLayoutStart } = require("../../core/stores/actions/assets");
const { pagesOrderSelector } = require("../../core/stores/selectors/project");
const { projLoadLayout } = require("../../core/stores/actions/project");
const { assetsLayoutSelector } = require("../../core/stores/selectors/assets");

const SweetAlert = require("sweetalert-react").default;
const isEqual = require("react-fast-compare");
const LayoutsHeader = require("./components/LayoutsHeader");

require("./Layouts.css");

class Layouts extends React.Component {
  state = {
    activePageId: null,
    showAlert: false,
    saText: "",
    layoutId: null,
    categories: [],
    selectedCategory: { value: "", label: "" }
  };

  onCategoryChange = selectedCategory => {
    this.setState({ selectedCategory });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  };

  componentDidMount() {
    this.props.assetsLayoutStart();
    const categories = [
      { value: "1", label: "Categ 1" },
      { value: "2", label: "Categ 2" },
      { value: "3", label: "Categ 3" }
    ];
    this.setState({ categories, selectedCategory: categories[0] });
  }

  selectImageHandler = layoutId => {
    this.setState({ showAlert: true, layoutId });
  };

  loadLayout = () => {
    this.setState({ showAlert: false });
    const layout = this.props.assetsLayout.findIndex(el => {
      return el.id === this.state.layoutId;
    });
    this.props.projLoadLayout(this.props.assetsLayout[layout]);
  };

  render() {
    return (
      <React.Fragment>
        <SweetAlert
          show={this.state.showAlert}
          type="warning"
          title={this.props.t("Warning")}
          text={
            this.props.t("Are you sure you want to load this layout ?") +
            "\n" +
            this.props.t("All changes for this page will be overwritten")
          }
          showCancelButton={true}
          onConfirm={() => this.loadLayout()}
          onCancel={() => this.setState({ showAlert: false })}
        />
        <LayoutsHeader
          title={this.props.t("Categories")}
          options={this.state.categories}
          selectedOption={this.state.selectedCategory}
          onChange={this.onCategoryChange}
        />
        <LayoutContainer
          addContainerClasses={this.props.addContainerClasses}
          loading={this.props.loading}
          selectImage={this.selectImageHandler}
          category_id={this.state.selectedCategory.value}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    activePageId: activePageIdSelector(state),
    pagesOrder: pagesOrderSelector(state),
    loading: assetsLayoutLoadingSelector(state),
    assetsLayout: assetsLayoutSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    assetsLayoutStart: () => dispatch(assetsLayoutStart()),
    projLoadLayout: layout => dispatch(projLoadLayout(layout))
  };
};

const LayoutsPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layouts")(Layouts));

module.exports = {
  Layouts: assign(LayoutsPlugin, {
    SideBar: {
      position: 4,
      priority: 1,
      text: "Layouts",
      icon: "fupa-layout",
      showMore: true,
      tooltip: { title: "Layouts", description: "Load a new layout" }
    }
  })
};
