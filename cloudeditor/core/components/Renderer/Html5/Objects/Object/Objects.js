const React = require("react");
const { connect } = require("react-redux");
const { propEq, find, clone, pathOr } = require("ramda");

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
  state = {
    pageBlocksData: {}
  };

  recursiveRenderBlocks(objects) {
    const { zoomScale, snapTolerance, middle, viewOnly } = this.props;
    let that = this;
    const bUuids = objects.map(function(obj) {
      return obj.uuid;
    });
    return bUuids.map(function(bUuid) {
      const obj = find(propEq("uuid", bUuid), objects);
      const bId = obj.id;
      const objectData = that.props.objectsData[bId];
      obj["offsetLeft"] = obj.parent.left + obj.parent.innerPage.offset.left;
      obj["offsetTop"] = obj.parent.top + obj.parent.innerPage.offset.top;

      const objectsIds = pathOr([], ["objectsIds"], objectData);
      if (objectsIds.length) {
        let newObjects = [];

        let parent = {
          id: bId,
          uuid: bUuid,
          width: objectData.width,
          height: objectData.height,
          top: objectData.top,
          left: objectData.left,
          innerPage: obj.parent.innerPage,
          parent: obj.parent
        };

        // if (includes(obj.subType, ["header", "footer"])) {
        //   parent["width"] = obj.parent.width + 2 * obj.parent.left;
        // }

        objIds = that.props.objectsData[bId]["objectsIds"];

        newObjects = objIds.reduce(function(acc, cV, _) {
          acc.push({
            id: cV,
            uuid: obj["uuid"] + "-" + cV,
            parent
          });
          return acc;
        }, newObjects);

        return (
          <React.Fragment>
            <ObjectBlock
              key={bUuid}
              id={bId}
              uuid={bUuid}
              zoomScale={zoomScale}
              snapTolerance={snapTolerance}
              middle={middle}
              viewOnly={viewOnly}
              {...obj}
            >
              {that.recursiveRenderBlocks(newObjects)}
            </ObjectBlock>
          </React.Fragment>
        );
      }

      return (
        <ObjectBlock
          key={bUuid}
          id={bId}
          uuid={bUuid}
          zoomScale={zoomScale}
          snapTolerance={snapTolerance}
          middle={middle}
          viewOnly={viewOnly}
          {...obj}
        />
      );
    });
  }
  render() {
    //const { objects, zoomScale, snapTolerance, middle, viewOnly } = this.props;

    return this.recursiveRenderBlocks(this.props.objects);
    //const newObjects = flattenIds(ids, this.props.objectsData, objects, null);
  }
}

const mapStateToProps = (state, props) => {
  return {
    objectsData: state.project.objects,
    configs: state.project.configs.objects
  };
};

module.exports = connect(
  mapStateToProps,
  null
)(Blocks);
