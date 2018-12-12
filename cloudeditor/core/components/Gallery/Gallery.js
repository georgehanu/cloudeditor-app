const React = require("react");
const LoadingItem = require("./LoadingItem");
const GalleryItem = require("./GalleryItem");
const GalleryPreviewItem = require("./GalleryPreviewItem");
const LazyLoad = require("react-lazy-load").default;

const Gallery = props => {
  let items = [];

  if (props.hideActions === undefined || props.hideActions === false) {
    items = props.items.map((el, index) => {
      return (
        <li className="UploadGalleryLi" key={index}>
          <LazyLoad>
            <GalleryItem
              {...el}
              selectedId={props.selectedId}
              selectImage={props.selectImage}
              deleteImage={props.deleteImage}
            />
          </LazyLoad>
        </li>
      );
    });
  } else {
    items = props.items.map((el, index) => {
      return (
        <li className="UploadGalleryLi" key={index}>
          <LazyLoad>
            <GalleryPreviewItem
              {...el}
              selectedId={props.selectedId}
              selectImage={props.selectImage}
              deleteImage={props.deleteImage}
              tooltip={{ imageSrc: el.src }}
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
          className="UploadGalleryLi UploadGalleryLiLoading"
          key={props.items.length + counter}
        >
          <LoadingItem loading={true} keys={props.items.length + counter} />
        </li>
      );
    }
  }

  return (
    <div className="UploadGallery">
      <ul className="UploadGalleryUl">{items}</ul>
    </div>
  );
};

module.exports = Gallery;
