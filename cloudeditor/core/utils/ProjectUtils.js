const uuidv4 = require("uuid/v4");
const { merge, mergeAll, pathOr, mergeDeepRight } = require("ramda");
const ConfigUtils = require("../utils/ConfigUtils");
const randomcolor = require("randomcolor");

const config = ConfigUtils.getDefaults();

const getObjectColorTemplate = cfg => {
  return merge(
    {
      colorSpace: "DeviceRGB",
      transparent: 1,
      htmlRGB: null,
      RGB: null,
      CMYK: null,
      separation: null,
      separationColorSpace: null,
      separationColor: null
    },
    cfg || {}
  );
};

const getObjectsDefaults = cfg => {
  const { general, image, graphics, text, pdf, qr, ...custom } = cfg || {};
  const generalCfg = merge(
    {
      editable: 1, //user can edit a block
      ignoreOnRest: 0, //this block will be ignored on rest
      onTop: 0, //specify if a block is on top
      required: 0, //user must specify a value for this block
      movable: 1, //can be moved
      resizable: 1, //user can resize this block
      rotatable: 1, //user can rotate this block
      rotateAngle: 0, // rotation angle of the block in deg
      snapable: 0, // if snap is allow or not
      tetha: 0, //this is rotation angle in radians for translate rotation in PDF
      visible: 1, //if false, a block is NOT visible in the editor, but visible in PDF
      orientate: "north", //PDFLIB orientation - not used
      opacity: 1, // opacity of the block
      realType: null, //specifies what is the real type of the block(image, pdf, qr, )
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      bgColor: getObjectColorTemplate((general && general.bgColor) || {}),
      borderColor: getObjectColorTemplate(
        (general && general.borderColor) || {}
      ),
      borderWidth: 0,
      rule_properties: {}
    },
    general || {}
  );

  const imageCfg = merge(
    {
      type: "image",
      realType: "image",
      alternateZoom: 0,
      backgroundBlock: 0,
      borderWidth: 0,
      contrast: 0,
      luminosite: 0,
      flipHorizontal: 0,
      flipVertical: 0,
      flipBoth: 0,
      greyscale: 0,
      invert: 0,
      sepia: 0,
      leftSlider: 0,
      localImages: 0,
      selectBox: 0,
      src: 0
    },
    image || {}
  );
  const graphicsCfg = merge(
    {
      type: "graphics",
      realType: "graphics",
      alternateZoom: 0,
      backgroundBlock: 0,
      borderWidth: 0,
      contrast: 0,
      luminosite: 0,
      flipHorizontal: 0,
      flipVertical: 0,
      flipBoth: 0,
      greyscale: 0,
      invert: 0,
      leftSlider: 0,
      localImages: 0,
      selectBox: 0,
      src: null
    },
    graphics || {}
  );
  const pdfCfg = mergeAll([
    image,
    {
      realType: "pdf"
    },
    pdf || {}
  ]);

  const qrCfg = mergeAll([
    image,
    {
      realType: "qr"
    },
    qr || {}
  ]);

  const textCfg = merge(
    {
      type: "text",
      realType: "text",
      alignment: "center",
      bold: 0,
      charSpacing: 0,
      circleText: 0,
      fillColor: getObjectColorTemplate((text && text.fillColor) || {}),
      deviationX: 0,
      deviationY: 0,
      fontId: 1,
      fontSize: 24,
      italic: 0,
      lineHeightN: 120,
      lineHeightP: false,
      maxLength: 0,
      prefix: "",
      sufix: "",
      underline: 0,
      vAlignment: "middle",
      wordSpacing: "normal",
      value: "Edit Text Here",
      defaultFontZise: 24,
      useDefaultFontSize: true
    },
    text || {}
  );

  const customCfg = custom || {};

  return {
    generalCfg,
    imageCfg,
    graphicsCfg,
    pdfCfg,
    qrCfg,
    textCfg,
    ...customCfg
  };
};

const getDocumentDefaults = cfg => {
  const defaults = merge(
    {
      facingPages: true,
      singleFirstLastPage: true,
      groupSize: 2,
      includeBoxes: true,
      showTrimbox: true,
      predefinedGroups: [2, 3], //or false
      groups: {
        group_1: ["page_1"],
        group_3: ["page_4", "page_2", "page_3"]
      }
    },
    cfg || {}
  );
  return defaults;
};

const getPagesDefaults = cfg => {
  const defaults = mergeDeepRight(
    {
      defaults: {
        width: 1080,
        height: 1080,
        rule: null
      },
      boxes: {
        trimbox: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        bleed: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      }
    },
    cfg || {}
  );
  return defaults;
};

const getProjectTemplate = cfg => {
  const project = {
    title: pathOr("Empty Project", ["title", "document"], cfg),
    pages: {},
    activePage: null,
    pagesOrder: [],
    selectedPage: null, // designer
    activeGroup: null, // designer
    objects: {},
    selectedObjectsIds: [],
    activeSelection: null,
    configs: {
      document: getDocumentDefaults(pathOr({}, ["configs", "document"], cfg)),
      pages: getPagesDefaults(pathOr({}, ["configs", "pages"], cfg)),
      objects: getObjectsDefaults(pathOr({}, ["configs", "objects"], cfg))
    },
    colors: {},
    fonts: {}
  };
  return project;
};

const getProjectPageTemplate = cfg => {
  const background = {
    type: "color",
    color: randomcolor()
  };
  return {
    id: pathOr(uuidv4(), ["id"], cfg),
    label: pathOr("Page %no%", ["label"], cfg),
    width: pathOr(1080, ["width"], cfg),
    height: pathOr(1080, ["height"], cfg),
    objectsIds: pathOr([], ["objectsIds"], cfg),
    background: pathOr(background, ["background"], cfg),
    rule: "scale"
  };
};

const getColorTemplate = cfg => {
  return merge(
    {
      id: uuidv4(),
      label: null, //label of the color
      htmlRGB: null, //html value of the color
      RGB: null, //pdflib RGB value
      CMYK: null, //pdflib CMYK value
      separation: null, // pdflib Separation color value
      separationColorSpace: null, //fallback for separation color
      separationColor: null //fallback for separation color
    },
    cfg || {}
  );
};

const getFontTemplate = cfg => {
  return merge(
    {
      id: uuidv4(),
      label: null, //label of the color
      font: null,
      icon: null
    },
    cfg || {}
  );
};

const getEmptyFont = cfg => {
  return getFontTemplate(cfg);
};

const getEmptyColor = cfg => {
  return getColorTemplate(cfg);
};

const getFontMetricTemplate = cfg => {
  return merge(
    {
      cb: null,
      emSize: null,
      hhAscent: null,
      hhDescent: null,
      ir: null,
      typoAscent: null,
      winAscent: null,
      winDescent: null
    },
    cfg || {}
  );
};

const getUIPermissionsTemplate = cfg => {
  return merge(
    {
      moveBlocks: 1,
      rotateBlocks: 1,
      resizeBlocks: 1,
      snapBlocks: 1
    },
    cfg || {}
  );
};

/**
 *
 * @param cfg
 * @returns {{title: (*|string), pages: {}, pagesOrder: Array, activePage: null, objects: {}, selectedObjectsIds: Array}}
 */
const getEmptyProject = cfg => {
  let project = getProjectTemplate(cfg);
  const emptyPage = getEmptyPage(cfg);
  return {
    ...project,
    pages: {
      [emptyPage.id]: emptyPage
    },
    pagesOrder: [emptyPage.id],
    activePage: emptyPage.id,
    selectedPage: emptyPage.id
  };
};

const getRandomProject = cfg => {
  const defaultImages = [
    "http://www.flexibleproduction.com/wp-content/uploads/2017/06/test-intelligenza-sociale.jpg",
    "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&h=350",
    //"http://www.flexibleproduction.com/wp-content/uploads/2017/06/test-intelligenza-sociale.jpg",
    "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg",
    //"https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?auto=compress&cs=tinysrgb&h=350",
    "https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/04/jonathan-martin-brunate-lead-image_0.jpg",
    "https://www.evoke-landscape-design.co.uk/wp-content/uploads/home-tree.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnln4X6Wha8vlaJMTkL3KEK2_v3Hxov3RqLJ5EZgJc3LbS47IG",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-XeKxMs9AQOlzv0IxEF3mjc9wkGw0HNMPmCq8Scf9JHZcxqL7hQ"
  ];
  let project = getProjectTemplate(cfg);
  let page1 = getProjectPageTemplate(cfg);
  let page2 = getProjectPageTemplate(cfg);
  let page3 = getProjectPageTemplate(cfg);
  let page4 = getProjectPageTemplate(cfg);

  let img1 = getEmptyObject({
    type: "image",
    width: 343.16999999999996,
    height: 921.4480733944953,
    left: 0,
    orientation: "north",
    top: 0,
    src:
      "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&h=350"
  });

  let img3 = getEmptyObject({
    type: "image",
    width: Math.random() * 500,
    height: Math.random() * 500,
    left: Math.random() * 500,
    top: Math.random() * 500,
    orientation: "north",
    src: defaultImages[0]
  });
  let img4 = getEmptyObject({
    type: "image",
    width: Math.random() * 500,
    height: Math.random() * 500,
    left: Math.random() * 500,
    top: Math.random() * 500,
    orientation: "north",
    src: defaultImages[parseInt(Math.random() * defaultImages.length)]
  });
  let img5 = getEmptyObject({
    type: "image",
    width: Math.random() * 500,
    height: Math.random() * 500,
    left: Math.random() * 500,
    orientation: "north",
    top: Math.random() * 500,
    src: defaultImages[4]
  });

  let text6 = getEmptyObject({
    type: "textbox",
    width: 450,
    height: 70,
    left: 0,
    top: 0,
    text: "Enter text here asd sadd",
    fontFamily: "Roboto",
    fontSize: 50,
    fill: "red"
  });
  let text1 = getEmptyObject({
    type: "textflow",
    width: 400,
    height: 100,
    left: 0,
    top: 0,
    text: "Enter text here",
    fontFamily: "Roboto",
    fontSize: 50,
    fill: "red"
  });

  let text9 = getEmptyObject({
    type: "textbox",
    width: 400,
    height: 400,
    left: 100,
    top: 100,
    fontSize: 14,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    text: "asdsad ad",
    fill: "red"
  });
  let text2 = getEmptyObject({
    type: "textflow",
    width: 200,
    height: 200,
    left: 100,
    top: 200,
    text: "Enter text number 2 here",
    fontFamily: "Roboto",
    fill: "red"
  });
  let text3 = getEmptyObject({
    type: "textflow",
    width: 200,
    height: 200,
    left: 300,
    top: 300,
    text: "Enter text number 2 here",
    fontFamily: "Roboto",
    fill: "red"
  });
  let text4 = getEmptyObject({
    type: "textflow",
    width: 220,
    height: 200,
    left: 400,
    top: 400,
    text: "Enter text number 2 here",
    fontFamily: "Roboto",
    fill: "red"
  });
  let text5 = getEmptyObject({
    id: "14adb525-49bc-4da4-b497-922a6aebbb3a",
    type: "textflow",
    width: 210,
    height: 200,
    left: 500,
    angle: 45,
    top: 500,
    text: "Enter text number 2 here",
    fontFamily: "Roboto",
    fill: "red"
  });
  let text7 = getEmptyObject({
    type: "textflow",
    width: 210,
    height: 200,
    left: 700,
    top: 70,
    text: "Enter text number 2 here",
    fontFamily: "Roboto",
    fill: "red"
  });

  const answers = require("../../workspaces/designer/answers.svg");

  let graphics = getEmptyObject({
    type: "graphics",
    width: Math.random() * 500,
    height: 400,
    left: 150,
    top: 200,
    src: answers
  });

  page1 = {
    ...page1,
    id: "page_1",
    //objectsIds: [text1.id, text2.id]
    objectsIds: []
  };

  page2 = {
    ...page2,
    id: "page_2",
    //objectsIds: [text3.id, text4.id]
    objectsIds: []
  };

  page3 = {
    ...page3,
    id: "page_3",
    //objectsIds: [img1.id, text5.id, text6.id, text9.id]
    objectsIds: [img1.id]
  };

  page4 = {
    ...page4,
    id: "page_4",
    //objectsIds: [text7.id]
    objectsIds: [text9.id, graphics.id]
  };

  return {
    ...project,
    pages: {
      [page1.id]: page1,
      [page2.id]: page2,
      [page3.id]: page3,
      [page4.id]: page4
    },
    objects: {
      // [text1.id]: text1,
      // [text2.id]: text2,
      // [text3.id]: text3,
      // [text4.id]: text4,
      // [text5.id]: text5,
      // [text6.id]: text6,
      // [text7.id]: text7,
      [text9.id]: text9,
      [img1.id]: img1,
      [graphics.id]: graphics
    },
    pagesOrder: [...project.pagesOrder, page2.id, page3.id, page4.id, page1.id],
    activePage: page3.id,
    selectedPage: page3.id, // designer
    activeGroup: "group_3" //designer
  };
};

/**
 *
 * @param cfg
 * @returns {{id: *, width: (*|number), height: (*|number), objectsIds: Array, background: {type: string}}}
 */
const getEmptyPage = cfg => {
  return getProjectPageTemplate(cfg);
};

const getEmptyObject = cfg => {
  let object = {
    id: cfg.id || uuidv4(),
    type: cfg.type || false,
    width: parseFloat(cfg.width.toFixed(2)) || 500,
    height: parseFloat(cfg.height.toFixed(2)) || 500,
    left: parseFloat(cfg.left.toFixed(2)),
    top: parseFloat(cfg.top.toFixed(2)),
    editable: cfg.editable || 1,
    value: cfg.value || "default value",
    resizable: cfg.resizable || 1,
    rotatable: cfg.rotatable || 1,
    movable: cfg.movable || 1,
    rotateAngle: cfg.rotateAngle || 0,
    ispSnap: cfg.ispSnap || 1,
    orientation: cfg.orientation || "north",
    rotate: cfg.rotate || 0,
    angle: cfg.angle || 0,
    dragging: 0,
    rotating: 0,
    resizing: 0
  };

  if (cfg && cfg.type) {
    switch (cfg.type) {
      case "image":
        return {
          ...object,
          src: cfg.src,
          cropH: 0,
          cropX: 538,
          cropY: 0,
          cropW: 0,
          cropH: 0,
          ratio: 1,
          brightness: 0,
          leftSlider: 0,
          contrast: 0,
          filter: "",
          imageWidth: 0,
          imageHeight: 0
        };
      case "graphics":
        return {
          ...object,
          src:
            cfg.src ||
            "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg"
        };

      case "activeSelection":
        return { ...object, type: cfg.type, left: cfg.left, top: cfg.top };
      case "group":
        return {
          ...object,
          type: cfg.type,
          width: cfg.width || 500,
          height: cfg.height || 500,
          left: cfg.left || 500,
          top: cfg.top || 500,
          _objectsIds: cfg._objectsIds || []
        };
        break;
      case "text":
      case "textflow":
      case "textbox":
        return {
          ...object,
          textAlign: cfg.textAlign || "left",
          vAlign: cfg.vAlign || "top",
          fontSize: cfg.fontSize || 12,
          bold: cfg.bold || false,
          underline: cfg.underline || false,
          italic: cfg.italic || false,
          fontFamily: cfg.fontFamily || false,
          text: cfg.text || "",
          defaultFontZise: cfg.fontSize || 12,
          useDefaultFontSize: cfg.useDefaultFontSize || true
        };
        break;
      default:
        return { ...object };
        break;
    }
  }
};

const getEmptyUI = cfg => {
  return {
    colors: {},
    fonts: {},
    fontMetrics: {},
    workArea: {
      zoom: 1,
      scale: 1,
      pageOffset: {
        x: 0,
        y: 0
      },
      offsetCanvasContainer: {
        x: 0,
        y: 0
      },
      canvas: {
        workingWidth: 0,
        workingHeight: 0
      }
    },
    permissions: getUIPermissionsTemplate(cfg)
  };
};

const getRandomUI = cfg => {
  const ui = getEmptyUI(cfg);
  const color1 = getEmptyColor({ id: 1, label: "white", htmlRGB: "#fff" });
  const color2 = getEmptyColor({ id: 2, label: "red", htmlRGB: "#f00" });
  const font1 = getEmptyFont({ label: "Helvetica", id: 1 });
  const font2 = getEmptyFont({ label: "Arial", id: 2 });

  return {
    ...ui,
    colors: {
      ...ui.colors,
      [color1.id]: color1,
      [color2.id]: color2
    },
    fonts: {
      ...ui.fonts,
      [font1.id]: font1,
      [font2.id]: font2
    }
  };
};

const getEmptyVariables = cfg => {
  return [
    {
      name: "FullName",
      display_name: "Full Name",
      prefix: "",
      sufix: "",
      value: "Marius Turcu"
    }
  ];
};

const getDGProject = cfg => {
  let project = getProjectTemplate(cfg);
  let page1 = getProjectPageTemplate(pathOr({}, ["defaultPage"], cfg));
  let page2 = getProjectPageTemplate(pathOr({}, ["defaultPage"], cfg));
  let page3 = getProjectPageTemplate(pathOr({}, ["defaultPage"], cfg));
  let page4 = getProjectPageTemplate(pathOr({}, ["defaultPage"], cfg));

  const page_1_bg = require("../../workspaces/designAndGo/svg/page1.svg");
  const page_2_blue_bg = require("../../workspaces/designAndGo/svg/page_2_blue.svg");

  let bg1 = getEmptyObject({
    type: "graphics",
    width: 500,
    height: 733,
    left: 0,
    top: 0,
    src: config.baseUrl + config.publicPath + page_1_bg
  });
  let bg2 = getEmptyObject({
    type: "graphics",
    width: 500,
    height: 663,
    left: 0,
    top: 0,
    src: config.baseUrl + config.publicPath + page_2_blue_bg
  });

  let page1JamName = getEmptyObject({
    type: "textbox",
    width: 300,
    height: 50,
    left: 100,
    top: 230,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]jarName[/%]",
    text: "[%]jarName[/%]"
  });

  let page1JamType = getEmptyObject({
    type: "textbox",
    width: 300,
    height: 50,
    left: 100,
    top: 300,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]jarType[/%]",
    text: "[%]jarType[/%]"
  });

  let page1TagLine1 = getEmptyObject({
    type: "textbox",
    width: 400,
    height: 50,
    left: 50,
    top: 400,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]tagLine1[/%]",
    text: "[%]tagLine1[/%]"
  });

  let page1TagLine2 = getEmptyObject({
    type: "textbox",
    width: 400,
    height: 50,
    left: 50,
    top: 460,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]tagLine2[/%]",
    text: "[%]tagLine2[/%]"
  });

  let page1BatchDate = getEmptyObject({
    type: "textbox",
    width: 200,
    height: 30,
    left: 150,
    top: 520,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]batchDate[/%]",
    text: "[%]batchDate[/%]"
  });

  let page2JamName = getEmptyObject({
    type: "textbox",
    width: 200,
    height: 50,
    left: 150,
    top: 170,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]jarName[/%]",
    text: "[%]jarName[/%]"
  });

  let page2JamType = getEmptyObject({
    type: "textbox",
    width: 270,
    height: 50,
    left: 115,
    top: 230,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]jarType[/%]",
    text: "[%]jarType[/%]"
  });

  let page2TagLine1 = getEmptyObject({
    type: "textbox",
    width: 300,
    height: 50,
    left: 100,
    top: 320,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]tagLine1[/%]",
    text: "[%]tagLine1[/%]"
  });

  let page2TagLine2 = getEmptyObject({
    type: "textbox",
    width: 300,
    height: 50,
    left: 100,
    top: 380,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]tagLine2[/%]",
    text: "[%]tagLine2[/%]"
  });

  let page2BatchDate = getEmptyObject({
    type: "textbox",
    width: 100,
    height: 30,
    left: 200,
    top: 440,
    fontSize: 30,
    defaultFontSize: 30,
    bold: false,
    italic: false,
    fontFamily: "Roboto",
    textAlign: "center",
    vAlign: "middle",
    value: "[%]batchDate[/%]",
    text: "[%]batchDate[/%]"
  });

  page1 = {
    ...page1,
    id: "page_1",
    height: 733,
    objectsIds: [
      ...page1.objectsIds,
      bg1.id,
      page1JamName.id,
      page1JamType.id,
      page1TagLine1.id,
      page1TagLine2.id,
      page1BatchDate.id
    ]
  };

  page2 = {
    ...page2,
    id: "page_2",
    height: 663,
    objectsIds: [
      ...page2.objectsIds,
      bg2.id,
      page2JamName.id,
      page2JamType.id,
      page2TagLine1.id,
      page2TagLine2.id,
      page2BatchDate.id
    ]
  };

  return {
    ...project,
    pages: {
      [page1.id]: page1,
      [page2.id]: page2,
      [page3.id]: page3,
      [page4.id]: page4
    },
    objects: {
      [bg1.id]: bg1,
      [bg2.id]: bg2,
      [page1JamName.id]: page1JamName,
      [page1JamType.id]: page1JamType,
      [page1TagLine1.id]: page1TagLine1,
      [page1TagLine2.id]: page1TagLine2,
      [page1BatchDate.id]: page1BatchDate,
      [page2JamName.id]: page2JamName,
      [page2JamType.id]: page2JamType,
      [page2TagLine1.id]: page2TagLine1,
      [page2TagLine2.id]: page2TagLine2,
      [page2BatchDate.id]: page2BatchDate
    },
    pagesOrder: [...project.pagesOrder, page1.id, page2.id],
    activePage: page1.id
  };
};

const getDGAlternateLayoutPages = cfg => {
  let page1 = getProjectPageTemplate(pathOr({}, ["defaultPage"], cfg));

  return {
    [page1.id]: page1
  };
};

const ProjectUtils = {
  getEmptyProject,
  getRandomProject,
  getEmptyPage,
  getEmptyObject,
  getEmptyUI,
  getEmptyVariables,
  getRandomUI,
  getEmptyColor,
  getEmptyFont,
  getDGProject,
  getDGAlternateLayoutPages
};

module.exports = ProjectUtils;
