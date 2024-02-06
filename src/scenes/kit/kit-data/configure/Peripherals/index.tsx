import AddPeripheral from "./components/AddPeripheral";
import ViewEditPeripheral from "./components/ViewEditPeripheral";
import { schemas } from "~/api";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
  readOnly: boolean;
};

export default function Peripherals({ kit, configuration, readOnly }: Props) {
  return (
    <>
      {!readOnly && <AddPeripheral kit={kit} configuration={configuration} />}
      {Object.values(configuration.peripherals).map((peripheral) => {
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
