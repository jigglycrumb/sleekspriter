import React from "react";
import _ from "lodash";

import { getPixelsInScope } from "../../utils";

const SEPERATOR = {label: "---"};

class Menu extends React.Component {
  render() {
    const { clipboard, frame, layer, layers, pixels, selection, size } = this.props;
    const MenuConfig = [
      {label: "File", items: [
        {label: "New…", action: () => { this.props.modalShow("ModalNewFile"); }},
        {label: "Open…", action: () => { this.props.modalShow("ModalLoadFile"); }}, // TODO: show modal only in browser
        {label: "Save", action: () => { this.props.modalShow("ModalSaveFile"); }}, // TODO: show modal only in browser
        {label: "Save as…"}, // TODO: Desktop only
        {label: "Import…", action: () => { this.props.modalShow("ModalImportFile"); }},
        SEPERATOR,
        {label: "Close"},
        SEPERATOR,
        {label: "About @@name"}, // TODO: Desktop only
        SEPERATOR,
        {label: "Quit @@name"}, // TODO: Desktop only
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
        {label: "Rotate 180°"},
        {label: "Rotate 90° CW"},
        {label: "Rotate 90° CCW"},
        SEPERATOR,
        {label: "Flip Horizontal"},
        {label: "Flip Vertical"},
        SEPERATOR,
        {label: "Image size…"}
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
            setTimeout(() => this.props.layerSelectTop(layers), 0); // TODO: find a more reliable solution
          }
        }},
        {label: "Merge with layer below", action: () => {
          const index = _.findIndex(layers, {id: this.props.layer});
          let layerBelow = null;
          if(layers[index+1]) {
            layerBelow = layers[index+1].id;
            this.props.layerMerge(frame, layer, layerBelow);
            setTimeout(() => this.props.layerSelectTop(layers), 0); // TODO: find a more reliable solution
          }
        }},
      ]},
      {label: "Frame", items: [
        {label: "Rotate 180°"},
        {label: "Rotate 90° CW"},
        {label: "Rotate 90° CCW"},
        SEPERATOR,
        {label: "Flip Horizontal"},
        {label: "Flip Vertical"},
        SEPERATOR,
        {label: "Duplicate…"},
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
