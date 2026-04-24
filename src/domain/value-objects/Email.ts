import { InvalidEmailError } from "../errors/InvalidEmailError";

export class Email {
  readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized.includes("@")) {
      throw new InvalidEmailError(value);
    }

    this.value = normalized;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
