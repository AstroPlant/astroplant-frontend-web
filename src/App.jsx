import React, { Component } from 'react';
import './App.css';

import { Switch, Route, Redirect } from 'react-router-dom'

import Navbar from "./Components/Navbar"
import Footer from './Components/Footer'
import Home from './Components/Home'
import MapPage from './Components/MapPage'
import AnalyzePage from './Components/AnalyzePage'
import LogInPage from './Components/LogInPage';
import SignUpPage from './Components/SignUpPage';
import TestComponent from './Components/Test/TestComponent';



class App extends Component {
  render() {
    return (
      <div>
        <Navbar/>

        <Switch>
          <Redirect exact from="/" to="home" />
          <Route exact path="/home" component={Home} />
        </Switch>

        <Route path='/(.+)' render ={() => (
          <div>
            <Route path="/map" component={MapPage} />
            <Route path="/test" component={TestComponent} />
            <Route path='/analyze' component={AnalyzePage} />
            <Route path='/login' component={LogInPage} />
            <Route path="/signup" component={SignUpPage} />
          </div>
        )} />        
        <Footer/>
      </div>
    );
  }
}

export default App;
