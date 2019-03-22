const {
  merge,
  mergeDeepRight,
  mergeDeepLeft,
  forEachObjIndexed,
  pathOr,
  mergeAll
} = require("ramda");
const uuidv4 = require("uuid/v4");

const getVariableTemplate = cfg => {
  const varUid = uuidv4();
  return merge(
    {
      name: varUid,
      label: varUid,
      type: null,
      value: null,
      general: {},
      specific: {},
      additional: {},
      actions: {},
      notes: {}
    },
    cfg || {}
  );
};

const getVariablesDefaults = cfg => {
  const { general, shortText, text, longText, boolean, ...custom } = cfg || {};

  const generalCfg = merge(
    {
      required: false,
      visible: true,
      displayFilter: ""
    },
    general || {}
  );

  const shortTextCfg = merge(
    {
      length: 10
    },
    shortText || {}
  );

  const textCfg = merge(
    {
      length: 265,
      test: 13
    },
    text || {}
  );

  const longTextCfg = merge(
    {
      length: 1000
    },
    longText || {}
  );

  const booleanCfg = merge({}, boolean || {});

  const customCfg = custom || {};

  return {
    generalCfg,
    shortTextCfg,
    textCfg,
    longTextCfg,
    booleanCfg,
    ...customCfg
  };
};

const getEmptyColorVariable = cfg => {
  const varUid = uuidv4();
  return merge(
    {
      name: varUid,
      type: "color",
      value: null
    },
    cfg || {}
  );
};

const getEmptyImageUploadVariable = cfg => {
  const varUid = uuidv4();
  return merge(
    {
      name: varUid,
      type: "image",
      value: null
    },
    cfg || {}
  );
};

const getEmptyVariables = cfg => {
  const defaultVar = getVariableTemplate(cfg);

  return defaultVar;
};

const getVariablesState = cfg => {
  let state = {
    variables: getVariablesFromProject(cfg),
    configs: getVariablesDefaults(cfg)
  };

  return state;
};

const getVariablesFromProject = cfg => {
  const vars = cfg.map(el => {
    return {
      [el.markup]: {
        name: el.markup,
        label: el.label,
        type: el.type,
        value: el.defaultValue,
        general: {
          displayFilter: "dg"
        },
        specific: {
          length: el.length
        },
        additional: {
          inputClasses: el.classes.split(",")
        }
      }
    };
  });
  return mergeAll(vars);
};

const getCompleteVariable = function(variable, configs) {
  const varType = pathOr(null, ["type"], variable);
  //return mergeDeepRight(variable, {
  return mergeDeepLeft(variable, {
    general: pathOr({}, ["general"], configs),
    specific: pathOr({}, [varType + "Cfg"], configs)
  });
};

const getCompleteVariables = function(variables, configs) {
  let newVariables = {};
  forEachObjIndexed((variable, name) => {
    newVariables[name] = getCompleteVariable(variable, configs);
  }, variables);
  return newVariables;
};

const getDGVariables = cfg => {
  let state = getVariablesState(cfg.variables);

  const jarNameVar = getEmptyVariables({
    name: "jarName",
    label: "Jar Name",
    type: "text",
    value: "Sarah's Special",
    general: {
      displayFilter: "dg"
    },
    specific: {
      length: 20
    },
    additional: {
      inputClasses: ["Input", "InputName"]
    }
  });

  const jarTypeVar = getEmptyVariables({
    name: "jarType",
    label: "Jar type",
    type: "text",
    value: "Mixed Berry Jam",
    general: {
      displayFilter: "dg"
    },
    specific: {
      length: 30
    },
    additional: {
      inputClasses: ["Input", "InputType"]
    }
  });

  const tagLine1Var = getEmptyVariables({
    name: "tagLine1",
    label: "Tag Line - Part One",
    type: "text",
    value: "Homemade in Aotearoa",
    general: {
      displayFilter: "dg"
    },
    specific: {
      length: 50
    },
    additional: {
      inputClasses: ["Input"]
    }
  });

  const tagLine2Var = getEmptyVariables({
    name: "tagLine2",
    label: "Tag Line - Part Two",
    type: "text",
    value: "by Sarah Crompton",
    general: {
      displayFilter: "dg"
    },
    specific: {
      length: 50
    },
    additional: {
      inputClasses: ["Input"]
    }
  });

  const batchDateVar = getEmptyVariables({
    name: "batchDate",
    label: "Batch date",
    type: "shortText",
    value: "Nov 2018",
    general: {
      displayFilter: "dg"
    },
    specific: {
      length: 15
    },
    additional: {
      inputClasses: ["Input", "InputDate"]
    }
  });

  const color1 = getEmptyColorVariable({
    name: "color1",
    type: "color",
    value: "rgb(150, 150, 150)"
  });
  const color2 = getEmptyColorVariable({
    name: "color2",
    type: "color",
    value: "rgb(0, 150, 150)"
  });
  const color3 = getEmptyColorVariable({
    name: "color3",
    type: "color",
    value: "rgb(150, 150, 0)"
  });

  const userImage = getEmptyImageUploadVariable({
    name: "userImage",
    type: "image",
    value: null, //"img1.jpg",
    imageHeight: 0,
    imageWidth: 0
  });

  return {
    ...state,
    variables: {
      ...state.variables,
      [jarNameVar.name]: jarNameVar,
      [jarTypeVar.name]: jarTypeVar,
      [tagLine1Var.name]: tagLine1Var,
      [tagLine2Var.name]: tagLine2Var,
      [batchDateVar.name]: batchDateVar,
      [color1.name]: color1,
      [color2.name]: color2,
      [color3.name]: color3,
      [userImage.name]: userImage
    }
  };
};

const extractVariablesFromString = function(str) {
  const regex = /\[%\](.*?)\[\/%\]/g;
  if (!str) return [];
  const found = str.match(regex);
  if (!found) return [];
  return found.map(function(val) {
    return val.replace(/\[%\]/g, "").replace(/\[\/%\]/g, "");
  });
};

const VariableUtils = {
  getVariableTemplate,
  getVariablesDefaults,
  getEmptyVariables,
  getDGVariables,
  getCompleteVariable,
  getCompleteVariables,

  extractVariablesFromString
};

module.exports = VariableUtils;
