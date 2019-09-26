import React, { Component } from "react";
import { Container } from "semantic-ui-react";

import HeadTitle from "../Components/HeadTitle";

export default function TermsAndConditions({}) {
  return (
    <>
      <HeadTitle main="Terms and Conditions" />
      <Container text style={{ marginTop: "1em" }}>
        <h1>My AstroPlant</h1>

        <p>
          To use this website and other AstroPlant software you must agree to
          AstroPlant's software license: BSD 2-Clause. You can read the license{" "}
          <a href="https://raw.githubusercontent.com/AstroPlant/astroplant-server/master/LICENSE.md">
            here
          </a>
          .
        </p>

        <p>Take special note of the limited liability.</p>

        <h1>AstroPlant hardware</h1>

        <p>
          The AstroPlant hardware is licensed under the CERN Open Hardware
          License v1.2, which you can read{" "}
          <a href="https://github.com/AstroPlant/astroplant-hardware/raw/master/LICENSE_cern_ohl_v_1_2.pdf">
            here
          </a>
          .
        </p>

        <p>
          To use the AstroPlant kit you must read and agree to that license.
        </p>

        <p>Take special note of the limited liability.</p>
      </Container>
    </>
  );
}
