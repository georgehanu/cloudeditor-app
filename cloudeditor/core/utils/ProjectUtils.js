const uuidv4 = require("uuid/v4");
const { merge, mergeAll, pathOr, mergeDeepRight } = require("ramda");
const randomColor = require("randomColor");

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
      displayOnePage: true,
      facingPages: true,
      singleFirstLastPage: true,
      groupSize: 2,
      includeBoxes: true,
      includeMagentic: false,
      showTrimbox: false,
      allowSafeCut: true,
      allowSnapBlocks: false,
      allowLayoutColumns: false,
      predefinedGroups: false, //[2,2]or false
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
        objectsIds: []
      },
      footer: {
        enabled: true,
        mode: "read", // (read, edit)
        activeOn: "inner", //(all inner)
        display: "before", // (before, after),
        mirrored: false,
        height: 10,
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

  const textHeader = getEmptyObject({
    id: "textHeader",
    type: "text",
    subType: "textflow",
    width: 100,
    height: 10,
    left: 17.308244475806433,
    top: 10,
    isPageNrBlock: 1,
    value: "",
    fontFamily: "Helvetica",
    fontSize: 12
  });
  const logoHeader = getEmptyObject({
    id: "logoHeader",
    type: "image",
    subType: "image",
    width: 35.819147865000915,
    height: 8.487903225806452,
    left: 526.1277667114695,
    top: 10,
    image_src:
      "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs//media/personalization/local_files/cw_logo.png",
    imagePath: "local_files/cw_logo.png",
    imageWidth: 237,
    imageHeight: 121,
    cropX: 0,
    cropY: 29,
    cropW: 232,
    cropH: 55,
    leftSlider: 0,
    alternateZoom: 0
  });
  const textFooter = getEmptyObject({
    id: "textFooter",
    type: "text",
    subType: "textflow",
    width: 100,
    height: 10,
    left: 17.308244475806433,
    top: 5,
    value: "Footer text",
    fontFamily: "Helvetica",
    fontSize: 12,
    fill: "red"
  });

  const header = getEmptyObject({
    id: "header",
    type: "section",
    subType: "header",
    objectsIds: [textHeader.id, logoHeader.id]
  });

  const footer = getEmptyObject({
    id: "footer",
    type: "section",
    subType: "footer",
    objectsIds: [textFooter.id]
  });

  const table = getEmptyObject({
    id: "table",
    type: "tinymceTable",
    subType: "tinymceTable",
    // width: 790.82688,
    // height: 545,
    width: null,
    height: null,
    left: 16.55 + 8.50394,
    top: 16.55 + 8.50394,
    tableContent: `<table style="width:auto; height: auto; border-spacing: 0px; color: black;">
<tbody>
  <tr>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;"></td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;"></td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;"></td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;"></td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          P
      </td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          W
      </td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          D
      </td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          L
      </td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          G
      </td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          D
      </td>
      <td style="padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; background-color: white;">
          P
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(0, 46, 95); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          1.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/EcfYhoKUkDSKQD0FjqosyLgAq1UCmkjWiap2B36K 1x,
                    https://cdn.fupa.rocks/club/svg/EcfYhoKUkDSKQD0FjqosyLgAq1UCmkjWiap2B36K 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/EcfYhoKUkDSKQD0FjqosyLgAq1UCmkjWiap2B36K"
                              title="Borussia Dortmund" alt="Borussia Dortmund" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Borussia Dortmund</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          11
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          0
      </td>
      <td width="40px" style="background-color:  rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          39:14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          25
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>36</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(20, 84, 133); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          2.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/HcuHdKI57sCX9RZa4KtVRvTMrE02qwV04cSt7CSc 1x,
                    https://cdn.fupa.rocks/club/svg/HcuHdKI57sCX9RZa4KtVRvTMrE02qwV04cSt7CSc 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/HcuHdKI57sCX9RZa4KtVRvTMrE02qwV04cSt7CSc"
                              title="Borussia Mönchengladbach" alt="Borussia Mönchengladbach" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Borussia Mönchengladbach</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          9
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          33:16
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          17
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>29</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(20, 84, 133); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          3.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/ruCXTmrflAB9BiwYkv2NZOfzPzfvT9vv7ntHZqVM 1x,
                    https://cdn.fupa.rocks/club/svg/ruCXTmrflAB9BiwYkv2NZOfzPzfvT9vv7ntHZqVM 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/ruCXTmrflAB9BiwYkv2NZOfzPzfvT9vv7ntHZqVM"
                              title="FC Bayern München" alt="FC Bayern München" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>FC Bayern München</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          8
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          28:18
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          10
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>27</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(20, 84, 133); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          4.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/png/25x25/X0ooU4MvYX1dYNRLPa3y7tJ61To66Ok8UvAwnpHS 1x,
                    https://cdn.fupa.rocks/club/png/25x25/X0ooU4MvYX1dYNRLPa3y7tJ61To66Ok8UvAwnpHS 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/png/25x25/X0ooU4MvYX1dYNRLPa3y7tJ61To66Ok8UvAwnpHS"
                              title="RB Leipzig" alt="RB Leipzig" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>RB Leipzig</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          7
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          24:13
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          11
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>25</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(89, 135, 184); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          5.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/yDnK4MV1seQOKUzWz7gu9gAFwvbUUPNoB5cMBgaz 1x,
                    https://cdn.fupa.rocks/club/svg/yDnK4MV1seQOKUzWz7gu9gAFwvbUUPNoB5cMBgaz 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/yDnK4MV1seQOKUzWz7gu9gAFwvbUUPNoB5cMBgaz"
                              title="Eintracht Frankfurt" alt="Eintracht Frankfurt" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Eintracht Frankfurt</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          7
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          30:17
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          13
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>23</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(89, 135, 184); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          6.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/3V1KQ4f7UHaG9tA75CpCpUgQMOfWp9wmSn1MhMsL 1x,
                    https://cdn.fupa.rocks/club/svg/3V1KQ4f7UHaG9tA75CpCpUgQMOfWp9wmSn1MhMsL 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/3V1KQ4f7UHaG9tA75CpCpUgQMOfWp9wmSn1MhMsL"
                              title="Hertha BSC" alt="Hertha BSC" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Hertha BSC</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          6
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          22:20
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>23</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          7.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/NtlN6SjOPiusLHpuikpHg2uv5W5XuV2W9P4EXl0K 1x,
                    https://cdn.fupa.rocks/club/svg/NtlN6SjOPiusLHpuikpHg2uv5W5XuV2W9P4EXl0K 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/NtlN6SjOPiusLHpuikpHg2uv5W5XuV2W9P4EXl0K"
                              title="TSG 1899 Hoffenheim" alt="TSG 1899 Hoffenheim" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>TSG 1899 Hoffenheim</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          6
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          30:21
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          9
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>22</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          8.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/gnmIdkGSoYYVejdSwx3MLTQVIFR6UwaoNMjDFEx9 1x,
                    https://cdn.fupa.rocks/club/svg/gnmIdkGSoYYVejdSwx3MLTQVIFR6UwaoNMjDFEx9 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/gnmIdkGSoYYVejdSwx3MLTQVIFR6UwaoNMjDFEx9"
                              title="SV Werder Bpxen" alt="SV Werder Bpxen" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>SV Werder Bpxen</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          6
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          24:23
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          1
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>21</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          9.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/S9xLnuR47LnX27mLG1hlUdUwLBmk1zGUcUiD7guo 1x,
                    https://cdn.fupa.rocks/club/svg/S9xLnuR47LnX27mLG1hlUdUwLBmk1zGUcUiD7guo 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/S9xLnuR47LnX27mLG1hlUdUwLBmk1zGUcUiD7guo"
                              title="VfL Wolfsburg" alt="VfL Wolfsburg" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>VfL Wolfsburg</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          20:20
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          0
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>19</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          10.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/zRtdyWQqfHWTws0IX5YNAyMoTaJXPJkvb0jAIuIO 1x,
                    https://cdn.fupa.rocks/club/svg/zRtdyWQqfHWTws0IX5YNAyMoTaJXPJkvb0jAIuIO 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/zRtdyWQqfHWTws0IX5YNAyMoTaJXPJkvb0jAIuIO"
                              title="FSV Mainz 05" alt="FSV Mainz 05" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>FSV Mainz 05</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          13:15
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -2
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>19</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          11.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/q3HOpfnwb0hNh9ubGx9etFsTHQTDlHlLnRqpHBIx 1x,
                    https://cdn.fupa.rocks/club/svg/q3HOpfnwb0hNh9ubGx9etFsTHQTDlHlLnRqpHBIx 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/q3HOpfnwb0hNh9ubGx9etFsTHQTDlHlLnRqpHBIx"
                              title="Bayer 04 Leverkusen" alt="Bayer 04 Leverkusen" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Bayer 04 Leverkusen</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          6
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          20:25
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -5
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>18</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          12.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/oZvPcte7NcQwUA3mpLjox5CVc6t4vlAjkQ8OnJJf 1x,
                    https://cdn.fupa.rocks/club/svg/oZvPcte7NcQwUA3mpLjox5CVc6t4vlAjkQ8OnJJf 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/oZvPcte7NcQwUA3mpLjox5CVc6t4vlAjkQ8OnJJf"
                              title="SC Freiburg" alt="SC Freiburg" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>SC Freiburg</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          19:22
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -3
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>17</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          13.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/NxIG4Pk95zvJUJEXNPgQURd0yextDtuyN62noEh1 1x,
                    https://cdn.fupa.rocks/club/svg/NxIG4Pk95zvJUJEXNPgQURd0yextDtuyN62noEh1 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/NxIG4Pk95zvJUJEXNPgQURd0yextDtuyN62noEh1"
                              title="FC Schalke 04" alt="FC Schalke 04" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>FC Schalke 04</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          8
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          15:20
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -5
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>14</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          14.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/wXlciSK32bUirWQxRRbPvuOpAR1OUUdqpdW7SVeJ 1x,
                    https://cdn.fupa.rocks/club/svg/wXlciSK32bUirWQxRRbPvuOpAR1OUUdqpdW7SVeJ 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/wXlciSK32bUirWQxRRbPvuOpAR1OUUdqpdW7SVeJ"
                              title="FC Augsburg" alt="FC Augsburg" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>FC Augsburg</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          7
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          20:23
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -3
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>13</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold;">
          15.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/735NqEYHYnLWYeSh0i8dvlFP0BI9naEVRDzoYvnL 1x,
                    https://cdn.fupa.rocks/club/svg/735NqEYHYnLWYeSh0i8dvlFP0BI9naEVRDzoYvnL 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/735NqEYHYnLWYeSh0i8dvlFP0BI9naEVRDzoYvnL"
                              title="1. FC Nürnberg" alt="1. FC Nürnberg" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>1. FC Nürnberg</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          5
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          7
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14:33
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -19
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>11</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(20, 84, 133); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          16.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/b3o1gkIeTGoJPs47rLgxQtDMvlpJk7wkXYHzEcOs 1x,
                    https://cdn.fupa.rocks/club/svg/b3o1gkIeTGoJPs47rLgxQtDMvlpJk7wkXYHzEcOs 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/b3o1gkIeTGoJPs47rLgxQtDMvlpJk7wkXYHzEcOs"
                              title="VfB Stuttgart" alt="VfB Stuttgart" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>VfB Stuttgart</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          9
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          9:29
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -20
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>11</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(0, 46, 95); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          17.
      </td>
      <td width="14px" title="-1" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: rgb(243, 243, 243); padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/PvKZ8dmUm6hFRXJ87ITj4nsBKOuEluHH7vEz6qxt 1x,
                    https://cdn.fupa.rocks/club/svg/PvKZ8dmUm6hFRXJ87ITj4nsBKOuEluHH7vEz6qxt 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/PvKZ8dmUm6hFRXJ87ITj4nsBKOuEluHH7vEz6qxt"
                              title="Hannover 96" alt="Hannover 96" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: rgb(243, 243, 243); padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Hannover 96</a>
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          4
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          8
      </td>
      <td width="40px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          16:29
      </td>
      <td width="18px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -13
      </td>
      <td width="20px" style="background-color: rgb(243, 243, 243); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>10</strong>
      </td>
  </tr>
  <tr>
      <td width="24px" style="background-color: rgb(0, 46, 95); padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px; font-weight: bold; color: white;">
          18.
      </td>
      <td width="14px" title="-1" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <div style="color: rgb(191, 191, 191);"></div>
      </td>
      <td width="30px" style="background-color: white; padding: 1px 2px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <div>
              <a>
                  <div style="position: relative; display: inline-block; vertical-align: middle; text-align: center; overflow: hidden; width: 25px; height: 25px;">
                      <picture style="object-fit: contain; height: inherit; width: inherit;">
                          <source srcset="
                    https://cdn.fupa.rocks/club/svg/uDAkEGyzRuvlsiiTOKf9hYNEs4cabNCAGcyQXfZJ 1x,
                    https://cdn.fupa.rocks/club/svg/uDAkEGyzRuvlsiiTOKf9hYNEs4cabNCAGcyQXfZJ 2x
                  ">
                          <img src="https://cdn.fupa.rocks/club/svg/uDAkEGyzRuvlsiiTOKf9hYNEs4cabNCAGcyQXfZJ"
                              title="Fortuna Düsseldorf" alt="Fortuna Düsseldorf" style="object-fit: contain; height: inherit; width: inherit;"></picture>
                  </div>
              </a>
          </div>
      </td>
      <td width="162px" style="background-color: white; padding: 4px 0px 4px 4px; margin: 0px; border: none; text-align: left; font-size: 12px; line-height: 12px;">
          <a>Fortuna Düsseldorf</a>
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          2
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          3
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          9
      </td>
      <td width="40px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          14:32
      </td>
      <td width="18px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          -18
      </td>
      <td width="20px" style="background-color: white; padding: 4px 0px; margin: 0px; border: none; text-align: center; font-size: 12px; line-height: 12px;">
          <strong>9</strong>
      </td>
  </tr>
</tbody>
</table>`
  });

  project.objects[table.id] = table;
  project.pages["page_1"]["objectsIds"] = [table.id];
  project.objects[header.id] = header;
  project.objects[footer.id] = footer;
  project.objects[textHeader.id] = textHeader;
  project.objects[textFooter.id] = textFooter;
  project.objects[logoHeader.id] = logoHeader;

  project.configs.document.header.objectsIds = [header.id];
  project.configs.document.footer.objectsIds = [footer.id];
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
      }
    },
    cfg || {}
  );
};

const getEmptyProductInformation = cfg => {
  return mergeDeepRight(
    {
      name: "",
      productId: null,
      qty: 1,
      productOptions: {}
    },
    cfg || {}
  );
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
  getEmptyAuth
};

module.exports = ProjectUtils;
