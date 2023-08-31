import { KitMembership } from "~/modules/me/reducer";

export interface KitPermissions {
  resetPassword: boolean;
  editDetails: boolean;
  editConfiguration: boolean;
  editMembers: boolean;
  setSuperMember: boolean;
  rpcVersion: boolean;
  rpcUptime: boolean;
  rpcPeripheralCommand: boolean;
  rpcPeripheralCommandLock: boolean;
}

export const NO_PERMISSIONS: KitPermissions = {
  resetPassword: false,
  editDetails: false,
  editConfiguration: false,
  editMembers: false,
  setSuperMember: false,
  rpcVersion: false,
  rpcUptime: false,
  rpcPeripheralCommand: false,
  rpcPeripheralCommandLock: false,
};

export function kitPermissionsFromMembership(
  membership: KitMembership | null,
): KitPermissions {
  let accessConfigure = membership?.accessConfigure ?? false;
  let accessSuper = membership?.accessSuper ?? false;

  return {
    resetPassword: accessSuper,
    editDetails: accessConfigure,
    editConfiguration: accessConfigure,
    editMembers: accessSuper,
    setSuperMember: accessSuper,
    rpcVersion: accessSuper,
    rpcUptime: accessSuper,
    rpcPeripheralCommand: accessSuper,
    rpcPeripheralCommandLock: accessSuper,
  };
}
