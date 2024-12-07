import { assert, assertEquals } from '@std/assert'
import { Collection } from '../../src/collection.ts'
import { Database } from '../../src/database.ts'
import { Document } from '../../src/document.ts'

// CONSTRUCTOR;
Deno.test('Collection - getName returns collection name', () => {
  const db = new Database()
  const collection = new Collection('test', db)
  assertEquals(collection.getName(), 'test')
})

Deno.test('Collection - setName updates collection name', () => {
  const db = new Database()
  const collection = new Collection('test', db)
  collection.setName('newName')
  assertEquals(collection.getName(), 'newName')
})

// CREATE DOCUMENT
Deno.test('Collection - createDocument with empty object', () => {
  const db = new Database()
  const collection = new Collection('test', db)
  const doc = collection.createDocument()

  assert(doc.hasProperty('_id'))
  assert(doc.hasProperty('_created'))
  assert(doc.hasProperty('_updated'))
  assertEquals(doc.getProperty('_id'), 0)
})

Deno.test('Collection - createDocument with custom object', () => {
  const db = new Database()
  const collection = new Collection('test', db)
  const doc = collection.createDocument({ name: 'test', value: 123 })

  assert(doc.hasProperty('_id'))
  assert(doc.hasProperty('_created'))
  assert(doc.hasProperty('_updated'))
  assertEquals(doc.getProperty('name'), 'test')
  assertEquals(doc.getProperty('value'), 123)
  assertEquals(doc.getProperty('_id'), 0)
})

Deno.test('Collection - createDocument increments _autoId', () => {
  const db = new Database()
  const collection = new Collection('test', db)

  const doc1 = collection.createDocument()
  const doc2 = collection.createDocument()

  assertEquals(doc1.getProperty('_id'), 0)
  assertEquals(doc2.getProperty('_id'), 1)
})

// IMPORT DOCUMENT
Deno.test('Collection - importDocument adds a document to the collection', () => {
  const db = new Database()
  const collection = new Collection('testCollection', db)

  // Import a document to the collection
  const docData = { _id: 1, name: 'Alice', amount: 123 }
  collection.importObject(docData)

  // Verify the document is added
  const importedDocument = collection.getById(1)
  assertEquals(importedDocument.getProperty('name'), 'Alice')
  assertEquals(importedDocument.getProperty('amount'), 123)
})

// ADD DOCUMENT
Deno.test('Collection - addDocument adds a document to the collection', () => {
  const db = new Database()
  const collection = new Collection('testCollection', db)

  // Create a document and add it to the collection
  const docData = { _id: 2, name: 'Bob', amount: 456 }
  const document = new Document(docData)
  collection.addDocument(document)

  // Verify the document is added
  const addedDocument = collection.getById(2)
  assertEquals(addedDocument.getProperty('name'), 'Bob')
  assertEquals(addedDocument.getProperty('amount'), 456)
})
