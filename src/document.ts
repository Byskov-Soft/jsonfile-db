import { throwError } from './errorManager.ts'
import type { JSONObject, JSONValue } from './json.ts'
import type { DocumentData, DocumentDataAny } from './types.ts'
import { generateUUID } from './utils.ts'

const reservedkeys = ['_id', '_created', '_updated']

export class Document {
  private data: DocumentData

  constructor(obj: DocumentData | DocumentDataAny) {
    this.data = {
      ...obj,
      _id: obj._id ?? generateUUID(),
      _created: obj._created || new Date().toISOString(),
      _updated: obj._updated || new Date().toISOString(),
    }
  }

  public hasProperty(key: string): boolean {
    return this.data[key] !== undefined
  }

  public getProperty<T extends JSONValue>(key: string): T {
    if (this.data[key] !== undefined) {
      return this.data[key] as T
    }

    return throwError(202, key)
  }

  public object(): JSONObject {
    return this.data
  }

  public setProperty(key: string, value: JSONValue): void {
    if (reservedkeys.indexOf(key) >= 0) {
      throwError(201, key)
    }

    this.data[key] = value
    this.data._updated = new Date().toISOString()
  }
}
