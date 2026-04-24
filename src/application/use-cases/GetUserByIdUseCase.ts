import { User } from "../../domain/entities/User";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
