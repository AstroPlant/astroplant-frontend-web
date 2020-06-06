import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card, CardProps, Button } from "semantic-ui-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Area,
  XAxis,
  YAxis,
  Brush,
} from "recharts";
import moment from "moment";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Peripheral, PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "utils/option";
import { KitState } from "modules/kit/reducer";

import { KitsApi, Response, schemas } from "api";
import { rateLimit, configuration } from "utils/api";

export type Aggregate = {
  datetimeStart: Date;
  datetimeStartNumber: number;
  datetimeEnd: Date;
  datetimeEndNumber: number;
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
    measurements: Option<Array<Aggregate>>;
  };

type State = {
  measurements: Option<Array<Aggregate>>;
  loading: boolean;
  requestNext: Option<
    Observable<Response<Array<schemas["AggregateMeasurement"]>>>
  >;
};

class AggregateMeasurementsChart extends React.PureComponent<Props, State> {
  state: State = {
    measurements: Option.none(),
    loading: false,
    requestNext: Option.none(),
  };

  async load(
    request: Observable<Response<Array<schemas["AggregateMeasurement"]>>>
  ) {
    this.setState({ loading: true });

    try {
      const result = await request
        .pipe(
          tap((response) => this.setState({ requestNext: response.next() })),
          map((response) => response.content.reverse()),
          rateLimit
        )
        .toPromise();

      const newMeasurements = result.map((measurement) => ({
        datetimeStart: new Date(measurement.datetimeStart),
        datetimeStartNumber: new Date(measurement.datetimeStart).getTime(),
        datetimeEnd: new Date(measurement.datetimeEnd),
        datetimeEndNumber: new Date(measurement.datetimeEnd).getTime(),
        values: measurement.values,
      }));

      this.setState({
        measurements: Option.some(
          this.state.measurements
            .map((measurements) => [...newMeasurements, ...measurements])
            .unwrapOrElse(() => newMeasurements)
        ),
      });
    } finally {
      this.setState({ loading: false });
    }
  }

  async loadNext() {
    if (this.state.requestNext.isSome()) {
      await this.load(this.state.requestNext.unwrap());
    }
  }

  async componentDidMount() {
    const { kitState, peripheral, quantityType } = this.props;
    const api = new KitsApi(configuration);
    const request = await api.listAggregateMeasurements({
      kitSerial: kitState.details.unwrap().serial,
      peripheral: peripheral.id,
      quantityType: quantityType.id,
    });
    await this.load(request);
  }

  /**
   * Uses some heuristics to calculate the starting index of the chart brush;
   * this ensures charts are zoomed in if there are big gaps in measurement
   * datetimes.
   */
  calculateWindowStartIndex(measurements: Array<Aggregate>) {
    if (measurements.length < 2) {
      return 0;
    }

    let minGap = Infinity;
    let prevDatetime = measurements[0].datetimeStart;
    for (const measurement of measurements.slice(1)) {
      const gap = measurement.datetimeStart.getTime() - prevDatetime.getTime();
      prevDatetime = measurement.datetimeStart;
      if (gap < minGap) {
        minGap = gap;
      }
    }

    let startIdx = 0;
    prevDatetime = measurements[0].datetimeStart;
    for (const [idx, measurement] of measurements.slice(1).entries()) {
      const gap = measurement.datetimeStart.getTime() - prevDatetime.getTime();
      prevDatetime = measurement.datetimeStart;
      if (gap >= 15 * minGap) {
        startIdx = idx + 1;
      }
    }

    return startIdx;
  }

  render() {
    const {
      kitState,
      peripheral,
      peripheralDefinition,
      quantityType,
      t,
      tReady,
      ...rest
    } = this.props;
    const { measurements } = this.state;
    return (
      <Card color="blue" fluid {...rest}>
        <Card.Content>
          <Card.Header>{quantityType.physicalQuantity}</Card.Header>
          <Card.Description textAlign="center">
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart data={measurements.unwrapOr([])}>
                <Tooltip
                  formatter={(value: any, name: any) =>
                    parseFloat(value.toPrecision(4))
                  }
                  labelFormatter={(time: any) => moment(time).format("L LTS")}
                />
                <XAxis
                  dataKey="datetimeStartNumber"
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
                <Brush
                  dataKey="datetimeStartNumber"
                  height={40}
                  tickFormatter={(time: any) => moment(time).format("L")}
                  startIndex={this.calculateWindowStartIndex(
                    measurements.unwrapOr([])
                  )}
                />
              </ComposedChart>
            </ResponsiveContainer>
            {measurements.isNone() ? (
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
            ) : (
              <Button
                disabled={
                  !this.state.requestNext.isSome() || this.state.loading
                }
                loading={this.state.loading}
                onClick={() => this.loadNext()}
              >
                Load more
              </Button>
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
