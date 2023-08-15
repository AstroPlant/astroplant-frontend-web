import "leaflet/dist/leaflet.css";
import { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { RootState } from "./types";

import { Navigate, Route, Routes } from "react-router-dom";

import ConnectionStatus from "./Components/ConnectionStatus";
import Footer from "./Components/Footer";
import NavigationBar from "./Components/NavigationBar";
import Notifications from "./Components/Notifications";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";

import CreateKit from "./scenes/CreateKit";
import Kit from "./scenes/kit";
import LogIn from "./scenes/LogIn";
import Map from "./scenes/map";
import Me from "./scenes/Me";
import SignUp from "./scenes/SignUp";

type Props = {
  displayName: string | null;
};

class App extends Component<Props> {
  componentDidMount() {
    // delete L.Icon.Default.prototype._getIconUrl;
    // L.Icon.Default.mergeOptions({
    //   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    //   iconUrl: require("leaflet/dist/images/marker-icon.png"),
    //   shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    // });
  }

  render() {
    return (
      <>
        <NavigationBar displayName={this.props.displayName} />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/map" element={<Map />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/me" element={<Me />} />
            <Route path="/create-kit" element={<CreateKit />} />
            <Route path="/kit/:kitSerial/*" element={<Kit />} />
            <Route element={<NotFound />} />
          </Routes>
        </main>

        <div style={{ minHeight: "1rem", flex: "1" }} />

        <Footer />
        <ConnectionStatus />
        <Notifications />
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { details } = state.me;
  return { displayName: details?.displayName ?? null };
};

export default connect(mapStateToProps)(App);
