import React, { Component } from 'react'
import { Input, Menu, Segment } from 'semantic-ui-react'

export default class MenuExampleTabularOnTop extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu attached='top' tabular>
          <Menu.Item
            name='bio'
            active={activeItem === 'bio'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='photos'
            active={activeItem === 'photos'}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input
                transparent
                icon={{ name: 'search', link: true }}
                placeholder='Search users...'
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment attached='bottom'>
          <img src='/images/wireframe/paragraph.png' />
        </Segment>
      </div>
    )
  }
}









import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class MenuExampleTabular extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu tabular>
        <Menu.Item name='bio' active={activeItem === 'bio'} onClick={this.handleItemClick} />
        <Menu.Item name='photos' active={activeItem === 'photos'} onClick={this.handleItemClick} />
      </Menu>
    )
  }
}









import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class MenuExampleText extends Component {
  state = { activeItem: 'closest' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu text>
        <Menu.Item header>Sort By</Menu.Item>
        <Menu.Item
          name='closest'
          active={activeItem === 'closest'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='mostComments'
          active={activeItem === 'mostComments'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='mostPopular'
          active={activeItem === 'mostPopular'}
          onClick={this.handleItemClick}
        />
      </Menu>
    )
  }
}





<Card fluid>
<Card.Content>
  <Card.Header>
    <h1>Linear Graph</h1>
  </Card.Header>            
  <Card.Description>
    <Grid stackable divided="vertically">
      <Grid.Row columns="2">
        <Grid.Column width="4">
          <p>Light Intensity</p>
          <p>Water Temperature</p>
          <p>Air temperature</p>
          <p>Air Humidity</p>
          <p>CO2 Concentration</p>
        </Grid.Column>
        <Grid.Column width="12">
          <LineChart
            width={width}
            height={300}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </Grid.Column>
       </Grid.Row>
     </Grid>
    </Card.Description>
 </Card.Content>
</Card>



import React, { Component } from 'react'
import { Menu, Container, Icon, Button } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

 class Navbar extends Component {
  state = {
      isMobile: true,
      width: window.innerWidth
  }

  componentDidMount() {
      window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
      window.addEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    if(window.innerWidth <= 500) {
        console.log("resize")
        let isDesktop = false
    }
  }
  
  render() {
    const {width} = this.state
    let isDesktop = width >= 500  

    return (
      <div>
          <Menu fixed="top"> 
          { isDesktop ?   
            <Container>
                <Menu.Item header>
                    <h2>AstroPlant</h2>
                </Menu.Item>
                    <Menu.Item as={NavLink} to="/home" name="home">
                        <Icon name="home" ></Icon>
                        Home
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/map" name="map">
                        <Icon name="map marker alternate"></Icon>
                        Map
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/analyze" name="analyze"> 
                        <Icon name="dashboard"></Icon>
                        Analyze
                    </Menu.Item>
                    <Menu.Item name="leaf"> 
                        <Icon name="leaf"></Icon>
                        About Astroplant
                    </Menu.Item>

                    <Menu.Item position="right">
                        <Button basic content="Login"/>
                        <Button basic content="Sing Up" style={{marginLeft:'0.5em'}} />
                    </Menu.Item>
            </Container>
            : <div>Hola</div> } 
          </Menu>
      </div>
    )
  }
}




<Container>
<Grid> 
    <Grid.Row columns={1} only="tablet computer" >
        <Menu.Item header>
            <h2>AstroPlant</h2>
        </Menu.Item>
        <Menu.Item as={NavLink} to="/home" name="home">
            <Icon name="home" ></Icon>
            Home
        </Menu.Item>
        <Menu.Item as={NavLink} to="/map" name="map">
            <Icon name="map marker alternate"></Icon>
            Map
        </Menu.Item>
        <Menu.Item as={NavLink} to="/analyze" name="analyze"> 
            <Icon name="dashboard"></Icon>
            Analyze
        </Menu.Item>
        <Menu.Item name="leaf"> 
            <Icon name="leaf"></Icon>
            About Astroplant
        </Menu.Item>

        <Menu.Item>
            <Button basic content="Login"/>
            <Button basic content="Sing Up" style={{marginLeft:'0.5em'}} />
        </Menu.Item>

    </Grid.Row>
    <Grid.Row columns={1} only="mobile" >
        <Menu.Item header>
            <h2>AstroPlant</h2>
        </Menu.Item>
        <Menu.Item position="right" >
            <Button basic content="Login"/>
            <Button basic content="Sing Up" style={{marginLeft:'0.5em'}} />
        </Menu.Item>

    </Grid.Row>
</Grid>
</Container>