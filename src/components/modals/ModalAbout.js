import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t } from "../../utils";
import { modalHide } from "../../state/actions";
import logo from "../../assets/logo@x2.png";

const mapDispatchToProps = { modalHide };

const ModalAbout = props => {
  return (
    <div className="dialog">
      <div className="title">{`${t("About")} ${APPNAME}`}</div>
      <div className="text">
        <div className="about-window">
          <div className="credits">
            <img src={logo} />
            <div>{VERSION}</div>
            <br />

            <h2>
              {t("Created by")}{" "}
              <a
                target="_blank"
                href="http://hpcodecraft.me"
                rel="noopener noreferrer">
                {AUTHOR}
              </a>
            </h2>
            <br />

            <h2>{t("Made with")}</h2>
            <ul>
              <li>
                <a
                  target="_blank"
                  href="http://facebook.github.io/react/"
                  rel="noopener noreferrer">
                  React
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/reactjs/redux"
                  rel="noopener noreferrer">
                  redux
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://lodash.com/"
                  rel="noopener noreferrer">
                  lodash
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/harthur/color"
                  rel="noopener noreferrer">
                  color
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/tweenjs/tween.js"
                  rel="noopener noreferrer">
                  tween.js
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/jnordberg/gif.js"
                  rel="noopener noreferrer">
                  gif.js
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/ccampbell/mousetrap"
                  rel="noopener noreferrer">
                  mousetrap
                </a>
              </li>
              <li>
                <h2>
                  {t("and a lot of")}&nbsp;&nbsp;
                  <span className="heart">❤</span>
                </h2>
              </li>
            </ul>
            <br />

            <h2>{t("Icons made by")}</h2>
            <ul>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/freepik"
                  title="Freepik"
                  rel="noopener noreferrer">
                  Freepik
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/daniel-bruce"
                  title="Daniel Bruce"
                  rel="noopener noreferrer">
                  Daniel Bruce
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/elegant-themes"
                  title="Elegant Themes"
                  rel="noopener noreferrer">
                  Elegant Themes
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/scott-de-jonge"
                  title="Scott de Jonge"
                  rel="noopener noreferrer">
                  Scott de Jonge
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/yannick"
                  title="Yannick"
                  rel="noopener noreferrer">
                  Yannick
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/tutsplus"
                  title="TutsPlus"
                  rel="noopener noreferrer">
                  TutsPlus
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/icomoon"
                  title="Icomoon"
                  rel="noopener noreferrer">
                  Icomoon
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/dave-gandy"
                  title="Dave Gandy"
                  rel="noopener noreferrer">
                  Dave Gandy
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/icons8"
                  title="Icons8"
                  rel="noopener noreferrer">
                  Icons8
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/catalin-fertu"
                  title="Catalin Fertu"
                  rel="noopener noreferrer">
                  Catalin Fertu
                </a>
              </li>
            </ul>

            <p>
              {t("Icons from")}{" "}
              <a
                target="_blank"
                href="http://www.flaticon.com"
                title="Flaticon"
                rel="noopener noreferrer">
                www.flaticon.com
              </a>{" "}
              {t("licensed by")}{" "}
              <a
                target="_blank"
                href="http://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                rel="noopener noreferrer">
                CC BY 3.0
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="actions">
        <button onClick={props.modalHide}>{t("Ok")}</button>
      </div>
    </div>
  );
};

ModalAbout.propTypes = {
  modalHide: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(ModalAbout);
