import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GetUserByIdUseCase } from "../../src/application/use-cases/GetUserByIdUseCase";
import { UserNotFoundError } from "../../src/domain/errors/UserNotFoundError";
import { FakeUserRepository } from "../fakes/FakeUserRepository";

describe("GetUserByIdUseCase", () => {
  it("returns user when id exists", async () => {
    const repository = new FakeUserRepository();
    const user = repository.seed({
      email: "known@example.com",
      passwordHash: "hashed:secret"
    });
    const useCase = new GetUserByIdUseCase(repository);

    const found = await useCase.execute(user.id);

    assert.equal(found.id, user.id);
    assert.equal(found.email.value, "known@example.com");
  });

  it("throws UserNotFoundError when id is absent", async () => {
    const repository = new FakeUserRepository();
    const useCase = new GetUserByIdUseCase(repository);

    await assert.rejects(async () => useCase.execute("missing-id"), UserNotFoundError);
  });
});
