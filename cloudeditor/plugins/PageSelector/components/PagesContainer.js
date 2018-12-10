const React = require("react");
const SinglePage = require("./SinglePage");
const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

const PagesContainer = props => {
  let items = props.items.map((el, index) => {
    let pageType = el.pageType;
    let text = el.text;
    if (el.draggable) {
      pageType = index % 2 === 1 ? "Left" : "Right";
      text = index - 1;
    }

    return (
      <SinglePage
        key={index}
        pageType={pageType}
        text={text}
        id={el.id}
        bgColor={el.bgColor}
        draggable={el.draggable}
        hover={props.hoverId === el.id}
        selected={props.selectedId === el.id}
        addNewPage={el.addNewPage}
        switchPages={props.switchPages}
        highlightHoverPage={props.highlightHoverPage}
        selectPage={props.selectPage}
      />
    );
  });

  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <div className="PageSelectorContainer">{items}</div>
    </DragDropContextProvider>
  );
};

module.exports = { PagesContainer };
