import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DomainEventDispatcher } from "../../src/application/services/DomainEventDispatcher";
import { CreateUserUseCase } from "../../src/application/use-cases/CreateUserUseCase";
import { DuplicateEmailError } from "../../src/domain/errors/DuplicateEmailError";
import { FakePasswordHasher } from "../fakes/FakePasswordHasher";
import { FakeUserRepository } from "../fakes/FakeUserRepository";

class SpyDomainEventDispatcher implements DomainEventDispatcher {
  readonly dispatched: string[] = [];

  async dispatch(events: { type: string }[]): Promise<void> {
    for (const event of events) {
      this.dispatched.push(event.type);
    }
  }
}

describe("CreateUserUseCase", () => {
  it("creates a new user successfully", async () => {
    const repository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const eventDispatcher = new SpyDomainEventDispatcher();
    const useCase = new CreateUserUseCase(
      repository,
      passwordHasher,
      eventDispatcher
    );

    const user = await useCase.execute({
      email: "test@example.com",
      password: "secret"
    });

    assert.equal(typeof user.id, "string");
    assert.equal(user.email.value, "test@example.com");
    assert.equal(user.passwordHash, "hashed:secret");
    assert.deepEqual(eventDispatcher.dispatched, ["UserRegistered"]);

    const storedUser = await repository.findByEmail(user.email);
    assert.notEqual(storedUser, null);
    assert.equal(storedUser?.id, user.id);
  });

  it("throws DuplicateEmailError if email already exists", async () => {
    const repository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const eventDispatcher = new SpyDomainEventDispatcher();
    const useCase = new CreateUserUseCase(
      repository,
      passwordHasher,
      eventDispatcher
    );

    await useCase.execute({
      email: "duplicate@example.com",
      password: "first"
    });

    await assert.rejects(
      async () =>
        useCase.execute({
          email: "duplicate@example.com",
          password: "second"
        }),
      DuplicateEmailError
    );
  });
});
