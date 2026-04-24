import { PasswordHasher } from "../../src/application/services/PasswordHasher";

export class FakePasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return `hashed:${plainPassword}`;
  }
}
