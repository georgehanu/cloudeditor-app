const React = require("react");
const LoadingItem = require("./LoadingItem");

const Gallery = props => {
  console.log(props, "Gale");
  let items = props.items.map((el, index) => {
    return (
      <li className="UploadGalleryLi" key={index}>
        <div className="UploadGalleryItem">
          <img
            src={el.src}
            alt="GalleryItem"
            className="UploadGalleryItemImage"
          />
          <div className="GalleryItemActions">
            <span
              className="Select icon printqicon-ok"
              onClick={() => props.selectImage(el.id)}
            />
            <span
              className="Delete icon printqicon-delete"
              onClick={() => props.deleteImage(el.id)}
            />
          </div>
        </div>
      </li>
    );
  });

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
