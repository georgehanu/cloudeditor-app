const uuidv4 = require("uuid/v4");
const { merge, mergeAll, pathOr, mergeDeepRight } = require("ramda");
const randomcolor = require("randomcolor");

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
  const { general, image, text, pdf, qr, ...custom } = cfg || {};
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
      borderWidth: 0
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
      filter: "",
      image_src: ""
    },
    image || {}
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

  const customCfg = custom || {};

  return {
    generalCfg,
    imageCfg,
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
    color: randomcolor()
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
    image_src:
      "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&h=350"
  });

  let img3 = getEmptyObject({
    type: "image",
    width: Math.random() * 500,
    height: Math.random() * 500,
    left: Math.random() * 500,
    top: Math.random() * 500,
    orientation: "north",
    image_src: defaultImages[0]
  });
  let img4 = getEmptyObject({
    type: "image",
    width: Math.random() * 500,
    height: Math.random() * 500,
    left: Math.random() * 500,
    top: Math.random() * 500,
    orientation: "north",
    image_src: defaultImages[parseInt(Math.random() * defaultImages.length)]
  });
  let img5 = getEmptyObject({
    type: "image",
    width: 500,
    height: 1000,
    left: 20,
    orientation: "north",
    top: 20,
    leftSlider: 0,
    image_src:
      "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&h=350"
  });
  let text6 = getEmptyObject({
    type: "textflow",
    width: 123,
    height: 343,
    left: 34,
    orientation: "north",
    fontFamily: "Dax",
    top: 120,
    value: "this is a default value for text"
  });
  let text1 = getEmptyObject({
    type: "textflow",
    width: 400,
    height: 100,
    left: 0,
    top: 0,
    text: "Enter text here",
    fontFamily: "Dax",
    fontSize: 50,
    fill: "red"
  });
  let text2 = getEmptyObject({
    type: "textflow",
    width: 200,
    height: 200,
    left: 100,
    top: 200,
    text: "Enter text number 2 here",
    fontFamily: "Dax",
    fill: "red"
  });
  let text3 = getEmptyObject({
    type: "textflow",
    width: 200,
    height: 200,
    left: 300,
    top: 300,
    text: "Enter text number 2 here",
    fontFamily: "Dax",
    fill: "red"
  });
  let text4 = getEmptyObject({
    type: "textflow",
    width: 220,
    height: 200,
    left: 400,
    top: 400,
    text: "Enter text number 2 here",
    fontFamily: "Dax",
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
    fontFamily: "Dax",
    fill: "red"
  });
  let text7 = getEmptyObject({
    type: "textflow",
    width: 210,
    height: 200,
    left: 700,
    top: 70,
    text: "Enter text number 2 here",
    fontFamily: "Dax",
    fill: "red"
  });
  let table = getEmptyObject({
    type: "tinymce",
    width: 600,
    height: 600,
    left: 20,
    top: 70
  });

  let graphics = getEmptyObject({
    type: "graphics",
    width: Math.random() * 500,
    height: 400,
    left: 150,
    top: 200,
    image_src: "http://localhost:8080/alfa006_top.svg"
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
      [text2.id]: text2,
      [text3.id]: text3,
      [text4.id]: text4,
      [text5.id]: text5,
      [text6.id]: text6,
      [text7.id]: text7,
      [img5.id]: img5
    },
    pagesOrder: [...project.pagesOrder, page2.id, page3.id, page4.id, page1.id],
    activePage: page3.id
  };
};

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
    width: cfg.width || 500,
    height: cfg.height || 500,
    left: cfg.left,
    top: cfg.top,
    editable: cfg.editable || 1,
    value: cfg.value || "default value",
    resizable: cfg.resizable || 1,
    rotatable: cfg.rotatable || 1,
    deletable: cfg.deletable || 1,
    movable: cfg.movable || 1,
    rotateAngle: cfg.rotateAngle || 0,
    ispSnap: cfg.ispSnap || 1,
    orientation: cfg.orientation || "north",
    fontFamily: cfg.fontFamily || "Arial",
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
          image_src: cfg.image_src,
          cropH: cfg.cropH || 0,
          cropX: cfg.cropX || 0,
          workingPercent: 0,
          cropY: cfg.cropY || 0,
          cropW: cfg.cropW || 0,
          cropH: cfg.cropH || 0,
          leftSlider: cfg.leftSlider || 0,
          ratio: 1,
          brightness: 0,
          contrast: 0,
          filter: cfg.leftSlider || "",
          imageWidth: cfg.imageWidth || 0,
          imageHeight: cfg.imageHeight || 0,
          workingPercent: 0,
          initialRestore: 0
        };
      case "graphics":
        return {
          ...object,
          image_src:
            cfg.image_src ||
            "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg",
          imagePath: cfg.imagePath || ""
        };
      case "textbox":
        return {
          ...object,
          type: "textbox",
          width: cfg.width || 0,
          height: cfg.height || 0,
          fontSize: cfg.fontSize || 20,
          text: cfg.text || "Lorem Ipsum"
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
        return {
          ...object,
          font: cfg.font || "Arial",
          textAlign: cfg.textAlign || "left",
          vAlign: cfg.vAlign || "top",
          fontSize: cfg.fontSize || 12,
          bold: cfg.bold || false,
          underline: cfg.underline || false,
          italic: cfg.italic || false,
          fontFamily: cfg.fontFamily || "Dax",
          fillColor: getObjectColorTemplate((cfg && cfg.fillColor) || {}),
          bgColor: getObjectColorTemplate((cfg && cfg.bgColor) || {}),
          borderColor: getObjectColorTemplate((cfg && cfg.borderColor) || {})
        };
        break;
      case "tinymce":
        return {
          ...object,
          width: 379,
          height: 506,
          left: cfg.left || 100,
          top: cfg.top || 100,
          tableContent:
            cfg.tableContent ||
            `<table style="width: 100%; border-spacing: 0px; color: black;">
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
        };

      default:
        return { ...object };
        break;
    }
  }
};

const getEmptyUI = cfg => {
  const color1 = getEmptyColor({ id: 1, label: "white", htmlRGB: "#fff" });
  const color2 = getEmptyColor({ id: 2, label: "red", htmlRGB: "#f00" });
  const font1 = getEmptyFont({ label: "Helvetica", id: 1 });
  const font2 = getEmptyFont({ label: "Arial", id: 2 });
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
  getEmptyFont
};

module.exports = ProjectUtils;
