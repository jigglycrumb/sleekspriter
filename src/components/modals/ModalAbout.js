import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import { modalHide } from "../../state/actions";
import logo from "../../assets/logo@x2.png";

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(modalHide())
});

function ModalAbout(props) {
  return (
    <div className="dialog">
      <div className="title">{t("About @@name")}</div>
      <div className="text">
        <div className="about-window">
          <div className="credits">
            <img src={logo} />
            <div>@@version</div>
            <br />

            <h2>
              {t("Created by")}{" "}
              <a target="_blank" href="http://hpcodecraft.me">
                @@author
              </a>
            </h2>
            <br />

            <h2>{t("Made with")}</h2>
            <ul>
              <li>
                <a target="_blank" href="http://facebook.github.io/react/">
                  React
                </a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/reactjs/redux">
                  redux
                </a>
              </li>
              <li>
                <a target="_blank" href="https://lodash.com/">
                  lodash
                </a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/harthur/color">
                  color
                </a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/tweenjs/tween.js">
                  tween.js
                </a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/jnordberg/gif.js">
                  gif.js
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/ccampbell/mousetrap"
                >
                  mousetrap
                </a>
              </li>
              <li>
                <h2>
                  {t("and a lot of")}&nbsp;&nbsp;<span className="heart">
                    ❤
                  </span>
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
                >
                  Freepik
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/daniel-bruce"
                  title="Daniel Bruce"
                >
                  Daniel Bruce
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/elegant-themes"
                  title="Elegant Themes"
                >
                  Elegant Themes
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/scott-de-jonge"
                  title="Scott de Jonge"
                >
                  Scott de Jonge
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/yannick"
                  title="Yannick"
                >
                  Yannick
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/tutsplus"
                  title="TutsPlus"
                >
                  TutsPlus
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/icomoon"
                  title="Icomoon"
                >
                  Icomoon
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/dave-gandy"
                  title="Dave Gandy"
                >
                  Dave Gandy
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/icons8"
                  title="Icons8"
                >
                  Icons8
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://www.flaticon.com/authors/catalin-fertu"
                  title="Catalin Fertu"
                >
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
              >
                www.flaticon.com
              </a>{" "}
              {t("licensed by")}{" "}
              <a
                target="_blank"
                href="http://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
              >
                CC BY 3.0
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="actions">
        <button onClick={props.hide}>{t("Ok")}</button>
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(ModalAbout);
