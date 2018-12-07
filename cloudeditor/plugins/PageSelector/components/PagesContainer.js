const React = require("react");
const SinglePage = require("./SinglePage");
const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");
const randomColor = require("randomcolor");

class PagesContainer extends React.Component {
  state = {
    pages: [],
    hoverId: null
  };
  componentDidMount() {
    let newPages = [];
    newPages.push({
      pageType: "Center",
      text: "Front",
      id: 0,
      bgColor: randomColor(),
      draggable: false
    });
    newPages.push({
      pageType: "Left",
      text: "",
      id: 1,
      bgColor: randomColor(),
      draggable: false
    });
    newPages.push({
      pageType: "Right",
      text: "1",
      id: 2,
      bgColor: randomColor()
    });

    for (let counter = 3; counter < 30; counter += 2) {
      newPages.push({
        pageType: "Left",
        text: counter - 1,
        id: counter,
        bgColor: randomColor()
      });
      newPages.push({
        pageType: "Right",
        text: counter,
        id: counter + 1,
        bgColor: randomColor()
      });
    }
    this.setState({ pages: newPages });
  }

  switchPages = (from, to) => {
    if (from === to) {
      return;
    }
    const newPages = [...this.state.pages];
    let fromIndex = this.state.pages.findIndex(el => {
      return el.id === from;
    });
    let toIndex = this.state.pages.findIndex(el => {
      return el.id === to;
    });
    newPages[fromIndex] = this.state.pages[toIndex];
    newPages[toIndex] = this.state.pages[fromIndex];
    this.setState({ pages: newPages });

    this.highlightHoverPage(null);
  };

  highlightHoverPage = hoverId => {
    this.setState({ hoverId });
  };

  render() {
    let items = this.state.pages.map((el, index) => {
      let pageType = index % 2 === 1 ? "Left" : "Right";
      let text = index - 1;
      if (index === 0) {
        pageType = "Center";
        text = "Front";
      } else if (index === 1) {
        text = "";
      }

      return (
        <SinglePage
          key={index}
          pageType={pageType}
          text={text}
          id={el.id}
          switchPages={this.switchPages}
          bgColor={el.bgColor}
          draggable={el.draggable}
          hover={this.state.hoverId === el.id}
          highlightHoverPage={this.highlightHoverPage}
        />
      );
    });

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="PageSelectorContainer">{items}</div>
      </DragDropContextProvider>
    );
  }
}

module.exports = { PagesContainer };
