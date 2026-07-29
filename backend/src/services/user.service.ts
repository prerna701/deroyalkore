import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { CreateUserInput, UpdateUserInput, User } from '../types/user.types';
import { PaginatedResult } from '../types/common.types';
import { buildPaginationMeta } from '../utils/pagination';

/**
 * SERVICE LAYER
 * -------------
 * This is where BUSINESS LOGIC lives: rules, checks, orchestration
 * between one or more repositories, calling other services, etc.
 *
 * Services never touch `req`/`res` - that keeps them reusable
 * (e.g. from a cron job, a queue worker, or another service) and easy
 * to unit test in isolation.
 *
 * Controllers call services. Services call repositories.
 */
class UserService {
  async getAllUsers(page: number, limit: number): Promise<PaginatedResult<User>> {
    const all = await userRepository.findAll();
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);

    return {
      items,
      meta: buildPaginationMeta(all.length, page, limit),
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(`User with id '${id}' not found`);
    }
    return user;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw ApiError.conflict(`A user with email '${input.email}' already exists`);
    }
    return userRepository.create(input);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    // Make sure it exists first, so we return a clean 404 instead of a silent no-op.
    await this.getUserById(id);

    if (input.email) {
      const existing = await userRepository.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw ApiError.conflict(`A user with email '${input.email}' already exists`);
      }
    }

    const updated = await userRepository.update(id, input);
    // updated can't actually be null here since we checked existence above,
    // but TypeScript can't know that, so we guard for safety.
    if (!updated) {
      throw ApiError.internal('Failed to update user');
    }
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw ApiError.notFound(`User with id '${id}' not found`);
    }
  }
}

export const userService = new UserService();
