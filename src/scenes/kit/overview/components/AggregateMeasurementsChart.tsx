import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card, CardProps } from "semantic-ui-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
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

export type Props = CardProps &
  WithTranslation & {
    peripheral: Peripheral;
    peripheralDefinition: PeripheralDefinition;
    quantityType: QuantityType;
    measurements: Option<Array<Measurements>>;
  };

const AggregateMeasurementsChart = (props: Props) => {
  const {
    peripheral,
    peripheralDefinition,
    quantityType,
    measurements,
    t,
    ...rest
  } = props;
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
                dataKey="datetimeStart"
                tickFormatter={tick => moment(tick).calendar()}
                minTickGap={40}
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
                opacity: 0.6
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
};

export default withTranslation()(AggregateMeasurementsChart);
