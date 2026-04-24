"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const CreateUserUseCase_1 = require("../../src/application/use-cases/CreateUserUseCase");
const FakePasswordHasher_1 = require("../fakes/FakePasswordHasher");
const FakeUserRepository_1 = require("../fakes/FakeUserRepository");
(0, vitest_1.describe)("CreateUserUseCase", () => {
    (0, vitest_1.it)("creates a new user successfully", async () => {
        const repository = new FakeUserRepository_1.FakeUserRepository();
        const passwordHasher = new FakePasswordHasher_1.FakePasswordHasher();
        const useCase = new CreateUserUseCase_1.CreateUserUseCase(repository, passwordHasher);
        const user = await useCase.execute({
            email: "test@example.com",
            password: "secret"
        });
        (0, vitest_1.expect)(user.id).toBeTypeOf("string");
        (0, vitest_1.expect)(user.email).toBe("test@example.com");
        (0, vitest_1.expect)(user.passwordHash).toBe("hashed:secret");
        const storedUser = await repository.findByEmail("test@example.com");
        (0, vitest_1.expect)(storedUser).not.toBeNull();
        (0, vitest_1.expect)(storedUser?.id).toBe(user.id);
    });
    (0, vitest_1.it)("throws an error if email already exists", async () => {
        const repository = new FakeUserRepository_1.FakeUserRepository();
        const passwordHasher = new FakePasswordHasher_1.FakePasswordHasher();
        const useCase = new CreateUserUseCase_1.CreateUserUseCase(repository, passwordHasher);
        await useCase.execute({
            email: "duplicate@example.com",
            password: "first"
        });
        await (0, vitest_1.expect)(useCase.execute({
            email: "duplicate@example.com",
            password: "second"
        })).rejects.toThrow("User with this email already exists");
    });
});
