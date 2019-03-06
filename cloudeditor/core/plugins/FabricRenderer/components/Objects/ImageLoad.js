const React = require("react");

const { Image } = require("../../fabric/index");
var imgCache = {};

class ImageLoad extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      image: null,
      error: false,
      loaded: false
    };
  }

  loadImg(src) {
    if (!src) {
      throw new Error("Expected image src instead saw " + typeof src);
    }

    var img = imgCache[src];

    if (!img) {
      console.log("cacheImg...");
      img = imgCache[src] = document.createElement("img");
      img.loadFns = [];
      img.errorFns = [];
      img.onerror = function() {
        img.error = true;
        console.log("image error handlers", img.errorFns);
        img.errorFns.forEach(fn => fn.call(img));
      };
      img.onload = function() {
        var hasNH = "naturalHeight" in img,
          w = hasNH ? "naturalWidth" : "width",
          h = hasNH ? "naturalHeight" : "height",
          invalidImg = img[w] + img[h] == 0;

        if (invalidImg) {
          console.log("calling image onerror");
          img.onerror();
        } else {
          img.loaded = true;
          console.log("image load handlers", img.loadFns);
          img.loadFns.forEach(fn => fn.call(img));
        }
      };
    }

    if (!img.loaded && !img.error) {
      console.log("set handlers");
      img.loadFns.push(() => {
        img.loaded = true;
        this.setState({ loaded: true, image: img });
        //console.log("test  ");
        console.log("Image loaded", src);
      });

      img.errorFns.push(() => {
        img.error = true;
        this.setState({ error: true, image: brokenImage });
        console.log("Error loading image", src, this.state);
      });
    } else if (img.error) {
      this.setState({ error: true, image: brokenImage });
      console.log("Error previously loading image", src);
    } else {
      this.setState({ loaded: true, image: img });
      console.log("Image pre-loaded", src);
    }

    if (!img.src) {
      console.log("set img src to", src);
      img.src = src;
    }
  }

  componentDidMount = () => {
    this.loadImg(this.props.image_src);
  };

  render() {
    let render = null;
    if (this.state.loaded)
      render = <Image loadedInstance={this.state.image} {...this.props} />;

    return render;
  }
}
module.exports = ImageLoad;
