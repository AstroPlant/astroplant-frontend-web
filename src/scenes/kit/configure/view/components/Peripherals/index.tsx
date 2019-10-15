import React from "react";
import { Icon } from "semantic-ui-react";

import { KitState } from "modules/kit/reducer";
import { KitConfigurationWithPeripherals } from "astroplant-api";

import AddPeripheral from "./components/AddPeripheral";

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
      </>
    );
  }
}
