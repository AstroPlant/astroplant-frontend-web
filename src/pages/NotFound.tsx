import { Link } from "react-router-dom";

import HeadTitle from "../Components/HeadTitle";

import commonStyle from "~/Common.module.css";

export default function TermsAndConditions() {
  return (
    <>
      <HeadTitle main="Oh no!" />
      <article
        className={commonStyle.containerWide}
        style={{ marginTop: "1rem" }}
      >
        <h2>That page was not found</h2>
        <p>The page you browsed to could not be found.</p>
        <p>
          Consider going to the <Link to="/home">home page</Link>.
        </p>
      </article>
    </>
  );
}
