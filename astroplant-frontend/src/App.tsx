import "leaflet/dist/leaflet.css";
import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import { useAppSelector } from "./hooks";

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

export default function App() {
  const displayName = useAppSelector(
    (state) => state.me.details?.displayName ?? null,
  );

  return (
    <>
      <NavigationBar displayName={displayName} />
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
