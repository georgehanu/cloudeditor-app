const React = require("react");
const { connect } = require("react-redux");
const { propEq, find, clone, pathOr, pick, omit } = require("ramda");
var now = require("performance-now");
const isEqual = require("react-fast-compare");
const Utils = require("../../../../../utils/UtilUtils");

const ObjectBlock = require("./Object");

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

  static getDerivedStateFromProps(nextProps, prevState) {
    const ids = nextProps.objects.map(function(obj) {
      return obj.id;
    });

    const start = now();
    let pageBlocksIds = getPageBlocksIds(ids, nextProps.objectsData);
    pageBlocksData = pick(pageBlocksIds, nextProps.objectsData);
    const end = now();

    //console.log("getPageBlocks", (end - start).toFixed(15), pageBlocksData);
    return { pageBlocksData };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const omitList = ["objectsData"];
    const pProps = omit(omitList, this.props);
    const nProps = omit(omitList, nextProps);
    if (isEqual(nextState, this.state) && isEqual(pProps, nProps)) {
      return false;
    }
    //console.log("update");
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

      obj["type"] = objectData["type"];
      obj["subType"] = objectData["subType"];
      obj["zoomScale"] = zoomScale;
      obj["innerPage"] = clone(obj.parent.innerPage);

      const objectsIds = pathOr([], ["objectsIds"], objectData);
      if (objectsIds.length) {
        let newObjects = [];

        objIds = objectsIds;

        newObjects = objIds.reduce(function(acc, cV, _) {
          acc.push({
            id: cV,
            uuid: obj["uuid"] + "--" + cV,
            level: obj.parent.level + 1,
            parent: obj
          });
          return acc;
        }, newObjects);

        return (
          <ObjectBlock
            key={bUuid}
            id={bId}
            uuid={bUuid}
            zoomScale={zoomScale}
            snapTolerance={snapTolerance}
            checkErrorMessages={that.props.checkErrorMessages}
            middle={middle}
            viewOnly={viewOnly}
            data={objectData}
            {...obj}
          >
            {that.recursiveRenderBlocks(newObjects, objectsData)}
          </ObjectBlock>
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
          checkErrorMessages={that.props.checkErrorMessages}
          viewOnly={viewOnly}
          data={objectData}
          {...obj}
        />
      );
    });
  }
  render() {
    const render = this.recursiveRenderBlocks(
      this.props.objects,
      this.state.pageBlocksData
    );

    return render;
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
