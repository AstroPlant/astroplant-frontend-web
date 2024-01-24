import { KitConfigurationState } from "~/modules/kit/reducer";

export function configurationToNameString(configuration: KitConfigurationState) {
  return `${configuration.description ?? "Unnamed configuration"} (#${
    configuration.id
  })`;
}
