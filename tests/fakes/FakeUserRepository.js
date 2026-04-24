"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeUserRepository = void 0;
class FakeUserRepository {
    users = new Map();
    async save(user) {
        this.users.set(user.id, user);
    }
    async findById(id) {
        return this.users.get(id) ?? null;
    }
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }
}
exports.FakeUserRepository = FakeUserRepository;
