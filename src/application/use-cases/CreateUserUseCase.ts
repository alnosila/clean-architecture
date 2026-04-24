import { randomUUID } from "crypto";
import { User } from "../../domain/entities/User";
import { DuplicateEmailError } from "../../domain/errors/DuplicateEmailError";
import { UserRegistered } from "../../domain/events/UserRegistered";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { Email } from "../../domain/value-objects/Email";
import { DomainEventDispatcher } from "../services/DomainEventDispatcher";
import { PasswordHasher } from "../services/PasswordHasher";

export type CreateUserInput = {
  email: string;
  password: string;
};

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly eventDispatcher: DomainEventDispatcher
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = new Email(input.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new DuplicateEmailError(email.value);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = new User(randomUUID(), email, passwordHash);
    user.addDomainEvent(new UserRegistered(user.id, email.value));

    await this.userRepository.save(user);
    await this.eventDispatcher.dispatch(user.pullDomainEvents());
    return user;
  }
}
