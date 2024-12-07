import { Collection } from './collection.ts'
import type { DocumentData } from './document.ts'
import { throwError } from './errorManager.ts'
import { DBJson } from './parsers.ts'
import { now } from './utils.ts'

/**
 * @interface DatabaseMeta
 */
export interface DatabaseMeta {
  /** An ISO8601 date string */
  created: string
  /** An ISO8601 date string */
  updated: string
}

/**
 * The Database class is the main class of the library.
 * It is used to create and manage collections but also persisting
 * and restoring the database.
 *
 * @class Database
 */
export class Database {
  /** @ignore */
  private _created: string
  /** @ignore */
  private _updated: string
  /** @ignore */
  private collections: Collection[]

  constructor() {
    this._created = now().toISOString()
    this._updated = now().toISOString()
    this.collections = []
  }

  /**
   * Get a collection by its name. If the collection does not exist, it will be created.
   *
   * @param {string} name
   * @returns {Collection}
   */
  public collection(name: string): Collection {
    return this.hasCollection(name) ? this.getCollection(name) : this.createCollection(name)
  }

  /**
   * Creates a new collection in the database.
   * @param {string} name
   * @returns
   * @throws {Error} 101 - Collection already exists
   */
  public createCollection(name: string): Collection {
    if (this.hasCollection(name)) {
      throwError(101, name)
    }

    const collection = new Collection(name, this)
    this.update()
    this.collections.push(collection)
    return collection
  }

  /**
   * Add a collection to the database.
   * @param {Collection} collection
   * @throws {Error} 101 - Collection already exists
   */
  public addCollection(collection: Collection): void {
    if (this.hasCollection(collection.getName())) {
      throwError(101, collection.getName())
    }

    this.update()
    this.collections.push(collection)
  }

  /**
   * Get a collection existing in the database.
   * @param {string} name
   * @returns {Collection}
   * @throws {Error} 102 - Collection does not exist
   */
  public getCollection(name: string): Collection {
    const collection = this.collections.find((c) => c.getName() === name)

    if (!collection) {
      return throwError(102, name)
    }

    return collection
  }

  /**
   * Check if a collection exists in the database.
   * @param {string} name
   * @returns {boolean}
   */
  public hasCollection(name: string): boolean {
    return this.collections.some((collection) => collection.getName() === name)
  }

  /**
   * Removes a collection from the database.
   * @param {string} name
   * @param {boolean} ignoreIfNotExists
   * @returns {boolean}
   * @throws {Error} 102 - Collection does not exist
   */
  public removeCollection(name: string, ignoreIfNotExists = false): boolean {
    const index = this.collections.findIndex((c) => c.getName() === name)

    if (index === -1) {
      if (ignoreIfNotExists) {
        return false
      }

      throwError(102, name)
    }

    this.update()
    this.collections.splice(index, 1)
    return true
  }

  /**
   * Add or replace a collection in the database.
   * If a collection with the same name already exists, it will be replaced.
   * @param {string} name
   * @param {Collection} collection
   */
  public addOrReplaceCollection(name: string, collection: Collection): void {
    this.removeCollection(name, true)
    this.addCollection(collection)
  }

  /**
   * Get the names of all collections in the database.
   * @returns {string[]}
   */
  public getCollectionNames(): string[] {
    return this.collections.map((collection) => collection.getName())
  }

  /**
   * Update the '_update' property of the database.
   * @param time
   */
  public update(time: Date | null = null): void {
    this._updated = time?.toISOString() || now().toISOString()
  }

  /**
   * Get the meta data of the database.
   * This includes the created and updated dates.
   * @returns {DatabaseMeta}
   */
  public getDBMeta(): DatabaseMeta {
    return { created: this._created, updated: this._updated }
  }

  /**
   * Persist the database to a file.
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  public async persist(filePath: string): Promise<void> {
    const fileData = this.collections.reduce(
      (acc: DBJson, collection: Collection) => {
        acc.push({
          name: collection.getName(),
          data: collection.getByAttribute([]).map((doc) => doc.object() as DocumentData),
        })

        return acc
      },
      [],
    )

    const jsonData = JSON.stringify(fileData, null, 2)

    try {
      const fileInfo = await Deno.stat(filePath)

      if (fileInfo.isDirectory) {
        console.error(`The path "${filePath}" provided is a directory. Please provide a file path.`)
      }

      if (fileInfo.isFile) {
        await Deno.remove(filePath)
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // Do nothing, the file does not exist
      } else {
        console.error((error as Error).message)
      }
    }

    await Deno.writeTextFile(filePath, jsonData)
  }

  /**
   * Restore a database from a file.
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  public async restore(filePath: string): Promise<void> {
    const fileData = await Deno.readTextFile(filePath)
    const jsonData = JSON.parse(fileData)
    const collectionData = DBJson.parse(jsonData)

    collectionData.forEach((entry) => {
      const collection = new Collection(entry.name, this)

      entry.data.forEach((doc) => {
        collection.createDocument(doc)
      })

      this.addCollection(collection)
    })
  }
}
