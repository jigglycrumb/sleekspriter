import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import getDefaultMenuConfig from "../../../config/menu";
import { inArray } from "../../../utils";

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

  componentDidMount() {
    document.addEventListener("mousedown", this.onOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onOutsideClick, false);
  }

  render() {
    let fullscreenLabel = "Enter fullscreen mode";
    if (this.state.fullscreen) {
      fullscreenLabel = "Exit fullscreen mode";
    }

    const {
      appMenu,
      editMenu,
      selectMenu,
      layerMenu,
      frameMenu,
      windowMenu,
      SEPERATOR,
    } = getDefaultMenuConfig(this.props);

    const fileMenu = {
      label: "File",
      screen: ["paint", "export"],
      submenu: [
        {
          label: "New…",
          click: () => {
            this.props.modalShow("ModalNewFile");
          },
        },
        {
          label: "Open…",
          click: () => {
            this.props.modalShow("ModalLoadFile");
          },
        },
        {
          label: "Save",
          click: () => {
            this.props.modalShow("ModalSaveFile");
          },
        },
        {
          label: "Import…",
          click: () => {
            this.props.modalShow("ModalImportFile");
          },
        },
      ],
    };

    const fullscreenOption = {
      label: fullscreenLabel,
      click: () => {
        if (!this.state.fullscreen) {
          const app = document.getElementById("app");
          app.webkitRequestFullscreen();
          this.setState({ fullscreen: true });
        } else {
          document.webkitExitFullscreen();
          this.setState({ fullscreen: false });
        }
      },
    };

    windowMenu.submenu.push(SEPERATOR);
    windowMenu.submenu.push(fullscreenOption);

    const menuConfig = [
      appMenu,
      fileMenu,
      editMenu,
      selectMenu,
      layerMenu,
      frameMenu,
      windowMenu,
    ];

    const cssClasses = {
      menu: true,
      active: this.state.active,
      activeItem: null,
    };

    return (
      <nav className={classnames(cssClasses)} ref={node => (this.node = node)}>
        <ul>
          {menuConfig.map((item, menuItemIndex) => {
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
                    {item.submenu.map((i, subMenuItemIndex) => {
                      if (i === SEPERATOR) {
                        return <hr key={subMenuItemIndex} />;
                      }

                      const click = e => {
                        if (i.click) {
                          i.click();
                        }
                        this.deactivate(e);
                      };

                      return (
                        <li key={subMenuItemIndex} onClick={click}>
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

Menu.propTypes = {
  file: PropTypes.object.isRequired,
  modalShow: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired,
  screenSelect: PropTypes.func.isRequired,
};

export default Menu;
