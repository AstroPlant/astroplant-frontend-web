import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "types";
import Option from "./utils/option";
import "./App.css";

import { Switch, Route, Redirect, NavLink } from "react-router-dom";

import NavigationBar from "./Components/NavigationBar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import PageLoader from "./PageLoader";
import MapPage from "./Components/MapPage";
import AnalyzePage from "./Components/AnalyzePage";
import LogInPage from "./Components/LogInPage";
import SignUpPage from "./Components/SignUpPage";
import TestComponent from "./Components/Test/TestComponent";

type Props = WithTranslation & {
  displayName: Option<string>;
};

class App extends Component<Props> {
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
            { as: NavLink, content: t("common.map"), to: "/map", key: "map" }
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
            <Route exact path="/terms-and-conditions">
              <PageLoader page="TermsAndConditions" />
            </Route>
            <Route path="/map" component={MapPage} />
            <Route path="/test" component={TestComponent} />
            <Route path="/analyze" component={AnalyzePage} />
            <Route path="/log-in" component={LogInPage} />
            <Route path="/sign-up" component={SignUpPage} />
            <Route>
              <PageLoader page="NotFound" />
            </Route>
          </Switch>

          <div style={{ minHeight: "1rem", flex: "auto" }} />

          <Footer />
        </NavigationBar>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { details } = state.me;
  return { displayName: details.map(d => d.displayName) };
};

export default connect(mapStateToProps)(withTranslation()(App));
