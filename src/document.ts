import { throwError } from './errorManager.ts'
import { generateUUID } from './utils.ts'

const reservedkeys = ['_id', '_created', '_updated']

/** Any object with any key-value pairs (key must be string) */
// deno-lint-ignore no-explicit-any
export type DocumentDataAny = Record<string, any>

/**
 * An object with metadata properties (`_id`, `_created`, and `_updated`)
 * and any other key-value pairs
 */
export type DocumentData = DocumentDataAny & {
  _id: string | number
  _created: string
  _updated: string
}

/**
 * A Document is a wrapper around a data object that provides
 * a set of methods to interact with the object.
 *
 * @class Document
 */
export class Document {
  /** @ignore */
  private data: DocumentData

  /**
   * Creates a new Document instance.
   * If the object does not have `_id`, `_created`, or `_updated` properties,
   * they will be added to the object as a new UUID, and the current date
   * as an ISO8601 string.
   *
   * @param {DocumentDataAny | DocumentData} obj The object to wrap
   */
  constructor(obj: DocumentDataAny | DocumentData) {
    this.data = {
      ...obj,
      _id: obj._id ?? generateUUID(),
      _created: obj._created ?? new Date().toISOString(),
      _updated: obj._updated ?? new Date().toISOString(),
    }
  }

  /**
   * Checks if the document object has a property with the given key.
   *
   * @param {string} key The key of the property
   * @returns {boolean} true if the property exists, false otherwise
   */
  public hasProperty(key: string): boolean {
    return this.data[key] !== undefined
  }

  /**
   * Gets a property value of the document object with the given key.
   *
   * @param {string} key The key of the property
   * @returns {T} The type of the property value
   * @throws {Error} 202 - Property with key '{key}' not found.
   */
  public getProperty<T>(key: string): T {
    if (this.data[key] !== undefined) {
      return this.data[key] as T
    }

    return throwError(202, key)
  }

  /**
   * Returns the document object.
   *
   * @returns {DocumentData} The document object
   */
  public object(): DocumentData {
    return this.data
  }

  /**
   * Set the value of a property with the given key.
   *
   * @param {string} key The key of the property
   * @param {T} value The value of the property
   */
  public setProperty<T>(key: string, value: T): void {
    if (reservedkeys.indexOf(key) >= 0) {
      throwError(201, key)
    }

    this.data[key] = value
    this.data._updated = new Date().toISOString()
  }
}
