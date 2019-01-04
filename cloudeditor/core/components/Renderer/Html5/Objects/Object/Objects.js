const React = require("react");
const { connect } = require("react-redux");
const { propEq, find, clone, pathOr, pick, omit } = require("ramda");
const objectAssign = require("object-assign");
var now = require("performance-now");
const isEqual = require("react-fast-compare");

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

function getPageBlocks(ids, objectsData) {
  if (Array.isArray(ids)) {
    return ids.reduce(function(done, cId) {
      if (objectsData[cId].hasOwnProperty("objectsIds"))
        return objectAssign(
          done,
          getPageBlocks(objectsData[cId].objectsIds, objectsData)
        );

      return pick(ids, objectsData);
    }, {});
  }

  return {};
}

function getPageBlocksIds(arr, data) {
  if (Array.isArray(arr)) {
    return arr.reduce(function(done, curr) {
      if (data[curr].hasOwnProperty("objectsIds"))
        return done.concat(
          [data[curr].id].concat(getPageBlocksIds(data[curr].objectsIds, data))
        );
      return done.concat(data[curr].id);
    }, []);
  } else {
    return arr;
  }
}

class Blocks extends React.Component {
  state = {
    pageBlocksData: {}
  };

  static getDerivedStateFromProps(nextProps) {
    const ids = nextProps.objects.map(function(obj) {
      return obj.id;
    });

    const start = now();
    let pageBlocksIds = getPageBlocksIds(ids, nextProps.objectsData);
    pageBlocksData = pick(pageBlocksIds, nextProps.objectsData);
    const end = now();

    console.log("getPageBlocks1", (end - start).toFixed(15), pageBlocksData);
    return { pageBlocksData };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const pProps = omit(["objectsData"], this.props);
    const nProps = omit(["objectsData"], nextProps);
    if (isEqual(nextState, this.state) && isEqual(pProps, nProps)) {
      return false;
    }
    return true;
  }

  recursiveRenderBlocks(objects, objectsData) {
    const { zoomScale, snapTolerance, middle, viewOnly } = this.props;
    let that = this;
    const bUuids = objects.map(function(obj) {
      return obj.uuid;
    });
    return bUuids.map(function(bUuid) {
      const obj = find(propEq("uuid", bUuid), objects);
      const bId = obj.id;
      const objectData = objectsData[bId];
      obj["offsetLeft"] = obj.parent.left + obj.parent.innerPage.offset.left;
      obj["offsetTop"] = obj.parent.top + obj.parent.innerPage.offset.top;

      const objectsIds = pathOr([], ["objectsIds"], objectsData);
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

        objIds = objectsData[bId]["objectsIds"];

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
    //return null;
    //const { objects, zoomScale, snapTolerance, middle, viewOnly } = this.props;

    const start1 = now();
    const render = this.recursiveRenderBlocks(
      this.props.objects,
      this.state.pageBlocksData
    );
    const end1 = now();

    console.log("recursiveRenderBlocks", (end1 - start1).toFixed(15));

    return render;
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
