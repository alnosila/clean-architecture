import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Email } from "../../src/domain/value-objects/Email";
import { assertThrowsNamedError } from "./helpers/domainAssertions";

describe("Email", () => {
  it("normalizes value by trimming and lowercasing", () => {
    const email = new Email("  TEST@Example.COM ");
    assert.equal(email.value, "test@example.com");
  });

  it("throws InvalidEmailError on malformed values", () => {
    assertThrowsNamedError(() => new Email("invalid-email"), "InvalidEmailError");
  });

  it("supports canonical equality", () => {
    const left = new Email("User@Example.com");
    const right = new Email(" user@example.com ");
    assert.equal(left.equals(right), true);
  });
});
