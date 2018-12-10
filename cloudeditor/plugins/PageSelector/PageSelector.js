const React = require("react");
const { PagesContainer } = require("./components/PagesContainer");
const PageHeader = require("./components/PageHeader");
const { hot } = require("react-hot-loader");
const randomColor = require("randomcolor");
const AddPages = require("./components/AddPages/AddPages");

class PageSelector extends React.Component {
  state = {
    size: "Normal",
    showAddPages: false,
    nrPagesToInsert: 1,
    pages: [],
    hoverId: null,
    selectedId: null,
    location: null,
    frontElements: [
      {
        pageType: "Center",
        text: "Front",
        id: "F1",
        bgColor: "white",
        draggable: false
      },
      {
        pageType: "Left",
        text: "",
        id: "F2",
        bgColor: "white",
        draggable: false
      }
    ],
    backElements: [
      {
        pageType: "Left",
        text: "",
        id: "B1",
        bgColor: "white",
        draggable: false,
        addNewPage: true
      },
      {
        pageType: "Right",
        text: "Back cover",
        id: "B2",
        bgColor: "white",
        draggable: false
      }
    ]
  };

  componentDidMount() {
    let newPages = [];

    let nrItems = 29;
    for (let counter = 0; counter < nrItems; counter++) {
      newPages.push({
        text: counter,
        id: counter,
        bgColor: randomColor(),
        draggable: true
      });
    }

    this.setState({ pages: newPages });
    this.setState({ nrPagesToInsert: 1 });
  }

  highlightHoverPage = hoverId => {
    this.setState({ hoverId });
  };

  insertNewPages(nrOfPages, location) {
    let newPages = [...this.state.pages];
    let addExtraPage = this.state.pages.length % 2 ? true : false;

    if (location === undefined) {
      // add end of the pages

      for (let i = 0; i < nrOfPages; i++) {
        newPages.push({
          text: this.state.pages.length + i,
          id: this.state.pages.length + i,
          bgColor: randomColor(),
          draggable: true
        });
      }
      /*
            if (addExtraPage) {
              newPages.push({
                text: "",
                id: newPages.length + 1,
                bgColor: "white",
                draggable: false
              })
            }*/
    }

    this.setState({ pages: newPages });
  }

  selectPage = (selectedId, addNewpage) => {
    if (addNewpage === true) {
      this.insertNewPages(1);
    } else {
      this.setState({ selectedId });
    }
  };

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

  extend = () => {
    if (this.state.size === "Normal") {
      this.props.addContainerClasses("PageSelector", ["PageSelectorExtended"]);
      this.setState({ size: "Extended" });
    } else {
      this.props.addContainerClasses("PageSelector", ["PageSelectorNormal"]);
      this.setState({ size: "Normal" });
    }
  };

  minimize = () => {
    if (this.state.size === "Normal") {
      this.props.addContainerClasses("PageSelector", ["PageSelectorMinimized"]);
      this.setState({ size: "Minimized" });
    } else {
      this.props.addContainerClasses("PageSelector", ["PageSelectorNormal"]);
      this.setState({ size: "Normal" });
    }
  };

  showAddPages = () => {
    this.setState({ showAddPages: true });
  };

  hideAddPages = () => {
    this.setState({ showAddPages: false });
  };

  changePagesToInsert = event => {
    // validate
    this.setState({ nrPagesToInsert: event.target.value });
  };

  addPages = () => {
    console.log(this.state.location);
    console.log(this.state.nrPagesToInsert);
  };

  onCheckboxChanged = value => {
    this.setState({ location: value });
  };

  render() {
    let items = this.state.frontElements.concat(
      this.state.pages.concat(this.state.backElements)
    );

    return (
      <div className="PageSelector">
        {this.state.showAddPages && (
          <AddPages
            show={true}
            hideAddPages={this.hideAddPages}
            changePagesToInsert={this.changePagesToInsert}
            nrPagesToInsert={this.state.nrPagesToInsert}
            addPages={this.addPages}
            onCheckboxChanged={this.onCheckboxChanged}
          />
        )}
        <PageHeader
          minimize={this.minimize}
          extend={this.extend}
          status={this.state.size}
          showExtend={this.state.size !== "Extended"}
          showMinimized={this.state.size !== "Minimized"}
          showAddPages={this.showAddPages}
        />
        <PagesContainer
          items={items}
          hoverId={this.state.hoverId}
          selectedId={this.state.selectedId}
          switchPages={this.switchPages}
          selectPage={this.selectPage}
          highlightHoverPage={this.highlightHoverPage}
        />
      </div>
    );
  }
}

const PageSelectorPlugin = hot(module)(PageSelector);

module.exports = {
  PageSelector: PageSelectorPlugin
};
