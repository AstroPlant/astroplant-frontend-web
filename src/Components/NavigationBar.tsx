import React, { Component } from "react";
import { render } from "react-dom";
import {
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
  Segment,
  Responsive
} from "semantic-ui-react";

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible
}: any) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible={visible}
    >
      <Menu.Item header>
        <h2>AstroPlant</h2>
      </Menu.Item>
      {leftItems.map((item: any) => (
        <Menu.Item {...item} />
      ))}
    </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Menu id="navigation-small" inverted>
        <Container>
          <Menu.Item header>
            <h2>AstroPlant</h2>
          </Menu.Item>
          <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Menu position="right">
            {rightItems.map((item: any) => (
              <Menu.Item {...item} />
            ))}
          </Menu.Menu>
        </Container>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavBarDesktop = ({
  leftItems,
  rightItems
}: {
  leftItems: any;
  rightItems: any;
}) => (
  <Menu id="navigation-big">
    <Container>
      <Menu.Item header>
        <h2>AstroPlant</h2>
      </Menu.Item>
      {leftItems.map((item: any) => (
        <Menu.Item {...item} />
      ))}
      <Menu.Menu position="right">
        {rightItems.map((item: any) => (
          <Menu.Item {...item} />
        ))}
      </Menu.Menu>
    </Container>
  </Menu>
);

const Content = ({ children }: { children: any }) => <>{children}</>;

type NavigationBarProps = {
  leftItems: any[];
  rightItems: any[];
};

class NavigationBar extends Component<
  NavigationBarProps,
  { visible: boolean }
> {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children, leftItems, rightItems } = this.props;
    const { visible } = this.state;

    return (
      <>
        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
          >
            <Content>{children}</Content>
          </NavBarMobile>
        </Responsive>
        <Responsive
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
          }}
          minWidth={Responsive.onlyTablet.minWidth}
        >
          <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
          <Content>{children}</Content>
        </Responsive>
      </>
    );
  }
}

/*
class Navbar extends Component {
  state = {};

  routeChange() {
    let path = "/login";
    this.props.history.push(path);
  }

  render() {
    return (
      <Menu fixed="top" stackable={true}>
        {isBrowser || isTablet ? (
          <Container>
            <Menu.Item header>
              <h2>AstroPlant</h2>
            </Menu.Item>
            <Menu.Item as={NavLink} to="/home" name="home">
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item as={NavLink} to="/map" name="map">
              <Icon name="map marker alternate" />
              Map
            </Menu.Item>
            <Menu.Item as={NavLink} to="/analyze" name="myAstroPlant">
              <Icon name="dashboard" />
              myAstroPlant
            </Menu.Item>

            <Menu.Item position="right">
              <Button as={Link} to="/login" basic content="Login" />
              <Button
                as={Link}
                to="/signup"
                basic
                content="Sing Up"
                style={{ marginLeft: "0.5em" }}
              />
            </Menu.Item>
          </Container>
        ) : (
          <Container>
            <Menu.Item header>
              <h2>AstroPlant</h2>
            </Menu.Item>
            <Menu.Item as={NavLink} to="/home" name="home">
              <Icon name="home" />
            </Menu.Item>
            <Menu.Item as={NavLink} to="/map" name="map">
              <Icon name="map marker alternate" />
            </Menu.Item>
            <Menu.Item as={NavLink} to="/analyze" name="analyze">
              <Icon name="dashboard" />
            </Menu.Item>

            <Menu.Item position="right">
              <Button basic content="Login" />
              <Button basic content="Sing Up" style={{ marginLeft: "0.5em" }} />
            </Menu.Item>
          </Container>
        )}
      </Menu>
    );
  }
}
*/

export default NavigationBar; //withRouter(NavBar);
