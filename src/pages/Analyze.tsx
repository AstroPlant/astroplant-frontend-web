import React, { Component } from "react";
import { Container, Grid } from "semantic-ui-react";

import HeadTitle from "../Components/HeadTitle";
import PieChartCards from "../Components/PieChartCards";
import LineChartCard from "../Components/LineChartCard";

class AnalyzePage extends Component {
  render() {
    return (
      <div>
        <HeadTitle main="Kits Name" />

        <LineChartCard />

        <Container style={{ paddingTop: "3em" }}>
          <Grid
            stackable
            textAlign="center"
            style={{ paddingLeft: "4em", paddingRight: "4em" }}
          >
            <Grid.Row stackable="1" columns={3} width={16}>
              <Grid.Column>
                <PieChartCards sensor="Air Temp." units="Cº" />
              </Grid.Column>
              <Grid.Column>
                <PieChartCards sensor="Air Pressure" units="hPa" />
              </Grid.Column>
              <Grid.Column>
                <PieChartCards sensor="Soil Humidity" units="npi" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default AnalyzePage;
