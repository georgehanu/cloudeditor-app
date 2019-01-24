const React = require("react");
const { connect } = require("react-redux");
const { identity, memoizeWith } = require("ramda");

const {
  allowLayoutColumnsSelector,
  allowSafeCutSelector,
  headerConfigSelector,
  footerConfigSelector
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
      allowSafeCut
    } = this.props;
    const {
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

    columnsContainer["top"] = headerHeight;
    columnsContainer["bottom"] = height - footerHeight;
    columnsContainer["height"] = height - headerHeight - footerHeight;

    if (allowSafeCut) {
      leftMargin = page["boxes"]["trimbox"]["top"] * 2 + page["safeCut"];
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

    for (i = 0; i < columnsNo; i++) {
      const top = boxContainer["top"];
      const left =
        boxContainer["left"] + i * boxWidth + columnSpacing * (i === 0 ? 0 : 1);
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
    headerConfig: headerConfigSelector(state),
    footerConfig: footerConfigSelector(state)
  };
};

module.exports = connect(
  mapStateToProps,
  null
)(WithColumns);
