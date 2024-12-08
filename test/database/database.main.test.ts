// deno-lint-ignore-file no-explicit-any
import { assertEquals, assertThrows } from '@std/assert'
import { Collection, Database } from '../../src/index.ts'

// CONSTRUCTOR
Deno.test('Database - constructor initializes properties', () => {
  const db = new Database()
  // Accessing private collections via type assertion for testing
  const collections = (db as any)._collections

  assertEquals(Array.isArray(collections), true)
  assertEquals(collections.length, 0)
})

// CREATE COLLECTION
Deno.test('Database - createCollection creates a new collection', () => {
  const db = new Database()
  const collection = db.createCollection('testCollection')

  assertEquals(collection.getName(), 'testCollection')
  // Accessing private collections array for testing
  const collections = (db as any)._collections
  assertEquals(collections.length, 1)
  assertEquals(collections[0], collection)
})

Deno.test('Database - createCollection throws error if collection exists', () => {
  const db = new Database()
  db.createCollection('testCollection')

  assertThrows(
    () => db.createCollection('testCollection'),
    Error,
    'Error 101',
  )
})

// COLLECTION
Deno.test('Database - collection method returns existing collection', () => {
  const db = new Database()

  // Create a collection using createCollection
  const createdCollection = db.createCollection('testCollection')

  // Retrieve the collection using the collection method
  const retrievedCollection = db.collection('testCollection')

  // Verify that the same collection is returned
  assertEquals(createdCollection, retrievedCollection)
})

Deno.test("Database - collection method creates new collection if it doesn't exist", () => {
  const db = new Database()

  // Ensure the collection does not exist yet
  const collectionsBefore = (db as any)._collections.length
  assertEquals(collectionsBefore, 0)

  // Retrieve (or create) the collection using the collection method
  const newCollection = db.collection('newCollection')

  // Verify that the collection has been created
  assertEquals(newCollection.getName(), 'newCollection')

  // Verify that the collection has been added to the database
  const collectionsAfter = (db as any)._collections.length
  assertEquals(collectionsAfter, 1)
})

Deno.test('Database - collection method does not create duplicate collections', () => {
  const db = new Database()

  // Retrieve (or create) the collection using the collection method
  const collection1 = db.collection('testCollection')

  // Call the collection method again with the same name
  const collection2 = db.collection('testCollection')

  // Verify that the same collection is returned
  assertEquals(collection1, collection2)

  // Verify that only one collection exists in the database
  const collections = (db as any)._collections
  assertEquals(collections.length, 1)
})

Deno.test('Database - collection method reflects changes made to the collection', () => {
  const db = new Database()
  const collectionName = 'testCollection'

  // Create a collection in the database
  const collection = db.createCollection(collectionName)

  // Modify the collection by adding a document
  const doc = collection.createDocument({ _id: 1, name: 'Alice', amount: 123 })

  // Also modify the document
  doc.setProperty('name', 'Alice 2')

  // Retrieve the collection again and verify the changes are present
  const retrievedCollection = db.collection(collectionName)
  const retrievedDocument = retrievedCollection.getById(1)

  assertEquals(retrievedDocument.getProperty('name'), 'Alice 2')
  assertEquals(retrievedDocument.getProperty('amount'), 123)
})

// REMOVE COLLECTION
Deno.test('Database - removeCollection removes existing collection', () => {
  const db = new Database()

  // Create a collection
  db.createCollection('testCollection')

  // Ensure the collection exists
  assertEquals(db.hasCollection('testCollection'), true)

  // Remove the collection
  const result = db.removeCollection('testCollection')
  assertEquals(result, true)

  // Verify the collection no longer exists
  assertEquals(db.hasCollection('testCollection'), false)
})

Deno.test('Database - removeCollection throws error for non-existent collection', () => {
  const db = new Database()

  // Attempt to remove a non-existent collection
  assertThrows(
    () => db.removeCollection('nonExistentCollection'),
    Error,
    'Error 102',
  )
})

Deno.test('Database - removeCollection updates collection list', () => {
  const db = new Database()

  // Create multiple collections
  db.createCollection('collection1')
  db.createCollection('collection2')
  db.createCollection('collection3')

  // Remove one collection
  db.removeCollection('collection2')

  // Get remaining collection names
  const collections = db.getCollectionNames()
  assertEquals(collections.length, 2)
  assertEquals(collections.includes('collection1'), true)
  assertEquals(collections.includes('collection2'), false)
  assertEquals(collections.includes('collection3'), true)
})

// ADD OR REPLACE COLLECTION
Deno.test('Database - addOrReplaceCollection adds a new collection', () => {
  const db = new Database()
  const collection = new Collection('testCollection')

  // Add the collection to the database
  db.addOrReplaceCollection('testCollection', collection)

  // Verify the collection is added
  const collectionNames = db.getCollectionNames()
  assertEquals(collectionNames.length, 1)
  assertEquals(collectionNames[0], 'testCollection')
})

Deno.test('Database - addOrReplaceCollection replaces an existing collection', () => {
  const db = new Database()
  const collection1 = new Collection('testCollection')
  const collection2 = new Collection('testCollection')

  // Add the first collection to the database
  db.addOrReplaceCollection('testCollection', collection1)

  // Add the second collection to the database, replacing the first one
  db.addOrReplaceCollection('testCollection', collection2)

  // Verify the collection is replaced
  const collectionNames = db.getCollectionNames()
  assertEquals(collectionNames.length, 1)
  assertEquals(collectionNames[0], 'testCollection')
  assertEquals(db.getCollection('testCollection'), collection2)
})
