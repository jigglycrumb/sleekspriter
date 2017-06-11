import en from "../i18n/en";

const translate = (key, replacements) => {
  let str = en[key];

  if(replacements) {
    Object.keys(replacements).map((search) => {
      str = str.split(`\${${search}}`).join(replacements[search]);
    });
  }

  return str;
};

export default translate;
