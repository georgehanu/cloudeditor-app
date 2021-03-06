const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DropTarget } = require("react-dnd");
const ReactDOM = require("react-dom");
const {
  forEachObjIndexed,
  includes,
  concat,
  without,
  indexOf,
  values
} = require("ramda");
const now = require("performance-now");

const type = ["image", "graphics", "pdf"];
const Objects = require("../Objects/Object/Objects");

const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");
const {
  scaledDisplayedPageSelector
} = require("../../../../stores/selectors/Html5Renderer");
const {
  globalObjectsIdsSelector
} = require("../../../../stores/selectors/render");
const { addObject } = require("../../../../stores/actions/project");
const {
  activePageIdSelector,
  headerConfigSelector,
  footerConfigSelector,
  projectHeaderEnabledSelector,
  projectFooterEnabledSelector,
  allowSafeCutSelector
} = require("../../../../stores/selectors/project");
const BlockMessage = require("../BlockMesage/BlockMessage");

const WithColumns = require("../renderProps/withColumns/withColumns");
require("./Page.css");

const Boxes = require("../Boxes/Boxes");
const Line = require("../Boxes/Line");
const centerPage = ({ width, height, containerWidth, containerHeight }) => {
  const marginTop = !(height > containerHeight)
    ? (containerHeight - height) / 2
    : 0;
  const marginLeft = !(width > containerWidth)
    ? (containerWidth - width) / 2
    : 0;

  return {
    marginLeft,
    marginTop
  };
};

const PageTarget = {
  drop(props, monitor, component) {
    if (monitor.isOver()) {
      const object = { ...monitor.getItem() };
      const componentBounding = ReactDOM.findDOMNode(
        component
      ).getBoundingClientRect();
      const activePageId = props.activePageId;
      innerPage = props.activePage.innerPages[activePageId];
      activePage = props.activePage;
      let aspectRatio = innerPage.height / innerPage.width;
      const colNumbers = innerPage.columnsNo;
      const columnSpacing = innerPage.columnSpacing;
      const safeCutDocument = innerPage.safeCut;
      //fit the image in col

      const widthPage =
        innerPage.width +
        activePage["boxes"]["trimbox"]["left"] +
        activePage["boxes"]["trimbox"]["right"];

      const safeCut =
        Math.max(...values(innerPage["boxes"]["trimbox"])) * 2 +
        safeCutDocument;

      let leftMargin = 0;
      let rightMargin = 0;
      if (props.allowSafeCut) {
        leftMargin = safeCut;
        rightMargin = leftMargin;
      } else {
        leftMargin = page["boxes"]["trimbox"]["left"];
        rightMargin = page["boxes"]["trimbox"]["right"];
      }
      width = widthPage - 2 * safeCut - (colNumbers - 1) * columnSpacing - 2;
      if (colNumbers) {
        width =
          (widthPage - 2 * safeCut - (colNumbers - 1) * columnSpacing) /
            colNumbers -
          2;
      }

      switch (object.type) {
        case "image":
          aspectRatio = object.imageHeight / object.imageWidth;
          break;
        default:
          break;
      }
      if (props.headerEnabled) {
        object.height = parseInt(props.headerConfig.height, 10);
        object.width = object.height / aspectRatio;
        const headerFooterOverlay = document.getElementById(
          "headerFooterOverlayId"
        );
        const overlayDimensions = headerFooterOverlay.getBoundingClientRect();
        const positionHeader = monitor.getSourceClientOffset();

        object.left =
          (-1 * (componentBounding.x - positionHeader.x)) / props.zoomScale;
        object.top =
          (-1 * (componentBounding.y - positionHeader.y)) / props.zoomScale;

        props.onAddObjectHandler(object);
        return;
      } else if (props.footerEnabled) {
        object.height = parseInt(props.footerConfig.height, 10);
        object.width = object.height / aspectRatio;
        const headerFooterOverlay = document.getElementById(
          "headerFooterOverlayId"
        );
        const overlayDimensions = headerFooterOverlay.getBoundingClientRect();
        const positionFooter = monitor.getSourceClientOffset();

        object.left =
          (-1 * (componentBounding.x - positionFooter.x)) / props.zoomScale;
        object.top =
          (-1 *
            (componentBounding.y -
              positionFooter.y +
              overlayDimensions.height)) /
          props.zoomScale;

        props.onAddObjectHandler(object);
        return;
      } else {
        object.width = width;
        object.height = width * aspectRatio;
      }
      const position = monitor.getSourceClientOffset();

      object.left = (-1 * (componentBounding.x - position.x)) / props.zoomScale;
      object.top = (-1 * (componentBounding.y - position.y)) / props.zoomScale;
      // TODO add in objects header/footer
      props.onAddObjectHandler(object);
    }
  },
  canDrop(props, monitor) {
    if (!props.viewOnly) {
      return true;
    }
    const position = monitor.getSourceClientOffset();
    if (props.headerEnabled || props.footerEnabled) {
      const headerFooterOverlay = document.getElementById(
        "headerFooterOverlayId"
      );

      const overlayDimensions = headerFooterOverlay.getBoundingClientRect();
      if (
        position.x >= overlayDimensions.x &&
        position.x <= overlayDimensions.x + overlayDimensions.width &&
        position.y >= overlayDimensions.y &&
        position.y <= overlayDimensions.y + overlayDimensions.height
      ) {
        return false;
      }
    }

    return false;
  },
  hover(props, monitor) {}
};

collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    clientOffset: monitor.getClientOffset()
  };
};

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.pageContainerRef = React.createRef();
    this.state = {
      errorMessages: []
    };
  }

  getIfMessage = (pageBounding, blockBounding, dragging) => {
    let type = 0;
    let snapTolerance = this.props.activePage.snapTolerance;
    const { zoomScale } = this.props;
    snapTolerance *= zoomScale;
    if (dragging) return type;
    if (
      blockBounding.left < snapTolerance ||
      blockBounding.right > pageBounding.width - snapTolerance ||
      blockBounding.top < snapTolerance ||
      blockBounding.bottom > pageBounding.height - snapTolerance
    )
      type = 1;
    if (
      blockBounding.right <= 0 ||
      blockBounding.left > pageBounding.width ||
      blockBounding.bottom <= 0 ||
      blockBounding.top > pageBounding.height
    )
      type = 2;
    return type;
  };
  checkErrorMessages = params => {
    const { blockId, dragging, width, height, left, top } = params;
    let { errorMessages } = this.state;
    const pageBounding = { width: this.props.width, height: this.props.height };
    const blockContainerBounding = {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height
    };

    errorMessages[blockId] = {
      type: this.getIfMessage(pageBounding, blockContainerBounding, dragging),
      left: blockContainerBounding.left + blockContainerBounding.width / 2,
      top: blockContainerBounding.top,
      width: blockContainerBounding.width
    };
    this.setState({ errorMessages });
  };

  renderObjects() {
    const {
      innerPages,
      offset,
      globalObjectsIds,
      zoomScale,
      activePage,
      width,
      height,
      viewOnly,
      bottomPagination,
      headerConfig,
      footerConfig,
      containerUuid,
      t
    } = this.props;
    let objectsOffset = [];
    forEachObjIndexed((innerPage, pKey) => {
      const parent = {
        id: pKey,
        uuid: pKey,
        type: "page",
        subType: "page",
        width: width,
        height: height,
        offsetTop: offset.top,
        offsetLeft: offset.left,
        zoomScale,
        level: 0,
        innerPage: {
          width: innerPage.width,
          height: innerPage.height,
          offset: {
            top: innerPage.offset.top,
            left: innerPage.offset.left
          },
          isDocumentFirstPage: innerPage.isDocumentFirstPage,
          isDocumentLastPage: innerPage.isDocumentLastPage,
          isGroupFirstPage: innerPage.isGroupFirstPage,
          isGroupLastPage: innerPage.isGroupLastPage
        },
        parent: null
      };

      let beforeObjIds = globalObjectsIds.before;
      let afterObjIds = globalObjectsIds.after;

      let mirroredHeader = false;
      let mirroredFooter = false;

      const hasHeader = innerPage["hasHeader"];
      const hasFooter = innerPage["hasFooter"];
      if (hasHeader) {
        if (headerConfig.display === "before")
          beforeObjIds = concat(beforeObjIds, headerConfig.objectsIds);
        if (headerConfig.display === "after")
          afterObjIds = concat(afterObjIds, headerConfig.objectsIds);

        if (headerConfig.mirrored) {
          mirroredHeader =
            innerPage.isGroupLastPage && !innerPage.isDocumentFirstPage ? 1 : 0;
        }
      }

      if (hasFooter) {
        if (footerConfig.display === "before")
          beforeObjIds = concat(beforeObjIds, footerConfig.objectsIds);
        if (footerConfig.display === "after")
          afterObjIds = concat(afterObjIds, footerConfig.objectsIds);

        if (footerConfig.mirrored)
          mirroredFooter =
            innerPage.isGroupLastPage && !innerPage.isDocumentFirstPage ? 1 : 0;
      }

      objIds = concat(beforeObjIds, innerPage.objectsIds, afterObjIds);

      objectsOffset = objIds.reduce(function(acc, cV, _) {
        let newObj = {
          id: cV,
          uuid: containerUuid + "--" + pKey + "--" + cV,
          level: parent.level + 1,
          offsetLeft: offset.left,
          offsetTop: offset.top,
          mirroredHeader,
          parent,
          t: t
        };

        if (hasHeader && includes(cV, headerConfig.objectsIds)) {
          newObj["mirroredHeader"] = mirroredHeader;
          newObj["heightHeader"] = headerConfig.height;
          newObj["modeHeader"] = headerConfig.mode;
        }
        if (hasFooter && includes(cV, footerConfig.objectsIds)) {
          newObj["mirroredFooter"] = mirroredFooter;
          newObj["heightFooter"] = footerConfig.height;
          newObj["modeFooter"] = footerConfig.mode;
        }
        acc.push(newObj);
        return acc;
      }, objectsOffset);
    }, innerPages);
    return (
      <Objects
        objects={objectsOffset}
        zoomScale={zoomScale}
        labelPage={this.props.labels[this.props.activePage.page_id]}
        snapTolerance={activePage.snapTolerance}
        middle={{ left: width / 2, top: height / 2 }}
        checkErrorMessages={this.checkErrorMessages}
        setMissingImages={this.props.setMissingImages}
        deleteMissingImages={this.props.deleteMissingImages}
        viewOnly={viewOnly}
        bottomPagination={bottomPagination}
        t={t}
      />
    );
  }
  renderErrorMessages = () => {
    const { errorMessages } = this.state;
    return Object.keys(errorMessages).map(obKey => {
      return (
        <BlockMessage
          key={obKey}
          {...errorMessages[obKey]}
          objectKeys={Object.keys(this.props.objectsOffsetList)}
          id={obKey}
          delay={10000}
          viewOnly={this.props.viewOnly}
          t={this.props.t}
        />
      );
    });
  };
  getPageRef = () => {
    return this.ref;
  };

  render() {
    const {
      width,
      height,
      viewOnly,
      background,
      visible,
      zoomScale
    } = this.props;
    if (!visible) {
      return null;
    }

    const { marginLeft, marginTop } = centerPage(this.props);
    const pageStyle = {
      width,
      height,
      marginLeft,
      marginTop,
      backgroundColor: "rgb(" + background.color.htmlRGB + ")"
    };
    let boxes = null;
    let snapBoxes = null;
    let withColumns = null;
    if (!viewOnly) {
      boxes = (
        <React.Fragment>
          <Boxes
            boxes={this.props.boxes}
            width={this.props.width}
            height={this.props.height}
          />
          <Boxes
            boxes={this.props.magneticBoxes}
            width={this.props.width}
            height={this.props.height}
            inlineClass={"drag_alignLines drag_alignLinesDynamic"}
          />
        </React.Fragment>
      );
      ///this is middle snap
      if (0) {
        const classes = "snapLine boxLine drag_alignLines middle_snap";
        const topStyle = {
          width: this.props.width,
          left: 0,
          top: this.props.height / 2,
          height: 1
        };
        const leftStyle = {
          width: 1,
          left: this.props.width / 2,
          top: 0,
          height: this.props.height
        };

        snapBoxes = (
          <React.Fragment>
            <Line {...topStyle} classes={classes + " horizontal"} />
            <Line {...leftStyle} classes={classes + " vertical"} />
          </React.Fragment>
        );
      }

      const { innerPages, activePageId } = this.props;

      withColumns = (
        <WithColumns page={innerPages[activePageId]} zoomScale={zoomScale}>
          {boxes => {
            return boxes.map(box => {
              const topStyle = {
                top: box["top"],
                width: box["width"],
                height: 1,
                left: box["left"]
              };
              const leftStyle = {
                top: box["top"],
                width: 1,
                height: box["height"],
                left: box["left"]
              };
              const rightStyle = {
                top: box["top"],
                width: 1,
                height: box["height"],
                left: box["left"] + box["width"]
              };
              const bottomStyle = {
                top: box["top"] + box["height"],
                width: box["width"],
                height: 1,
                left: box["left"]
              };
              const classes = "boxLine  drag_alignLines columnsLine";
              return (
                <React.Fragment key={box["key"]}>
                  <Line {...topStyle} classes={classes + " top"} />
                  <Line {...leftStyle} classes={classes + " left"} />
                  <Line {...rightStyle} classes={classes + " right"} />
                  <Line {...bottomStyle} classes={classes + " bottom"} />
                </React.Fragment>
              );
            });
          }}
        </WithColumns>
      );
    }

    return this.props.connectDropTarget(
      <div
        ref={this.props.getPageRef}
        style={pageStyle}
        className="pageContainer page"
      >
        {/*<div className="pageOverlay" id="pageOverlay" />*/}
        {this.renderObjects()}
        {boxes}
        {snapBoxes}
        {withColumns}
        {this.renderErrorMessages()}
        <div
          onClick={() => this.props.onChangePage(this.props.activePage.page_id)}
          className={"overlaySideBySide"}
        />
      </div>
    );
  }
}

const makeMapStateToProps = (state, props) => {
  const activePage = (_, props) => {
    return props.activePage;
  };
  const viewOnly = (_, props) => {
    return props.viewOnly;
  };

  const zoomScale = (_, props) => {
    return props.zoomScale;
  };

  const getScaledDisplayedPageSelector = scaledDisplayedPageSelector(
    activePage,
    zoomScale
  );
  const getObjectsOffsetsList = createSelector(
    getScaledDisplayedPageSelector,
    scaledPage => {
      let objectsOffset = {};
      forEachObjIndexed((innerPage, pKey) => {
        innerPage.objectsIds.map(oKey => {
          objectsOffset[oKey] = {
            offsetTop: scaledPage.offset.top + innerPage.offset.top,
            offsetLeft: scaledPage.offset.left + innerPage.offset.left
          };
        });
      }, scaledPage.innerPages);
      return objectsOffset;
    }
  );

  const mapStateToProps = (state, props) => {
    const scaledPage = getScaledDisplayedPageSelector(state, props);
    return {
      ...scaledPage,
      activePageId: activePageIdSelector(state),
      globalObjectsIds: globalObjectsIdsSelector(state),
      headerConfig: headerConfigSelector(state),
      footerConfig: footerConfigSelector(state),
      headerEnabled: projectHeaderEnabledSelector(state.project),
      footerEnabled: projectFooterEnabledSelector(state.project),
      objectsOffsetList: getObjectsOffsetsList(state, props),
      allowSafeCut: allowSafeCutSelector(state, props)
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = dispatch => {
  return { onAddObjectHandler: payload => dispatch(addObject(payload)) };
};
module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(DropTarget(type, PageTarget, collectDrop)(Page))
);
