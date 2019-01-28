const {
  head,
  pluck,
  values,
  compose,
  last,
  apply,
  add,
  reduce,
  forEach,
  lensPath,
  set,
  view,
  equals
} = require("ramda");
const isEqual = require("react-fast-compare");

const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

const computeScale = function(parent, child) {
  return Math.min(parent.width / child.width, parent.height / child.height);
};

const computeZoomScale = function(zoom, parent, child) {
  const scale = computeScale(parent, child);

  const zoomScale = scale + ((zoom * 100 - 100) / 100) * scale;
  return zoomScale;
};

const getMaxProp = (target, prop) => {
  return compose(
    apply(Math.max),
    values,
    pluck(prop)
  )(target);
};
const getHeadProp = (target, prop) => {
  return compose(
    head,
    values,
    pluck(prop)
  )(target);
};
const getLastProp = (target, prop) => {
  return compose(
    last,
    values,
    pluck(prop)
  )(target);
};
const addProps = (target, prop, initial) => {
  return compose(
    reduce(add, initial),
    values,
    pluck(prop)
  )(target);
};
const applyMax = (initial, after) => {
  return Math.max(initial, after);
};

const applyZoomScaleToTarget = (target, scale, paths) => {
  let scaledTarget = target;

  forEach(path => {
    const lens = lensPath(path);
    const value = view(lens, scaledTarget);
    scaledTarget = set(lens, value * scale, scaledTarget);
  })(paths);

  return scaledTarget;
};
const rerenderPage = () => {
  var event = new Event("resizePage");
  window.dispatchEvent(event);
};

const checkChangedProps = (nextProps, currentProps) => {
  Object.keys(nextProps)
    .filter(key => {
      return !isEqual(nextProps[key], currentProps[key]);
    })
    .map(key => {
      console.log(
        "changed property:",
        key,
        "from",
        currentProps[key],
        "to",
        nextProps[key]
      );
    });
};

function isVisible(el) {
  var rect = el.getBoundingClientRect();

  var isVisible =
    rect.top >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.left >= 0 &&
    rect.right <= window.innerWidth;
  return isVisible;
}
module.exports = {
  updateObject,
  computeScale,
  computeZoomScale,
  getMaxProp,
  getHeadProp,
  getLastProp,
  applyMax,
  addProps,
  applyZoomScaleToTarget,
  rerenderPage,
  checkChangedProps,
  isVisible
};
