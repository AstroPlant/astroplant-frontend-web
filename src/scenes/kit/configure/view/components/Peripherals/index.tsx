import React from "react";
import { Icon, Segment } from "semantic-ui-react";

import { KitState } from "modules/kit/reducer";
import { KitConfigurationWithPeripherals } from "astroplant-api";

import AddPeripheral from "./components/AddPeripheral";
import ViewEditPeripheral from "./components/ViewEditPeripheral";

export type Props = {
  kit: KitState;
  configuration: KitConfigurationWithPeripherals;
};

export default class Peripherals extends React.Component<Props> {
  render() {
    const { kit, configuration } = this.props;

    return (
      <>
        {configuration.neverUsed && (
          <AddPeripheral kit={kit} configuration={configuration} />
        )}
        {configuration.peripherals.map(peripheral => {
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
