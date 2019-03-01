const React = require("react");
const LoadingItem = require("./LoadingItem");
const GalleryItem = require("./GalleryItem");
const GalleryPreviewItem = require("./GalleryPreviewItem");
const GalleryToolbarPreview = require("./GalleryToolbarPreview");

const LazyLoad = require("react-lazy-load").default;
const { connect } = require("react-redux");
const { pathOr } = require("ramda");
const { removeAssetFromGalleryStart } = require("../../stores/actions/assets");
const {
  assetsLayoutForActivePageSelector
} = require("../../stores/selectors/assets");
const SweetAlert = require("sweetalert-react").default;
require("sweetalert/dist/sweetalert.css");
const { withNamespaces } = require("react-i18next");
const BackdropSpinner = require("../../hoc/withSpinner/backdropSpinner");
const ConfigUtils = require("../../../core/utils/ConfigUtils");
const baseUrl =
  ConfigUtils.getConfigProp("baseUrl") + "/media/personalization/";

class Gallery extends React.PureComponent {
  state = {
    showAlert: false,
    itemId: null,
    loadingDelete: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.loadingDelete === true && prevState.loadingDelete === false) {
      nextProps.addContainerClasses &&
        nextProps.addContainerClasses(
          "Gallery",
          ["containerMaxZindex", "containerMaxZindexGallery"],
          false
        );
      return {
        ...prevState,
        loadingDelete: true
      };
    } else if (
      nextProps.loadingDelete === false &&
      prevState.loadingDelete === true
    ) {
      nextProps.addContainerClasses &&
        nextProps.addContainerClasses("Gallery", [], false);
      return {
        ...prevState,
        loadingDelete: false
      };
    }
    return null;
  }

  deleteItemHandler = () => {
    this.setState({ showAlert: false });
    this.props.onDeleteAssetHandler({
      id: this.state.itemId,
      type: this.props.type,
      fromToolbar: this.props.fromToolbar
    });
  };

  onDeleteHandler = itemId => {
    this.setState({ showAlert: true, itemId });
  };

  render() {
    let items = [];

    if (
      this.props.hideActions === undefined ||
      this.props.hideActions === false
    ) {
      items = this.props.items.map((el, index) => {
        if (this.props.fromToolbar) {
          return (
            <li className="uploadGalleryLi" key={index}>
              <LazyLoad>
                <GalleryToolbarPreview
                  image={el}
                  type={this.props.type}
                  deleteAsset={this.onDeleteHandler}
                  selectAsset={this.props.onSelectAssetHandler}
                />
              </LazyLoad>
            </li>
          );
        }
        return (
          <li className="uploadGalleryLi" key={index}>
            <LazyLoad>
              <GalleryItem
                {...el}
                type={this.props.type}
                deleteAsset={this.onDeleteHandler}
                addContainerClasses={this.props.addContainerClasses}
              />
            </LazyLoad>
          </li>
        );
      });
    } else {
      items = this.props.items.map((el, index) => {
        return (
          <li className="uploadGalleryLi" key={index}>
            <LazyLoad>
              <GalleryPreviewItem
                {...el}
                deleteAsset={this.props.onDeleteAssetHandler}
                tooltip={{
                  imageSrc: baseUrl + el.thumbnail_src,
                  icon: el.icon
                }}
                addContainerClasses={this.props.addContainerClasses}
                selectImage={this.props.selectImage}
              />
            </LazyLoad>
          </li>
        );
      });
    }

    if (this.props.loading) {
      for (let counter = 0; counter < this.props.loadingNr; counter++) {
        items.push(
          <li
            className="uploadGalleryLi uploadGalleryLiLoading"
            key={this.props.items.length + counter}
          >
            <LoadingItem
              loading={true}
              keys={this.props.items.length + counter}
            />
          </li>
        );
      }
    }

    return (
      <React.Fragment>
        <SweetAlert
          show={this.state.showAlert}
          type="warning"
          title={this.props.t("Warning")}
          text={this.props.t("Are you sure you want to delete ?")}
          showCancelButton={true}
          onConfirm={() => this.deleteItemHandler()}
          onCancel={() => this.setState({ showAlert: false })}
        />
        {this.props.loadingDelete && (
          <div
            className={
              this.props.fromToolbar
                ? "backdropSpinnerContainerFromToolbar"
                : "backdropSpinnerContainer"
            }
          >
            <BackdropSpinner loading={true} />
          </div>
        )}
        <div className="uploadGallery">
          <ul className="uploadGalleryUl">{items}</ul>
        </div>
      </React.Fragment>
    );
  }
}

const getItemsByType = (state, props) => {
  if (props.type === "layout") {
    return assetsLayoutForActivePageSelector(state, {
      category_id: props.category_id
    });
  } else if (props.type == "graphics") {
    return pathOr([], [props.type, "items"], state.assets);
  } else return pathOr([], [props.type, "uploadedFiles"], state.assets);
};
const getLoadingByType = (state, props) => {
  return pathOr(false, [props.type, "loading"], state.assets);
};

const getLoadingNrByType = (state, props) => {
  return pathOr(0, [props.type, "loadingFiles"], state.assets);
};

const getLoadingDeleteByType = (state, props) => {
  if (props.fromToolbar) {
    return pathOr(false, [props.type, "loadingDeleteToolbar"], state.assets);
  }
  return pathOr(false, [props.type, "loadingDelete"], state.assets);
};

const mapStateToProps = (state, props) => {
  return {
    items: getItemsByType(state, props),
    loading: getLoadingByType(state, props),
    loadingNr: getLoadingNrByType(state, props),
    loadingDelete: getLoadingDeleteByType(state, props)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onDeleteAssetHandler: payload =>
      dispatch(removeAssetFromGalleryStart(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("gallery", { usePureComponent: true })(Gallery));
