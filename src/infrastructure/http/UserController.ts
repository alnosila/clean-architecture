import { Router } from "express";
import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { DuplicateEmailError } from "../../domain/errors/DuplicateEmailError";
import { InvalidEmailError } from "../../domain/errors/InvalidEmailError";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError";

export function createUserController(
  createUserUseCase: CreateUserUseCase,
  getUserByIdUseCase: GetUserByIdUseCase
): Router {
  const router = Router();

  router.post("/users", async (req, res) => {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
      }

      const user = await createUserUseCase.execute({ email, password });

      return res.status(201).json({
        id: user.id,
        email: user.email.value
      });
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        return res.status(409).json({ error: error.message });
      }

      if (error instanceof InvalidEmailError) {
        return res.status(400).json({ error: error.message });
      }

      const message = error instanceof Error ? error.message : "Unexpected error";
      return res.status(500).json({ error: message });
    }
  });

  router.get("/users/:id", async (req, res) => {
    try {
      const user = await getUserByIdUseCase.execute(req.params.id);
      return res.status(200).json({ id: user.id, email: user.email.value });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      const message = error instanceof Error ? error.message : "Unexpected error";
      return res.status(500).json({ error: message });
    }
  });

  return router;
}
