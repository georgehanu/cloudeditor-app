const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");
const SubmenuPoptext = require("./components/SubmenuPoptext");
const SubmenuLayout = require("./components/SubmenuLayout");
const { withNamespaces } = require("react-i18next");
const URL = "http://work.cloudlab.at:9012/ig/uploads/";
const uuidv4 = require("uuid/v4");
const axios = require("axios");
const { equals } = require("ramda");
const { debounce } = require("underscore");

const LOAD_LAYOUTS_URL = "http://work.cloudlab.at:9012/ig/tests/upload.php";

const {
  headerConfigSelector,
  footerConfigSelector
} = require("../../core/stores/selectors/project");

const {
  updateHeaderconfigProps,
  updateFooterconfigProps
} = require("../../core/stores/actions/project");
require("./menuItemHeaderFooter.css");
class MenuItemHeaderFooter extends React.PureComponent {
  state = {
    submenuOpened: false,
    poptextEdit: {
      items: ["Footer", "Header"],
      active: "Header",
      open: false
    },
    poptextInsert: {
      items: ["yes", "no"],
      open: false
    },
    poptextLayoutMirror: {
      items: ["yes", "no"],
      active: "yes",
      open: false
    },
    poptextActive: {
      items: ["inner", "all"],
      active: "inner",
      open: false
    },
    poptextLayouts: {
      items: [],
      active: "Layouts",
      open: false
    }
  };

  componentDidMount() {
    this.loadLayouts();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equals(nextProps, this.props);
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
      poptextInsert: { ...this.state.poptextInsert, open: false },
      poptextLayoutMirror: { ...this.state.poptextLayoutMirror, open: false },
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
    const target = this.state.poptextEdit.active;

    let payload = {};

    switch (type) {
      case "edit":
        this.setState({
          poptextEdit: {
            ...this.state.poptextEdit,
            open: false,
            active: value
          }
        });
        break;
      case "insert":
        this.setState({
          poptextInsert: {
            ...this.state.poptextInsert,
            open: false
          }
        });

        payload = {
          prop: "enabled",
          value: value === "yes" ? true : false
        };

        if (target === "Header") {
          this.props.onUpdateHeaderConfigHandler(payload);
        }
        if (target === "Footer") {
          this.props.onUpdateFooterConfigHandler(payload);
        }
        break;
      case "layoutMirror":
        this.setState({
          poptextLayoutMirror: {
            ...this.state.poptextLayoutMirror,
            open: false
          }
        });

        payload = {
          prop: "mirrored",
          value: value === "yes" ? true : false
        };

        if (target === "Header") {
          this.props.onUpdateHeaderConfigHandler(payload);
        }
        if (target === "Footer") {
          this.props.onUpdateFooterConfigHandler(payload);
        }
        break;
      case "active":
        this.setState({
          poptextActive: {
            ...this.state.poptextActive,
            open: false
          }
        });

        payload = {
          prop: "activeOn",
          value: value
        };

        if (target === "Header") {
          this.props.onUpdateHeaderConfigHandler(payload);
        }
        if (target === "Footer") {
          this.props.onUpdateFooterConfigHandler(payload);
        }
        break;
      case "height":
        payload = {
          prop: "height",
          value: value
        };

        if (target === "Header") {
          this.props.onUpdateHeaderConfigHandler(payload);
        }
        if (target === "Footer") {
          this.props.onUpdateFooterConfigHandler(payload);
        }
        break;
      default:
        break;
    }
  };

  toggleMenuHandler = () => {
    const show = !this.state.submenuOpened;

    this.setState({ submenuOpened: show }, () => {
      if (this.state.submenuOpened !== false) {
        this.props.addContainerClasses("submenuHeaderFooter", [
          "showHeaderFooter"
        ]);
      } else {
        this.closePoptext();
        this.props.addContainerClasses("submenuHeaderFooter", []);
      }

      payload = {
        prop: "mode",
        value: this.state.submenuOpened ? "edit" : "read"
      };

      this.props.onUpdateHeaderConfigHandler(payload);
      this.props.onUpdateFooterConfigHandler(payload);
    });
  };

  render() {
    console.log("MenuItemHeaderFooter render", this.props);
    const className =
      "projectMenuButtonLink " +
      (this.state.submenuOpened ? "projectMenuButtonSubMenuOpened" : "");

    const { headerCfg, footerCfg } = this.props;

    const target = this.state.poptextEdit.active;

    let enabled = "no";
    let activeOn = "";
    let mirrored = "no";
    let height = 0;

    switch (target) {
      case "Header":
        enabled = headerCfg.enabled ? "yes" : "no";
        activeOn = headerCfg.activeOn;
        mirrored = headerCfg.mirrored ? "yes" : "no";
        height = headerCfg.height;
        break;
      case "Footer":
        enabled = footerCfg.enabled ? "yes" : "no";
        activeOn = footerCfg.activeOn;
        mirrored = footerCfg.mirrored ? "yes" : "no";
        height = footerCfg.height;
        break;
      default:
        break;
    }

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
            <div className="submenuItemHeaderFooterInsert">
              <span>{this.props.t("Enabled")}:</span>
              <SubmenuPoptext
                activeItem={enabled}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="insert"
                items={this.state.poptextInsert.items}
                open={this.state.poptextInsert.open}
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
              <span>{this.props.t("Mirror Layout")}:</span>
              <SubmenuPoptext
                activeItem={mirrored}
                togglePoptext={this.togglePoptextHandler}
                toggleSelectPoptext={this.toggleSelectPoptext}
                poptextName="layoutMirror"
                items={this.state.poptextLayoutMirror.items}
                open={this.state.poptextLayoutMirror.open}
              />
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterActive">
              <span>{this.props.t("Active on")}:</span>
              <SubmenuPoptext
                activeItem={activeOn}
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
              <input
                type="number"
                value={height}
                onChange={event =>
                  debounce(
                    this.toggleSelectPoptext("height", event.target.value),
                    300
                  )
                }
              />
              <span>{this.props.t("mm")}</span>
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterClose">
              <button onClick={() => this.toggleMenuHandler(false)}>
                {this.props.t("Close menu")}
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    headerCfg: headerConfigSelector(state),
    footerCfg: footerConfigSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHeaderConfigHandler: payload =>
      dispatch(updateHeaderconfigProps(payload)),
    onUpdateFooterConfigHandler: payload =>
      dispatch(updateFooterconfigProps(payload))
  };
};

const MenuItemHeaderFooterPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemHeaderFooter")(MenuItemHeaderFooter));

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
