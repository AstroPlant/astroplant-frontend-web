/// Remove all properties with null values.
export function removeNull(obj: object): object {
  let newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null) {
      newObj[key] = value;
    }
  }
  return newObj;
}

/// Copies all properties from `obj`. All properties named in `properties`, but
/// undefined in `obj`, are set to `null`.
export function undefinedToNull(obj: object, properties: Array<string>): object {
  let newObj: any = { ...obj };
  for (const property of properties) {
    // @ts-ignore
    if (typeof obj[property] === "undefined") {
      newObj[property] = null;
    }
  }
  return newObj;
}

/// Set all properties that are empty strings to null.
export function emptyStringToNull(obj: object): object {
  let newObj: any = { ...obj };
  for (const property of Object.keys(obj)) {
    // @ts-ignore
    if (obj[property] === "") {
      newObj[property] = null;
    }
  }
  return newObj;
}
