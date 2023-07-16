import React from "react";
import { Routes, Route } from "react-router";
import { Container, Message } from "semantic-ui-react";

import Create from "./create";
import List from "./list";
import View from "./view";

export default function KitConfigure() {
  return (
    <Container>
      <Message>
        <Message.Header>Kit version</Message.Header>
        <p>
          During this beta testing phase, it is important to regularly check you
          are running the latest kit software. Please check you are running the
          latest version by referring to the{" "}
          <a href="https://astroplant.gitbook.io/join-mission/astroplant-software/software-setup">
            software setup guides
          </a>
          . If your kit is up and running you can check your current kit version
          through the RPC system using &quot;Query kit version&quot;. You can
          also SSH into your kit and run:
        </p>
        <pre>
          <code>$ astroplant-kit version</code>
        </pre>
      </Message>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:configurationId" element={<View />} />
      </Routes>
    </Container>
  );
}
