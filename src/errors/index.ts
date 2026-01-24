export enum ExitCode {
  UNEXPECTED = 1,
  CLI = 10,
  PARSE = 30,
  VALIDATION = 31,
  HTTP = 20,
}

export abstract class BaseError extends Error {
  abstract readonly exitCode: ExitCode;
  constructor(message: string) {
      super(message);
  }
}

export class CliError extends BaseError {
  readonly exitCode = ExitCode.CLI;
}

export class CsvParseError extends BaseError {
  readonly exitCode = ExitCode.PARSE;
}

export class ValidationError extends BaseError {
  readonly exitCode = ExitCode.VALIDATION;
}

export class HttpError extends BaseError {
  readonly exitCode = ExitCode.HTTP;

  constructor(
      message: string,
      public readonly status?: number
  ) {
    super(message);
  }
}

export function isKnownError(err: unknown): err is BaseError {
  return err instanceof BaseError;
}

