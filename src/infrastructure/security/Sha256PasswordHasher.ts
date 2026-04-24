import { createHash } from "crypto";
import { PasswordHasher } from "../../application/services/PasswordHasher";

export class Sha256PasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return createHash("sha256").update(plainPassword).digest("hex");
  }
}
