import React from "react";
import _ from "lodash";

import { getPixelsInFrame, getPixelsInScope, getPivot } from "../../utils";

const SEPERATOR = {label: "---"};

class Menu extends React.Component {
  render() {
    const { clipboard, frame, layer, layers, pixels, selection, size } = this.props;
    const MenuConfig = [
      {label: "@@name", items: [
        {label: "About @@name", action: () => { this.props.modalShow("ModalAbout"); }},
        // SEPERATOR,
        // {label: "Quit @@name"}, // TODO: Desktop only
      ]},
      {label: "File", items: [
        {label: "New…", action: () => { this.props.modalShow("ModalNewFile"); }},
        {label: "Open…", action: () => { this.props.modalShow("ModalLoadFile"); }}, // TODO: show modal only in browser
        {label: "Save", action: () => { this.props.modalShow("ModalSaveFile"); }}, // TODO: show modal only in browser
        // {label: "Save as…"}, // TODO: Desktop only
        {label: "Import…", action: () => { this.props.modalShow("ModalImportFile"); }},
        SEPERATOR,
        {label: "Close", action: () => {
          this.props.modalShow("ModalSaveFile"); // TODO: show modal only in browser
          this.props.screenSelect("start");
        }},
      ]},
      {label: "Edit", items: [
        {label: "Cut", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          this.props.pixelsCut(frame, layer, scopedPixels);
        }},
        {label: "Copy", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          this.props.pixelsCopy(frame, layer, scopedPixels);
        }},
        {label: "Paste", action: () => {
          this.props.pixelsPaste(frame, layer, clipboard);
        }},
        {label: "Delete", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          this.props.pixelsDelete(frame, layer, scopedPixels);
        }},
        SEPERATOR,
        {label: "Rotate 180°", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          const pivot = getPivot(size, selection);
          this.props.pixelsRotate(frame, layer, scopedPixels, 180, pivot, size);
        }},
        {label: "Rotate 90° CW", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          const pivot = getPivot(size, selection);
          this.props.pixelsRotate(frame, layer, scopedPixels, 90, pivot, size);
        }},
        {label: "Rotate 90° CCW", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          const pivot = getPivot(size, selection);
          this.props.pixelsRotate(frame, layer, scopedPixels, -90, pivot, size);
        }},
        SEPERATOR,
        {label: "Flip Horizontal", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          const pivot = getPivot(size, selection);
          this.props.pixelsFlipHorizontal(frame, layer, scopedPixels, pivot, size);
        }},
        {label: "Flip Vertical", action: () => {
          const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);
          const pivot = getPivot(size, selection);
          this.props.pixelsFlipVertical(frame, layer, scopedPixels, pivot, size);
        }},
        SEPERATOR,
        {label: "Image size…", action: () => { this.props.modalShow("ModalEditImageSize"); }}
      ]},
      {label: "Select", items: [
        {label: "All", action: () => {
          this.props.selectionStart({ x: 1, y: 1 });
          this.props.selectionEnd({ x: size.width, y: size.height });
        }},
        {label: "Deselect", action: this.props.selectionClear },
      ]},
      {label: "Layer", items: [
        {label: "Merge with layer above", action: () => {
          const index = _.findIndex(layers, {id: layer});
          let layerAbove = null;
          if(layers[index-1]) {
            layerAbove = layers[index-1].id;
            this.props.layerMerge(frame, layerAbove, layer);
            setTimeout(() => this.props.layerSelectTop(layers), 50); // TODO: find a more reliable solution
          }
        }},
        {label: "Merge with layer below", action: () => {
          const index = _.findIndex(layers, {id: this.props.layer});
          let layerBelow = null;
          if(layers[index+1]) {
            layerBelow = layers[index+1].id;
            this.props.layerMerge(frame, layer, layerBelow);
            setTimeout(() => this.props.layerSelectTop(layers), 50); // TODO: find a more reliable solution
          }
        }},
      ]},
      {label: "Frame", items: [
        {label: "Rotate 180°", action: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          this.props.frameRotate(frame, framePixels, 180, pivot, size);
        }},
        {label: "Rotate 90° CW", action: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          this.props.frameRotate(frame, framePixels, 90, pivot, size);
        }},
        {label: "Rotate 90° CCW", action: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          this.props.frameRotate(frame, framePixels, -90, pivot, size);
        }},
        SEPERATOR,
        {label: "Flip Horizontal", action: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          this.props.frameFlipHorizontal(frame, framePixels, pivot, size);
        }},
        {label: "Flip Vertical", action: () => {
          const framePixels = getPixelsInFrame(frame, pixels);
          const pivot = getPivot(size);
          this.props.frameFlipVertical(frame, framePixels, pivot, size);
        }},
        SEPERATOR,
        {label: "Duplicate…", action: () => { this.props.modalShow("ModalDuplicateFrame"); }},
      ]},
      // {label: "Window", items: [
      //   {label: "Paint"},
      // ]},
    ];

    return (
      <nav className="menu">
        <ul>
          {MenuConfig.map((item, index) => {
            return (
              <li key={index}>
                <span>{item.label}</span>
                <div>
                  <ul>
                    {item.items.map((i, index2) => {
                      if(i === SEPERATOR) {
                        return <hr key={index2} />;
                      }

                      if(i.action) {
                        return <li key={index2} onClick={i.action}>{i.label}</li>;
                      }

                      return <li key={index2}>{i.label}</li>;
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Menu;
