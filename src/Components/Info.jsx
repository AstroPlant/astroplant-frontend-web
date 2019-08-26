import React, { Component } from "react";
import { Grid } from "semantic-ui-react";

import InfoRecuadro from "./InfoRecuadro";

class Info extends Component {
  render() {
    return (
      <Grid stackable divided="vertically">
        <Grid.Row columns="1">
          <h2 className="p_title">Grow plants in space</h2>

          <p className="p_body">
            Welcome, space farmer!
            <br />
            <br />
            AstroPlant is an educational citizen science project with the
            European Space Agency to engage a new generation of space farmers,
            collect data and ideas for agriculture on Mars, develop open source
            research equipment, and create awareness of regenerative and
            closed-loop life support systems. We have built a prototype plant
            lab that collects and shares open data about plant growth in
            different grow environments and are working on an open
            lab-infrastructure that makes it possible for everyone to contribute
            to science and space exploration—and to get to know more about
            topics such as plant science and biology, space science,
            engineering, electronics, open innovation and the circular economy.
          </p>
        </Grid.Row>

        <Grid.Row
          stackable="1"
          columns={3}
          textAlign="center"
          style={{ paddingTop: "3em" }}
        >
          <Grid.Column>
            <InfoRecuadro
              icon="map marker alternate"
              head_text="See"
              p_text="See the Astroplant kits in the world"
              button_text="Show Map"
              ruta="home"
            />
          </Grid.Column>
          <Grid.Column>
            <InfoRecuadro
              icon="pagelines"
              head_text="Learn"
              p_text="Learn about growing plants and AstroPlant."
              button_text="Read More"
              ruta="/home"
            />
          </Grid.Column>
          <Grid.Column>
            <InfoRecuadro
              icon="dashboard"
              head_text="Analyze"
              p_text="Analyze real-time AstroPlant data."
              button_text="Analyze System"
              ruta="/analyze"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Info;
