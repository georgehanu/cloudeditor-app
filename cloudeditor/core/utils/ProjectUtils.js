const uuidv4 = require("uuid/v4");
const { merge, mergeAll, pathOr, mergeDeepRight, forEach } = require("ramda");
const randomColor = require("randomColor");
const axios = require("axios");
const ConfigUtils = require("./ConfigUtils");
const getObjectColorTemplateFill = cfg => {
  return merge(
    {
      colorSpace: "DeviceRGB",
      htmlRGB: null,
      RGB: "0 0 0",
      CMYK: "0 0 0 1",
      separation: null,
      separationColorSpace: null,
      separationColor: null
    },
    cfg || {}
  );
};
const getObjectColorTemplate = cfg => {
  return merge(
    {
      colorSpace: "DeviceRGB",
      htmlRGB: null,
      RGB: null,
      CMYK: null,
      separation: null,
      separationColorSpace: null,
      separationColor: null,
      new: false
    },
    cfg || {}
  );
};
const getEmptyLayoutTemplateConfig = cfg => {
  return merge(
    {
      duplicateChecked: false,
      isDefaultPoptext: {
        options: [{ value: "1", label: "Yes" }, { value: "no", label: "No" }],
        selectedOption: { value: "1", label: "Yes" },
        title: "Project is Default"
      },
      projectPagePoptext: {
        options: [],
        selectedOption: { value: "", label: "" },
        title: "Project Page"
      },
      projectCategoryPoptext: {
        options: [],
        selectedOption: { value: "", label: "" },
        title: "Project Category"
      },
      projectStatusPoptext: {
        options: [
          { value: "1", label: "Active" },
          { value: "0", label: "Inctive" }
        ],
        selectedOption: { value: "Active", label: "Active" },
        title: "Project Status"
      },
      projectStoreViewPopText: {
        options: [],
        selectedOption: [],
        title: "Project Store Views"
      },
      projectTitle: "",
      projectDescription: "",
      projectOrder: "",
      showAlert: false,
      saText: "",
      projectIcon: null,
      projectIconSrc: null,
      loading: false
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
    table,
    pdf,
    qr,
    section,
    footer,
    header,
    tinymceTable,
    ...custom
  } = cfg || {};
  const generalCfg = merge(
    {
      id: null,
      type: "none",
      subType: "none", //specifies what is the real type of the block(image, pdf, qr, )
      editable: 1, //user can edit a block
      deletable: 1, //user can delete a block
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
      borderWidth: 0,
      renderId: uuidv4()
    },
    general || {}
  );

  const imageCfg = merge(
    {
      type: "image",
      subType: "image",
      alternateZoom: 0,
      backgroundblock: 0,
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
      workingWidth: 0,
      workingHeight: 0,
      brightness: 0,
      imageWidth: 0,
      imageHeight: 0,
      ratioWidth: 1,
      ratioHeight: 1,
      missingImage: false,
      flip: ""
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
      textAlign: "center",
      bold: 0,
      charSpacing: 0,
      circleText: 0,
      fillColor: getObjectColorTemplateFill((text && text.fillColor) || {}),
      bgColor: getObjectColorTemplate((text && text.bgColor) || {}),
      borderColor: getObjectColorTemplate((text && text.borderColor) || {}),
      deviationX: 0,
      deviationY: 0,
      fontId: 1,
      fontSize: 14,
      italic: 0,
      lineHeightN: 120,
      lineHeightP: false,
      maxLength: 0,
      prefix: "",
      sufix: "",
      type: "text",
      underline: 0,
      vAlign: "middle",
      wordSpacing: "normal",
      fontFamily: "",
      prefix: "",
      value: "Edit Text Here",
      firstlinedist: "ascender",
      lastlinedist: 0
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
      objectsIds: [],
      movable: 0,
      resizable: 0,
      rotatable: 0,
      rotateAngle: 0
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

  const tinymceTableCfg = merge(
    {
      type: "tinymceTable",
      subType: "tinymceTable",
      tableContent: ""
    },
    tinymceTable || {}
  );

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
    tinymceTableCfg,
    ...customCfg
  };
};

const getDocumentDefaults = cfg => {
  const defaults = merge(
    {
      displayOnePage: false,
      facingPages: true,
      singleFirstLastPage: true,
      groupSize: 2,
      includeBoxes: true,
      includeMagnetic: true,
      showTrimbox: false,
      allowSafeCut: true,
      allowSnapBlocks: false,
      isCustom: false,
      allowLayoutColumns: false,
      predefinedGroups: false, //[2,2]or false
      headerEditor: false, //[2,2]or false
      backendEditor: false, //[2,2]or false
      footerEditor: false, //[2,2]or false
      groups: {
        group_1: ["page_1"],
        group_3: ["page_4", "page_2", "page_3"]
      },
      header: {
        enabled: true,
        mode: "read", // (read, edit)
        activeOn: "all", //(all inner)
        display: "before", // (before, after)
        mirrored: true,
        height: 12,
        initialHeight: 12,
        objectsIds: []
      },
      footer: {
        enabled: true,
        mode: "read", // (read, edit)
        activeOn: "inner", //(all inner)
        display: "before", // (before, after),
        mirrored: false,
        height: 10,
        initialHeight: 10,
        objectsIds: []
      }
    },
    cfg || {}
  );
  return defaults;
};

const getPagesDefaults = cfg => {
  const defaults = mergeDeepRight(
    {
      width: 1080,
      height: 1080,
      safeCut: 0,
      columnsNo: 0,
      columnSpacing: 0,
      blockActions: {
        allowAddImage: 1,
        allowAddText: 1,
        allowDeleteBlock: 1
      },
      allowDeletePage: 1,
      boxes: {
        trimbox: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        bleed: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      label: "Page %no%",
      shortLabel: "%no%",
      countInPagination: true,
      lockPosition: false,
      selectable: true,
      allowDeletePage: true,
      objectsIds: [],
      background: {
        type: "none",
        color: {
          colorSpace: "DeviceRGB",
          htmlRGB: "255,255,255",
          RGB: "1,1,1",
          CMYK: null,
          separation: null,
          separationColorSpace: null,
          separationColor: null
        },
        image_src: false,
        path: false
      }
    },
    cfg || {}
  );
  return defaults;
};
const getEmptyBackground = cfg => {
  return mergeDeepRight({}, cfg);
};
const getProjectTemplate = cfg => {
  const project = mergeDeepRight(
    {
      title: "Empty Project",
      description: "Project description",
      projectId: null,
      save: { loading: false, errorMessage: null },
      load: {
        loading: false,
        errorMessage: null,
        loadedProjects: [],
        loadingDelete: false,
        errorMessageDelete: null,
        loadingProject: false,
        errorMessageProject: null
      },
      pages: {},
      activePage: "page_0",
      pagesOrder: [],
      objects: {},
      globalObjectsIds: { before: [], after: [] },
      selectedObjectsIds: [],
      activeSelection: null,
      configs: {
        document: getDocumentDefaults({}),
        pages: getPagesDefaults({}),
        objects: getObjectsDefaults({})
      },
      ui: getEmptyUI(cfg.ui)
    },
    cfg || {}
  );
  return project;
};

const getProjectPageTemplate = cfg => {
  const background = {
    type: "color",
    color: randomColor()
  };
  const boxes = {
    trimbox: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };

  return {
    id: pathOr(uuidv4(), ["id"], cfg),
    label: pathOr("Page %no%", ["label"], cfg),
    shortLabel: pathOr("%no%", ["label"], cfg),
    countInPagination: pathOr(true, ["countInPagination"], cfg),
    lockPosition: pathOr(false, ["lockPosition"], cfg),
    selectable: pathOr(true, ["selectable"], cfg),
    width: pathOr(1080, ["width"], cfg),
    height: pathOr(1080, ["height"], cfg),
    objectsIds: pathOr([], ["objectsIds"], cfg),
    background: pathOr(background, ["background"], cfg),
    boxes: pathOr(boxes, ["boxes"], cfg)
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
      type: ["COLOR_TAB_FG", "COLOR_TAB_BG", "COLOR_TAB_BORDER_COLOR"],
      new: false
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
const getEmptySelection = cfg => {
  return cfg;
};

const getUIPermissionsTemplate = cfg => {
  return merge(
    {
      moveBlocks: 1,
      rotateBlocks: 1,
      resizeBlocks: 1,
      snapBlocks: 1,
      alertOnExit: 0
    },
    cfg || {}
  );
};

/**
 *
 * @param cfg
 * @returns {{title: (*|string), pages: {}, pagesOrder: Array, activePage: null, objects: {}, selectedObjectsIds: Array}}
 */
const getEmptyProjectMerged = cfg => {
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
const getEmptyProject = cfg => {
  const project = getProjectTemplate(cfg);

  const header = getEmptyObject({
    id: "header",
    type: "section",
    subType: "header",
    objectsIds: []
  });

  const footer = getEmptyObject({
    id: "footer",
    type: "section",
    subType: "footer",
    objectsIds: []
  });

  //project.objects[table.id] = table;
  //project.pages["page_1"]["objectsIds"] = [table.id];

  if (!project.configs.document.header.objectsIds.length) {
    project.objects[header.id] = header;
    project.objects[footer.id] = footer;
    project.configs.document.header.objectsIds = [header.id];
    project.configs.document.footer.objectsIds = [footer.id];
  }
  return project;
};

const getRandomProject1 = cfg => {
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
    fontFamily: "Helvetica",
    fontSize: 12,
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
    text: "Header text here",
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
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

const getRandomProject = cfg => {
  let project = getEmptyProject();
  let i;
  const textHeader = getEmptyObject({
    id: "textHeader",
    type: "text",
    subType: "textflow",
    width: 100,
    height: 100,
    left: 0,
    top: 0,
    value: "Header text here",
    fontFamily: "Helvetica",
    fontSize: 20,
    fill: "red"
  });
  const textFooter = getEmptyObject({
    id: "textFooter",
    type: "text",
    subType: "textflow",
    width: 100,
    height: 100,
    left: 0,
    top: 0,
    value: "Footer text here",
    fontFamily: "Helvetica",
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
  for (i = 0; i < 5; i++) {
    let page = getEmptyPage();
    let j;
    for (j = 0; j < 5; j++) {
      let object = getEmptyObject({
        type: "text",
        subType: "textflow",
        width: 100 + Math.random() * 500,
        height: 100 + Math.random() * 500,
        left: Math.random() * 300,
        top: Math.random() * 300,
        value: "Enter text here",
        fontFamily: "Helvetica",
        fontSize: 5 + Math.random() * 50
      });
      page.objectsIds.push(object.id);
      project.objects[object.id] = object;
    }
    project.pages[page.id] = page;
    project.pagesOrder.push(page.id);
    project.activePage = page.id;
    project.objects[header.id] = header;
    project.objects[footer.id] = footer;
    project.objects[textHeader.id] = textHeader;
    project.objects[textFooter.id] = textFooter;
  }

  project.configs.document.header.objectsIds = [header.id];
  project.configs.document.footer.objectsIds = [footer.id];
  return project;
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
  let object = merge(
    {
      id: uuidv4()
    },
    cfg || {}
  );

  return object;
};

const getEmptyUI = cfg => {
  return mergeDeepRight(
    {
      rerenderId: null,
      fonts: {},
      fontMetrics: {},
      colors: {},
      lastUsedColors: [],
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
      permissions: getUIPermissionsTemplate(cfg.permissions)
    },
    cfg || {}
  );
};
const getEmptyAuth = cfg => {
  return mergeDeepRight(
    {
      loggedIn: false,
      userName: null,
      loading: false,
      errorMessage: null
    },
    cfg || {}
  );
};
const getEmptyAssets = cfg => {
  return mergeDeepRight(
    {
      layout: {
        loading: false,
        items: []
      },
      pdf: {
        loading: false,
        loadingDelete: false,
        loadingFiles: 0,
        uploadedFiles: []
      },
      image: {
        loading: false,
        loadingDelete: false,
        loadingFiles: 0,
        uploadedFiles: []
      },
      graphics: {
        loading: false,
        items: []
      },
      layout: {
        loading: false,
        items: [],
        categories: []
      },
      footerheader: {
        loading: false,
        items: []
      }
    },
    cfg || {}
  );
};

const getObjectHeaderFooterIds = (objectsIds, objects, returnData) => {
  forEach(function(id) {
    if (objects[id].hasOwnProperty("objectsIds"))
      getObjectHeaderFooterIds(objects[id]["objectsIds"], objects, returnData);
    returnData.push(id);
  }, objectsIds);
  return returnData;
};
const getEmptyProductInformation = cfg => {
  return mergeDeepRight(
    {
      name: "",
      productId: null,
      templateId: null,
      qty: 1,
      productOptions: {},
      total_price: false
    },
    cfg || {}
  );
};
const getPrice = (serverData, callbackSuccess, callbackFailure, obs) => {
  axios
    .post(ATTACH_URL, serverData)
    .then(resp => resp.data)
    .then(data => {
      if (data.success) {
        callbackSuccess(data);
      } else {
        callbackFailure(data);
      }
      obs.complete();
    });
};
const getRandomUI = cfg => {
  const ui = getEmptyUI(cfg);
  const color1 = getEmptyColor({ id: 1, label: "white", htmlRGB: "#fff" });
  const color2 = getEmptyColor({ id: 2, label: "red", htmlRGB: "#f00" });
  const font1 = getEmptyFont({ label: "Helve3333tica", id: 1 });
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
  getEmptySelection,
  getFontMetricTemplate,
  getEmptyProductInformation,
  getEmptyAssets,
  getEmptyAuth,
  getEmptyLayoutTemplateConfig,
  getObjectHeaderFooterIds
};

module.exports = ProjectUtils;
