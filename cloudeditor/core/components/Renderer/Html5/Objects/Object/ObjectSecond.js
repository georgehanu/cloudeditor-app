const React = require("react");
const { connect } = require("react-redux");
const { compose } = require("redux");

const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const withSnap = require("../hoc/withSnap/withSnap");

const InnerBlockLoader = require("./Object");

class BaseBlock extends React.Component {
  render() {
    return 1223;
  }
}

class BlockLoader extends React.Component {
  render() {
    if (this.props.loader === 1) return <BaseBlock />;
    return (
      <React.Fragment>
        <BaseBlock />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { objects: state.objects };
};

module.exports = connect(
  mapStateToProps,
  null
)(
  compose(
    withDraggable,
    withResizable,
    withRotatable,
    withSnap
  )(BlockLoader)
);
