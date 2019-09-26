import React, { Component } from "react";
import { Container, Divider, Grid, Segment } from "semantic-ui-react";

import HeadTitle from "./HeadTitle";
import InfoRecuadro from "./InfoRecuadro";

class Home extends Component {
  render() {
    return (
      <>
        <HeadTitle main="AstroPlant Prototype" secondary="Be a space farmer" />
        <Container text style={{marginTop: "1em"}}>
          <h2>Grow plants in space</h2>

          <p>Welcome, space farmer!</p>
          <p>
            AstroPlant is an educational citizen science project with the
            European Space Agency to engage a new generation of space farmers,
            collect data and ideas for agriculture on Mars, develop open source
            research equipment, and create awareness of regenerative and
            closed-loop life support systems.
          </p>
          <p>
            We have built a prototype plant lab that collects and shares open
            data about plant growth in different grow environments and are
            working on an open lab-infrastructure that makes it possible for
            everyone to contribute to science and space exploration—and to get
            to know more about topics such as plant science and biology, space
            science, engineering, electronics, open innovation and the circular
            economy.
          </p>
        </Container>

        <Divider/>

        <Container>
          <Segment placeholder>
          <Grid columns={3} stackable textAlign="center">
            <Grid.Row
              divided="vertically"
              verticalAlign="middle"
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
          </Segment>
        </Container>
      </>
    );
  }
}

export default Home;
