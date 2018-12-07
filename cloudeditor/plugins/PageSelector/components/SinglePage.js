const React = require("react");
const { DragSource, DropTarget } = require("react-dnd");

const PAGES = "PAGES";

const PageSource = {
  beginDrag(props) {
    return {
      type: PAGES,
      id: props.id
    };
  }
};

const PageTarget = {
  drop(props, monitor, component) {
    props.switchPages(monitor.getItem().id, props.id);
  }
  /*
  canDrop(props, monitor) {
    if (monitor.getItem().type == PAGES) {
      return true;
    }
    return false;
  }*/
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
  return props.connectDropTarget(
    props.connectDragSource(
      <div className="SinglePage" style={{ backgroundColor: props.bgColor }} />
    )
  );
};

module.exports = DropTarget(PAGES, PageTarget, collectDrop)(
  DragSource(PAGES, PageSource, collectDrag)(SinglePage)
);
