const React = require("react");
const ObjectBlock = require("./Object/Object");
const Tinymce = require("./Tinymce/Tinymce");

const objects = props => (
  <React.Fragment>
    {Object.keys(props.items).map(obKey => {
      let {
        width,
        height,
        left,
        top,
        offsetLeft,
        offsetTop,
        rotatable,
        resizable,
        ...otherProps
      } = props.items[obKey];
      if (props.viewOnly) {
        offsetLeft = 0;
        offsetTop = 0;
      }

      const scale = props.scale;

      if (props.items[obKey].type === "tinymce") {
        return (
          <Tinymce
            key={obKey}
            tableContent={props.items[obKey].tableContent}
            height={height}
            width={width}
          />
        );
      }

      return (
        <ObjectBlock
          key={obKey}
          scale={scale}
          width={width * scale}
          height={height * scale}
          offsetLeft={offsetLeft}
          offsetTop={offsetTop}
          left={(left + offsetLeft) * scale}
          top={(top + offsetTop) * scale}
          {...otherProps}
          onUpdateProps={props.onUpdateProps}
          onTextChange={props.onTextChange}
        />
      );
    })}
  </React.Fragment>
);

module.exports = objects;
