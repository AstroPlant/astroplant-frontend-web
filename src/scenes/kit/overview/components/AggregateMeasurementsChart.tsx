import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card, CardProps } from "semantic-ui-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";
import { map } from "rxjs/operators";
import { Peripheral, PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "utils/option";
import { KitState } from "modules/kit/reducer";

import { KitsApi } from "api";
import { rateLimit, configuration } from "utils/api";

export type Measurements = {
  datetimeStart: Date;
  datetimeEnd: Date;
  values: {
    [aggregateType: string]: number;
  };
};

export type Props = CardProps &
  WithTranslation & {
    kitState: KitState;
    peripheral: Peripheral;
    peripheralDefinition: PeripheralDefinition;
    quantityType: QuantityType;
    measurements: Option<Array<Measurements>>;
  };

type State = {
  measurements: Option<Array<Measurements>>;
};

class AggregateMeasurementsChart extends React.Component<Props, State> {
  state: State = {
    measurements: Option.none(),
  };

  async componentDidMount() {
    const { kitState, peripheral, quantityType } = this.props;
    try {
      const api = new KitsApi(configuration);
      const aggregateMeasurements = await api
        .listAggregateMeasurements({
          kitSerial: kitState.details.unwrap().serial,
          peripheral: peripheral.id,
          quantityType: quantityType.id,
        })
        .pipe(
          map((response) => response.content.reverse()),
          rateLimit
        )
        .toPromise();

      let stateAggregateMeasurements: Array<Measurements> = [];
      let idxAggregateMeasurements: {
        [index: string]: number; // index into stateAggregatemeasurements
      } = {};

      for (const aggregateMeasurement of aggregateMeasurements) {
        const idxMeasurement = `${aggregateMeasurement.datetimeStart}.${aggregateMeasurement.datetimeEnd}`;
        if (!(idxMeasurement in idxAggregateMeasurements)) {
          idxAggregateMeasurements[idxMeasurement] =
            stateAggregateMeasurements.length;
          stateAggregateMeasurements.push({
            datetimeStart: new Date(aggregateMeasurement.datetimeStart),
            datetimeEnd: new Date(aggregateMeasurement.datetimeEnd),
            values: {},
          });
        }
        const idx = idxAggregateMeasurements[idxMeasurement];
        stateAggregateMeasurements[idx].values[
          aggregateMeasurement.aggregateType
        ] = aggregateMeasurement.value;
      }

      this.setState({ measurements: Option.some(stateAggregateMeasurements) });
    } finally {
      //this.setState({ versionRequesting: false });
    }
  }

  render() {
    const {
      peripheral,
      peripheralDefinition,
      quantityType,
      t,
      tReady,
      ...rest
    } = this.props;
    const { measurements } = this.state;
    const transformedMeasurements = measurements.map((measurements) =>
      measurements.map(({ datetimeStart, datetimeEnd, ...rest }) => ({
        datetimeStart: new Date(datetimeStart).getTime(),
        datetimeEnd: new Date(datetimeEnd).getTime(),
        ...rest,
      }))
    );
    return (
      <Card color="blue" fluid {...rest}>
        <Card.Content>
          <Card.Header>{quantityType.physicalQuantity}</Card.Header>
          <Card.Description textAlign="center">
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart data={transformedMeasurements.unwrapOr([])}>
                <Tooltip
                  formatter={(value: any, name: any) =>
                    parseFloat(value.toPrecision(4))
                  }
                  labelFormatter={(time: any) => moment(time).format("L LTS")}
                />
                <XAxis
                  dataKey="datetimeStart"
                  tickFormatter={(tick) => moment(tick).calendar()}
                  minTickGap={40}
                  scale="linear"
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={
                    quantityType.physicalUnitSymbol || quantityType.physicalUnit
                  }
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(tick) => tick.toPrecision(4)}
                  padding={{ top: 50, bottom: 0 }}
                />
                <Area
                  yAxisId="left"
                  dataKey="values.minimum"
                  name={t("kit.aggregateMeasurements.minimum") as string}
                />
                <Area
                  yAxisId="left"
                  dataKey="values.average"
                  name={t("kit.aggregateMeasurements.average") as string}
                />
                <Area
                  yAxisId="left"
                  dataKey="values.maximum"
                  name={t("kit.aggregateMeasurements.maximum") as string}
                />
              </ComposedChart>
            </ResponsiveContainer>
            {measurements.isNone() && (
              <div
                style={{
                  position: "absolute",
                  marginTop: "-300px",
                  height: "300px",
                  width: "100%",
                  textTransform: "uppercase",
                  fontWeight: "bolder",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.6,
                }}
              >
                <h2 style={{ textAlign: "center" }}>
                  {t("kit.aggregateMeasurements.noMeasurements")}
                </h2>
              </div>
            )}
          </Card.Description>
          <Card.Meta>
            {t("kit.aggregateMeasurements.measuredBy", { peripheral })}
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

export default withTranslation()(AggregateMeasurementsChart);
