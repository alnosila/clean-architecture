import { DomainEvent } from "./DomainEvent";

export class UserRegistered implements DomainEvent {
  readonly type = "UserRegistered";
  readonly occurredAt: Date;

  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    this.occurredAt = new Date();
  }
}
