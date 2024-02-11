import { schemas } from "./api";

export interface KitPermissions {
  deleteMedia: boolean;
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
  deleteMedia: false,
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

// Might be better if the API returns the permissions, so we don't have to
// calculate them here.
export function kitPermissionsFromMembership(
  membership: schemas["KitMembership"] | null,
): KitPermissions {
  let accessConfigure = membership?.accessConfigure ?? false;
  let accessSuper = membership?.accessSuper ?? false;

  // This corresponds to
  // https://github.com/AstroPlant/astroplant-api/blob/3cc10c726b1d1cbb4185193d756febe19a0c8e09/astroplant-api/src/authorization/mod.rs#L39-L81
  return {
    deleteMedia: accessConfigure || accessSuper,
    resetPassword: accessSuper,
    editDetails: accessConfigure || accessSuper,
    editConfiguration: accessConfigure || accessSuper,
    editMembers: accessSuper,
    setSuperMember: accessSuper,
    rpcVersion: accessSuper,
    rpcUptime: accessSuper,
    rpcPeripheralCommand: accessSuper,
    rpcPeripheralCommandLock: accessSuper,
  };
}
