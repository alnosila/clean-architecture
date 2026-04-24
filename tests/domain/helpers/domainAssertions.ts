import assert from "node:assert/strict";

export function assertThrowsNamedError(
  candidate: () => void,
  expectedName: string
): void {
  assert.throws(candidate, (error: unknown) => {
    return error instanceof Error && error.name === expectedName;
  });
}
