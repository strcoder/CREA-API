import MongoLib from "../lib/mongo";
// import bcrypt from 'bcrypt';

class UserServices {
  collection: string;
  mongoDB: MongoLib;

  constructor(collection: string) {
    this.collection = collection;
    this.mongoDB = new MongoLib();
  }

  async getUsers({ email, nickname }: { email?: string, nickname?: string }) {
    const query = email && nickname  ? { $or: [ { email }, { nickname } ] }
      : email && !nickname ? { email }
      : !email && nickname ? { nickname }
      : {};
    const [users, count] = await this.mongoDB.getAll(this.collection, query);
    return [users, count] || [];
  }

  async getUser({ userId }: { userId: string }) {
    const user = await this.mongoDB.getById(this.collection, userId);
    return user || {};
  }

  async getUserDistinct({ attribute }: { attribute: string }) {
    const list = await this.mongoDB.getDistinct(this.collection, attribute);
    return list || [];
  }

  async createUser({ user }: any) {
    // const { password } = user;
    // const hashedPassword = await bcrypt.hash(password, 10);
    // user.password = hashedPassword;
    const createUserId = await this.mongoDB.create(this.collection, user);
    return createUserId;
  }

  async updateUser({ userId, user }: { userId: string, user: object }) {
    const updatedUserId = await this.mongoDB.update(this.collection, userId, user);
    const userData = await this.mongoDB.getById(this.collection, userId);
    updatedUserId.unshift(userData);
    return updatedUserId;
  }

  async deleteUser({ userId }: { userId: string }) {
    const deletedUserId = await this.mongoDB.delete(this.collection, userId);
    return deletedUserId;
  }
}

export default UserServices;