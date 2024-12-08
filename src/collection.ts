import { Document, type DocumentData, type DocumentDataAny } from './document.ts'
import { throwError } from './errorManager.ts'

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
 *
 * @class Collection
 */
export class Collection {
  /** @ignore */
  private _documents: Document[]
  /** @ignore */
  private _name: string
  /** @ignore */
  private _autoId: number

  /**
   * @param {string} name The name of the collection.
   */
  constructor(name: string) {
    this._name = name
    this._autoId = 0
    this._documents = []
  }

  /**
   * Get the name of the collection.
   *
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
   *
   * @param {string} name - The new name of the collection.
   */
  public setName(name: string): void {
    this._name = name
  }

  /**
   * Create a new document from the provided object.
   *
   * If the `_id`, `_created`, or `_updated` properties are not provided, they will be auto-generated.
   * `_id` will be assigned from an auto-incremented integer.
   *
   * @param {DocumentDataAny} obj A record of type `record<string, any>`
   * @returns {Document} The newly created document containing the provided object.
   */
  public createDocument(obj: DocumentDataAny = {}): Document {
    const document = new Document({
      ...obj,
      ...(obj._id ? {} : { _id: this._autoId++ }),
    })

    this._documents.push(document)
    return document
  }

  /**
   * Create a document by importing an object.
   *
   * If the `_id`, `_created`, or `_updated` properties are not provided, they will be auto-generated.
   * `_id` will be assigned a random UUID.
   *
   * @param {DocumentData | DocumentDataAny} obj A record of type `record<string, any>`
   *   (optionally having `_id`, `_created`, and `_updated` properties).
   * @returns {Document} The imported document containing the provided object.
   */
  public importObject(obj: DocumentData | DocumentDataAny): Document {
    const document = new Document(obj)
    this._documents.push(document)
    return document
  }

  /**
   * Add a document to the collection.
   *
   * @param {Document} document The document to add.
   */
  public addDocument(document: Document): void {
    this._documents.push(document)
  }

  /**
   * Get a document by its `_id` attribute.
   *
   * @param {number | string} id The `_id` attribute of the document to get
   * @returns {Document} The document with the provided `_id`.
   * @throws {Error} 301 - If the document is not found.
   */
  public getById(id: number | string): Document {
    const document = this._documents.find((doc) => doc.getProperty('_id') === id)

    if (!document) {
      return throwError(301, id)
    }

    return document
  }

  /**
   * Get all documents in the collection matching the provided criteria.
   * Using an empty array (`[]`) will return all documents.
   * See [AttributeCriteria](./AttributeCriteria.html) for more information.
   *
   * @param {AttributeCriteria[]} criteria The criteria to match.
   * @returns {Document[]} An array of documents matching the criteria.
   */
  public getByAttribute(criteria: AttributeCriteria[]): Document[] {
    if (criteria.length === 0) {
      return this._documents
    }

    return this._documents.filter((doc) => {
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
   *
   * @param {number | string} id The `_id` attribute of the document to remove.
   * @returns {boolean} `true` if the document was removed, `false` if not found.
   */
  public removeById(id: number | string): boolean {
    const index = this._documents.findIndex((doc) => doc.getProperty('_id') === id)

    if (index === -1) {
      return false
    }

    this._documents.splice(index, 1)
    return true
  }

  /**
   * Removes all documents from the collection matching the provided criteria.
   * Note that the optional criteria options (`beginsWith`, `endsWith`, and `contains`)
   * are not supported. This means that only exact matches are removed.
   * Also, providing an empty array (`[]`) will not remove any documents.
   *
   * @param {AttributeCriteria[]} criteria The criteria to match.
   * @returns {boolean} `true` if any documents were removed, `false` if none were found.
   */

  public removeByAttribute(criteria: AttributeCriteria[]): boolean {
    const initialLength = this._documents.length

    if (criteria.length === 0) {
      return false
    }

    this._documents = this._documents.filter((doc) => {
      return !criteria.every((criterion) =>
        doc.hasProperty(criterion.name) &&
        doc.getProperty(criterion.name) === criterion.value
      )
    })

    if (this._documents.length === initialLength) {
      return false
    }

    return true
  }
}
