import React from "react";

import { KitConfigurationState } from "modules/kit/reducer";
import { Kit } from "astroplant-api";

import AddPeripheral from "./components/AddPeripheral";
import ViewEditPeripheral from "./components/ViewEditPeripheral";

export type Props = {
  kit: Kit;
  configuration: KitConfigurationState;
};

export default function Peripherals({ kit, configuration }: Props) {
  return (
    <>
      {configuration.neverUsed && (
        <AddPeripheral kit={kit} configuration={configuration} />
      )}
      {Object.keys(configuration.peripherals).map((peripheralId) => {
        const peripheral = configuration.peripherals[peripheralId];
        return (
          <ViewEditPeripheral
            key={peripheral.id}
            kit={kit}
            configuration={configuration}
            peripheral={peripheral}
          />
        );
      })}
    </>
  );
}
