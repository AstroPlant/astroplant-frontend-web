import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "types";
import Option from "./utils/option";
import "./App.css";
import "leaflet/dist/leaflet.css";

import { Switch, Route, Redirect, NavLink } from "react-router-dom";

import Notifications from "./Components/Notifications";
import ConnectionStatus from "./Components/ConnectionStatus";
import NavigationBar from "./Components/NavigationBar";
import Footer from "./Components/Footer";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";

import LogIn from "./scenes/LogIn";
import SignUp from "./scenes/SignUp";
import Me from "./scenes/Me";
import CreateKit from "./scenes/CreateKit";
import Kit from "./scenes/kit";
import Map from "./scenes/map";

type Props = WithTranslation & {
  displayName: Option<string>;
};

class App extends Component<Props> {
  componentDidMount() {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }

  render() {
    const { t } = this.props;
    return (
      <>
        <NavigationBar
          leftItems={[
            {
              as: NavLink,
              content: t("common.home"),
              to: "/home",
              key: "home"
            },
            {
              as: NavLink,
              content: t("common.map"),
              to: "/map",
              key: "map"
            }
          ]}
          rightItems={
            this.props.displayName.isSome()
              ? [
                  {
                    as: NavLink,
                    content: this.props.displayName.unwrap(),
                    to: "/me",
                    key: "me"
                  }
                ]
              : [
                  {
                    as: NavLink,
                    content: t("common.logIn"),
                    to: "/log-in",
                    key: "logIn"
                  },
                  {
                    as: NavLink,
                    content: t("common.signUp"),
                    to: "/sign-up",
                    key: "signUp"
                  }
                ]
          }
        >
          <Switch>
            <Redirect exact from="/" to="home" />
            <Route exact path="/home" component={Home} />
            <Route
              exact
              path="/terms-and-conditions"
              component={TermsAndConditions}
            />
            <Route path="/map" component={Map} />
            <Route path="/log-in" component={LogIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/me" component={Me} />
            <Route path="/create-kit" component={CreateKit} />
            <Route path="/kit/:kitSerial" component={Kit} />
            <Route component={NotFound} />
          </Switch>

          <div style={{ minHeight: "1rem", flex: "auto" }} />

          <Footer />
        </NavigationBar>
        <ConnectionStatus />
        <Notifications />
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { details } = state.me;
  return { displayName: details.map(d => d.displayName) };
};

export default connect(mapStateToProps)(withTranslation()(App));
