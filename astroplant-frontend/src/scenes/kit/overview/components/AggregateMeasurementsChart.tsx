import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { DateTime } from "luxon";
import { map, tap } from "rxjs/operators";
import { firstValueFrom, Observable } from "rxjs";
import { Peripheral, PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "~/utils/option";
import { KitState } from "~/modules/kit/reducer";

import { api, Response, schemas } from "~/api";
import { rateLimit } from "~/utils/api";

export type Aggregate = {
  datetimeStart: Date;
  datetimeStartNumber: number;
  datetimeEnd: Date;
  datetimeEndNumber: number;
  values: {
    [aggregateType: string]: number;
  };
};

export type Props = CardProps & {
  kitState: KitState;
  peripheral: Peripheral;
  peripheralDefinition: PeripheralDefinition;
  quantityType: QuantityType;
};

const fillColor = "#35EF7F";
const borderColor = "#2fce6f";

export default function AggregateMeasurementsChart(props: Props) {
  const { t } = useTranslation();

  const { kitState, peripheral, peripheralDefinition, quantityType, ...rest } =
    props;
  const kitSerial = kitState.details!.serial;

  const [measurements, setMeasurements] = useState<Option<Array<Aggregate>>>(
    Option.none()
  );
  const [loading, setLoading] = useState(false);
  const [requestNext, setRequestNext] = useState<Observable<
    Response<Array<schemas["AggregateMeasurement"]>>
  > | null>(null);

  const load = useCallback(
    async (
      request: Observable<Response<Array<schemas["AggregateMeasurement"]>>>
    ) => {
      setLoading(true);

      try {
        const result = await firstValueFrom(
          request.pipe(
            tap((response) =>
              setRequestNext(response.meta.response?.next ?? null)
            ),
            map((response) => response.data.reverse()),
            rateLimit
          )
        );

        const newMeasurements = result.map((measurement) => ({
          datetimeStart: new Date(measurement.datetimeStart),
          datetimeStartNumber: new Date(measurement.datetimeStart).getTime(),
          datetimeEnd: new Date(measurement.datetimeEnd),
          datetimeEndNumber: new Date(measurement.datetimeEnd).getTime(),
          values: measurement.values,
        }));

        setMeasurements((measurements) =>
          Option.some(
            measurements
              .map((measurements) => [...newMeasurements, ...measurements])
              .unwrapOrElse(() => newMeasurements)
          )
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadNext = async () => {
    if (requestNext !== null) {
      await load(requestNext);
    }
  };

  useEffect(() => {
    const fn = async () => {
      const request = api.listAggregateMeasurements({
        kitSerial,
        peripheral: peripheral.id,
        quantityType: quantityType.id,
      });
      await load(request);
    };
    fn();
  }, [
    kitSerial,
    peripheral.id,
    quantityType.id,
    load, // doesn't actually change as its useCallback'd without dependencies
  ]);

  /**
   * Uses some heuristics to calculate the starting index of the chart brush;
   * this ensures charts are zoomed in if there are big gaps in measurement
   * datetimes.
   */
  const calculateWindowStartIndex = (measurements: Array<Aggregate>) => {
    if (measurements.length < 2) {
      return 0;
    }

    let minGap = Infinity;
    let prevDatetime = measurements[0]!.datetimeStart;
    for (const measurement of measurements.slice(1)) {
      const gap = measurement.datetimeStart.getTime() - prevDatetime.getTime();
      prevDatetime = measurement.datetimeStart;
      if (gap < minGap) {
        minGap = gap;
      }
    }

    let startIdx = 0;
    prevDatetime = measurements[0]!.datetimeStart;
    // @ts-ignore
    for (const [idx, measurement] of measurements.slice(1).entries()) {
      const gap = measurement.datetimeStart.getTime() - prevDatetime.getTime();
      prevDatetime = measurement.datetimeStart;
      if (gap >= 15 * minGap) {
        startIdx = idx + 1;
      }
    }

    return startIdx;
  };

  return (
    <Card color="black" fluid {...rest}>
      <Card.Content>
        <Card.Header>{quantityType.physicalQuantity}</Card.Header>
        <Card.Description textAlign="center">
          <ResponsiveContainer height={300} width="100%">
            <ComposedChart data={measurements.unwrapOr([])}>
              <Tooltip
                formatter={(value: any, name: any) =>
                  parseFloat(value.toPrecision(4))
                }
                labelFormatter={(time: any) =>
                  DateTime.fromMillis(time).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )
                }
              />
              <XAxis
                dataKey="datetimeStartNumber"
                tickFormatter={(tick) =>
                  DateTime.fromMillis(tick).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )
                }
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
                fill={fillColor}
                stroke={borderColor}
                yAxisId="left"
                dataKey="values.minimum"
                name={t("kit.aggregateMeasurements.minimum") as string}
              />
              <Area
                fill={fillColor}
                stroke={borderColor}
                yAxisId="left"
                dataKey="values.average"
                name={t("kit.aggregateMeasurements.average") as string}
              />
              <Area
                fill={fillColor}
                stroke={borderColor}
                yAxisId="left"
                dataKey="values.maximum"
                name={t("kit.aggregateMeasurements.maximum") as string}
              />
              {
                // see https://github.com/recharts/recharts/issues/1187 and https://github.com/recharts/recharts/issues/2093
              }
              {measurements.unwrapOr([]).length > 0 && (
                <Brush
                  dataKey="datetimeStartNumber"
                  height={40}
                  tickFormatter={(time: any) =>
                    DateTime.fromMillis(time).toLocaleString(
                      DateTime.DATETIME_SHORT
                    )
                  }
                  startIndex={calculateWindowStartIndex(
                    measurements.unwrapOr([])
                  )}
                />
              )}
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
              disabled={requestNext === null || loading}
              loading={loading}
              onClick={() => loadNext()}
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
