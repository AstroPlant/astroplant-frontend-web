import { useContext, useMemo } from "react";
import { IconSettings, IconCheck } from "@tabler/icons-react";

import { ConfigurationsContext } from "../contexts";
import { DropdownDetails } from "~/Components/DropdownDetails";
import { KitConfigurationState } from "~/modules/kit/reducer";

import style from "./ConfigurationSelector.module.css";
import { Badge } from "~/Components/Badge";

const MAX_ENTRIES = 10;

function Row({
  configuration,
  chosen,
}: {
  configuration: KitConfigurationState;
  chosen: boolean;
}) {
  return (
    <li>
      <DropdownDetails.Link to={`?c=${configuration.id}`} aria-checked={chosen} role="menuitemradio">
        {
          <IconCheck
            size="1em"
            aria-hidden
            visibility={chosen ? "initial" : "hidden"}
          />
        }
        <span className={style.description}>
          {configuration.description}{" "}
          <span className={style.identifier}>#{configuration.id}</span>
        </span>
        {configuration.active && (
          <Badge text="Active" variant="muted" size="small" />
        )}
      </DropdownDetails.Link>
    </li>
  );
}

export type ConfigurationSelectorProps = {
  chosenConfiguration: KitConfigurationState | null;
};

export function ConfigurationSelector({
  chosenConfiguration,
}: ConfigurationSelectorProps) {
  const configurations = useContext(ConfigurationsContext);

  const numConfigurations = Object.keys(configurations).length;

  const activeConfiguration = useMemo(
    () => Object.values(configurations).find((c) => c.active) ?? null,
    [configurations],
  );

  const inactiveConfigurations = useMemo(
    () =>
      Object.values(configurations)
        .filter((c) => !c.active)
        .slice(0, activeConfiguration === null ? MAX_ENTRIES : MAX_ENTRIES - 1),
    [configurations],
  );

  return (
    <DropdownDetails
      className={style.configurations}
      icon={<IconSettings />}
      label={
        chosenConfiguration ? (
          <>
            {chosenConfiguration.description || "Unnamed configuration"} (#
            {chosenConfiguration.id})
          </>
        ) : (
          <em>Configurations</em>
        )
      }
      title="Switch configurations"
      header="Choose a configuration"
      anchor="left"
    >
      <ul role="menu">
        {activeConfiguration && (
          <Row
            configuration={activeConfiguration}
            chosen={activeConfiguration.id === chosenConfiguration?.id}
          />
        )}
        {inactiveConfigurations.map((configuration) => (
          <Row
            key={configuration.id}
            configuration={configuration}
            chosen={configuration.id === chosenConfiguration?.id}
          />
        ))}
      </ul>
      <DropdownDetails.Link to="../configurations">
        View all configurations
      </DropdownDetails.Link>
    </DropdownDetails>
  );
}
