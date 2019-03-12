//const Types = require("../../components/DesignAndGoConfig/types");
const uuidv4 = require("uuid/v4");

const { handleActions } = require("redux-actions");

const initialState = projectConfigGlobal["alternateLayouts"];
/*
const initialState = [
  {
    id: uuidv4(),
    title: "Layout 1",
    rangeBy: "width",
    minDim: 1,
    maxDim: 10000,
    pages: {
      page_0: {
        id: "page_0",
        width: 500,
        height: 733,
        objectsIds: [
          "287b6ff5-7ee6-4251-b38a-6ac8159c068e",
          "3b00a5a4-76aa-43d1-8e2e-66655f55daa9"
        ],
        rule: "scale" //scale,objectBased,reCenter,guideBased
      }
    },
    objects: {
      "287b6ff5-7ee6-4251-b38a-6ac8159c068e": {
        id: "287b6ff5-7ee6-4251-b38a-6ac8159c068e",
        type: "graphics",
        width: 500,
        height: 733,
        left: 0,
        top: 0,
        rule_proprieties: {
          topMarginFixed: 1,
          leftMarginFixed: 1,
          rightMarginFixed: 0,
          bottomMarginFixed: 0,
          widthResizable: 0,
          heightResizable: 0
        },
        src:
          "http://localhost:8081/images/page1-3dc89a95f953cf455f9a47e7b67c1dd3.svg"
      },
      "3b00a5a4-76aa-43d1-8e2e-66655f55daa9": {
        id: "3b00a5a4-76aa-43d1-8e2e-66655f55daa9",
        type: "textbox",
        width: 300,
        height: 50,
        left: 100,
        top: 230,
        editable: 1,
        value: "[%]jarName[/%]",
        resizable: 1,
        rotatable: 1,
        movable: 1,
        rotateAngle: 0,
        ispSnap: 1,
        orientation: "north",
        rotate: 0,
        angle: 0,
        dragging: 0,
        rotating: 0,
        resizing: 0,
        textAlign: "center",
        vAlign: "middle",
        fontSize: 38.65,
        bold: false,
        underline: false,
        italic: false,
        fontFamily: "Roboto",
        text: "[%]jarName[/%]",
        defaultFontZise: 30,
        useDefaultFontSize: true,
        rule_proprieties: {
          topMarginFixed: 0,
          leftMarginFixed: 1,
          rightMarginFixed: 1,
          bottomMarginFixed: 0,
          widthResizable: 1,
          heightResizable: 0
        }
      }
    }
  }
];*/
module.exports = handleActions(
  //export default handleActions(
  {},
  initialState
);
