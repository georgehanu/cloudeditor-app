const { isEmpty, forEachObjIndexed } = require("ramda");
const { updateCropParams } = require("../../core/stores/actions/project");
const {
  updateObjFromVariableInit
} = require("../../core/stores/actions/variables");
const smartcrop = require("smartcrop");

const applyVariables = (store, ConfigUtils) => {
  const state = store.getState();

  store.dispatch(
    updateObjFromVariableInit({
      objects: state.project.objects,
      variables: state.variables.variables
    })
  );
};

const applySmartcropToProject = (store, ConfigUtils) => {
  const state = store.getState();

  const project = state.project;

  const baseUrl = ConfigUtils.getConfigProp("baseUrl");
  const assetsRelativePath = ConfigUtils.getConfigProp("assetsRelativePath");

  if (!isEmpty(project.objects)) {
    forEachObjIndexed((image, iKey) => {
      const { type, resizeStrategy } = image;

      const smartCrop = resizeStrategy === "smartCrop" ? 1 : 0;
      if (type === "image") {
        if (smartCrop) {
          let img = new Image();
          img.src = baseUrl + assetsRelativePath + image.image_src;
          img.onload = () => {
            window.setTimeout(() => {
              smartcrop
                .crop(img, {
                  width: image.width,
                  height: image.height,
                  boost: [
                    {
                      x: image.cropX,
                      y: image.cropY,
                      width: image.cropW,
                      height: image.cropH,
                      weight: 0
                    }
                  ]
                })
                .then(result => {
                  const { x, y, width, height } = result.topCrop;
                  store.dispatch(
                    updateCropParams({
                      id: iKey,
                      props: {
                        cropX: x,
                        cropY: y,
                        cropW: width,
                        cropH: height
                      }
                    })
                  );
                });
            }, 10);
          };
        }
      }
    }, project.objects);
  }
};

module.exports = [applySmartcropToProject, applyVariables];
