const { pick, forEachObjIndexed, filter, values, uniq } = require("ramda");
const { extractVariablesFromString } = require("./VariableUtils");

const MODE_COLOR = 1;
const MODE_IMAGE = 2;
const MODE_TEXT = 3;
const HIDE_LINE_UP = 1;
const HIDE_LINE_DOWN = 2;

const computeOffset = hideLineOffset => {
  if (!hideLineOffset) return 0;

  const offsets = values(hideLineOffset);
  if (offsets.length === 0) return 0;

  return offsets.reduce((partial_sum, value) => partial_sum + value);
};

const originalTopPosition = obj => {
  return (
    obj.top -
    computeOffset(obj.hideLineUpOffset) +
    computeOffset(obj.hideLineDownOffset)
  );
};

const blocksAreInSameColumn = (block, obj) => {
  const block_x1 = block.left;
  const block_x2 = block.left + block.width;
  const obj_x1 = obj.left;
  const obj_x2 = obj.left + obj.width;
  return block_x1 < obj_x2 && block_x2 > obj_x1;
};

const findTargetBlocks = (obj, mode, objects, fieldTarget) => {
  let target = {};

  if (obj[fieldTarget]) {
    target = pick(obj[fieldTarget].split(","), objects);
  } else {
    const isText = item => {
      let offset = originalTopPosition(item) - originalTopPosition(obj);
      if (mode === HIDE_LINE_DOWN) offset *= -1;
      return (
        item.type === "textbox" &&
        offset > 0 &&
        blocksAreInSameColumn(obj, item)
      );
    };
    target = filter(isText, objects);
  }

  return target;
};
const replaceVariable = (variableValue, variables, obj, mode) => {
  const usedVariables = pick(
    extractVariablesFromString(variableValue),
    variables
  );

  if (mode === MODE_IMAGE) {
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
  } else {
    let newValue = variableValue;
    forEachObjIndexed((variable, key) => {
      if (variable.value === null && mode === MODE_COLOR) {
        if (obj.fillColor) {
          newValue = "rgb(" + obj.fillColor.htmlRGB + ")";
        } else {
          // default color
          newValue = "rgb(0,0,0)";
        }
      } else newValue = newValue.replace("[%]" + key + "[/%]", variable.value);
    }, usedVariables);

    return newValue;
  }
};

const moveBlock = (block, obj, mode) => {
  let field = "hideLineUpOffset";
  let moveUp = obj.value.length === 0;
  if (mode === HIDE_LINE_DOWN) {
    field = "hideLineDownOffset";
    moveUp = !moveUp;
  }
  let hideLineOffset = block[field] || {};
  if (moveUp) {
    if (
      hideLineOffset[obj.id] === undefined ||
      mode === HIDE_LINE_UP ||
      (mode === HIDE_LINE_DOWN && hideLineOffset[obj.id] <= 0)
    ) {
      block[field] = {
        ...hideLineOffset,
        [obj.id]: obj.height
      };
      block.top = block.top - obj.height;
    }
  } else {
    if (hideLineOffset[obj.id] === undefined) {
      block[field] = {
        [obj.id]: 0
      };
    }
    if (
      hideLineOffset[obj.id] === undefined ||
      (mode === HIDE_LINE_UP && hideLineOffset[obj.id] > 0) ||
      mode === HIDE_LINE_DOWN
    ) {
      block.top = block.top + obj.height;
      block[field] = {
        ...hideLineOffset,
        [obj.id]: block[field][obj.id] - obj.height
      };
    }
  }

  return { ...block };
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

  for (const oneVar of values(variables)) {
    const updatedObjects = updateObjOneVariable({
      objects,
      variables,
      variable: oneVar
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

  for (const objId of values(registered)) {
    // update the value based on the variable
    let obj = objects[objId];
    if (obj.type === "textbox") {
      obj = {
        ...obj,
        value: replaceVariable(obj.text, variables, obj, MODE_TEXT)
      };
    }

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
      const visibleDepend = obj.value.length === 0 ? false : true;
      for (const objDependId of values(obj.Dependency)) {
        const objDepend = {
          ...objects[objDependId],
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
      for (const mode of [HIDE_LINE_UP, HIDE_LINE_DOWN]) {
        if (
          (mode === HIDE_LINE_UP && obj.HideLineUp) ||
          (mode === HIDE_LINE_DOWN && obj.HideLineDown)
        ) {
          let targetBlocks = findTargetBlocks(
            obj,
            mode,
            objects,
            mode === HIDE_LINE_UP ? "HideLineUpTarget" : "HideLineDownTarget"
          );

          for (const keyObj in targetBlocks) {
            const block = moveBlock(objects[keyObj], obj, mode);

            objects = {
              ...objects,
              [block.id]: block
            };
            newObjs[block.id] = block;
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

const updateObjColorImageVar = (state, action, mode) => {
  let objects = { ...state.objects };
  const { variables } = action.payload;
  let registered = [];

  for (const oneVar of values(variables)) {
    registered = registered.concat(oneVar.registered);
  }
  const newObjs = {};

  for (const objId of values(registered)) {
    let obj = objects[objId];
    if (mode === MODE_COLOR && obj.dynamicFillColor) {
      const newColor = replaceVariable(obj.fill, variables, obj, MODE_COLOR);
      obj = { ...obj, fillNew: newColor };
    } else if (mode === MODE_IMAGE && obj.dynamicImage) {
      const newFields = replaceVariable(
        obj.dynamicImage,
        variables,
        obj,
        MODE_IMAGE
      );
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
  return updateObjColorImageVar(state, action, MODE_IMAGE);
};
const updateObjColorVariable = (state, action) => {
  return updateObjColorImageVar(state, action, MODE_COLOR);
};

const checkIfVariableIsValid = (state, payload) => {
  let invalidMessage = null;
  const { name, registered } = payload.variable;
  const { objects } = payload;
  for (const key of values(registered)) {
    if (objects[key].invalidMessage) {
      invalidMessage = objects[key].invalidMessage;
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
