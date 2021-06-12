import { MongoClient, ObjectId } from 'mongodb';
import { config } from '../config';

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  client: MongoClient;
  dbName: string;
  static connection: any;
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((error) => {
          if (error) {
            reject(error);
            return;
          }

          console.log('Connected successfuly to mongo');

          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection: string, query?: any, sort?: object, page?: number, limit?: number) {
    return this.connect().then(async (db: any) => {
      const count = await db.collection(collection).find(query).count();
      if (page && limit) {
        const items = await db.collection(collection).find(query).sort(sort).skip((page - 1) * limit).limit(limit).toArray() || [];
        return [items, count];
      } else {
        const items = await db.collection(collection).find(query).sort(sort).toArray() || [];
        return [items, count];
      }
    });
  }

  getById(collection: string, id: string) {
    return this.connect().then((db: any) => {
      return db.collection(collection).findOne({ _id: new ObjectId(id) });
    });
  }

  getByQuery(collection: string, query: object) {
    return this.connect().then((db: any) => {
      return db.collection(collection).findOne(query);
    });
  }

  getDistinct(collection: string, attribute: string) {
    return this.connect().then((db: any) => {
      return db.collection(collection).distinct(attribute);
    });
  }

  create(collection: string, data: object) {
    return this.connect()
      .then((db: any) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result: any) => result.insertedId);
  }

  update(collection: string, id: string, data: object) {
    return this.connect().then((db: any) => {
      return db
      .collection(collection)
      .updateOne({ _id: new ObjectId(id) }, { $set: data }, { upsert: false });
    }).then(({ matchedCount, modifiedCount }: any) => [id, matchedCount, modifiedCount]);
  }

  updateSetObjectList(collection: string, id: string, query: object) {
    return this.connect().then((db: any) => {
      return db
        .collection(collection)
        .updateOne({ _id: new ObjectId(id) }, { $addToSet: query });
    }).then(({ matchedCount, modifiedCount }: any) => [id, matchedCount, modifiedCount]);
  }

  updateObjectList(collection: string, idQuery: object, query: object) {
    return this.connect().then((db: any) => {
      return db
        .collection(collection)
        .updateOne(idQuery, { $set: query });
    }).then(({ matchedCount, modifiedCount }: any) => [matchedCount, modifiedCount]);
  }

  updateMany(collection: string, query: object, data: object) {
    return this.connect()
      .then((db: any) => {
        return db
          .collection(collection)
          .updateMany(query, { $set: data });
      })
      .then(({ matchedCount, modifiedCount }: any) => [matchedCount, modifiedCount]);
  }

  deleteItem(collection: string, id: string, query: object) {
    return this.connect()
      .then((db: any) => {
        return db
          .collection(collection)
          .updateOne({ _id: new ObjectId(id) }, { $pull: query });
      })
      .then((result: any) => result.upsertedId);
  }

  deleteManyItems(collection: string, id: string, query: object) {
    return this.connect()
      .then((db: any) => {
        return db
          .collection(collection)
          .updateOne({ _id: new ObjectId(id) }, { $pull: query });
      })
      .then((result: any) => result.upsertedId);
  }

  delete(collection: string, id: string) {
    return this.connect()
      .then((db: any) => {
        return db.collection(collection).deleteOne({ _id: new ObjectId(id) });
      })
      .then(({ deletedCount }: any) => [id, deletedCount]);
  }

  deleteMany(collection: string, ids: string[]) {
    const objectIds = ids.map((id) => new ObjectId(id));
    return this.connect()
      .then((db: any) => {
        return db.collection(collection).deleteMany({ _id: { $in: objectIds } });
      })
      .then(({ deletedCount }: any) => deletedCount);
  }
}

export default MongoLib;


