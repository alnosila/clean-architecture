import { DomainEvent } from "../../domain/events/DomainEvent";

export interface DomainEventDispatcher {
  dispatch(events: DomainEvent[]): Promise<void>;
}

export class InMemoryDomainEventDispatcher implements DomainEventDispatcher {
  async dispatch(_events: DomainEvent[]): Promise<void> {
    // Synchronous no-op for this phase.
  }
}
