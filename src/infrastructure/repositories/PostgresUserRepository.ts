import { Pool } from "pg";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { Email } from "../../domain/value-objects/Email";

type UserRow = {
  id: string;
  email: string;
  password: string;
};

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async save(user: User): Promise<void> {
    await this.pool.query(
      `
      INSERT INTO users (id, email, password)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET email = EXCLUDED.email, password = EXCLUDED.password
      `,
      [user.id, user.email.value, user.passwordHash]
    );
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, email, password FROM users WHERE id = $1 LIMIT 1",
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(row.id, new Email(row.email), row.password);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, email, password FROM users WHERE email = $1 LIMIT 1",
      [email.value]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(row.id, new Email(row.email), row.password);
  }
}
