import React, { useCallback, useState } from "react";
import { Container, Icon, Menu, Sidebar, Responsive } from "semantic-ui-react";
import { Logo } from "./Logo";

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible,
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
            <Logo variant="white" size={24} />
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
  rightItems,
}: {
  leftItems: any;
  rightItems: any;
}) => (
  <Menu id="navigation-big">
    <Container>
      <Menu.Item header>
        <Logo variant="green" size={32} />
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

type NavigationBarProps = React.PropsWithChildren<{
  leftItems: any[];
  rightItems: any[];
}>;

export default function NavigationBar({
  children,
  leftItems,
  rightItems,
}: NavigationBarProps) {
  const [visible, setVisible] = useState(false);

  const handlePusher = useCallback(() => {
    if (visible) setVisible(false);
  }, [visible]);

  const handleToggle = useCallback(() => setVisible(!visible), [visible]);

  return (
    <>
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <NavBarMobile
          leftItems={leftItems}
          onPusherClick={handlePusher}
          onToggle={handleToggle}
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
          flexDirection: "column",
        }}
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
        <Content>{children}</Content>
      </Responsive>
    </>
  );
}
