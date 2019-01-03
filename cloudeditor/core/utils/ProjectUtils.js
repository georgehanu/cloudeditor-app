const uuidv4 = require("uuid/v4");
const { merge, mergeAll, pathOr, mergeDeepRight } = require("ramda");
const randomColor = require("randomColor");

const getObjectColorTemplate = cfg => {
  return merge(
    {
      colorSpace: "DeviceRGB",
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
  const {
    general,
    image,
    text,
    textline,
    textflow,
    pdf,
    qr,
    section,
    footer,
    header,
    ...custom
  } = cfg || {};
  const generalCfg = merge(
    {
      id: null,
      type: "none",
      subType: "none", //specifies what is the real type of the block(image, pdf, qr, )
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
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      value: null,
      ispSnap: 0,
      orientation: "north",
      rotate: 0,
      dragging: 0,
      rotating: 0,
      resizing: 0,
      bgColor: getObjectColorTemplate((general && general.bgColor) || {}),
      borderColor: getObjectColorTemplate(
        (general && general.borderColor) || {}
      ),
      borderWidth: 0
    },
    general || {}
  );

  const imageCfg = merge(
    {
      type: "image",
      subType: "image",
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
      filter: "",
      image_src: "",
      cropH: 0,
      cropX: 0,
      cropY: 0,
      cropW: 0,
      ratio: 1,
      brightness: 0,
      imageWidth: 0,
      imageHeight: 0
    },
    image || {}
  );
  const pdfCfg = mergeAll([
    imageCfg,
    {
      subType: "pdf"
    },
    pdf || {}
  ]);

  const qrCfg = mergeAll([
    imageCfg,
    {
      subType: "qr"
    },
    qr || {}
  ]);

  const textCfg = merge(
    {
      alignment: "center",
      bold: 0,
      charSpacing: 0,
      circleText: 0,
      fillColor: getObjectColorTemplate((text && text.fillColor) || {}),
      bgColor: getObjectColorTemplate((text && text.bgColor) || {}),
      borderColor: getObjectColorTemplate((text && text.borderColor) || {}),
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
      type: "text",
      underline: 0,
      vAlignment: "middle",
      wordSpacing: "normal",
      value: "Edit Text Here"
    },
    text || {}
  );

  const textlineCfg = mergeAll([
    textCfg,
    {
      subType: "textline"
    },
    textline || {}
  ]);

  const textflowCfg = mergeAll([
    textCfg,
    {
      subType: "textflow"
    },
    textflow || {}
  ]);

  const sectionCfg = merge(
    {
      type: "section",
      global: false,
      objectsIds: []
    },
    section || {}
  );

  const headerCfg = mergeAll([
    sectionCfg,
    {
      subType: "header",
      mirror: true,
      global: true
    },
    header || {}
  ]);

  const footerCfg = mergeAll([
    sectionCfg,
    {
      subType: "footer",
      mirror: true,
      global: true
    },
    footer || {}
  ]);

  const customCfg = custom || {};

  return {
    generalCfg,
    imageCfg,
    pdfCfg,
    qrCfg,
    textCfg,
    textflowCfg,
    textlineCfg,
    sectionCfg,
    headerCfg,
    footerCfg,
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
      includeMagentic: false,
      showTrimbox: false,
      useMagentic: true,
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
        height: 1080
      },
      tolerance: 40,
      blockActions: {
        allowAddImage: 1,
        allowAddText: 1,
        allowDeleteBlock: 1
      },
      allowDeletePage: 1,
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
    objects: {},
    globalObjectsIds: {
      before: [],
      after: []
    },
    selectedObjectsIds: [],
    activeSelection: null,
    configs: {
      document: getDocumentDefaults(pathOr({}, ["defaults", "document"], cfg)),
      pages: getPagesDefaults(pathOr({}, ["defaults", "pages"], cfg)),
      objects: getObjectsDefaults(pathOr({}, ["defaults", "objects"], cfg))
    },
    colors: {},
    fonts: {}
  };
  return project;
};

const getProjectPageTemplate = cfg => {
  const background = {
    type: "color",
    color: randomColor()
  };
  return {
    id: pathOr(uuidv4(), ["id"], cfg),
    label: pathOr("Page %no%", ["label"], cfg),
    shortLabel: pathOr("%no%", ["label"], cfg),
    countInPagination: pathOr(true, ["countInPagination"], cfg),
    lockPosition: pathOr(true, ["lockPosition"], cfg),
    selectable: pathOr(true, ["selectable"], cfg),
    width: pathOr(1080, ["width"], cfg),
    height: pathOr(1080, ["height"], cfg),
    objectsIds: pathOr([], ["objectsIds"], cfg),
    background: pathOr(background, ["background"], cfg)
  };
};

const getColorTemplate = cfg => {
  return merge(
    {
      id: uuidv4(),
      label: null,
      htmlRGB: null,
      RGB: null,
      CMYK: null,
      separation: null,
      separationColorSpace: null,
      separationColor: null,
      type: ["COLOR_TAB_FG", "COLOR_TAB_BG", "COLOR_TAB_BORDER_COLOR"]
    },
    cfg || {}
  ); //label of the color //html value of the color //pdflib RGB value //pdflib CMYK value // pdflib Separation color value //fallback for separation color //fallback for separation color
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
  let project = getProjectTemplate(cfg);
  let page1 = getProjectPageTemplate(cfg);
  let page2 = getProjectPageTemplate(cfg);
  let page3 = getProjectPageTemplate(cfg);
  let page4 = getProjectPageTemplate(cfg);

  const text1 = getEmptyObject({
    id: "text1",
    type: "text",
    subType: "textflow",
    width: 400,
    height: 100,
    left: 0,
    top: 0,
    value: "Enter text here",
    fontFamily: "Dax",
    fontSize: 50,
    fill: "red"
  });

  const textHeader = getEmptyObject({
    id: "textHeader",
    type: "text",
    subType: "textflow",
    width: 100,
    height: 100,
    left: 500,
    top: 20,
    value: "Header text here",
    fontFamily: "Dax",
    fontSize: 20,
    fill: "red"
  });
  const textFooter = getEmptyObject({
    id: "textFooter",
    type: "text",
    subType: "textflow",
    width: 100,
    height: 100,
    left: 150,
    top: 60,
    value: "Footer text here",
    fontFamily: "Dax",
    fontSize: 20,
    fill: "red"
  });

  const header = getEmptyObject({
    id: "header",
    type: "section",
    subType: "header",
    objectsIds: [textHeader.id],
    height: 200
  });

  const footer = getEmptyObject({
    id: "footer",
    type: "section",
    subType: "footer",
    objectsIds: [textFooter.id],
    height: 200
  });

  page1 = {
    ...page1,
    id: "page_1",
    objectsIds: []
  };

  page2 = {
    ...page2,
    id: "page_2",
    objectsIds: []
  };

  page3 = {
    ...page3,
    id: "page_3",
    objectsIds: [text1.id]
  };

  page4 = {
    ...page4,
    id: "page_4",
    objectsIds: []
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
      [text1.id]: text1,
      [header.id]: header,
      [footer.id]: footer,
      [textHeader.id]: textHeader,
      [textFooter.id]: textFooter
    },
    globalObjectsIds: {
      ...project.globalObjectsIds,
      before: [header.id, footer.id],
      after: []
    },
    pagesOrder: [...project.pagesOrder, page1.id, page2.id, page3.id, page4.id],
    activePage: page3.id
  };
};

/* 
const getRandomProject2 = cfg => {
  let project = getEmptyProject();
  let i;
  for (i = 0; i < 50; i++) {
    let page = getEmptyPage();
    let j;
    for (j = 0; j < 10; j++) {
      let object = getEmptyObject({
        type: "textflow",
        width: 100 + Math.random() * 500,
        height: 100 + Math.random() * 500,
        left: Math.random() * 1000,
        top: Math.random() * 1000,
        text: "Enter text here",
        fontFamily: "Dax",
        fontSize: 5 + Math.random() * 50,
        fill: "red"
      });
      page.objectsIds.push(object.id);
      project.objects[object.id] = object;
    }
    project.pages[page.id] = page;
    project.pagesOrder.push(page.id);
    project.activePage = page.id;
  }
  return project;
}; 
*/

/**
 *
 * @param cfg
 * @returns {{id: *, width: (*|number), height: (*|number), objectsIds: Array, background: {type: string}}}
 */
const getEmptyPage = cfg => {
  return getProjectPageTemplate(cfg);
};

const getEmptyObject = cfg => {
  let object = merge(
    {
      id: uuidv4()
    },
    cfg || {}
  );

  return object;
};

const getEmptyUI = cfg => {
  const color1 = getEmptyColor({ id: 1, label: "white", htmlRGB: "#fff" });
  const color2 = getEmptyColor({ id: 2, label: "red", htmlRGB: "#f00" });
  // const font1 = getEmptyFont({ label: "Helvetica", id: 1 });
  // const font2 = getEmptyFont({ label: "Arial", id: 2 });
  return {
    rerenderId: null,
    fonts: {},
    fontMetrics: {},
    colors: {
      [color1.id]: color1,
      [color2.id]: color2
    },
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

const ProjectUtils = {
  getEmptyProject,
  getRandomProject,
  getEmptyPage,
  getEmptyObject,
  getEmptyUI,
  getRandomUI,
  getEmptyColor,
  getEmptyFont,
  getFontMetricTemplate
};

module.exports = ProjectUtils;
