import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { User } from "../../src/domain/entities/User";
import { UserRegistered } from "../../src/domain/events/UserRegistered";
import { Email } from "../../src/domain/value-objects/Email";

describe("User aggregate", () => {
  it("changes email using value object", () => {
    const user = new User("u-1", new Email("start@example.com"), "hash");

    user.changeEmail(new Email("next@example.com"));

    assert.equal(user.email.value, "next@example.com");
  });

  it("collects and clears domain events", () => {
    const user = new User("u-1", new Email("start@example.com"), "hash");
    user.addDomainEvent(new UserRegistered(user.id, user.email.value));

    const events = user.pullDomainEvents();
    const eventsAfterPull = user.pullDomainEvents();

    assert.equal(events.length, 1);
    assert.equal(events[0]?.type, "UserRegistered");
    assert.equal(eventsAfterPull.length, 0);
  });
});
