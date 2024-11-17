import { Collection } from "./collection.ts";
import { throwError } from "./errorManager.ts";
import { JSONArray, JSONObject } from "./json.ts";
import { now } from "./utils.ts";

interface DatabaseMeta {
  _created: string;
  _updated: string;
}

export class Database {
  private meta: DatabaseMeta;
  private collections: Collection[];

  constructor() {
    this.meta = {
      _created: now().toISOString(),
      _updated: now().toISOString(),
    };

    this.collections = [];
  }

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
      throwError(104, name);
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

  public update(time: Date | null = null): void {
    this.meta._updated = time?.toISOString() || now().toISOString();
  }

  public getUpdateTime(): string {
    return this.meta._updated;
  }

  public async saveToFile(filePath: string): Promise<void> {
    const data = this.collections.map((collection) => ({
      name: collection.getName(),
      data: collection.getByAttribute([]).map((doc) => doc.object()),
    }));

    const jsonData = JSON.stringify(data, null, 2);
    await Deno.writeTextFile(filePath, jsonData);
  }

  public async loadFromFile(filePath: string): Promise<void> {
    const jsonData = await Deno.readTextFile(filePath);
    const data = JSON.parse(jsonData);

    (data as JSONArray).forEach((entry) => {
      const raw = entry as { name: string; data: JSONArray };
      const collection = new Collection(raw.name, this);

      raw.data.forEach((doc) => {
        collection.createDocument(doc as JSONObject, true);
      });

      this.addCollection(collection);
    });
  }
}
