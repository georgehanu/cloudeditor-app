const React = require("react");
const LoadingItem = require("./LoadingItem");
const GalleryItem = require("./GalleryItem");
const GalleryPreviewItem = require("./GalleryPreviewItem");
const LazyLoad = require("react-lazy-load").default;
const { connect } = require("react-redux");
const { pathOr } = require("ramda");
const { removeAssetFromGallery } = require("../../stores/actions/assets");

const gallery = props => {
  console.log(props, "aaaaaa");
  let items = [];

  if (props.hideActions === undefined || props.hideActions === false) {
    items = props.items.map((el, index) => {
      return (
        <li className="uploadGalleryLi" key={index}>
          <LazyLoad>
            <GalleryItem {...el} deleteAsset={props.onDeleteAssetHandler} />
          </LazyLoad>
        </li>
      );
    });
  } else {
    items = props.items.map((el, index) => {
      return (
        <li className="uploadGalleryLi" key={index}>
          <LazyLoad>
            <GalleryPreviewItem
              {...el}
              deleteAsset={props.onDeleteAssetHandler}
              tooltip={{ imageSrc: el.thumbnail_src }}
            />
          </LazyLoad>
        </li>
      );
    });
  }

  if (props.loading) {
    for (let counter = 0; counter < props.loadingNr; counter++) {
      items.push(
        <li
          className="uploadGalleryLi uploadGalleryLiLoading"
          key={props.items.length + counter}
        >
          <LoadingItem loading={true} keys={props.items.length + counter} />
        </li>
      );
    }
  }

  return (
    <div className="uploadGallery">
      <ul className="uploadGalleryUl">{items}</ul>
    </div>
  );
};

const getItemsByType = (state, props) => {
  return pathOr([], [props.type, "uploadedFiles"], state.assets);
};
const getLoadingByType = (state, props) => {
  return pathOr(0, [props.type, "loadingFiles"], state.assets);
};

const getLoadingNrByType = (state, props) => {
  return pathOr(false, [props.type, "loading"], state.assets);
};

const mapStateToProps = (state, props) => {
  return {
    items: getItemsByType(state, props),
    loading: getLoadingByType(state, props),
    loadingNr: getLoadingNrByType(state, props)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onDeleteAssetHandler: payload => dispatch(removeAssetFromGallery(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(gallery);
