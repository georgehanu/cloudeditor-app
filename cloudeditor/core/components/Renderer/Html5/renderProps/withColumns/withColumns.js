const React = require("react");
const { connect } = require("react-redux");
const { identity, memoizeWith, values } = require("ramda");

const {
  allowLayoutColumnsSelector,
  allowSafeCutSelector,
  headerConfigSelector,
  footerConfigSelector,
  showTrimboxSelector
} = require("../../../../../stores/selectors/project");
class WithColumns extends React.Component {
  getBoxContainerFromPage() {
    let columnsContainer = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    const {
      headerConfig,
      footerConfig,
      page,
      zoomScale,
      allowSafeCut,
      allowTrimbox
    } = this.props;
    let {
      width,
      height,
      hasHeader,
      hasFooter,
      columnsNo,
      columnSpacing
    } = page;
    let headerHeight = 0;
    let footerHeight = 0;
    let leftMargin = 0;
    let rightMargin = 0;
    if (hasHeader) {
      headerHeight = headerConfig.height * 2.83465 * zoomScale;
    }
    if (hasFooter) {
      footerHeight = footerConfig.height * 2.83465 * zoomScale;
    }
    if (allowTrimbox) {
      width =
        width +
        page["boxes"]["trimbox"]["left"] +
        page["boxes"]["trimbox"]["right"];
      height =
        height +
        page["boxes"]["trimbox"]["top"] +
        page["boxes"]["trimbox"]["bottom"];
    }
    const safeCut =
      Math.max(...values(page["boxes"]["trimbox"])) * 2 + page["safeCut"];
    columnsContainer["top"] = 0;
    columnsContainer["height"] = height;
    columnsContainer["bottom"] = height - footerHeight;
    if (hasHeader) {
      columnsContainer["top"] = headerHeight;
      columnsContainer["height"] = columnsContainer["height"] - headerHeight;
    } else {
      if (allowSafeCut) {
        columnsContainer["top"] = safeCut;
        columnsContainer["height"] = height - safeCut;
      } else {
        columnsContainer["top"] = page["boxes"]["trimbox"]["top"];
        columnsContainer["height"] = height - page["boxes"]["trimbox"]["top"];
      }
    }
    if (hasFooter) {
      columnsContainer["bottom"] = height - footerHeight;
      columnsContainer["height"] = columnsContainer["height"] - footerHeight;
    } else {
      if (allowSafeCut) {
        columnsContainer["bottom"] = height - safeCut;
        columnsContainer["height"] = columnsContainer["height"] - safeCut;
      } else {
        columnsContainer["bottom"] =
          height - page["boxes"]["trimbox"]["bottom"];
        columnsContainer["height"] =
          columnsContainer["height"] - page["boxes"]["trimbox"]["bottom"];
      }
    }

    if (allowSafeCut) {
      leftMargin = safeCut;
      rightMargin = leftMargin;
    } else {
      leftMargin = page["boxes"]["trimbox"]["left"];
      rightMargin = page["boxes"]["trimbox"]["right"];
    }

    columnsContainer["left"] = page["offset"]["left"] + leftMargin;
    columnsContainer["right"] = width - rightMargin;
    columnsContainer["width"] = width - leftMargin - rightMargin;

    return columnsContainer;
  }
  computeBoxes = (boxContainer, columnsNo, columnSpacing, zoomScale) => {
    let boxes = [];
    const boxWidth =
      (boxContainer["width"] - (columnsNo - 1) * columnSpacing) / columnsNo;

    let i;

    let totalLeft = boxContainer["left"];
    for (i = 0; i < columnsNo; i++) {
      const top = boxContainer["top"];
      if (i > 0) totalLeft += boxWidth + columnSpacing * (i === 0 ? 0 : 1);
      const left = totalLeft;
      const box = {
        top,
        left,
        width: boxWidth,
        height: boxContainer["height"],
        key: i
      };
      boxes.push(box);
    }
    return boxes;
  };
  render() {
    const { page, zoomScale } = this.props;
    const boxContainer = this.getBoxContainerFromPage();
    const boxes = this.computeBoxes(
      boxContainer,
      page.columnsNo,
      page.columnSpacing,
      zoomScale
    );
    return this.props.children(boxes);
  }
}

const mapStateToProps = state => {
  return {
    allowColumns: allowLayoutColumnsSelector(state),
    allowSafeCut: allowSafeCutSelector(state),
    allowTrimbox: showTrimboxSelector(state),
    headerConfig: headerConfigSelector(state),
    footerConfig: footerConfigSelector(state)
  };
};

module.exports = connect(
  mapStateToProps,
  null
)(WithColumns);
