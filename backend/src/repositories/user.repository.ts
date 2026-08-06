import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';
import { CreateUserInput, UpdateUserInput, User } from '../types/user.types';

const COLLECTION_NAME = 'users';

class UserRepository {
  async findAll(): Promise<User[]> {
    const collection = await getCollection<User>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).toArray();
  }

  async findById(id: string): Promise<User | null> {
    const collection = await getCollection<User>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    const collection = await getCollection<User>(COLLECTION_NAME);
    return collection.findOne({ email }, { projection: { _id: 0 } }) as Promise<User | null>;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      age: input.age,
      createdAt: new Date().toISOString(),
    };

    const collection = await getCollection<User>(COLLECTION_NAME);
    await collection.insertOne(user as User);
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const collection = await getCollection<User>(COLLECTION_NAME);
    const updatePayload = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<User>;

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updatePayload },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as User | null;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await getCollection<User>(COLLECTION_NAME);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const userRepository = new UserRepository();
