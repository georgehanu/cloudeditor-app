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
    configs: getVariablesDefaults()
  };

  return state;
};

const getVariablesFromProject = cfg => {
  const vars = cfg.map(el => {
    if (el.type === "color") {
      return {
        [el.markup]: {
          name: el.markup,
          label: el.label,
          type: el.type,
          registered: el.registered
        }
      };
    } else if (el.type === "image") {
      return {
        [el.markup]: {
          name: el.markup,
          type: el.type,
          registered: el.registered,
          image_path: el.image_path || "",
          image_src: el.image_src || "",
          ratioWidth: el.ratioWidth || 1,
          ratioHeight: el.ratioHeight || 1,
          imageWidth: el.imageWidth || 0,
          imageHeight: el.imageHeight || 0
        }
      };
    }
    return {
      [el.markup]: {
        name: el.markup,
        label: el.label,
        type: el.type,
        value: el.defaultValue,
        order: el.order,
        registered: el.registered,
        general: {
          displayFilter: "dg"
        },
        specific: {
          length: el.length
        },
        additional: {
          inputClasses: el.classes ? el.classes.split(",") : []
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

  return {
    ...state,
    variables: {
      ...state.variables
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
