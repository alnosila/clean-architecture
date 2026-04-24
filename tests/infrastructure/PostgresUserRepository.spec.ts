import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Email } from "../../src/domain/value-objects/Email";
import { PostgresUserRepository } from "../../src/infrastructure/repositories/PostgresUserRepository";

type FakePool = {
  query: (text: string, values?: unknown[]) => Promise<{ rowCount: number; rows: unknown[] }>;
};

describe("PostgresUserRepository mapping", () => {
  it("maps row email to Email value object on findById", async () => {
    const pool: FakePool = {
      async query() {
        return {
          rowCount: 1,
          rows: [{ id: "u-1", email: "mapped@example.com", password: "hash" }]
        };
      }
    };

    const repository = new PostgresUserRepository(pool as never);
    const user = await repository.findById("u-1");

    assert.notEqual(user, null);
    assert.equal(user?.email instanceof Email, true);
    assert.equal(user?.email.value, "mapped@example.com");
  });

  it("queries findByEmail with normalized email value", async () => {
    let receivedValue: unknown;
    const pool: FakePool = {
      async query(_text, values) {
        receivedValue = values?.[0];
        return { rowCount: 0, rows: [] };
      }
    };

    const repository = new PostgresUserRepository(pool as never);
    await repository.findByEmail(new Email("Case@Test.com"));

    assert.equal(receivedValue, "case@test.com");
  });
});
