import React from "react";
import { Card, CardProps } from "semantic-ui-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis
} from "recharts";
import moment from "moment";
import { Peripheral, PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "utils/option";

export type Measurements = {
  datetimeStart: Date;
  datetimeEnd: Date;
  values: {
    [aggregateType: string]: number;
  };
};

export type Props = CardProps & {
  peripheral: Peripheral;
  peripheralDefinition: PeripheralDefinition;
  quantityType: QuantityType;
  measurements: Option<Array<Measurements>>;
};

export default (props: Props) => {
  const {
    peripheral,
    peripheralDefinition,
    quantityType,
    measurements,
    ...rest
  } = props;
  return (
    <Card color="blue" fluid {...rest}>
      <Card.Content>
        <Card.Header>{quantityType.physicalQuantity}</Card.Header>
        <Card.Description textAlign="center">
          <ResponsiveContainer height={300} width="100%">
            <ComposedChart data={measurements.unwrapOr([])}>
              <XAxis
                dataKey="datetimeStart"
                tickFormatter={tick => moment(tick).calendar()}
                minTickGap={25}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                label={
                  quantityType.physicalUnitSymbol || quantityType.physicalUnit
                }
                domain={["dataMin", "dataMax"]}
                tickFormatter={tick => tick.toPrecision(4)}
                padding={{ top: 50, bottom: 0 }}
              />
              {/*
              <YAxis
               yAxisId="right"
               orientation="right"
               label="Count"
               domain={["dataMin", "dataMax"]}
               allowDecimals={false}
              />
              */}
              <Area yAxisId="left" dataKey="values.minimum" />
              <Area yAxisId="left" dataKey="values.average" />
              <Area yAxisId="left" dataKey="values.maximum" />
              {/*
              <Line
                yAxisId="right"
                dot={false}
                dataKey="values.count"
              />
              */}
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
                opacity: 0.6
              }}
            >
              <h2 style={{ textAlign: "center" }}>No measurements</h2>
            </div>
          )}
        </Card.Description>
        <Card.Meta>Measured by {peripheral.name}</Card.Meta>
      </Card.Content>
    </Card>
  );
};
