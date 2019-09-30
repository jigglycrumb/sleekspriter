import { writeFile } from "fs";
import { basename, dirname } from "path";

import config from "../../../config";
import { stateToFile } from "../../../utils";

export const save = (path, contents, errorHandler) => {
  writeFile(path, JSON.stringify(stateToFile(contents)), function(error) {
    if (error) {
      errorHandler(error);
    }
  });
};

export const fileInfoFromPath = path => {
  const fileName = basename(path, "." + config.fileExtension); // the file name without extension, e.g. "coin"
  const folder = dirname(path); // the complete absolute folder (same as path without the file name)

  return {
    fileName,
    folder,
  };
};

export const fileDefaultPath = (file, extension) => {
  const folder = file.folder || config.defaultFolder;
  const name = file.name || config.defaultName;
  const ext = extension || config.fileExtension;

  return `${folder}/${name}.${ext}`; // TODO: use platform-independent folder seperator
};
