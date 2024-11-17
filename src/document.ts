import { throwError } from "./errorManager.ts";
import { JSONObject, JSONValue } from "./json.ts";
import { generateUUID } from "./utils.ts";

enum KEY_TYPE {
  RESERVED = "RESERVED",
  IMMUTABLE = "IMMUTABLE",
}

const properties = {
  // _rev and _key are currently not used
  reserved: ["_rev", "_key", "_created", "_updated"],
  immutable: ["_id"],
};

const validateKey = (key: string, type: KEY_TYPE): void => {
  if (type === KEY_TYPE.RESERVED) {
    if (properties.reserved.indexOf(key) >= 0) {
      throwError(201, key);
    }
  } else if (properties.immutable.indexOf(key) >= 0) {
    throwError(203, key);
  }
};

export class Document {
  private data: JSONObject = {};

  constructor(obj: JSONObject, isImport = false) {
    if (obj["_id"] === undefined) {
      obj["_id"] = generateUUID();
    }

    for (const key in obj) {
      const value = obj[key];
      if (!isImport) validateKey(key, KEY_TYPE.RESERVED);
      this.data[key] = value;
    }

    this.data["_created"] = new Date().toISOString();
    this.data["_updated"] = new Date().toISOString();
  }

  public hasProperty(key: string): boolean {
    return this.data[key] !== undefined;
  }

  public getProperty<T extends JSONValue>(key: string): T {
    if (this.data[key] !== undefined) {
      return this.data[key] as T;
    }

    throwError(204, key);
  }

  public object(): JSONObject {
    return this.data;
  }

  public setProperty(key: string, value: JSONValue): void {
    validateKey(key, KEY_TYPE.RESERVED);
    validateKey(key, KEY_TYPE.IMMUTABLE);
    this.data[key] = value;
    this.data["_updated"] = new Date().toISOString();
  }
}
