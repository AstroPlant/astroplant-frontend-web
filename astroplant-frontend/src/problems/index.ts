export type InvalidParameterReason =
  | "mustBeEmailAddress"
  | "mustBeUrl"
  | { mustHaveLengthBetween: { min: number; max: number } }
  | "alreadyExists"
  | "other";

export type ProblemDetails = {
  type: string;
  status: number;
  title?: string;
  invalidParameters?: { [parameter: string]: [InvalidParameterReason] };
};

export type InvalidParametersFormErrors = {
  [parameter: string]: { __errors: string[] };
};

// TODO: should this really be a class with static functions? Or should it be
// namespaced differently?
export class PDInvalidParameters {
  /**
   * Attempt to turn invalid parameter problem details into form errors.
   * @return The form errors or null if the problem details are not of the
   * invalid parameters type.
   */
  static toFormErrors(
    t: any, // TODO: improve type
    problemDetails: ProblemDetails | null
  ): InvalidParametersFormErrors | null {
    if (
      problemDetails &&
      PDInvalidParameters.is(problemDetails) &&
      problemDetails.invalidParameters !== undefined
    ) {
      const invalidParametersReasons = problemDetails.invalidParameters;

      let formErrors: InvalidParametersFormErrors = {};

      for (let [parameter, reasons] of Object.entries(
        invalidParametersReasons
      )) {
        formErrors[parameter] = {
          __errors: reasons.map(reason => {
            if (reason === "mustBeEmailAddress") {
              return t("invalidParameter.mustBeEmailAddress");
            } else if (
              typeof reason === "object" &&
              reason.hasOwnProperty("mustHaveLengthBetween")
            ) {
              return t(
                "invalidParameter.mustHaveLengthBetween",
                reason.mustHaveLengthBetween
              );
            } else if (reason === "alreadyExists") {
              return t("invalidParameter.alreadyExists");
            } else {
              return t("invalidParameter.unexpected");
            }
          })
        };
      }

      return formErrors;
    } else {
      return null;
    }
  }

  static is(problemDetails: ProblemDetails): boolean {
    return problemDetails.type === "/probs/invalid-parameters";
  }
}

export class PDNotFound {
  static is(problemDetails: ProblemDetails): boolean {
    return (
      problemDetails.type === "about:blank" && problemDetails.status === 404
    );
  }
}

export class PDForbidden {
  static is(problemDetails: ProblemDetails): boolean {
    return (
      problemDetails.type === "about:blank" && problemDetails.status === 403
    );
  }
}
