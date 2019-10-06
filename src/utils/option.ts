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

  static from<T>(value?: T | null) {
    if (typeof value === "undefined" || value === null) {
      return Option.none<T>();
    } else {
      return Option.some<T>(value);
    }
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

  /**
   * Get the value inside the option if it is Some. Throws an error otherwise.
   */
  unwrap(): T {
    if (this._some) {
      return this._value as T;
    } else {
      throw new Error("Tried to unwrap None");
    }
  }

  /**
   * Get the value inside the option if it is Some. Return the alternative
   * otherwise.
   */
  unwrapOr(alternative: T): T {
    if (this._some) {
      return this._value as T;
    } else {
      return alternative;
    }
  }

  /**
   * Get the value inside the option if it is Some. Otherwise, call the function
   * to generate an alternative and return that.
   */
  unwrapOrElse(fnAlternative: () => T): T {
    if (this._some) {
      return this._value as T;
    } else {
      return fnAlternative();
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
