const { forEachObjIndexed, toUpper, isEmpty, forEach } = require("ramda");

const applyLiquidRules = payloadData => {
  let realProductDim = {
      width: parseFloat(payloadData.realDimension.width),
      height: parseFloat(payloadData.realDimension.height)
    },
    alternateLayout = payloadData.layout;
  return { ...alternateLayout };
  if (!isEmpty(alternateLayout.pages)) {
    forEachObjIndexed((pageData, pKey) => {
      let scale = Math.min(
        realProductDim.height / pageData.height,
        realProductDim.width / pageData.width
      );
      switch (pageData.rule) {
        case "SCALE":
          if (!isEmpty(pageData.objectsIds)) {
            forEach(blockID => {
              if (alternateLayout.objects[blockID]) {
                let newLeft =
                    alternateLayout.objects[blockID].left * scale +
                    (realProductDim.width - pageData.width * scale) / 2,
                  newTop =
                    alternateLayout.objects[blockID].top * scale +
                    (realProductDim.height - pageData.height * scale) / 2;

                alternateLayout = {
                  ...alternateLayout,
                  objects: {
                    ...alternateLayout.objects,
                    [blockID]: {
                      ...alternateLayout.objects[blockID],
                      width: alternateLayout.objects[blockID].width * scale,
                      height: alternateLayout.objects[blockID].height * scale,
                      left: newLeft,
                      top: newTop,
                      scaleX: 1,
                      scaleY: 1
                    }
                  }
                };
              }
            }, pageData.objectsIds);
          }
          break;
        case "reCenter":
          if (!isEmpty(pageData.objectsIds)) {
            forEach(blockID => {
              if (alternateLayout.objects[blockID]) {
                let newLeft =
                    alternateLayout.objects[blockID].left +
                    (realProductDim.width - pageData.width) / 2,
                  newTop =
                    alternateLayout.objects[blockID].top +
                    (realProductDim.height - pageData.height) / 2;

                alternateLayout = {
                  ...alternateLayout,
                  objects: {
                    ...alternateLayout.objects,
                    [blockID]: {
                      ...alternateLayout.objects[blockID],
                      left: newLeft,
                      top: newTop
                    }
                  }
                };
              }
            }, pageData.objectsIds);
          }
          break;
        case "objectBased":
        case "OBJECT_BASED":
        case "GUIDE_BASED":
          if (!isEmpty(pageData.objectsIds)) {
            forEach(blockID => {
              if (alternateLayout.objects[blockID]) {
                let newWidth = alternateLayout.objects[blockID].width,
                  newHeight = alternateLayout.objects[blockID].height,
                  newLeft = alternateLayout.objects[blockID].left,
                  newTop = alternateLayout.objects[blockID].top;

                if (
                  alternateLayout.objects[blockID].hasOwnProperty(
                    "rule_properties"
                  )
                ) {
                  if (
                    alternateLayout.objects[blockID].rule_properties[
                      "widthResizable"
                    ]
                  ) {
                    const scaleWidth = realProductDim.width / pageData.width;
                    newWidth =
                      alternateLayout.objects[blockID].width * scaleWidth;

                    if (
                      alternateLayout.objects[blockID].rule_properties[
                        "leftMarginFixed"
                      ] &&
                      alternateLayout.objects[blockID].rule_properties[
                        "rightMarginFixed"
                      ]
                    ) {
                      newWidth =
                        alternateLayout.objects[blockID].width +
                        (realProductDim.width - pageData.width);
                    }
                  }
                  if (
                    alternateLayout.objects[blockID].rule_properties[
                      "heightResizable"
                    ]
                  ) {
                    const scaleHeight = realProductDim.height / pageData.height;
                    newHeight =
                      alternateLayout.objects[blockID].height * scaleHeight;

                    if (
                      alternateLayout.objects[blockID].rule_properties[
                        "topMarginFixed"
                      ] &&
                      alternateLayout.objects[blockID].rule_properties[
                        "topMarginFixed"
                      ]
                    ) {
                      newHeight =
                        alternateLayout.objects[blockID].height +
                        (realProductDim.height - pageData.height);
                    }
                  }

                  if (
                    !alternateLayout.objects[blockID].rule_properties[
                      "topMarginFixed"
                    ]
                  ) {
                    newTop =
                      alternateLayout.objects[blockID].top +
                      (realProductDim.height - pageData.height) / 2 -
                      (newHeight - alternateLayout.objects[blockID].height);
                  }
                  if (
                    !alternateLayout.objects[blockID].rule_properties[
                      "leftMarginFixed"
                    ]
                  ) {
                    newLeft =
                      alternateLayout.objects[blockID].left +
                      (realProductDim.width - pageData.width) / 2 -
                      (newWidth - alternateLayout.objects[blockID].width);
                  }
                  if (
                    alternateLayout.objects[blockID].rule_properties[
                      "rightMarginFixed"
                    ]
                  ) {
                    newLeft =
                      alternateLayout.objects[blockID].left +
                      (realProductDim.width - pageData.width) -
                      (newWidth - alternateLayout.objects[blockID].width);
                  }
                  if (
                    alternateLayout.objects[blockID].rule_properties[
                      "bottomMarginFixed"
                    ]
                  ) {
                    newTop =
                      alternateLayout.objects[blockID].top +
                      (realProductDim.height - pageData.height) -
                      (newHeight - alternateLayout.objects[blockID].height);
                  }
                }
                alternateLayout = {
                  ...alternateLayout,
                  objects: {
                    ...alternateLayout.objects,
                    [blockID]: {
                      ...alternateLayout.objects[blockID],
                      width: newWidth,
                      height: newHeight,
                      left: newLeft,
                      top: newTop
                    }
                  }
                };
              }
            }, pageData.objectsIds);
          }
          break;
      }
      alternateLayout = {
        ...alternateLayout,
        pages: {
          ...alternateLayout.pages,
          [pKey]: {
            ...alternateLayout.pages[pKey],
            width: realProductDim.width,
            height: realProductDim.height
          }
        }
      };
    }, alternateLayout.pages);
  }

  return { ...alternateLayout };
};

module.exports = { applyLiquidRules };
