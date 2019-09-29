export default class Option<T> {
  private _value?: T;
  private _some: boolean;

  private constructor(some: boolean, value?: T) {
    if (some && typeof value === "undefined") {
      throw new Error("Tried to set undefined value as Some");
    }

    this._value = value;
    this._some = some;
  }

  static some<T>(value: T) {
    return new Option<T>(true, value);
  }

  static none<T>() {
    return new Option<T>(false);
  }

  isSome(): boolean {
    return this._some;
  }

  isNone(): boolean {
    return !this._some;
  }

  unwrap(): T {
    if (this._some) {
      return this._value as T;
    } else {
      throw new Error("Tried to unwrap None");
    }
  }

  map<U>(f: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return Option.some(f(this.unwrap()));
    } else {
      return Option.none();
    }
  }

  andThen<U>(f: (value: T) => Option<U>): Option<U> {
    if (this.isSome()) {
      return f(this.unwrap());
    } else {
      return Option.none();
    }
  }
}
