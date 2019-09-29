import config from "../config";

const setWindowTitle = (filename, dirty) => {
  document.title = `${APPNAME} - ${filename || config.defaultName}${
    dirty ? "*" : ""
  }`;
};

export default setWindowTitle;
