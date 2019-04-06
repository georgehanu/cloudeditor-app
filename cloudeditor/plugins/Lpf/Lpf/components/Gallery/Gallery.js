const React = require("react");
const { withNamespaces } = require("react-i18next");
require("./Gallery.css");
class Gallery extends React.Component {
  render() {
    const galleryItems = this.props.items.map(item => {
      return (
        <div className={"galleryItem"}>
          <img src={item.thumbnail_src} />
          <div className={"galleryLabel"}>{item.image_name}</div>
        </div>
      );
    });

    return <div className="galleryContainer">{galleryItems}</div>;
  }
}

module.exports = withNamespaces("translate")(Gallery);
