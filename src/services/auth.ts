import MongoLib from "../lib/mongo";
import bcrypt from 'bcrypt';

class AuthServices {
  collection: string;
  mongoDB: MongoLib;

  constructor(collection: string = 'auth') {
    this.collection = collection;
    this.mongoDB = new MongoLib();
  }

  async getAllAuth({ email, nickname }: { email?: string, nickname?: string }) {
    const query = email && nickname
      ? { $or: [ { email }, { nickname } ] } : email && !nickname
      ? { email } : !email && nickname
      ? { nickname } : {};
    const [auths, count] = await this.mongoDB.getAll(this.collection, query);
    return [auths, count] || [];
  }

  async getAuth({ email, nickname}: { email?: string, nickname?: string }) {
    const query = email && nickname
      ? { $or: [ { email }, { nickname } ] } : email && !nickname
      ? { email } : !email && nickname
      ? { nickname } : {};
    if (Object.entries(query).length > 0) {
      const auth = await this.mongoDB.getByQuery(this.collection, query);
      return auth;
    }
    return {};
  }

  async getAuthDistinct({ attribute }: { attribute: string }) {
    const list = await this.mongoDB.getDistinct(this.collection, attribute);
    return list || [];
  }

  async createAuth({ auth }: any) {
    const { password } = auth;
    const hashedPassword = await bcrypt.hash(password, 10);
    auth.password = hashedPassword;
    const createAuthId = await this.mongoDB.create(this.collection, auth);
    return createAuthId;
  }

  async updateAuth({ authId, auth }: { authId: string, auth: object }) {
    const updatedAuthId = await this.mongoDB.update(this.collection, authId, auth);
    return updatedAuthId;
  }

  async deleteAuth({ authId }: { authId: string }) {
    const deletedAuthId = await this.mongoDB.delete(this.collection, authId);
    return deletedAuthId;
  }
}

export default AuthServices;