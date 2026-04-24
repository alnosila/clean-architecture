import assert from "node:assert/strict";
import { describe, it } from "node:test";
import express from "express";
import request from "supertest";
import { InMemoryDomainEventDispatcher } from "../../src/application/services/DomainEventDispatcher";
import { CreateUserUseCase } from "../../src/application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../src/application/use-cases/GetUserByIdUseCase";
import { createUserController } from "../../src/infrastructure/http/UserController";
import { FakePasswordHasher } from "../fakes/FakePasswordHasher";
import { FakeUserRepository } from "../fakes/FakeUserRepository";

function buildApp() {
  const repository = new FakeUserRepository();
  const createUserUseCase = new CreateUserUseCase(
    repository,
    new FakePasswordHasher(),
    new InMemoryDomainEventDispatcher()
  );
  const getUserByIdUseCase = new GetUserByIdUseCase(repository);

  const app = express();
  app.use(express.json());
  app.use(createUserController(createUserUseCase, getUserByIdUseCase));
  return app;
}

describe("UserController HTTP contract", () => {
  it("keeps POST /users response shape and status", async () => {
    const app = buildApp();
    const response = await request(app)
      .post("/users")
      .send({ email: "john@example.com", password: "secret" });

    assert.equal(response.status, 201);
    assert.equal(typeof response.body.id, "string");
    assert.equal(response.body.email, "john@example.com");
    assert.equal("passwordHash" in response.body, false);
  });

  it("maps duplicate email to 409", async () => {
    const app = buildApp();
    await request(app)
      .post("/users")
      .send({ email: "dupe@example.com", password: "first" });

    const response = await request(app)
      .post("/users")
      .send({ email: "dupe@example.com", password: "second" });

    assert.equal(response.status, 409);
  });

  it("maps missing user to 404 on GET /users/:id", async () => {
    const app = buildApp();
    const response = await request(app).get("/users/unknown-id");
    assert.equal(response.status, 404);
  });
});
