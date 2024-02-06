import React from "react";

import { schemas } from "~/api";
import { KitConfigurationState } from "~/modules/kit/reducer";
import { KitMembership } from "~/modules/me/reducer";
import { KitPermissions, NO_PERMISSIONS } from "~/permissions";

export const KitContext = React.createContext<schemas["Kit"]>(null as any);
export const ConfigurationsContext = React.createContext<{
  [id: string]: schemas["KitConfigurationWithPeripherals"];
}>({});
export const MembershipContext = React.createContext<KitMembership | null>(
  null,
);
export const PermissionsContext =
  React.createContext<KitPermissions>(NO_PERMISSIONS);
