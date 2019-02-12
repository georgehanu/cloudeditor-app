const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");
const SubmenuPoptext = require("./components/SubmenuPoptext");
const SubmenuLayout = require("./components/SubmenuLayout");
const { withNamespaces } = require("react-i18next");
const { debounce } = require("underscore");
const posed = require("react-pose").default;
const Box = posed.div({
  visible: { top: 30 },
  hidden: { top: 0 }
});

const {
  headerConfigSelector,
  footerConfigSelector,
  getHeaderEditorSelector,
  getFooterEditorSelector
} = require("../../core/stores/selectors/project");

const {
  updateHeaderconfigProps,
  updateFooterconfigProps,
  changeModeHeaderFooter
} = require("../../core/stores/actions/project");
require("./menuItemHeaderFooter.css");
class MenuItemHeaderFooter extends React.Component {
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
    if (this.props.headerEditor) {
      this.setState({
        submenuOpened: true,
        poptextEdit: {
          items: ["Header"],
          active: "Header",
          open: false
        },
        poptextInsert: {
          items: ["yes"],
          open: false
        },
        poptextLayoutMirror: null,
        poptextActive: {
          items: ["all"],
          active: "all",
          open: false
        },
        poptextLayouts: null
      });
    }
    if (this.props.footerEditor) {
      this.setState({
        submenuOpened: true,
        poptextEdit: {
          items: ["Footer"],
          active: "Footer",
          open: false
        },
        poptextInsert: {
          items: ["yes"],
          open: false
        },
        poptextLayoutMirror: null,
        poptextActive: {
          items: ["all"],
          active: "all",
          open: false
        },
        poptextLayouts: null
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  closePoptext = () => {
    this.setState({
      poptextEdit: { ...this.state.poptextEdit, open: false },
      poptextInsert: { ...this.state.poptextInsert, open: false },
      poptextLayoutMirror: { ...this.state.poptextLayoutMirror, open: false },
      poptextActive: { ...this.state.poptextActive, open: false },
      poptextLayouts: { ...this.state.poptextLayouts, open: false }
    });
  };

  togglePoptextHandler = (type, hide = false) => {
    if (type === "edit") {
      if (this.state.poptextEdit.open === false) {
        this.closePoptext();
      }

      this.setState({
        poptextEdit: {
          ...this.state.poptextEdit,
          open: hide ? false : !this.state.poptextEdit.open
        }
      });
    } else if (type === "insert") {
      if (this.state.poptextInsert.open === false) {
        this.closePoptext();
      }
      this.setState({
        poptextInsert: {
          ...this.state.poptextInsert,
          open: hide ? false : !this.state.poptextInsert.open
        }
      });
    } else if (type === "layoutMirror") {
      if (this.state.poptextLayoutMirror.open === false) {
        this.closePoptext();
      }

      this.setState({
        poptextLayoutMirror: {
          ...this.state.poptextLayoutMirror,
          open: hide ? false : !this.state.poptextLayoutMirror.open
        }
      });
    } else if (type === "active") {
      if (this.state.poptextActive.open === false) {
        this.closePoptext();
      }
      this.setState({
        poptextActive: {
          ...this.state.poptextActive,
          open: hide ? false : !this.state.poptextActive.open
        }
      });
    } else if (type === "layouts") {
      if (this.state.poptextLayouts.open === false) {
        this.closePoptext();
      }
      this.setState({
        poptextLayouts: {
          ...this.state.poptextLayouts,
          open: hide ? false : !this.state.poptextLayouts.open
        }
      });
    }
  };

  toggleSelectPoptext = (type, value) => {
    const target = this.state.poptextEdit.active;

    let payload = {};

    switch (type) {
      case "edit":
        this.setState(
          {
            poptextEdit: {
              ...this.state.poptextEdit,
              open: false,
              active: value
            }
          },
          () => {
            if (this.state.poptextEdit.active === "Header") {
              this.props.onUpdateHeaderFooterConfigPropsHandler({
                header: { prop: "mode", value: "edit" },
                footer: { prop: "mode", value: "read" }
              });
            } else {
              this.props.onUpdateHeaderFooterConfigPropsHandler({
                header: { prop: "mode", value: "read" },
                footer: { prop: "mode", value: "edit" }
              });
            }
          }
        );
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
        this.props.addContainerClasses(
          "submenuHeaderFooter",
          ["showHeaderFooter"],
          true
        );
      } else {
        this.closePoptext();
        this.props.addContainerClasses("submenuHeaderFooter", [], true);
      }

      if (this.state.submenuOpened === false) {
        this.props.onUpdateHeaderFooterConfigPropsHandler({
          header: { prop: "mode", value: "read" },
          footer: { prop: "mode", value: "read" }
        });
      } else {
        if (this.state.poptextEdit.active === "Header") {
          this.props.onUpdateHeaderConfigHandler({
            prop: "mode",
            value: "edit"
          });
        } else {
          this.props.onUpdateFooterConfigHandler({
            prop: "mode",
            value: "edit"
          });
        }
      }
    });
  };

  resetInitialHeight = () => {
    if (this.state.poptextEdit.active === "Header") {
      this.props.onUpdateHeaderConfigHandler({
        prop: "height",
        value: this.props.headerCfg.initialHeight
      });
    } else {
      this.props.onUpdateFooterConfigHandler({
        prop: "height",
        value: this.props.footerCfg.initialHeight
      });
    }
  };

  render() {
    //console.log("render footer");
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

    const classNameSubMenu =
      "submenuItemHeaderFooter submenuItemHeaderFooterFirst";

    return (
      <React.Fragment>
        <div className={className}>
          <ProjectMenuButton
            active={this.props.active}
            clicked={() => this.toggleMenuHandler(true)}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            {this.props.t(this.props.text)}
          </ProjectMenuButton>
        </div>
        <Box
          className={classNameSubMenu}
          pose={this.state.submenuOpened ? "visible" : "hidden"}
        >
          <div className="submenuItemHeaderFooter">
            <div className="submenuItemHeaderFooterEdit">
              {!this.props.headerEditor && !this.props.footerEditor && (
                <React.Fragment>
                  <span>{this.props.t("Edit")}:</span>
                  <SubmenuPoptext
                    activeItem={this.state.poptextEdit.active}
                    togglePoptext={this.togglePoptextHandler}
                    toggleSelectPoptext={this.toggleSelectPoptext}
                    poptextName="edit"
                    items={this.state.poptextEdit.items}
                    open={this.state.poptextEdit.open}
                    t={this.props.t}
                  />
                </React.Fragment>
              )}
            </div>
            {!this.props.headerEditor && !this.props.footerEditor && (
              <React.Fragment>
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
                    t={this.props.t}
                  />
                </div>
              </React.Fragment>
            )}
            {!this.props.headerEditor && !this.props.footerEditor && (
              <React.Fragment>
                <span className="submenuSepatator">{"|"}</span>
                <div className="submenuItemHeaderFooterLayouts">
                  <SubmenuLayout
                    activeItem={this.state.poptextLayouts.active}
                    togglePoptext={this.togglePoptextHandler}
                    toggleSelectPoptext={this.toggleSelectPoptext}
                    poptextName="layouts"
                    items={this.state.poptextLayouts.items}
                    open={this.state.poptextLayouts.open}
                    t={this.props.t}
                  />
                </div>{" "}
              </React.Fragment>
            )}
            {!this.props.headerEditor && !this.props.footerEditor && (
              <React.Fragment>
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
                    t={this.props.t}
                  />
                </div>{" "}
              </React.Fragment>
            )}
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterActive">
              {!this.props.headerEditor && !this.props.footerEditor && (
                <React.Fragment>
                  <span>{this.props.t("Active on")}:</span>
                  <SubmenuPoptext
                    activeItem={activeOn}
                    togglePoptext={this.togglePoptextHandler}
                    toggleSelectPoptext={this.toggleSelectPoptext}
                    poptextName="active"
                    items={this.state.poptextActive.items}
                    open={this.state.poptextActive.open}
                    t={this.props.t}
                  />
                </React.Fragment>
              )}
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
              <button
                className="submenuItemHeaderFooterHeightReset"
                onClick={this.resetInitialHeight}
              >
                {this.props.t("Reset Height")}
              </button>
            </div>
            <span className="submenuSepatator">{"|"}</span>
            <div className="submenuItemHeaderFooterClose">
              <button onClick={() => this.toggleMenuHandler(false)}>
                {this.props.t("Close menu")}
              </button>
            </div>
          </div>
        </Box>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    headerCfg: headerConfigSelector(state),
    footerCfg: footerConfigSelector(state),
    headerEditor: getHeaderEditorSelector(state),
    footerEditor: getFooterEditorSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateHeaderFooterConfigPropsHandler: payload =>
      dispatch(changeModeHeaderFooter(payload)),
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
