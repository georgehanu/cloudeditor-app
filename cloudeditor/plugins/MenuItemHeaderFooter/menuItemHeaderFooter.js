const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");
const SubmenuPoptext = require("./components/SubmenuPoptext");
const SubmenuLayout = require("./components/SubmenuLayout");
const { withNamespaces } = require("react-i18next");
const URL = "http://work.cloudlab.at:9012/ig/uploads/";
const uuidv4 = require("uuid/v4");
const axios = require("axios");

const LOAD_LAYOUTS_URL = "http://work.cloudlab.at:9012/ig/tests/upload.php";

class MenuItemHeaderFooter extends React.Component {
  state = {
    submenuOpened: false,
    poptextEdit: {
      items: ["Footer", "Header"],
      active: "Footer",
      open: false
    },
    poptextLayoutMirror: {
      items: ["Right page", "Left page"],
      active: "Right page",
      open: false
    },
    poptextInsert: {
      items: ["Choose", "Option", "Option 2", "Option 3-3-3"],
      active: "Choose",
      open: false
    },
    poptextActive: {
      items: ["Inside", "All"],
      active: "Inside",
      open: false
    },
    poptextLayouts: {
      items: [],
      active: "Layouts",
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
      poptextEdit: {
        ...this.state.poptextEdit,
        ...this.translate(this.state.poptextEdit)
      },
      poptextLayoutMirror: {
        ...this.state.poptextLayoutMirror,
        ...this.translate(this.state.poptextLayoutMirror)
      },
      poptextInsert: {
        ...this.state.poptextInsert,
        ...this.translate(this.state.poptextInsert)
      },
      poptextActive: {
        ...this.state.poptextActive,
        ...this.translate(this.state.poptextActive)
      }
    });

    this.loadLayouts();
  }

  loadLayouts = () => {
    axios
      .post(LOAD_LAYOUTS_URL)
      .then(resp => resp.data)
      .then(data => {
        if (data.status === "success") {
          let items = [];
          for (let idx in data.items) {
            items.push({
              id: uuidv4(),
              src: data.items[idx]
            });
          }
          this.setState({
            poptextLayouts: { ...this.state.poptextLayouts, items }
          });
        } else {
        }
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  closePoptext = () => {
    this.setState({
      poptextEdit: { ...this.state.poptextEdit, open: false },
      poptextLayoutMirror: { ...this.state.poptextLayoutMirror, open: false },
      poptextInsert: { ...this.state.poptextInsert, open: false },
      poptextActive: { ...this.state.poptextActive, open: false },
      poptextLayouts: { ...this.state.poptextLayouts, open: false }
    });
  };

  togglePoptextHandler = type => {
    if (type === "edit") {
      if (this.state.poptextEdit.open === false) {
        this.closePoptext();
      }

      this.setState({
        poptextEdit: {
          ...this.state.poptextEdit,
          open: !this.state.poptextEdit.open
        }
      });
    } else if (type === "layoutMirror") {
      if (this.state.poptextLayoutMirror.open === false) {
        this.closePoptext();
      }

      this.setState({
        poptextLayoutMirror: {
          ...this.state.poptextLayoutMirror,
          open: !this.state.poptextLayoutMirror.open
        }
      });
    } else if (type === "insert") {
      if (this.state.poptextInsert.open === false) {
        this.closePoptext();
      }
      this.setState({
        poptextInsert: {
          ...this.state.poptextInsert,
          open: !this.state.poptextInsert.open
        }
      });
    } else if (type === "active") {
      if (this.state.poptextActive.open === false) {
        this.closePoptext();
      }
      this.setState({
        poptextActive: {
          ...this.state.poptextActive,
          open: !this.state.poptextActive.open
        }
      });
    } else if (type === "layouts") {
      if (this.state.poptextLayouts.open === false) {
        this.closePoptext();
      }
      this.setState({
        poptextLayouts: {
          ...this.state.poptextLayouts,
          open: !this.state.poptextLayouts.open
        }
      });
    }
  };

  toggleSelectPoptext = (type, value) => {
    if (type === "edit") {
      this.setState({
        poptextEdit: {
          ...this.state.poptextEdit,
          open: false,
          active: value
        }
      });
    } else if (type === "layoutMirror") {
      this.setState({
        poptextLayoutMirror: {
          ...this.state.poptextLayoutMirror,
          open: false,
          active: value
        }
      });
    } else if (type === "insert") {
      this.setState({
        poptextInsert: {
          ...this.state.poptextInsert,
          open: false,
          active: value
        }
      });
    } else if (type === "active") {
      this.setState({
        poptextActive: {
          ...this.state.poptextActive,
          open: false,
          active: value
        }
      });
    }
  };

  toggleMenuHandler = show => {
    if (this.state.submenuOpened === false) {
      this.props.addContainerClasses("submenuHeaderFooter", [
        "showHeaderFooter"
      ]);
    } else {
      this.closePoptext();
      this.props.addContainerClasses("submenuHeaderFooter", []);
    }
    this.setState({ submenuOpened: !this.state.submenuOpened });
  };

  render() {
    const className =
      "projectMenuButtonLink " +
      (this.state.submenuOpened ? "projectMenuButtonSubMenuOpened" : "");
    return (
      <React.Fragment>
        <div className={className}>
          <ProjectMenuButton
            active={this.props.active}
            clicked={() => this.toggleMenuHandler(true)}
          >
            {this.props.t(this.props.text)}
          </ProjectMenuButton>
        </div>
        {this.state.submenuOpened && (
          <div className="submenuItemHeaderFooter">
            <div className="submenuItemHeaderFooterEdit">
              <span>{this.props.t("Edit")}:</span>
              <SubmenuPoptext
                activeItem={this.state.poptextEdit.active}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="edit"
                items={this.state.poptextEdit.items}
                open={this.state.poptextEdit.open}
              />
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterLayouts">
              <SubmenuLayout
                activeItem={this.state.poptextLayouts.active}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="layouts"
                items={this.state.poptextLayouts.items}
                open={this.state.poptextLayouts.open}
              />
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterLayoutMirror">
              <span>{this.props.t("Layout mirror")}:</span>
              <SubmenuPoptext
                activeItem={this.state.poptextLayoutMirror.active}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="layoutMirror"
                items={this.state.poptextLayoutMirror.items}
                open={this.state.poptextLayoutMirror.open}
              />
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterInsert">
              <span>{this.props.t("Insert")}:</span>
              <SubmenuPoptext
                activeItem={this.state.poptextInsert.active}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="insert"
                items={this.state.poptextInsert.items}
                open={this.state.poptextInsert.open}
              />
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterActive">
              <span>{this.props.t("Active on")}:</span>
              <SubmenuPoptext
                activeItem={this.state.poptextActive.active}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="active"
                items={this.state.poptextActive.items}
                open={this.state.poptextActive.open}
              />
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterHeight">
              <span>{this.props.t("Height")}:</span>
              <input type="number" />
              <span>{this.props.t("mm")}</span>
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterClose">
              <button onClick={this.toggleMenuHandler}>
                {this.props.t("Close menu")}
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const MenuItemHeaderFooterPlugin = withNamespaces("menuItemHeaderFooter")(
  MenuItemHeaderFooter
);

module.exports = {
  MenuItemHeaderFooter: assign(MenuItemHeaderFooterPlugin, {
    ProjectMenu: {
      position: 6,
      priority: 1,
      text: "Header and Footer",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemHeaderFooter"
    }
  })
};
