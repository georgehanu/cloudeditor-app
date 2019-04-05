const { pick, forEachObjIndexed, filter } = require("ramda");
const { extractVariablesFromString } = require("./VariableUtils");

const MODE_COLOR = 1;
const MODE_IMAGE = 2;
const HIDE_LINE_UP = 1;
const HIDE_LINE_DOWN = 2;

const computeOffset = arr => {
  const newArray = Object.keys(arr).map(el => {
    return arr[el];
  });
  if (newArray.length === 0) return 0;

  return newArray.reduce((partial_sum, value) => partial_sum + value);
};

const sameColumn = (block, value) => {
  const block_x1 = block.left;
  const block_x2 = block.left + block.width;
  const value_x1 = value.left;
  const value_x2 = value.left + value.width;
  return block_x1 < value_x2 && block_x2 > value_x1;
};

const originalTopPosition = obj => {
  const offsetUp =
    obj.hideLineUpOffset === undefined
      ? 0
      : computeOffset(obj.hideLineUpOffset);
  const offsetDown =
    obj.hideLineDownOffset === undefined
      ? 0
      : computeOffset(obj.hideLineDownOffset);
  return obj.top - offsetUp + offsetDown;
};

const findTarget = (obj, mode, objects) => {
  let target = {};

  if (mode === HIDE_LINE_UP) {
    if (obj.HideLineUpTarget) {
      target = pick(obj.HideLineUpTarget.split(","), objects);
    } else {
      const isText = item => {
        // and are above this item
        // when comparing position ... compare the object's current position or original position ? ...
        // same with the comparison objects ???
        return (
          item.type === "textbox" &&
          //item.top + computeOffset(item.hideLineUpOffset || {}) > obj.top &&
          originalTopPosition(item) > originalTopPosition(obj) &&
          sameColumn(obj, item)
        );
      };
      target = filter(isText, objects);
    }
  } else {
    if (obj.HideLineDownTarget) {
      target = pick(obj.HideLineDownTarget.split(","), objects);
    } else {
      const isText = item => {
        // and are bellow this item
        return (
          item.type === "textbox" &&
          //item.top - computeOffset(item.hideLineDownOffset || {}) < obj.top &&
          originalTopPosition(item) < originalTopPosition(obj) &&
          sameColumn(obj, item)
        );
      };
      target = filter(isText, objects);
    }
  }

  return target;
};
const replaceVariable = (variableText, variables, obj, isColor = false) => {
  const usedVariables = pick(
    extractVariablesFromString(variableText),
    variables
  );

  let newValue = variableText;
  forEachObjIndexed((variable, key) => {
    if (variable.value === null && isColor) {
      if (obj.fillColor) {
        newValue = "rgb(" + obj.fillColor.htmlRGB + ")";
      } else {
        // default color
        newValue = "rgb(0,0,0)";
      }
    } else newValue = newValue.replace("[%]" + key + "[/%]", variable.value);
  }, usedVariables);

  return newValue;
};

const replaceImageVariable = (variableText, variables, obj) => {
  const usedVariables = pick(
    extractVariablesFromString(variableText),
    variables
  );

  let image_src = obj.image_src;
  let imageHeight = obj.imageHeight || 0;
  let imageWidth = obj.imageWidth || 0;
  forEachObjIndexed((variable, key) => {
    if (variable.value) {
      image_src = obj.dynamicImage.replace(
        "[%]" + key + "[/%]",
        variable.value
      );
      imageHeight = variable.imageHeight;
      imageWidth = variable.imageWidth;
    }
  }, usedVariables);

  return { imageHeight, imageWidth, image_src };
};

const updateObjFromVariable = (obj, variables) => {
  if (obj.type === "textbox") {
    const newText = replaceVariable(obj.text, variables, obj);
    obj = { ...obj, value: newText };
  }
  return obj;
};

const updateObjVariable = (state, action) => {
  const updatedObjects = updateObjOneVariable({
    objects: state.objects,
    variables: action.payload.variables,
    variable: action.payload.variable
  });

  return {
    ...state,
    objects: {
      ...state.objects,
      ...updatedObjects.objects
    }
  };
};

const updateObjVariableInit = (state, payload) => {
  const filterColorAndImage = variable =>
    variable.type !== "color" && variable.type !== "image";
  const variables = filter(filterColorAndImage, payload.payload.variables);
  let objects = payload.payload.objects;

  for (let oneVar in variables) {
    const updatedObjects = updateObjOneVariable({
      objects,
      variables,
      variable: variables[oneVar]
    });

    objects = {
      ...objects,
      ...updatedObjects.objects
    };
  }

  return {
    ...state,
    objects: {
      ...state.objects,
      ...objects
    }
  };
};

const updateObjOneVariable = payload => {
  let objects = { ...payload.objects };
  const { variables, variable } = payload;
  const { registered } = variable;

  const newObjs = {};

  for (let objKey in registered) {
    // update the value based on the variable
    let obj = updateObjFromVariable(objects[registered[objKey]], variables);

    if (obj.ValidationRule) {
      obj.invalidMessage = null;
      const returnValue = eval(obj.ValidationRule);
      if (returnValue !== true) {
        obj.invalidMessage = returnValue;

        newObjs[obj.id] = obj;
        // object was updated, we need it updated in objects
        objects = {
          ...objects,
          [obj.id]: obj
        };
        continue;
      }
    }

    if (obj.FormatRule) {
      const newObj = eval(obj.FormatRule);
      if (newObj !== null) {
        obj = { ...newObj };
      }
    }

    if (obj.ConcatAfter) {
      obj.value = obj.value + obj.ConcatAfter;
    }
    if (obj.ConcatBefore) {
      obj.value = obj.ConcatBefore + obj.value;
    }

    if (obj.value.length <= 1 && obj.Dependency) {
      // search if this object is set as depended for another block
      visibleDepend = obj.value.length === 0 ? false : true;
      for (let objDependId in obj.Dependency) {
        objDepend = {
          ...objects[obj.Dependency[objDependId]],
          visibleDepend
        };

        objects = {
          ...objects,
          [objDepend]: objDepend
        };
        newObjs[objDepend.id] = objDepend;
      }
    }

    if (obj.value.length <= 1) {
      for (let mode of [HIDE_LINE_UP, HIDE_LINE_DOWN]) {
        if (
          (mode === HIDE_LINE_UP && obj.HideLineUp) ||
          (mode === HIDE_LINE_DOWN && obj.HideLineDown)
        ) {
          moveUp = obj.value.length === 0;
          moveUp = mode === HIDE_LINE_DOWN ? !moveUp : moveUp;
          let field =
            mode === HIDE_LINE_UP ? "hideLineUpOffset" : "hideLineDownOffset";

          let target = findTarget(obj, mode, objects);

          for (let keyObj in target) {
            const tmpObj = objects[keyObj];
            let hideLineOffset = tmpObj[field] || {};
            if (moveUp) {
              if (
                hideLineOffset[obj.id] === undefined ||
                mode === HIDE_LINE_UP ||
                (mode === HIDE_LINE_DOWN && hideLineOffset[obj.id] <= 0)
              ) {
                tmpObj[field] = {
                  ...hideLineOffset,
                  [obj.id]: obj.height
                };
                tmpObj.top = tmpObj.top - obj.height;
              }
            } else {
              if (hideLineOffset[obj.id] === undefined) {
                tmpObj[field] = {
                  [obj.id]: 0
                };
              }
              if (
                hideLineOffset[obj.id] === undefined ||
                (mode === HIDE_LINE_UP && hideLineOffset[obj.id] > 0) ||
                mode === HIDE_LINE_DOWN
              ) {
                tmpObj.top = tmpObj.top + obj.height;
                tmpObj[field] = {
                  ...hideLineOffset,
                  [obj.id]: tmpObj[field][obj.id] - obj.height
                };
              }
            }
            objects = {
              ...objects,
              [tmpObj.id]: tmpObj
            };
            newObjs[tmpObj.id] = tmpObj;
          }
        }
      }
    }

    newObjs[obj.id] = obj;
    objects = {
      ...objects,
      [obj.id]: obj
    };
  }

  return {
    objects: {
      ...newObjs
    }
  };
};

const updateObjVar = (state, action, mode) => {
  let objects = { ...state.objects };
  const { variables } = action.payload;
  let registered = [];

  for (let oneVar in variables) {
    registered = registered.concat(variables[oneVar].registered);
  }
  const newObjs = {};

  for (let objKey in registered) {
    let obj = objects[registered[objKey]];
    if (mode === MODE_COLOR && obj.dynamicFillColor) {
      const newColor = replaceVariable(obj.fill, variables, obj, true);
      obj = { ...obj, fillNew: newColor };
    } else if (mode === MODE_IMAGE && obj.dynamicImage) {
      const newFields = replaceImageVariable(obj.dynamicImage, variables, obj);
      obj = { ...obj, ...newFields };
    }
    newObjs[obj.id] = obj;
  }

  return {
    ...state,
    objects: {
      ...state.objects,
      ...newObjs
    }
  };
};

const updateObjImageVariable = (state, action) => {
  return updateObjVar(state, action, MODE_IMAGE);
};
const updateObjColorVariable = (state, action) => {
  return updateObjVar(state, action, MODE_COLOR);
};

const checkIfVariableIsValid = (state, payload) => {
  let invalidMessage = null;
  const { name, registered } = payload.variable;
  for (let key in registered) {
    if (payload.objects[registered[key]].invalidMessage) {
      invalidMessage = payload.objects[registered[key]].invalidMessage;
      break;
    }
  }

  return {
    ...state,
    variables: {
      ...state.variables,
      [name]: {
        ...state.variables[name],
        invalidMessage
      }
    }
  };
};

module.exports = {
  updateObjVariable,
  checkIfVariableIsValid,
  updateObjColorVariable,
  updateObjImageVariable,
  updateObjVariableInit
};
