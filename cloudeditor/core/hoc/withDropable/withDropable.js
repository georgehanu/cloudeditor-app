const React = require("react");
const { DropTarget } = require("react-dnd");

const withDropableTarget = WrappedComponent => {
  const WithDropableTarget = class extends React.Component {
    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            ref={this.forwardedRef}
            getReference={this.getReference}
            {...rest}
          />
        </React.Fragment>
      );
    }
  };

  return React.forwardRef((props, ref) => {
    return <WithDropableTarget {...props} forwardedRef={ref} />;
  });
};

module.exports = DropTarget(type, PageTarget, collectDrop)(withDropableTarget);
