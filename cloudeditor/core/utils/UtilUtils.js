const {
  head,
  pluck,
  values,
  compose,
  last,
  apply,
  add,
  reduce
} = require("ramda");
const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

const computeZoomScale = function(zoom, parent, child) {
  const scale = Math.min(
    parent.width / child.width,
    parent.height / child.height
  );

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

module.exports = {
  updateObject,
  computeZoomScale,
  getMaxProp,
  getHeadProp,
  getLastProp,
  applyMax,
  addProps
};
