import type { Database } from './database.ts'
import { Document } from './document.ts'
import { throwError } from './errorManager.ts'
import type { CollectionMeta, DocumentData, DocumentDataAny } from './types.ts'
import { now } from './utils.ts'

export interface AttributeCriteria {
  name: string
  value: unknown
  opt?: 'beginsWith' | 'endsWith' | 'contains'
}

export class Collection {
  private documents: Document[]
  private database: Database
  private _name: string
  private _created: string
  private _updated: string
  private _autoId: number

  constructor(name: string, database: Database) {
    this.database = database
    this._name = name
    this._created = now().toISOString()
    this._updated = now().toISOString()
    this._autoId = 0
    this.documents = []
  }

  public getName(): string {
    return this._name
  }

  public setName(name: string): void {
    this._name = name
  }

  public createDocument(obj: DocumentDataAny = {}): Document {
    const document = new Document({
      ...obj,
      ...(obj._id ? {} : { _id: this._autoId++ }),
    })

    this.documents.push(document)
    this.update()
    return document
  }

  public importDocument(obj: DocumentData): Document {
    const document = new Document(obj)
    this.documents.push(document)
    this.update()
    return document
  }

  public getById(id: number | string): Document {
    const document = this.documents.find((doc) => doc.getProperty('_id') === id)

    if (!document) {
      return throwError(301, id)
    }

    return document
  }

  public getByAttribute(criteria: AttributeCriteria[]): Document[] {
    if (criteria.length === 0) {
      return this.documents
    }

    return this.documents.filter((doc) => {
      return criteria.every((criterion) => {
        if (!doc.hasProperty(criterion.name)) return false
        const value = `${doc.getProperty(criterion.name)}`

        if (!criterion.opt) {
          return value === criterion.value
        }

        if (typeof value === 'string') {
          if (criterion.opt === 'beginsWith') {
            return value.startsWith(`${criterion.value}`)
          }

          if (criterion.opt === 'endsWith') {
            return value.endsWith(`${criterion.value}`)
          }

          if (criterion.opt === 'contains') {
            return value.includes(`${criterion.value}`)
          }
        }
      })
    })
  }

  public removeById(id: number | string): boolean {
    const index = this.documents.findIndex((doc) => doc.getProperty('_id') === id)

    if (index === -1) {
      return false
    }

    this.documents.splice(index, 1)
    this.update()
    return true
  }

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

  private update(time: Date | null = null): void {
    if (time === null) {
      time = now()
    }

    this._updated = time.toISOString()
    this.database.update(time)
  }

  public getCollectionMeta(): CollectionMeta {
    return {
      name: this._name,
      created: this._created,
      updated: this._updated,
      autoId: this._autoId,
    }
  }
}
