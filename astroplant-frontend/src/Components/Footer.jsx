import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import packageJson from "../../package.json";

class Footer extends Component {
  render() {
    return (
      <footer id="footer">
        <Container>
          <p>
            Copyright © AstroPlant 2018. Source code available on <a href="https://github.com/astroplant">GitHub</a>.
          </p>
          <p>
          Version: {packageJson.version}
          </p>
        </Container>
      </footer>
    );
  }
}

export default Footer;
