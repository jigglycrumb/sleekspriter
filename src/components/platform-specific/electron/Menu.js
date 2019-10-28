import { useEffect } from "react";
import process from "process";
import { remote } from "electron";

import getDefaultMenuConfig from "../../../config/menu";
import { inArray } from "../../../utils";

import { fileDefaultPath, save } from "./utils";

const { app, dialog, Menu } = remote;

const isMac = process.platform === "darwin";

// TODO: translations

const MenuComponent = props => {
  const {
    file,
    fileDirty,
    fileSave,
    modalHide,
    modalShow,
    screenSelect,
  } = props;

  const {
    aboutOption,
    editMenu,
    selectMenu,
    layerMenu,
    frameMenu,
    windowMenu,
    SEPERATOR,
  } = getDefaultMenuConfig(props);

  let appMenu;

  const fileMenu = {
    label: "File",
    screen: ["paint", "export"],
    submenu: [
      {
        enableOnScreen: ["start"],
        label: "New…",
        accelerator: "CmdOrCtrl+N",
        click: () => {
          modalShow("ModalNewFile");
        },
      },
      {
        enableOnScreen: ["start"],
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
            // update meta timestamp
            fileSave();
            // set not dirty
            fileDirty(false);
            // save
            const filePath = fileDefaultPath(file);
            save(filePath, props.data, error => console.error(error));
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
        enableOnScreen: ["start"],
        label: "Import…",
        click: () => {
          modalHide();
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

  const quitOption = {
    role: "quit",
  };

  const minimizeOption = {
    label: "Minimize",
    accelerator: "CmdOrCtrl+M",
    role: "minimize",
  };

  switch (process.platform) {
    case "darwin":
      // Mac OS specific menu items
      appMenu = {
        label: APPNAME,
        screen: ["start", "paint", "export"],
        submenu: [
          aboutOption,
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
          quitOption,
        ],
      };

      windowMenu.submenu = [
        ...windowMenu.submenu,
        SEPERATOR,
        fullscreenOption,
        minimizeOption,
        SEPERATOR,
        {
          label: "Bring All to Front",
          role: "front",
        },
      ];

      break;

    case "win32": // Windows specific menu items
      fileMenu.submenu = [...fileMenu.submenu, SEPERATOR, quitOption];

      windowMenu.submenu = [
        ...windowMenu.submenu,
        SEPERATOR,
        fullscreenOption,
        minimizeOption,
        SEPERATOR,
        aboutOption,
      ];
      break;

    case "linux": // Linux specific menu items
      break;
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
        accelerator: isMac ? "Alt+Command+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
    ];
  }

  const menuConfig = [
    fileMenu,
    editMenu,
    selectMenu,
    layerMenu,
    frameMenu,
    windowMenu,
  ];

  if (isMac) {
    menuConfig.unshift(appMenu);
  }

  useEffect(() => {
    menuConfig.forEach(item => {
      const menuEnabled = inArray(item.screen, props.screen);

      item.submenu.forEach(subItem => {
        let enabled = false;
        if (menuEnabled) {
          enabled = true;
        } else if (subItem.enableOnScreen) {
          enabled = inArray(subItem.enableOnScreen, props.screen);
        }

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
