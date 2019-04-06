const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const {
  getFreeImagesDataSelector
} = require("../../../store/selectors/imageApi");
const { changeSearchCriteria } = require("../../../store/actions/imageApi");
require("./ApiGalleryFreeImages.css");
const SearchBar = require("../../../components/SearchBar/SearchBar");
const Gallery = require("../../../components/Gallery/Gallery");
const ReactPaginate = require("react-paginate").default;
class ApiGalleryFreeImages extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };

  changeCategoryHandler = value => {
    this.props.changeSearchCriteriaHandler({
      api_code: "free_images",
      props: {
        category: value,
        page: 0
      }
    });
  };
  changePerPageHandler = value => {
    this.props.changeSearchCriteriaHandler({
      api_code: "free_images",
      props: {
        perPage: value,
        page: 0
      }
    });
  };
  changePerPageHandler = value => {
    this.props.changeSearchCriteriaHandler({
      api_code: "free_images",
      props: {
        perPage: value,
        page: 0
      }
    });
  };
  changeTagsHandler = value => {
    this.props.changeSearchCriteriaHandler({
      api_code: "free_images",
      props: {
        tags: value,
        page: 0
      }
    });
  };
  changePageHandler = value => {
    this.props.changeSearchCriteriaHandler({
      api_code: "free_images",
      props: {
        page: value
      }
    });
  };
  render() {
    const searchBarItems = [
      {
        type: "select",
        label: this.props.t("Category:"),
        selectedValue: this.props.apiData.category,
        items: this.props.apiData.categories,
        changeInput: this.changeCategoryHandler
      },
      {
        type: "input",
        selectedValue: this.props.apiData.tags,
        label: this.props.t("Tags:"),
        items: [],
        changeInput: this.changeTagsHandler
      },
      {
        type: "select",
        label: this.props.t("Per Page:"),
        selectedValue: this.props.apiData.perPage,
        items: [{ value: 1, label: "25" }, { value: 50, label: "50" }],
        changeInput: this.changePerPageHandler
      }
    ];
    return (
      <div className="ApiGalleryFreeImagesContainer">
        <SearchBar items={searchBarItems} />
        <Gallery items={this.props.apiData.images} />
        <ReactPaginate
          pageCount={this.props.apiData.totalItems / this.props.apiData.perPage}
          marginPagesDisplayed={3}
          onPageChange={page => {
            this.changePageHandler(page.selected);
          }}
          initialPage={this.props.apiData.page}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { apiData: getFreeImagesDataSelector(state) };
};
const mapDispatchToProps = dispatch => {
  return {
    changeSearchCriteriaHandler: payload =>
      dispatch(changeSearchCriteria(payload))
  };
};

const ApiGalleryFreeImagesPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("ApiGalleryFreeImages")(ApiGalleryFreeImages));

module.exports = {
  ApiGalleryFreeImages: assign(ApiGalleryFreeImagesPlugin, {
    ApiConfigurator: {
      position: 2,
      priority: 1,
      type: "free_images"
    }
  })
};
