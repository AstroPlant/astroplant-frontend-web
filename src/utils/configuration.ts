import { schemas } from "~/api";

export function configurationToNameString<
  T extends schemas["KitConfiguration"],
>(configuration: T) {
  return `${configuration.description ?? "Unnamed configuration"} (#${
    configuration.id
  })`;
}
