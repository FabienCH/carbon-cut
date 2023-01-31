export class ValidationError extends Error {
  constructor(readonly errors: string[]) {
    super();
  }
}
