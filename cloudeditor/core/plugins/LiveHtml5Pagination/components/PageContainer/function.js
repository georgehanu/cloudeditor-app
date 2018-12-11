const PageSource = {
  beginDrag(props) {
    props.highlightHoverPage(null);
    props.selectPage(props.id);
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
