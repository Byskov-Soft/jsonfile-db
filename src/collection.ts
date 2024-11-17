import { Database } from "./database.ts";
import { Document } from "./document.ts";
import { throwError } from "./errorManager.ts";
import { JSONObject } from "./json.ts";
import { now } from "./utils.ts";

interface CollectionMeta {
  name: string;
  _created: string;
  _updated: string;
  _autoId: number;
}

export interface AttributeCriteria {
  name: string;
  value: string;
}

export class Collection {
  private meta: CollectionMeta;
  private documents: Document[];
  private database: Database;

  constructor(name: string, database: Database) {
    this.database = database;
    this.meta = {
      name,
      _created: now().toISOString(),
      _updated: now().toISOString(),
      _autoId: 0,
    };
    this.documents = [];
  }

  public getName(): string {
    return this.meta.name;
  }

  public setName(name: string): void {
    this.meta.name = name;
  }

  public createDocument(obj: JSONObject = {}, isImport = false): Document {
    obj["_id"] = obj._id || this.meta._autoId++;
    const document = new Document(obj, isImport);
    this.update();
    this.documents.push(document);
    return document;
  }

  public getById(id: number | string): Document {
    const document = this.documents.find((doc) =>
      doc.getProperty("_id") === id
    );

    if (!document) {
      throwError(301, id);
    }

    return document;
  }

  public getByAttribute(criteria: AttributeCriteria[]): Document[] {
    if (criteria.length === 0) {
      return this.documents;
    }

    return this.documents.filter((doc) => {
      return criteria.every((criterion) =>
        doc.hasProperty(criterion.name) &&
        doc.getProperty(criterion.name) === criterion.value
      );
    });
  }

  public removeById(id: number | string): boolean {
    const index = this.documents.findIndex((doc) =>
      doc.getProperty("_id") === id
    );

    if (index === -1) {
      return false;
    }

    this.documents.splice(index, 1);
    this.update();
    return true;
  }

  public removeByAttribute(criteria: AttributeCriteria[]): boolean {
    const initialLength = this.documents.length;

    if (criteria.length === 0) {
      return false;
    }

    this.documents = this.documents.filter((doc) => {
      return !criteria.every((criterion) =>
        doc.hasProperty(criterion.name) &&
        doc.getProperty(criterion.name) === criterion.value
      );
    });

    if (this.documents.length === initialLength) {
      return false;
    }

    this.update();
    return true;
  }

  private update(time: Date | null = null): void {
    if (time === null) {
      time = now();
    }

    this.meta._updated = time.toISOString();
    this.database.update(time);
  }

  public getUpdateTime(): string {
    return this.meta._updated;
  }
}
