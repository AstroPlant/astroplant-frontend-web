import React from "react";

import { schemas } from "~/api";
import { KitConfigurationState } from "~/modules/kit/reducer";
import { KitMembership } from "~/modules/me/reducer";

export const KitContext = React.createContext<schemas["Kit"]>(null as any);
export const ConfigurationsContext = React.createContext<{
  [id: string]: KitConfigurationState;
}>({});
export const MembershipContext = React.createContext<KitMembership | null>(
  null,
);
