import MongoLib from "../lib/mongo";

class Services {
  collection: string;
  mongoDB: MongoLib;

  constructor(collection: string ) {
    this.collection = collection;
    this.mongoDB = new MongoLib();
  }

  async getList({ tags, page, limit }: any) {
    const query = tags && { tags: { $in: tags } }
    const [list, count] = await this.mongoDB.getAll(this.collection, query, page, limit);
    return [list, count] || [];
  }

  async getOne({ objectId }: { objectId: string }) {
    const object = await this.mongoDB.getById(this.collection, objectId);
    return object || {};
  }

  async createOne({ object }: { object: object }) {
    const createObjectId = await this.mongoDB.create(this.collection, object);
    return createObjectId;
  }

  async updateOne({ objectId, object }: { objectId: string, object: object }) {
    const updatedObjectId = await this.mongoDB.update(this.collection, objectId, object);
    const teamData = await this.mongoDB.getById(this.collection, objectId);
    updatedObjectId.unshift(teamData);
    return updatedObjectId;
  }

  async deleteOne({ objectId }: { objectId: string }) {
    const deletedObjectId = await this.mongoDB.delete(this.collection, objectId);
    return deletedObjectId;
  }

  async deleteMany({ objectsIds }: { objectsIds: string[] }) {
    const deletedCount = await this.mongoDB.deleteMany(this.collection, objectsIds);
    return deletedCount;
  }
}

export default Services;