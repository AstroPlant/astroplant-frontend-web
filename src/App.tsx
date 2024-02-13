import "leaflet/dist/leaflet.css";
import "./App.css";

import { Navigate, Route, Routes, useParams } from "react-router-dom";

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
import User from "./scenes/user";

export default function App() {
  return (
    <>
      <NavigationBar />
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
          <Route path="/user/:username" element={<UserWrapped />} />
          <Route path="/create-kit" element={<CreateKit />} />
          <Route path="/kit/:kitSerial/*" element={<Kit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <div style={{ minHeight: "1rem", flex: "1" }} />

      <Footer />
      <ConnectionStatus />
      <Notifications />
    </>
  );
}

function UserWrapped() {
  const { username } = useParams<{ username: string }>();
  if (username) {
    return <User username={username} />;
  } else {
    return <NotFound />;
  }
}
