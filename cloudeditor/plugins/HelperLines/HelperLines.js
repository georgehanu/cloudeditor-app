const React = require("react");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
require("./HelperLines.css");
const SubmenuPoptext = require("../MenuItemHeaderFooter/components/SubmenuPoptext");

class HelperLines extends React.Component {
  state = {
    submenuOpened: false,
    poptextPages: {
      items: [
        "Layout 1 Page",
        "Layout 2 Pages",
        "Layout 3 Pages",
        "Layout 4 Pages",
        "None"
      ],

      active: "1 Page",
      open: false
    }
  };

  translate = poptext => {
    const items = poptext.items.map((el, index) => {
      return this.props.t(el);
    });
    return {
      active: this.props.t(poptext.active),
      items
    };
  };

  componentDidMount() {
    this.setState({
      poptextPages: {
        ...this.state.poptextPages,
        ...this.translate(this.state.poptextPages)
      }
    });
  }

  togglePoptextHandler = type => {
    if (type === "pages") {
      this.setState({
        poptextPages: {
          ...this.state.poptextPages,
          open: !this.state.poptextPages.open
        }
      });
    }
  };

  toggleSelectPoptext = (type, value) => {
    if (type === "pages") {
      this.setState({
        poptextPages: {
          ...this.state.poptextPages,
          open: false,
          active: value
        }
      });
    }
  };

  render() {
    return (
      <div className="helperLinesContainer">
        <div className="magneticLines">
          <input type="checkbox" className="magneticLinesCheckbox" />
          <span className="magneticLinesDescription">
            {this.props.t("Magnetic helper lines")}
          </span>
        </div>

        <div className="helperLinesLayout">
          <SubmenuPoptext
            activeItem={this.state.poptextPages.active}
            togglePoptext={this.togglePoptextHandler}
            toggleSelectPoptext={this.toggleSelectPoptext}
            poptextName="pages"
            items={this.state.poptextPages.items}
            open={this.state.poptextPages.open}
          />
        </div>
      </div>
    );
  }
}

const HelperLinesPlugin = withNamespaces("helperLines")(HelperLines);

module.exports = {
  HelperLines: assign(HelperLinesPlugin)
};
