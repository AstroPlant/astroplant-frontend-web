import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

class HeadTitle extends Component {
  render() {
    return (
      
    <div className="headTitleBackground">
      <Container>
        <h1 className="headText1">{this.props.titulo}</h1>
        <h4 className="headText2">{this.props.texto}</h4>
      </Container>
    </div>

    )
  }
}

export default HeadTitle
