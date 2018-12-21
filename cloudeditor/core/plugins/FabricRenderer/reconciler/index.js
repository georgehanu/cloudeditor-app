const React = require("react");
const Reconciler = require("react-reconciler");
const emptyObject = require("fbjs/lib/emptyObject");
const ReactDOMFrameScheduling = require("./ReactDOMFrameScheduling");
const ReactDOMComponentTree = require("./ReactDOMComponentTree");
const { createElement } = require("../utils/createElement");
const logger = require("../../../utils/LoggerUtils");

const UPDATE_SIGNAL = {};

const hostConfig = {
  // cancelDeferredCallback: ReactScheduler.cancelDeferredCallback,
  now: ReactDOMFrameScheduling.now,

  // The Konva renderer is secondary to the React DOM renderer.
  isPrimaryRenderer: false,

  supportsMutation: true,

  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,

  appendInitialChild(canvas, child) {
    logger.info("appendInitialChild", canvas, child);
    objectsRendered++;
    canvas.instance.add(child.instance);
  },

  createInstance(type, props, canvas) {
    logger.info("createInstance", type, props, canvas);

    const instance = createElement(type, props);
    return instance;
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    logger.info(
      "createTextInstance",
      text,
      rootContainerInstance,
      internalInstanceHandle
    );
  },

  finalizeInitialChildren(domElement, type, props) {
    logger.info("finalizeInitialChildren", domElement, type, props);
    return false;
  },

  getPublicInstance(instance) {
    logger.info("getPublicInstance", instance);
    return instance;
  },

  prepareForCommit() {
    logger.info("prepareForCommit");
    // Noop
  },

  prepareUpdate(domElement, type, oldProps, newProps) {
    logger.info("prepareUpdate", domElement, type, oldProps, newProps);
    return UPDATE_SIGNAL;
  },

  resetAfterCommit() {
    const canvas = arguments[0].instance;

    if (canvas.totalChilds === canvas.getObjects().length) {
      canvas.fire("canvas:objects:ready");
      // console.log(
      //   arguments[0].instance.toDataURL({
      //     left: canvas.getCanvasOffsetX(),
      //     top: canvas.getCanvasOffsetY(),
      //     width: canvas.getCanvasWorkingWidth(),
      //     height: canvas.getCanvasWorkingHeight(),
      //     format: "png"
      //   })
      // );
    }
    logger.info("resetAfterCommit");
    // Noop
  },

  resetTextContent(domElement) {
    logger.info("resetTextContent");
    // Noop
  },

  shouldDeprioritizeSubtree(type, props) {
    logger.info("shouldDeprioritizeSubtree", type, props);
    return false;
  },

  getRootHostContext() {
    logger.info("getRootHostContext");
    return emptyObject;
  },

  getChildHostContext() {
    logger.info("getChildHostContext");
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
    logger.info("shouldSetTextContent", type, props);
    return false;
  },

  appendChild(parentInstance, child) {
    logger.info("appendChild", parentInstance, child);
    objectsRendered++;
    parentInstance.instance.add(child.instance);
    child._updatePicture();
  },

  appendChildToContainer(parentInstance, child) {
    //we need to check if the element is already in canvas/ (for bring to front/sent to back)
    if (parentInstance.instance._objects.indexOf(child.instance) > -1) {
      objectsRendered--;
      parentInstance.instance.remove(child.instance);
    }
    logger.info("appendChildToContainer", parentInstance, child);
    objectsRendered++;
    parentInstance.instance.add(child.instance);

    child._updatePicture();
  },

  insertBefore(parentInstance, child, beforeChild) {
    logger.info("insertBefore", parentInstance, child, beforeChild);
  },

  insertInContainerBefore(parentInstance, child, beforeChild) {
    logger.info("insertInContainerBefore", parentInstance, child, beforeChild);

    //we need to check if the element is already in canvas/ (for bring to front/sent to back)
    if (parentInstance.instance._objects.indexOf(child.instance) > -1) {
      objectsRendered--;
      parentInstance.instance.remove(child.instance);
    }

    logger.info("appendChildToContainer", parentInstance, child);
    let index = parentInstance.instance._objects.length - 1;
    if (beforeChild.instance) {
      index = parentInstance.instance._objects.indexOf(beforeChild.instance);
    }
    objectsRendered++;
    parentInstance.instance.insertAt(child.instance, index);

    child._updatePicture();
  },

  removeChild(parentInstance, child) {
    objectsRendered--;
    parentInstance.instance.remove(child.instance);
    logger.info("removeChild", parentInstance, child);
  },

  removeChildFromContainer(parentInstance, child) {
    objectsRendered--;
    parentInstance.instance.remove(child.instance);
    logger.info("removeChildFromContainer", parentInstance, child);
  },

  commitTextUpdate(textInstance, oldText, newText) {
    logger.info("commitTextUpdate", textInstance, oldText, newText);
  },

  commitMount(instance, type, newProps) {
    logger.info("commitMount", instance, type, newProps);
    // Noop
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    logger.info(
      "commitUpdate",
      instance,
      updatePayload,
      type,
      oldProps,
      newProps
    );

    instance._applyProps(newProps, oldProps);
  }
};

const FabricRenderer = Reconciler(hostConfig);

FabricRenderer.injectIntoDevTools({
  findFiberByHostInstance: ReactDOMComponentTree.getClosestInstanceFromNode,
  bundleType: process.env.NODE_ENV !== "production" ? 1 : 0,
  version: React.version || 16,
  rendererPackageName: "react-fabric",
  getInspectorDataForViewTag: (...args) => {
    console.log(args);
  }
});

module.exports = FabricRenderer;
