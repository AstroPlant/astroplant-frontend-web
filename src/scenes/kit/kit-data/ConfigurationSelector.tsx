import { useContext, useMemo } from "react";
import { IconSettings, IconCheck } from "@tabler/icons-react";

import { ConfigurationsContext } from "../contexts";
import { DropdownDetails } from "~/Components/DropdownDetails";

import style from "./ConfigurationSelector.module.css";
import { Badge } from "~/Components/Badge";
import { schemas } from "~/api";

const MAX_ENTRIES = 10;

function Row({
  configuration,
  chosen,
}: {
  configuration: schemas["KitConfigurationWithPeripherals"];
  chosen: boolean;
}) {
  return (
    <li>
      <DropdownDetails.Link
        to={`?c=${configuration.id}`}
        aria-checked={chosen}
        role="menuitemradio"
      >
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
  chosenConfiguration: schemas["KitConfigurationWithPeripherals"] | null;
};

export function ConfigurationSelector({
  chosenConfiguration,
}: ConfigurationSelectorProps) {
  const configurations = useContext(ConfigurationsContext);

  // Show the active configuration first, make sure the chosen configuration
  // (the one the user is currently viewing) is shown, and show at most
  // `MAX_ENTRIES` configurations.
  const shownConfigurations = useMemo(() => {
    const activeConfiguration =
      Object.values(configurations).find((c) => c.active) ?? null;

    const shownConfigurations = [
      ...(activeConfiguration ? [activeConfiguration] : []),
      ...Object.values(configurations)
        .filter((c) => !c.active)
        .slice(0, activeConfiguration === null ? MAX_ENTRIES : MAX_ENTRIES - 1),
    ];

    if (chosenConfiguration !== null) {
      if (
        shownConfigurations.find((c) => c.id === chosenConfiguration.id) ===
        undefined
      ) {
        if (shownConfigurations.length === MAX_ENTRIES) {
          shownConfigurations.pop();
        }
        shownConfigurations.push(chosenConfiguration);
      }
    }

    return shownConfigurations;
  }, [chosenConfiguration, configurations]);

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
        {shownConfigurations.map((configuration) => (
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
