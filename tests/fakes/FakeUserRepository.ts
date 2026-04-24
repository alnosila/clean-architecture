import { randomUUID } from "crypto";
import { User } from "../../src/domain/entities/User";
import { UserRepository } from "../../src/domain/repositories/UserRepository";
import { Email } from "../../src/domain/value-objects/Email";

export class FakeUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  seed(input: { email: string; passwordHash: string; id?: string }): User {
    const user = new User(
      input.id ?? randomUUID(),
      new Email(input.email),
      input.passwordHash
    );
    this.users.set(user.id, user);
    return user;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }

    return null;
  }
}
