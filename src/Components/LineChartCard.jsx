import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Menu, Container } from 'semantic-ui-react'
import { SizeMe } from 'react-sizeme'
import LineChartGraph from './LineChartGraph'


const mapData = (state) => ({
  data: state.data
})


class LineChartCard extends Component {
  state = { 
    activeItem: 'Temperature',
  }

  componentDidUpdate(prevProps) {

  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


  render() {
    const { activeItem } = this.state
    const { data } = this.props

    return (
      <SizeMe>{({ size }) =>
      <Container   style={{paddingTop:"3em"}}>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              <h1>Linear Graph</h1>
            </Card.Header>            
            <Card.Description>
              <Menu text style={{paddingLeft:"3em", paddingBottom:"2em", fontSize:"16px"}}>
                <Menu.Item
                  name='Temperature'
                  active={activeItem === 'Temperature'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Air Presure'
                  active={activeItem === 'Air Presure'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Humidity'
                  active={activeItem === 'Humidity'}
                  onClick={this.handleItemClick}
                />
              </Menu>
              {this.state.activeItem === 'Temperature' && 
              <LineChartGraph ancho={size.width} datos={data} eje={"pv"} />
              }
              {this.state.activeItem === 'Air Presure' && 
              <LineChartGraph ancho={size.width} datos={data} eje={"uv"} />
              }
              {this.state.activeItem === 'Humidity' && 
              <LineChartGraph ancho={size.width} datos={data} eje={"zv"} />
              }

              
            </Card.Description>
          </Card.Content>
        </Card>
        <div>{/*console.log(size.width)*/}</div>
    </Container>
     }</SizeMe>
    )
  }
}

export default connect(mapData)(LineChartCard)
