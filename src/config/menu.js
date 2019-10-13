import { findIndex } from "lodash";

import { getPixelsInFrame, getPixelsInScope, getPivot } from "../utils";

const getDefaultMenuConfig = props => {
  const { clipboard, frame, layer, layers, pixels, selection, size } = props;

  const SEPERATOR = { type: "separator" };

  const aboutOption = {
    label: `About ${APPNAME}`,
    click: () => {
      props.modalShow("ModalAbout");
    },
  };

  // -------------------------------------------------------------------------------------------

  const editMenu = {
    label: "Edit",
    screen: ["paint"],
    submenu: [
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          props.pixelsCut(frame, layer, scopedPixels, pixels);
        },
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          props.pixelsCopy(frame, layer, scopedPixels);
        },
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        click: () => {
          props.pixelsPaste(frame, layer, clipboard);
        },
      },
      {
        label: "Delete",
        accelerator: "Backspace",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          props.pixelsDelete(frame, layer, scopedPixels, pixels);
        },
      },
      SEPERATOR,
      {
        label: "Rotate 180°",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          const pivot = getPivot(size, selection);
          props.pixelsRotate(frame, layer, scopedPixels, 180, pivot, size);
        },
      },
      {
        label: "Rotate 90° CW",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          const pivot = getPivot(size, selection);
          props.pixelsRotate(frame, layer, scopedPixels, 90, pivot, size);
        },
      },
      {
        label: "Rotate 90° CCW",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          const pivot = getPivot(size, selection);
          props.pixelsRotate(frame, layer, scopedPixels, -90, pivot, size);
        },
      },
      SEPERATOR,
      {
        label: "Flip Horizontal",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          const pivot = getPivot(size, selection);
          props.pixelsFlipHorizontal(frame, layer, scopedPixels, pivot, size);
        },
      },
      {
        label: "Flip Vertical",
        click: () => {
          const scopedPixels = getPixelsInScope(
            frame,
            layer,
            pixels,
            selection
          );
          const pivot = getPivot(size, selection);
          props.pixelsFlipVertical(frame, layer, scopedPixels, pivot, size);
        },
      },
      SEPERATOR,
      {
        label: "Replace color…",
        click: () => {
          props.modalShow("ModalReplaceColor");
        },
      },
      // {label: "Image size…", click: () => { props.modalShow("ModalEditImageSize"); }}
    ],
  };

  // -------------------------------------------------------------------------------------------

  const selectMenu = {
    label: "Select",
    screen: ["paint"],
    submenu: [
      {
        label: "All",
        accelerator: "CmdOrCtrl+A",
        click: () => {
          props.selectionStart({ x: 1, y: 1 });
          props.selectionEnd({ x: size.width, y: size.height });
        },
      },
      {
        label: "Deselect",
        accelerator: "CmdOrCtrl+D",
        click: props.selectionClear,
      },
    ],
  };

  // -------------------------------------------------------------------------------------------

  const layerMenu = {
    label: "Layer",
    screen: ["paint"],
    submenu: [
      {
        label: "Merge with layer above",
        accelerator: "CmdOrCtrl+E",
        click: () => {
          const index = findIndex(layers, { id: layer });
          let layerAbove = null;
          if (layers[index - 1]) {
            layerAbove = layers[index - 1].id;
            props.layerMerge(frame, layerAbove, layer, pixels);
          }
        },
      },
      {
        label: "Merge with layer below",
        accelerator: "CmdOrCtrl+Shift+E",
        click: () => {
          const index = findIndex(layers, { id: props.layer });
          let layerBelow = null;
          if (layers[index + 1]) {
            layerBelow = layers[index + 1].id;
            props.layerMerge(frame, layer, layerBelow, pixels);
          }
        },
      },
    ],
  };

  // -------------------------------------------------------------------------------------------

  const frameMenu = {
    label: "Frame",
    screen: ["paint"],
    submenu: [
      {
        label: "Rotate 180°",
        click: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          props.frameRotate(frame, framePixels, 180, pivot, size);
        },
      },
      {
        label: "Rotate 90° CW",
        click: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          props.frameRotate(frame, framePixels, 90, pivot, size);
        },
      },
      {
        label: "Rotate 90° CCW",
        click: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          props.frameRotate(frame, framePixels, -90, pivot, size);
        },
      },
      SEPERATOR,
      {
        label: "Flip Horizontal",
        click: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          props.frameFlipHorizontal(frame, framePixels, pivot, size);
        },
      },
      {
        label: "Flip Vertical",
        click: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          props.frameFlipVertical(frame, framePixels, pivot, size);
        },
      },
      SEPERATOR,
      {
        label: "Duplicate…",
        click: () => {
          props.modalShow("ModalDuplicateFrame");
        },
      },
    ],
  };

  // -------------------------------------------------------------------------------------------

  const windowMenu = {
    label: "Window",
    screen: ["paint", "export"],
    submenu: [
      {
        label: "Paint",
        accelerator: "CmdOrCtrl+1",
        click: () => {
          props.screenSelect("paint");
        },
      },
      {
        label: "Export",
        accelerator: "CmdOrCtrl+2",
        click: () => {
          props.screenSelect("export");
        },
      },
    ],
  };

  // -------------------------------------------------------------------------------------------

  return {
    aboutOption,
    editMenu,
    selectMenu,
    layerMenu,
    frameMenu,
    windowMenu,
    SEPERATOR,
  };
};

export default getDefaultMenuConfig;
