import React from "react";
import { connect } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import { RootState } from "types";
import Option from "utils/option";
import { KitState } from "modules/kit/reducer";

import {
  PeripheralDefinition,
  QuantityType,
  MeasurementsApi
} from "astroplant-api";
import { AuthConfiguration } from "utils/api";

import AggregateMeasurementsChart, {
  Measurements
} from "./AggregateMeasurementsChart";

type Params = { kitSerial: string };

export type Props = {
  kit: KitState;
  peripheralDefinitions: { [id: string]: PeripheralDefinition };
  quantityTypes: { [id: string]: QuantityType };
};

type State = {
  aggregateMeasurements: { [index: string]: Array<Measurements> };
};

class AggregateMeasurements extends React.Component<Props> {
  state: State = {
    aggregateMeasurements: {}
  };

  async componentDidMount() {
    const { kit } = this.props;
    try {
      const api = new MeasurementsApi(AuthConfiguration.Instance);
      const aggregateMeasurements = await api
        .listAggregateMeasurements({
          kitSerial: kit.details.serial
        })
        .toPromise();

      let stateAggregateMeasurements: {
        [index: string]: Array<Measurements>;
      } = {};
      let idxAggregateMeasurements: {
        [index: string]: {
          [index: string]: number; // index into stateAggregatemeasurements
        };
      } = {};

      for (const aggregateMeasurement of aggregateMeasurements) {
        const idxPerQt = `${aggregateMeasurement.peripheralId}.${aggregateMeasurement.quantityTypeId}`;
        const idxMeasurement = `${aggregateMeasurement.datetimeStart}.${aggregateMeasurement.datetimeEnd}`;
        if (!(idxPerQt in idxAggregateMeasurements)) {
          idxAggregateMeasurements[idxPerQt] = {};
          stateAggregateMeasurements[idxPerQt] = [];
        }
        if (!(idxMeasurement in idxAggregateMeasurements[idxPerQt])) {
          idxAggregateMeasurements[idxPerQt][idxMeasurement] =
            stateAggregateMeasurements[idxPerQt].length;
          stateAggregateMeasurements[idxPerQt].push({
            datetimeStart: aggregateMeasurement.datetimeStart,
            datetimeEnd: aggregateMeasurement.datetimeEnd,
            values: {}
          });
        }
        const idx = idxAggregateMeasurements[idxPerQt][idxMeasurement];
        stateAggregateMeasurements[idxPerQt][idx].values[
          aggregateMeasurement.aggregateType
        ] = aggregateMeasurement.value;
      }

      for (let measurements of Object.values(stateAggregateMeasurements)) {
        while (measurements.length >= 100) {
          measurements.shift();
        }
      }

      this.setState({ aggregateMeasurements: stateAggregateMeasurements });
    } finally {
      //this.setState({ versionRequesting: false });
    }
  }

  render() {
    const { kit, peripheralDefinitions, quantityTypes } = this.props;
    const { aggregateMeasurements } = this.state;
    let activeConfiguration = null;
    for (const configuration of Object.values(kit.configurations)) {
      if (configuration.active) {
        activeConfiguration = configuration;
      }
    }

    if (activeConfiguration !== null) {
      return (
        <Container>
          <Card.Group centered>
            {Object.values(activeConfiguration.peripherals).map(peripheral => {
              const def: Option<PeripheralDefinition> = Option.from(
                peripheralDefinitions[peripheral.peripheralDefinitionId]
              );
              return def
                .map((def: PeripheralDefinition) =>
                  def.expectedQuantityTypes!.map(quantityType => {
                    const qt: Option<QuantityType> = Option.from(
                      quantityTypes[quantityType]
                    );
                    return qt
                      .map(qt => {
                        const measurements = Option.from(
                          aggregateMeasurements[peripheral.id + "." + qt.id]
                        );
                        return measurements
                          .map((measurements: Array<Measurements>) => {
                            return (
                              <AggregateMeasurementsChart
                                key={peripheral.id + "." + qt.id}
                                peripheral={peripheral}
                                peripheralDefinition={def}
                                quantityType={qt}
                                measurements={measurements}
                              />
                            );
                          })
                          .unwrapOrNull();
                      })
                      .unwrapOrNull();
                  })
                )
                .unwrapOrNull();
            })}
          </Card.Group>
        </Container>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions,
    quantityTypes: state.quantityType.quantityTypes
  };
};

export default connect(mapStateToProps)(AggregateMeasurements);
