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

  /**
   * Construct an option from a value that is possible null or undefined. If
   * the value is null or undefined, the option is None, else it is Some. */
  static from<T>(value?: T | null) {
    if (typeof value === "undefined" || value === null) {
      return Option.none<T>();
    } else {
      return Option.some<T>(value);
    }
  }

  /** Construct an option from a value. The option will be Some. */
  static some<T>(value: T) {
    return new Option<T>(true, value);
  }

  /** Construct an empty option. The option will be None. */
  static none<T>() {
    return new Option<T>(false);
  }

  /** Whether the option is Some. */
  isSome(): boolean {
    return this._some;
  }

  /** Whether the option is None. */
  isNone(): boolean {
    return !this._some;
  }

  /**
   * Get the value inside the option if it is Some. Throws an error otherwise.
   *
   * @throws If and only if the option is None.
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

  /** Get the value inside the option if it is Some. Otherwise return null. */
  unwrapOrNull(): T | null {
    if (this.isSome()) {
      return this.unwrap();
    } else {
      return null;
    }
  }

  /**
   * Returns None if the option is None. Otherwise calls the provided function
   * with the wrapped Some value, returning a new Some option.
   */
  map<U>(f: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return Option.some(f(this.unwrap()));
    } else {
      return Option.none();
    }
  }

  /**
   * Returns None if the option is None. Otherwise calls the provided function
   * with the wrapped Some value, returning that function's result.
   */
  andThen<U>(f: (value: T) => Option<U>): Option<U> {
    if (this.isSome()) {
      return f(this.unwrap());
    } else {
      return Option.none();
    }
  }
}
