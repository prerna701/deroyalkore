import { randomUUID } from 'crypto';
import { CreateUserInput, UpdateUserInput, User } from '../types/user.types';

/**
 * REPOSITORY LAYER
 * ----------------
 * This is the ONLY place that talks to a data source.
 * Right now it's an in-memory array so the boilerplate runs with zero setup.
 *
 * To use a real database, replace the method bodies below with your
 * ORM/driver calls (e.g. Prisma's `prisma.user.findMany()`, Mongoose's
 * `UserModel.find()`, a raw SQL query, etc). Nothing outside this file
 * needs to change - the service layer only knows about these method
 * signatures, not how the data is actually stored.
 */
class UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      age: input.age,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    Object.assign(user, input);
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const before = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < before;
  }
}

// Exported as a singleton - one shared instance across the whole app.
export const userRepository = new UserRepository();
