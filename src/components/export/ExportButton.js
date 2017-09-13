import React from "react";
import { t } from "../../utils";

const ExportButton = (props) => {
  return ( <a className="button" onClick={props.export}>{t("Export")}</a> );
};

export default ExportButton;
