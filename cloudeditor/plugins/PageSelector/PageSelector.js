const React = require("react");
const { PagesContainer } = require("./components/PagesContainer");
const PageHeader = require("./components/PageHeader");
const { hot } = require("react-hot-loader");
const randomColor = require("randomcolor");
const AddPages = require("./components/AddPages/AddPages");
const { AFTER, BEFORE, END } = require("./components/utils");
require("./PageSelector.css");
class PageSelector extends React.Component {
  state = {
    activePage: 10,
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
  }

  highlightHoverPage = hoverId => {
    this.setState({ hoverId });
  };

  insertNewPages(nrOfPages, location) {
    let newPages = [...this.state.pages];
    if (location === END) {
      // add end of the pages

      for (let i = 0; i < nrOfPages; i++) {
        newPages.push({
          id: this.state.pages.length + i,
          bgColor: randomColor(),
          draggable: true
        });
      }
    } else if (location === BEFORE) {
      newPages = this.state.pages.slice(0, nrOfPages);
      for (let i = 0; i < nrOfPages; i++) {
        newPages.push({
          id: this.state.pages.length + i,
          bgColor: randomColor(),
          draggable: true
        });
      }
      newPages = newPages.concat(this.state.pages.slice(nrOfPages));
    }

    this.setState({ pages: newPages });
  }

  selectPage = (selectedId, addNewpage) => {
    if (addNewpage === true) {
      this.insertNewPages(1, END);
    } else {
      this.setState({ selectedId });

      /* scroll the pages so that the first one is the one selected */
      /*
      const element = document
        .getElementById(selectedId)
        .getBoundingClientRect();
      const container = document.getElementById("PagesContainer");

      const index = this.state.pages.findIndex(el => {
        return el.id === selectedId;
      });
      if (index !== -1) {
        // we need to skip the first 2 elements, which are not included in the pages
        // element.width + padding
        const padding = 10;
        let value =
          (2 + index) * (element.width + padding) +
          (index % 2 === 0 ? 2 : 2 + padding);
        container.scrollLeft = value;
      }*/
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
      this.setState({ size: "Extended" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["PageSelectorExtended"],
          true
        );
      });
    } else {
      this.setState({ size: "Normal" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["PageSelectorNormal"],
          true
        );
      });
    }
  };

  minimize = () => {
    if (this.state.size === "Normal") {
      this.setState({ size: "Minimized" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["PageSelectorMinimized"],
          true
        );
      });
    } else {
      this.setState({ size: "Normal" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["PageSelectorNormal"],
          true
        );
      });
    }
  };

  showAddPages = () => {
    this.setState({ showAddPages: true });
  };

  hideAddPages = () => {
    this.setState({ showAddPages: false, nrPagesToInsert: 1 });
  };

  changePagesToInsert = event => {
    // validate
    this.setState({ nrPagesToInsert: event.target.value });
  };

  addPages = () => {
    this.insertNewPages(this.state.nrPagesToInsert, this.state.location);
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
            page={this.state.activePage}
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
          id="PagesContainer"
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
