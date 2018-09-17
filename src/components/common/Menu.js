import React from "react";
import classnames from "classnames";
import _ from "lodash";

import {
  getPixelsInFrame,
  getPixelsInScope,
  getPivot,
  inArray,
} from "../../utils";

const SEPERATOR = { label: "---" };

class Menu extends React.Component {
  state = {
    active: false,
    fullscreen: false,
  };

  constructor(props) {
    super(props);

    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.onOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onOutsideClick, false);
  }

  render() {
    const {
      clipboard,
      frame,
      layer,
      layers,
      pixels,
      selection,
      size,
    } = this.props;

    let fullscreenLabel = "Enter fullscreen mode";
    if (this.state.fullscreen) {
      fullscreenLabel = "Exit fullscreen mode";
    }

    const MenuConfig = [
      {
        label: "@@name",
        screen: ["start", "paint", "export"],
        items: [
          {
            label: "About @@name",
            action: () => {
              this.props.modalShow("ModalAbout");
            },
          },
          // SEPERATOR,
          // {label: "Quit @@name"}, // TODO: Desktop only
        ],
      },
      {
        label: "File",
        screen: ["paint", "export"],
        items: [
          {
            label: "New…",
            action: () => {
              this.props.modalShow("ModalNewFile");
            },
          },
          {
            label: "Open…",
            action: () => {
              this.props.modalShow("ModalLoadFile");
            },
          }, // TODO: show modal only in browser
          {
            label: "Save",
            action: () => {
              this.props.modalShow("ModalSaveFile");
            },
          }, // TODO: show modal only in browser
          // {label: "Save as…"}, // TODO: Desktop only
          {
            label: "Import…",
            action: () => {
              this.props.modalShow("ModalImportFile");
            },
          },
          SEPERATOR,
          {
            label: "Close",
            action: () => {
              this.props.modalShow("ModalSaveFile"); // TODO: show modal only in browser
              this.props.screenSelect("start");
            },
          },
        ],
      },
      {
        label: "Edit",
        screen: ["paint"],
        items: [
          {
            label: "Cut",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              this.props.pixelsCut(frame, layer, scopedPixels, pixels);
            },
          },
          {
            label: "Copy",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              this.props.pixelsCopy(frame, layer, scopedPixels);
            },
          },
          {
            label: "Paste",
            action: () => {
              this.props.pixelsPaste(frame, layer, clipboard);
            },
          },
          {
            label: "Delete",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              this.props.pixelsDelete(frame, layer, scopedPixels, pixels);
            },
          },
          SEPERATOR,
          {
            label: "Rotate 180°",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              const pivot = getPivot(size, selection);
              this.props.pixelsRotate(
                frame,
                layer,
                scopedPixels,
                180,
                pivot,
                size
              );
            },
          },
          {
            label: "Rotate 90° CW",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              const pivot = getPivot(size, selection);
              this.props.pixelsRotate(
                frame,
                layer,
                scopedPixels,
                90,
                pivot,
                size
              );
            },
          },
          {
            label: "Rotate 90° CCW",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              const pivot = getPivot(size, selection);
              this.props.pixelsRotate(
                frame,
                layer,
                scopedPixels,
                -90,
                pivot,
                size
              );
            },
          },
          SEPERATOR,
          {
            label: "Flip Horizontal",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              const pivot = getPivot(size, selection);
              this.props.pixelsFlipHorizontal(
                frame,
                layer,
                scopedPixels,
                pivot,
                size
              );
            },
          },
          {
            label: "Flip Vertical",
            action: () => {
              const scopedPixels = getPixelsInScope(
                frame,
                layer,
                pixels,
                selection
              );
              const pivot = getPivot(size, selection);
              this.props.pixelsFlipVertical(
                frame,
                layer,
                scopedPixels,
                pivot,
                size
              );
            },
          },
          SEPERATOR,
          {
            label: "Replace color…",
            action: () => {
              this.props.modalShow("ModalReplaceColor");
            },
          },
          // {label: "Image size…", action: () => { this.props.modalShow("ModalEditImageSize"); }}
        ],
      },
      {
        label: "Select",
        screen: ["paint"],
        items: [
          {
            label: "All",
            action: () => {
              this.props.selectionStart({ x: 1, y: 1 });
              this.props.selectionEnd({ x: size.width, y: size.height });
            },
          },
          { label: "Deselect", action: this.props.selectionClear },
        ],
      },
      {
        label: "Layer",
        screen: ["paint"],
        items: [
          {
            label: "Merge with layer above",
            action: () => {
              const index = _.findIndex(layers, { id: layer });
              let layerAbove = null;
              if (layers[index - 1]) {
                layerAbove = layers[index - 1].id;
                this.props.layerMerge(frame, layerAbove, layer, pixels);
              }
            },
          },
          {
            label: "Merge with layer below",
            action: () => {
              const index = _.findIndex(layers, { id: this.props.layer });
              let layerBelow = null;
              if (layers[index + 1]) {
                layerBelow = layers[index + 1].id;
                this.props.layerMerge(frame, layer, layerBelow, pixels);
              }
            },
          },
        ],
      },
      {
        label: "Frame",
        screen: ["paint"],
        items: [
          {
            label: "Rotate 180°",
            action: () => {
              const framePixels = getPixelsInFrame(frame, pixels);
              const pivot = getPivot(size);
              this.props.frameRotate(frame, framePixels, 180, pivot, size);
            },
          },
          {
            label: "Rotate 90° CW",
            action: () => {
              const framePixels = getPixelsInFrame(frame, pixels);
              const pivot = getPivot(size);
              this.props.frameRotate(frame, framePixels, 90, pivot, size);
            },
          },
          {
            label: "Rotate 90° CCW",
            action: () => {
              const framePixels = getPixelsInFrame(frame, pixels);
              const pivot = getPivot(size);
              this.props.frameRotate(frame, framePixels, -90, pivot, size);
            },
          },
          SEPERATOR,
          {
            label: "Flip Horizontal",
            action: () => {
              const framePixels = getPixelsInFrame(frame, pixels);
              const pivot = getPivot(size);
              this.props.frameFlipHorizontal(frame, framePixels, pivot, size);
            },
          },
          {
            label: "Flip Vertical",
            action: () => {
              const framePixels = getPixelsInFrame(frame, pixels);
              const pivot = getPivot(size);
              this.props.frameFlipVertical(frame, framePixels, pivot, size);
            },
          },
          SEPERATOR,
          {
            label: "Duplicate…",
            action: () => {
              this.props.modalShow("ModalDuplicateFrame");
            },
          },
        ],
      },
      {
        label: "Window",
        screen: ["paint", "export"],
        items: [
          {
            label: "Paint",
            action: () => {
              this.props.screenSelect("paint");
            },
          },
          {
            label: "Export",
            action: () => {
              this.props.screenSelect("export");
            },
          },
          {
            label: fullscreenLabel,
            action: () => {
              if (!this.state.fullscreen) {
                const app = document.getElementById("app");
                app.webkitRequestFullscreen();
                this.setState({ fullscreen: true });
              } else {
                document.webkitExitFullscreen();
                this.setState({ fullscreen: false });
              }
            },
          },
        ],
      },
    ];

    const cssClasses = {
      menu: true,
      active: this.state.active,
      activeItem: null,
    };

    return (
      <nav className={classnames(cssClasses)} ref={node => (this.node = node)}>
        <ul>
          {MenuConfig.map((item, menuItemIndex) => {
            const cssClasses = {
              disabled: !inArray(item.screen, this.props.screen),
              active: menuItemIndex === this.state.activeItem,
            };

            return (
              <li
                key={menuItemIndex}
                className={classnames(cssClasses)}
                onClick={e => this.activate(e, menuItemIndex)}
                onMouseOver={() => {
                  if (this.state.active) {
                    this.setState({ activeItem: menuItemIndex });
                  }
                }}>
                <span>{item.label}</span>
                <div
                  className="submenu"
                  style={{
                    display:
                      menuItemIndex === this.state.activeItem
                        ? "block"
                        : "none",
                  }}>
                  <ul>
                    {item.items.map((i, subMenuItemIndex) => {
                      if (i === SEPERATOR) {
                        return <hr key={subMenuItemIndex} />;
                      }

                      const action = e => {
                        if (i.action) {
                          i.action();
                        }
                        this.deactivate(e);
                      };

                      return (
                        <li key={subMenuItemIndex} onClick={action}>
                          {i.label}
                        </li>
                      );
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

  activate(e, index) {
    e.stopPropagation();
    this.setState({
      active: true,
      activeItem: index,
    });
  }

  deactivate(e) {
    e.stopPropagation();
    this.setState({
      active: false,
      activeItem: null,
    });
  }

  onOutsideClick(e) {
    if (!this.node.contains(e.target)) {
      this.deactivate(e);
    }
  }
}

export default Menu;
