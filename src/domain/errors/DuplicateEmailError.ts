export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`User with this email already exists: ${email}`);
    this.name = "DuplicateEmailError";
  }
}
