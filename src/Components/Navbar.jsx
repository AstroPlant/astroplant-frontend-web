import React, { Component } from 'react'
import { Menu, Container, Icon, Button } from 'semantic-ui-react'
import { NavLink, Link, withRouter } from 'react-router-dom'



import { isBrowser, isTablet } from 'react-device-detect'

 class Navbar extends Component {
  state = {}

  routeChange() {
    let path = '/login';
    this.props.history.push(path);
  }

  
  render() {
    return (
        <Menu fixed="top"> 
          { isBrowser||isTablet ?   
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
                    <Menu.Item as={NavLink} to="/analyze" name="myAstroPlant"> 
                        <Icon name="dashboard"></Icon>
                        myAstroPlant
                    </Menu.Item>

                    <Menu.Item position="right">
                        <Button as={Link} to="/login" basic content="Login"/>
                        <Button as={Link} to="/signup" basic content="Sing Up" style={{marginLeft:'0.5em'}} />
                    </Menu.Item>
            </Container>
            : 
            <Container>
                <Menu.Item header>
                    <h2>AstroPlant</h2>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/home" name="home">
                        <Icon name="home" ></Icon>
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/map" name="map">
                        <Icon name="map marker alternate"></Icon>
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/analyze" name="analyze"> 
                        <Icon name="dashboard"></Icon>
                    </Menu.Item>

                    <Menu.Item position="right">
                        <Button basic content="Login"/>
                        <Button basic content="Sing Up" style={{marginLeft:'0.5em'}} />
                    </Menu.Item>
                
            </Container>
            } 
          </Menu>
    )
  }
}

export default withRouter(Navbar)
