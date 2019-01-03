const React = require("react");
const { connect } = require("react-redux");
const { propEq, find, clone } = require("ramda");

const ObjectBlock = require("./Object");

const flattenIds = (ids, objectsData, parents, parent) => {
  if (Array.isArray(ids)) {
    return ids.reduce(function(done, curr) {
      let elementData = find(propEq("uuid", curr), parents);
      if (parent) {
        elementData = clone(parent);
        elementData["id"] = curr;
        elementData["uuid"] = parent["uuid"] + "-" + curr;
      }
      const cId = elementData.id;

      if (objectsData[cId].hasOwnProperty("objectsIds"))
        return done.concat(
          [{ ...elementData }].concat(
            flattenIds(
              objectsData[cId].objectsIds,
              objectsData,
              parents,
              elementData
            )
          )
        );

      return done.concat({ ...elementData });
    }, []);
  } else {
    return ids;
  }
};

class Blocks extends React.Component {
  render() {
    const { objects, zoomScale, snapTolerance, middle, viewOnly } = this.props;
    const ids = objects.map(function(obj) {
      return obj.uuid;
    });
    const objectsOffset = flattenIds(
      ids,
      this.props.objectsData,
      objects,
      null
    );

    console.log("objectsOffset", objectsOffset);

    return objectsOffset.map(obj => {
      const { id, uuid, ...objProps } = obj;
      //return null;

      return (
        <ObjectBlock
          key={uuid}
          id={id}
          uuid={uuid}
          zoomScale={zoomScale}
          snapTolerance={snapTolerance}
          middle={middle}
          viewOnly={viewOnly}
          {...objProps}
        />
      );
    });
  }
}

const mapStateToProps = (state, props) => {
  return {
    objectsData: state.project.objects
  };
};

module.exports = connect(
  mapStateToProps,
  null
)(Blocks);
