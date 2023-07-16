import React from "react";

import {
  KitConfigurationState,
  peripheralSelectors,
} from "modules/kit/reducer";

import AddPeripheral from "./components/AddPeripheral";
import ViewEditPeripheral from "./components/ViewEditPeripheral";
import { schemas } from "~/api";
import { useAppSelector } from "~/hooks";

export type Props = {
  kit: schemas["Kit"];
  configuration: KitConfigurationState;
  readOnly: boolean;
};

export default function Peripherals({ kit, configuration, readOnly }: Props) {
  const peripherals = useAppSelector(peripheralSelectors.selectEntities);

  return (
    <>
      {!readOnly && <AddPeripheral kit={kit} configuration={configuration} />}
      {Object.values(configuration.peripherals)
        .map((id) => peripherals[id]!)
        .map((peripheral) => {
          return (
            <ViewEditPeripheral
              key={peripheral.id}
              kit={kit}
              configuration={configuration}
              peripheral={peripheral}
              readOnly={readOnly}
            />
          );
        })}
    </>
  );
}
