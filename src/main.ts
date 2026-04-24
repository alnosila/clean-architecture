import express from "express";
import { InMemoryDomainEventDispatcher } from "./application/services/DomainEventDispatcher";
import { CreateUserUseCase } from "./application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "./application/use-cases/GetUserByIdUseCase";
import { createPostgresPool } from "./infrastructure/db/PostgresClient";
import { createUserController } from "./infrastructure/http/UserController";
import { PostgresUserRepository } from "./infrastructure/repositories/PostgresUserRepository";
import { Sha256PasswordHasher } from "./infrastructure/security/Sha256PasswordHasher";

const app = express();
app.use(express.json());

const pool = createPostgresPool();
const userRepository = new PostgresUserRepository(pool);
const passwordHasher = new Sha256PasswordHasher();
const domainEventDispatcher = new InMemoryDomainEventDispatcher();

const createUserUseCase = new CreateUserUseCase(
  userRepository,
  passwordHasher,
  domainEventDispatcher
);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

app.use(createUserController(createUserUseCase, getUserByIdUseCase));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});
