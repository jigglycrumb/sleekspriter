import React from "react";
import PropTypes from "prop-types";
import { ColorswatchPicker } from "../common";
import { t } from "../../utils";

const ExportBackgroundSelection = ({ background, setBackground }) => {
  return (
    <div>
      <h6>{t("Background")}</h6>
      <ul>
        <li>
          <ColorswatchPicker color={background} action={setBackground} />
        </li>
      </ul>
    </div>
  );
};

ExportBackgroundSelection.propTypes = {
  background: PropTypes.string.isRequired,
  setBackground: PropTypes.func.isRequired,
};

export default ExportBackgroundSelection;
