import { DomainEvent } from "../events/DomainEvent";
import { Email } from "../value-objects/Email";

export class User {
  private readonly events: DomainEvent[] = [];

  constructor(
    public readonly id: string,
    public email: Email,
    public passwordHash: string
  ) {}

  changeEmail(email: Email): void {
    this.email = email;
  }

  addDomainEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const snapshot = [...this.events];
    this.events.length = 0;
    return snapshot;
  }
}
