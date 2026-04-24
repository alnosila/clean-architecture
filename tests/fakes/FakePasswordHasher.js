"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakePasswordHasher = void 0;
class FakePasswordHasher {
    async hash(plainPassword) {
        return `hashed:${plainPassword}`;
    }
}
exports.FakePasswordHasher = FakePasswordHasher;
