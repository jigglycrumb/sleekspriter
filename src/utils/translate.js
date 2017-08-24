import en from "../i18n/en.yml";

const translate = (key, replacements) => {
  let str = en[key];

  if(replacements) {
    Object.keys(replacements).map((search) => {
      if(search === "key") {
        let metaKey = "ctrl";
        if(navigator.platform === "MacIntel") metaKey = "cmd";
        replacements[search] = replacements[search].replace("meta", metaKey);
      }
      str = str.split(`\${${search}}`).join(replacements[search]);
    });
  }

  return str;
};

export default translate;
