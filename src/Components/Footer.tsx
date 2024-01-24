import { Component } from "react";
import packageJson from "../../package.json";

import commonStyle from "~/Common.module.css";
import style from "./Footer.module.css";

class Footer extends Component {
  render() {
    return (
      <footer className={style.footer}>
        <div className={commonStyle.containerWide}>
          <p>
            Copyright © AstroPlant 2018&ndash;2024. Source code available on{" "}
            <a href="https://github.com/astroplant">GitHub</a>.
          </p>
          <p>
            Version: {packageJson.version}{" "}
            {import.meta.env.VITE_BUILD_STRING &&
              "(" + import.meta.env.VITE_BUILD_STRING + ")"}
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;
