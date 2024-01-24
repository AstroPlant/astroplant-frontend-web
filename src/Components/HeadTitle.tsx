import { Component } from "react";

import commonStyle from "~/Common.module.css";
import style from "./HeadTitle.module.css";

type HeadTitleProps = {
  main?: string;
  secondary?: string;
};

class HeadTitle extends Component<HeadTitleProps, {}> {
  render() {
    return (
      <div className={style.headTitleBackground}>
        <header className={commonStyle.containerWide}>
          {this.props.main !== undefined && <h1>{this.props.main}</h1>}
          {this.props.secondary !== undefined && <p>{this.props.secondary}</p>}
        </header>
      </div>
    );
  }
}

export default HeadTitle;
