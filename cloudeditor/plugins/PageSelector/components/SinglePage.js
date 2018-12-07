const React = require("react");
const { DragSource, DropTarget } = require("react-dnd");

const PAGES = "PAGES";

const PageSource = {
  beginDrag(props) {
    props.highlightHoverPage(null);
    return {
      type: PAGES,
      id: props.id,
      draggable: props.draggable || true
    };
  },
  canDrag(props, monitor) {
    if (props.draggable === false) {
      return false;
    }
    return true;
  }
};

const PageTarget = {
  drop(props, monitor) {
    props.switchPages(monitor.getItem().id, props.id);
  },

  canDrop(props, monitor) {
    if (props.draggable === false) {
      return false;
    }
    return true;
  },
  hover(props, monitor) {
    if (props.id === monitor.getItem().id || props.draggable === false) {
      props.highlightHoverPage(null);
    } else {
      props.highlightHoverPage(props.id);
    }
  }
};

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const SinglePage = props => {
  let className =
    "SinglePageContainer " +
    (props.pageType === undefined ? "" : "SinglePage" + props.pageType);
  className += props.hover ? " SinglePageHover" : "";

  return props.connectDropTarget(
    props.connectDragSource(
      <div className={className}>
        <div
          className="SinglePage"
          style={{ backgroundColor: props.bgColor }}
        />
        <div className="SinglePageText">{props.text}</div>
      </div>
    )
  );
};

module.exports = DropTarget(PAGES, PageTarget, collectDrop)(
  DragSource(PAGES, PageSource, collectDrag)(SinglePage)
);
