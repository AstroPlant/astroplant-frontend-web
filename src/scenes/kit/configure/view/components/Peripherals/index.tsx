import React from "react";

import { KitState, KitConfigurationState } from "modules/kit/reducer";

import AddPeripheral from "./components/AddPeripheral";
import ViewEditPeripheral from "./components/ViewEditPeripheral";

export type Props = {
  kit: KitState;
  configuration: KitConfigurationState;
};

export default class Peripherals extends React.Component<Props> {
  render() {
    const { kit, configuration } = this.props;

    return (
      <>
        {configuration.neverUsed && (
          <AddPeripheral kit={kit} configuration={configuration} />
        )}
        {Object.keys(configuration.peripherals).map(peripheralId => {
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
}
