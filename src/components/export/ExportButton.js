import React from "react";
import PropTypes from "prop-types";
import { t } from "../../utils";

const ExportButton = props => {
  return (
    <a className="button" onClick={props.export}>
      {t("Export")}
    </a>
  );
};

ExportButton.propTypes = {
  export: PropTypes.func.isRequired,
};

export default ExportButton;
