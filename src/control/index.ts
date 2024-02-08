import { produce } from "immer";
import { FuzzyControl } from "./types";

/**
 * Delete a peripheral from a FuzzyControl object. Returns a new FuzzyControl object with the peripheral removed.
 */
export function fuzzyControlDeletePeripheral(
  fuzzyControl: FuzzyControl,
  peripheralName: string,
): FuzzyControl {
  return produce(fuzzyControl, (fuzzyControl) => {
    delete fuzzyControl.input[peripheralName];
    delete fuzzyControl.output[peripheralName];
    for (let rule of fuzzyControl.rules) {
      rule.condition = rule.condition.filter(
        (condition) => condition.peripheral !== peripheralName,
      );
      rule.implication = rule.implication.filter(
        (implication) => implication.peripheral !== peripheralName,
      );
      rule.schedules = rule.schedules.filter(
        (schedule) => schedule.peripheral !== peripheralName,
      );
    }

    fuzzyControl.rules = fuzzyControl.rules.filter(
      (rule) =>
        rule.condition.length > 0 ||
        rule.implication.length > 0 ||
        rule.schedules.length > 0,
    );
  });
}

/**
 * Rename a peripheral in a FuzzyControl object. Returns a new FuzzyControl object with the peripheral renamed.
 */
export function fuzzyControlRenamePeripheral(
  fuzzyControl: FuzzyControl,
  oldPeripheralName: string,
  newPeripheralName: string,
): FuzzyControl {
  return produce(fuzzyControl, (fuzzyControl) => {
    fuzzyControl.input = renameKey(
      fuzzyControl.input,
      oldPeripheralName,
      newPeripheralName,
    );
    fuzzyControl.output = renameKey(
      fuzzyControl.output,
      oldPeripheralName,
      newPeripheralName,
    );
    for (const rule of fuzzyControl.rules) {
      for (const schedule of rule.implication) {
        if (schedule.peripheral === oldPeripheralName) {
          schedule.peripheral = newPeripheralName;
        }
      }
      for (const schedule of rule.condition) {
        if (schedule.peripheral === oldPeripheralName) {
          schedule.peripheral = newPeripheralName;
        }
      }
      for (const schedule of rule.schedules) {
        if (schedule.peripheral === oldPeripheralName) {
          schedule.peripheral = newPeripheralName;
        }
      }
    }
  });
}

function renameKey<T>(
  o: { [key: string]: T },
  oldName: string,
  newName: string,
): { [key: string]: T } {
  const { [oldName]: val, ...rest } = o;
  if (val !== undefined) {
    return { [newName]: val, ...rest };
  } else {
    return o;
  }
}
