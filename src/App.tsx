import React, { Component } from "react";
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

class App extends Component {
  render() {
    return (
      <>
        <NavigationBar
          leftItems={[
            { as: NavLink, content: "Home", to: "/home", key: "home" },
            { as: NavLink, content: "Map", to: "/map", key: "map" }
          ]}
          rightItems={[
            { as: NavLink, content: "Log in", to: "/log-in", key: "logIn" },
            { as: NavLink, content: "Sign up", to: "/sign-up", key: "signUp" }
          ]}
        >
          <Switch>
            <Redirect exact from="/" to="home" />
            <Route exact path="/home" component={Home} />
            <Route exact path="/terms-and-conditions">
              <PageLoader page="TermsAndConditions" />
            </Route>
          </Switch>

          <Route
            path="/(.+)"
            render={() => (
              <div>
                <Route path="/map" component={MapPage} />
                <Route path="/test" component={TestComponent} />
                <Route path="/analyze" component={AnalyzePage} />
                <Route path="/log-in" component={LogInPage} />
                <Route path="/sign-up" component={SignUpPage} />
              </div>
            )}
          />

          <div style={{ minHeight: "1rem", flex: "auto" }} />

          <Footer />
        </NavigationBar>
      </>
    );
  }
}

export default App;
