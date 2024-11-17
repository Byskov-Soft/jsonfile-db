import { Collection } from "./collection.ts";
import { throwError } from "./errorManager.ts";
import { DatabaseMeta, DBJson, DocumentData } from "./types.ts";
import { now } from "./utils.ts";

export class Database {
  private _created: string;
  private _updated: string;
  private collections: Collection[];

  constructor() {
    this._created = now().toISOString();
    this._updated = now().toISOString();
    this.collections = [];
  }

  // COLLECTIONS
  public collection(name: string): Collection {
    return this.hasCollection(name)
      ? this.getCollection(name)
      : this.createCollection(name);
  }

  public createCollection(name: string): Collection {
    if (this.hasCollection(name)) {
      throwError(101, name);
    }

    const collection = new Collection(name, this);
    this.update();
    this.collections.push(collection);
    return collection;
  }

  public addCollection(collection: Collection): void {
    if (this.hasCollection(collection.getName())) {
      throwError(101, collection.getName());
    }

    this.update();
    this.collections.push(collection);
  }

  public getCollection(name: string): Collection {
    const collection = this.collections.find((c) => c.getName() === name);

    if (!collection) {
      return throwError(103, name);
    }

    return collection;
  }

  public hasCollection(name: string): boolean {
    return this.collections.some((collection) => collection.getName() === name);
  }

  public removeCollection(name: string): boolean {
    const index = this.collections.findIndex((c) => c.getName() === name);

    if (index === -1) {
      throwError(102, name);
    }

    this.update();
    this.collections.splice(index, 1);
    return true;
  }

  public getCollectionNames(): string[] {
    return this.collections.map((collection) => collection.getName());
  }

  // META
  public update(time: Date | null = null): void {
    this._updated = time?.toISOString() || now().toISOString();
  }

  public getDBMeta(): DatabaseMeta {
    return { created: this._created, updated: this._updated };
  }

  // PERSISTENCE
  public async persist(filePath: string): Promise<void> {
    const fileData = this.collections.reduce(
      (acc: DBJson, collection: Collection) => {
        acc.push({
          name: collection.getName(),
          data: collection.getByAttribute([]).map((doc) =>
            doc.object() as DocumentData
          ),
        });

        return acc;
      },
      [],
    );

    const jsonData = JSON.stringify(fileData, null, 2);
    await Deno.writeTextFile(filePath, jsonData);
  }

  public async restore(filePath: string): Promise<void> {
    const fileData = await Deno.readTextFile(filePath);
    const jsonData = JSON.parse(fileData);
    const collectionData = DBJson.parse(jsonData);

    collectionData.forEach((entry) => {
      const collection = new Collection(entry.name, this);

      entry.data.forEach((doc) => {
        collection.createDocument(doc);
      });

      this.addCollection(collection);
    });
  }
}
