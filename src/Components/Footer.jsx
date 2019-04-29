import React, { Component } from 'react'
import { Container } from 'semantic-ui-react';

class Footer extends Component {
  render() {
    return (
        <Container fluid>
            <div className="footer_background">
                <h4 className="footer_text">AstroPlant © 2018-2019 by Border Labs. Source code available on GitHub.</h4>
            </div>
        </Container>
    )
  }
}

export default Footer
