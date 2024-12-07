import type { Database } from './database.ts'
import { Document, type DocumentData, type DocumentDataAny } from './document.ts'
import { throwError } from './errorManager.ts'
import { now } from './utils.ts'

/**
 * Collection meta data
 *
 * ### Example:
 *
 *   ```
 *   {
 *     name: 'users',
 *     created: '2024-12-01T14:23:08.000Z',
 *     updated: '2021-12-01T19:11:46.000Z',
 *     autoId: 12
 *   }
 *   ```
 * @interface CollectionMeta
 */
export interface CollectionMeta {
  /** Collection name */
  name: string
  /** ISO8601 date string */
  created: string
  /** ISO8601 date string */
  updated: string
  /** The current value of the auto-increment ID */
  autoId: number
}

/**
 * Criteria used when querying a collection by attribute(s).
 *
 * ### Example:
 *
 *   ```
 *   collection.getByAttribute([
 *     {
 *       name: 'firstName',
 *       value: 'John'
 *     },
 *     {
 *       name: 'phone',
 *       value: '+385',
 *       opt: 'beginsWith'
 *     }
 *   ])
 *   ```
 *  **Note:** Options `beginsWith`, `endsWith`, and `contains` only work with string values.
 *
 * @interface AttributeCriteria
 */
export interface AttributeCriteria {
  /** The name of the attribute being queried. */
  name: string
  /** The value to match. */
  value: unknown
  /** An optional query options applied to the value. */
  opt?: 'beginsWith' | 'endsWith' | 'contains'
}

/**
 * The Collection class is used for managing documents.
 * @class Collection
 */
export class Collection {
  /** @ignore */
  private documents: Document[]
  /** @ignore */
  private database: Database | undefined
  /** @ignore */
  private _name: string
  /** @ignore */
  private _created: string
  /** @ignore */
  private _updated: string
  /** @ignore */
  private _autoId: number

  /**
   * Note: You only need to provide the optional `database` argument, if you want to
   * update the `_updated` attribute of the database holding the collection, when a document
   * is added or removed.
   * @param {string} name The name of the collection.
   * @param {Database} database The database that holds or will hold the collection.
   */
  constructor(name: string, database?: Database) {
    this._name = name
    this.database = database
    this._created = now().toISOString()
    this._updated = now().toISOString()
    this._autoId = 0
    this.documents = []
  }

  /**
   * Get the name of the collection.
   * @returns {string} The name of the collection.
   */
  public getName(): string {
    return this._name
  }

  /**
   * Set the name of the collection.
   * Be aware that a database has a list of collections by name.
   * If you change the name after it has been associated with a database,
   * the database will not be able to find the collection by its new name.
   * @param {string} name - The new name of the collection.
   */
  public setName(name: string): void {
    this._name = name
  }

  /**
   * Create a new document from the provided object.
   *
   * If the `_id`, `_created`, or `_updated` properties are not provided, they will be auto-generated
   * `_id` will be assigned from an auto-incremented integer.
   * @param {DocumentDataAny} obj A record of type `record<string, any>`
   * @returns {Document} The newly created document containing the provided object.
   */
  public createDocument(obj: DocumentDataAny = {}): Document {
    const document = new Document({
      ...obj,
      ...(obj._id ? {} : { _id: this._autoId++ }),
    })

    this.documents.push(document)
    this.update()
    return document
  }

  /**
   * Create a document by importing an object.
   *
   * If the `_id`, `_created`, or `_updated` properties are not provided, they will be auto-generated.,
   * `_id` will be a random UUID.
   * @param {DocumentData | DocumentDataAny} obj A record of type `record<string, any>` (optionally having `_id`, `_created`, and `_updated` properties).
   * @returns {Document} The imported document containing the provided object.
   */
  public importObject(obj: DocumentData | DocumentDataAny): Document {
    const document = new Document(obj)
    this.documents.push(document)
    this.update()
    return document
  }

  /**
   * Add a document to the collection.
   * @param {Document} document The document to add.
   */
  public addDocument(document: Document): void {
    this.documents.push(document)
    this.update()
  }

  /**
   * Get a document by its `_id` attribute.
   * @param {number | string} id The `_id` attribute of the document to get
   * @returns {Document} The document with the provided `_id`.
   * @throws {Error} 301 - If the document is not found.
   */
  public getById(id: number | string): Document {
    const document = this.documents.find((doc) => doc.getProperty('_id') === id)

    if (!document) {
      return throwError(301, id)
    }

    return document
  }

  /**
   * Get all documents in the collection matching the provided criteria.
   * Using an empty array (`[]`) will return all documents.
   * See [AttributeCriteria](./AttributeCriteria.html) for more information.
   * @param {AttributeCriteria[]} criteria The criteria to match.
   * @returns {Document[]} An array of documents matching the criteria.
   */
  public getByAttribute(criteria: AttributeCriteria[]): Document[] {
    if (criteria.length === 0) {
      return this.documents
    }

    return this.documents.filter((doc) => {
      return criteria.every((criterion) => {
        if (!doc.hasProperty(criterion.name)) return false
        const value = `${doc.getProperty(criterion.name)}`
        const criterionValue = `${criterion.value}`

        if (!criterion.opt) {
          return value === criterionValue
        }

        if (typeof value === 'string') {
          if (criterion.opt === 'beginsWith') {
            return value.startsWith(criterionValue)
          }

          if (criterion.opt === 'endsWith') {
            return value.endsWith(criterionValue)
          }

          if (criterion.opt === 'contains') {
            return value.includes(criterionValue)
          }
        }
      })
    })
  }

  /**
   * Removes a document from the collection by its `_id` attribute.
   * Returns `true` if the document was removed, `false` if not found.
   * @param {number | string} id The `_id` attribute of the document to remove.
   * @returns {boolean} `true` if the document was removed, `false` if not found.
   */
  public removeById(id: number | string): boolean {
    const index = this.documents.findIndex((doc) => doc.getProperty('_id') === id)

    if (index === -1) {
      return false
    }

    this.documents.splice(index, 1)
    this.update()
    return true
  }

  /**
   * Removes all documents from the collection matching the provided criteria.
   * Note that the optional criteria options (`beginsWith`, `endsWith`, and `contains`)
   * are not supported. This means that only exact matches are removed.
   * Also, providing an empty array (`[]`) will not remove any documents.
   * @param {AttributeCriteria[]} criteria The criteria to match.
   * @returns {boolean} `true` if any documents were removed, `false` if none were found.
   */

  public removeByAttribute(criteria: AttributeCriteria[]): boolean {
    const initialLength = this.documents.length

    if (criteria.length === 0) {
      return false
    }

    this.documents = this.documents.filter((doc) => {
      return !criteria.every((criterion) =>
        doc.hasProperty(criterion.name) &&
        doc.getProperty(criterion.name) === criterion.value
      )
    })

    if (this.documents.length === initialLength) {
      return false
    }

    this.update()
    return true
  }

  /** @ignore */
  private update(time: Date | null = null): void {
    if (time === null) {
      time = now()
    }

    this._updated = time.toISOString()

    if (this.database) {
      this.database.update(time)
    }
  }

  /**
   * Returns the collection metadata.
   * @returns {CollectionMeta} The collection metadata.
   */
  public getCollectionMeta(): CollectionMeta {
    return {
      name: this._name,
      created: this._created,
      updated: this._updated,
      autoId: this._autoId,
    }
  }
}
