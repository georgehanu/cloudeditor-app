const { debounce } = require("underscore");
const { forEach } = require("ramda");

const { fabric } = require("../../../rewrites/fabric/fabric");
const { TextboxTypes, TextboxDefaults } = require("./types/textbox");
const Text = require("./Text");

class Textbox extends Text {
  _initInstance() {
    this.setMapValueStateToFabric({
      // bold: {
      //   true: "bold",
      //   false: ""
      // },
      // italic: {
      //   true: "italic",
      //   false: ""
      // },
      // underline: {
      //   true: true,
      //   false: false
      // }
    });
    this.setMapKeysStateToFabric({
      // bold: "fontWeight",
      // italic: "fontStyle",
      // underline: "underline"
    });

    let props = { ...this.props };
    delete props.variables;
    delete props.dispatch;

    props = this._mapStatePropsToFabric(props);
    this.instance = new fabric.Textbox(props.text, props);
    this.attachEvents();
    this.instance.isLoaded = 1;
    this._applyProps(props);
  }
  checkForVariables(variables, text) {
    if (variables && variables.length) {
      forEach(variable => {
        text = text.replace(
          new RegExp("%" + variable.display_name + "%", "g"),
          variable.prefix + variable.value + variable.sufix
        );
      }, variables);
    }
    return text;
  }
  deleteSkipProps(props) {}
  attachEvents() {
    this.instance.on(
      "changed",
      debounce(e => {
        if (
          this.instance.designerCallbacks &&
          typeof this.instance.designerCallbacks.updateObjectProps ===
            "function"
        ) {
          this.instance.designerCallbacks.updateObjectProps({
            id: this.instance.id,
            props: {
              fontSize: this.instance.fontSize / this.instance.scale,
              text: this.instance.text
            }
          });
        }
      })
    );
  }
}

Textbox.propTypes = TextboxTypes;
Textbox.defaultProps = TextboxDefaults;

module.exports = Textbox;
