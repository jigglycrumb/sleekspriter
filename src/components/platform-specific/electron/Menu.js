import { useEffect } from "react";
import process from "process";
import { remote } from "electron";

import getDefaultMenuConfig from "../../../config/menu";
import { inArray } from "../../../utils";

import { fileDefaultPath, save } from "./utils";

const { app, dialog, Menu } = remote;

const MenuComponent = props => {
  const { file, fileDirty, modalShow, screenSelect } = props;

  // console.log("file", file);

  const {
    appMenu,
    editMenu,
    selectMenu,
    layerMenu,
    frameMenu,
    windowMenu,
    SEPERATOR,
  } = getDefaultMenuConfig(props);

  const fileMenu = {
    label: "File",
    screen: ["paint", "export"],
    submenu: [
      {
        label: "New…",
        accelerator: "CmdOrCtrl+N",
        click: () => {
          modalShow("ModalNewFile");
        },
      },
      {
        label: "Open…",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          modalShow("ModalLoadFile");
        },
      },
      // {
      //   role: "recentDocuments",
      // },
      // {
      //   role: "clearRecentDocuments",
      // },
      SEPERATOR,
      {
        label: "Save",
        accelerator: "CmdOrCtrl+S",
        click: () => {
          if (file.folder && file.name) {
            // save
            const filePath = fileDefaultPath(file);
            save(filePath, props.data, error => console.error(error));
            // set not dirty
            fileDirty(false);
          } else {
            modalShow("ModalSaveFile");
          }
        },
      },
      {
        label: "Save as…",
        accelerator: "CmdOrCtrl+Shift+S",
        click: () => {
          modalShow("ModalSaveFile");
        },
      },
      SEPERATOR,
      {
        label: "Import…",
        click: () => {
          modalShow("ModalImportFile");
        },
      },
      SEPERATOR,
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        click: () => {
          const messageBoxConfig = {
            type: "question",
            buttons: ["Save", "Don't save", "Cancel"],
            title: "Unsaved changes",
            message:
              "Do you want to save your changes before the file is closed?",
            defaultId: 0,
            cancelId: 2,
          };

          let dialogInput = messageBoxConfig.defaultId;

          if (file.dirty) {
            dialogInput = dialog.showMessageBoxSync(messageBoxConfig);

            if (dialogInput === messageBoxConfig.defaultId) {
              if (file.folder && file.name) {
                // save
                const filePath = fileDefaultPath(file);
                save(filePath, props.data, error => console.error(error));
                // set not dirty
                fileDirty(false);
              } else {
                modalShow("ModalSaveFile");
              }
            }
          }

          if (dialogInput !== messageBoxConfig.cancelId) {
            screenSelect("start");
          }
        },
      },
    ],
  };

  const fullscreenOption = {
    role: "togglefullscreen",
  };

  // Mac OS specific menu items
  if (process.platform === "darwin") {
    appMenu.submenu = [
      ...appMenu.submenu,
      SEPERATOR,
      {
        role: "hide",
      },
      {
        role: "hideothers",
      },
      {
        role: "unhide",
      },
      SEPERATOR,
      {
        role: "quit",
      },
    ];

    windowMenu.submenu = [
      ...windowMenu.submenu,
      SEPERATOR,
      fullscreenOption,
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize",
      },
      SEPERATOR,
      {
        label: "Bring All to Front",
        role: "front",
      },
    ];
  }

  // Add reload and devtools to development build menu
  if (!app.isPackaged) {
    windowMenu.submenu = [
      ...windowMenu.submenu,
      SEPERATOR,
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      {
        label: "Toggle Developer Tools",
        accelerator:
          process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
    ];
  }

  const menuConfig = [
    appMenu,
    fileMenu,
    editMenu,
    selectMenu,
    layerMenu,
    frameMenu,
    windowMenu,
  ];

  useEffect(() => {
    menuConfig.forEach(item => {
      const enabled = inArray(item.screen, props.screen);
      item.submenu.forEach(subItem => {
        subItem.enabled = enabled;
      });
    });

    const menu = Menu.buildFromTemplate(menuConfig);
    Menu.setApplicationMenu(menu);
  }, [menuConfig, props.screen]);

  const menu = Menu.buildFromTemplate(menuConfig);
  Menu.setApplicationMenu(menu);

  return null;
};

export default MenuComponent;
