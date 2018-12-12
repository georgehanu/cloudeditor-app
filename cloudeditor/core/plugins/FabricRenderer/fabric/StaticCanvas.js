const { forEach, find, propEq } = require("ramda");
const { fabric } = require("../../../rewrites/fabric/fabric");
const {
  staticCanvasTypes,
  staticCanvasDefaults
} = require("./types/staticCanvas");

class StaticCanvas {
  constructor(ref, props) {
    this.ref = ref;
    this.props = props;
    this._initInstance();
  }

  _initInstance() {
    this.instance = new fabric.StaticCanvas(this.ref, this.props);
    this._applyProps(this.props);
  }

  static propTypes = staticCanvasTypes;
  static defaultProps = staticCanvasDefaults;

  propsToSkip = {
    children: true,
    ref: true,
    key: true,
    style: true,
    image: true
  };

  _applyProps(props, oldProps) {
    const { instance } = this;
    let updatedProps = {};
    let hasUpdates = false;
    for (var key in oldProps) {
      if (this.propsToSkip[key]) {
        continue;
      }
      if (key === "events" && oldProps[key].length) {
        forEach(event => {
          let isInCurrent = false;
          if (
            typeof find(propEq("id", event.id))(props.events) === "undefined"
          ) {
            instance.off(event.event_name, event.callback);
          }
        }, oldProps[key]);
      }
      /*
      const isOldEvent = key.slice(0, 5) === "event";
      const propChanged = oldProps[key] !== props[key];
      if (isOldEvent && propChanged) {
        const oldEventName = key
          .substr(6)
          .toLowerCase()
          .replace(/_/g, ":");
        instance.off(oldEventName, oldProps[key]);
      }*/
      var toRemove = !props.hasOwnProperty(key);
      if (toRemove) {
        instance.set(key, undefined);
      }
    }
    for (var key in props) {
      if (this.propsToSkip[key]) {
        continue;
      }
      if (key === "events" && props[key].length) {
        const oldEvents = oldProps && oldProps.events ? oldProps.events : [];
        forEach(event => {
          if (typeof find(propEq("id", event.id))(oldEvents) === "undefined") {
            instance.on(event.event_name, event.callback);
          }
        }, props[key]);
      }
      /*
      const isNewEvent = key.slice(0, 5) === "event";
      const toAdd = oldProps ? oldProps[key] !== props[key] : true;
      if (isNewEvent && toAdd) {
        if (props[key]) {
          const newEventName = key
            .substr(6)
            .toLowerCase()
            .replace(/_/g, ":");
          instance.on(newEventName, props[key]);
        }
      }
      */
      if (
        (oldProps && key != "events" && props[key] !== oldProps[key]) ||
        props[key] !== instance.get(key)
      ) {
        hasUpdates = true;
        updatedProps[key] = props[key];
      }
    }

    if (hasUpdates) {
      this._updateDimmensions(updatedProps);
      const { width, height, ...otherProps } = updatedProps;
      instance.set(otherProps);
      this._updatePicture(instance);
    }
  }

  _updatePicture() {
    return this.instance.requestRenderAll();
  }
  _updateDimmensions(updatedProps) {
    const dim = {
      width: updatedProps.width || this.instance.width,
      height: updatedProps.height || this.instance.height
    };

    this.instance.setDimensions(dim);
  }
}

module.exports = StaticCanvas;
