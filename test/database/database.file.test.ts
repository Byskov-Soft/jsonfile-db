// deno-lint-ignore-file no-explicit-any
import { assert, assertEquals } from '@std/assert'
import { expect } from '@std/expect'
import { existsSync } from '@std/fs'
import {
  Collection,
  Database,
  type Document,
  type DocumentData,
  type DocumentDataAny,
} from '../../src/index.ts'

Deno.test('Database - saveToFile saves collections and documents to a JSON file', async () => {
  const db = new Database()

  // Create collections and documents
  const collection1 = db.createCollection('collection1')
  collection1.createDocument({ name: 'Doc1', value: 123 })
  collection1.createDocument({ name: 'Doc2', value: 456 })

  const collection2 = db.createCollection('collection2')
  collection2.createDocument({ name: 'DocA', value: 'abc' })

  // File path in /tmp directory
  const filePath = '/tmp/test_db.json'

  // Ensure the file doesn't exist before the test
  if (existsSync(filePath)) {
    Deno.removeSync(filePath)
  }

  // Call saveToFile
  await db.persist(filePath)

  // Verify the file was created
  assert(
    existsSync(filePath),
    'File should exist after saveToFile is called',
  )

  // Read and parse the file
  const jsonData = Deno.readTextFileSync(filePath)
  const data = JSON.parse(jsonData)

  // Create a map of collections by name for easy access
  const dataMap = data.reduce(
    (
      acc: { [key: string]: DocumentDataAny },
      collection: { name: string; data: DocumentData[] },
    ) => {
      const sanitizedData = collection.data.map((doc: any) => {
        const { _created, _updated, ...rest } = doc
        return rest as DocumentDataAny
      })

      acc[collection.name] = sanitizedData
      return acc
    },
    {},
  )

  // Verify collection1
  const collection1Data = dataMap['collection1']
  assert(collection1Data, 'collection1 should exist in the saved data')
  assertEquals(collection1Data.length, 2)

  assertEquals(collection1Data, [
    { _id: 0, name: 'Doc1', value: 123 },
    { _id: 1, name: 'Doc2', value: 456 },
  ])

  // Verify collection2
  const collection2Data = dataMap['collection2']
  assert(collection2Data, 'collection2 should exist in the saved data')
  assertEquals(collection2Data.length, 1)

  assertEquals(collection2Data, [
    { _id: 0, name: 'DocA', value: 'abc' },
  ])

  // Clean up: Remove the test file
  Deno.removeSync(filePath)
})

Deno.test('Database - loadFromFile reads collections and documents from a JSON file', async () => {
  const db1 = new Database()

  // Create collections and documents
  const collection1 = db1.createCollection('collection1')
  collection1.createDocument({ name: 'Doc1', value: 123 })
  collection1.createDocument({ name: 'Doc2', value: 456 })

  const collection2 = db1.createCollection('collection2')
  collection2.createDocument({ name: 'DocA', value: 'abc' })

  // File path in /tmp directory
  const filePath = '/tmp/test_db.json'

  // Ensure the file doesn't exist before the test
  if (existsSync(filePath)) {
    Deno.removeSync(filePath)
  }

  // Call saveToFile
  await db1.persist(filePath)

  // Load the file into a new database
  const db2 = new Database()
  await db2.restore(filePath)

  // Verify the collections and documents in db2
  assertEquals(db2.getCollectionNames(), ['collection1', 'collection2'])

  // Verify collection1
  const db2Collection1 = db2.getCollection('collection1')
  const db2Coll1Records = db2Collection1.getByAttribute([]).map((doc) => doc.object())

  const db2Collection2 = db2.getCollection('collection2')
  const db2Coll2Records = db2Collection2.getByAttribute([]).map((doc) => doc.object())

  expect(db2Coll1Records[0]).toEqual(
    expect.objectContaining({ _id: 0, name: 'Doc1', value: 123 }),
  )

  expect(db2Coll1Records[1]).toEqual(
    expect.objectContaining({ _id: 1, name: 'Doc2', value: 456 }),
  )

  expect(db2Coll2Records[0]).toEqual(
    expect.objectContaining({ _id: 0, name: 'DocA', value: 'abc' }),
  )

  // Clean up: Remove the test file
  await Deno.remove(filePath)
})

Deno.test('Database - persist overwrites existing file', async () => {
  const db = new Database()
  const collection = new Collection('testCollection')

  // Add documents to the collection
  collection.createDocument({ name: 'Alice', amount: 123 })
  db.addCollection(collection)

  const filePath = './test_db.json'

  // Persist the database to a file
  await db.persist(filePath)

  // Modify the collection
  collection.createDocument({ name: 'Bob', amount: 456 })

  // Persist the database again to overwrite the existing file
  await db.persist(filePath)

  // Read the file content
  const fileContent = await Deno.readTextFile(filePath)
  const jsonData = JSON.parse(fileContent)

  // Verify the file content
  assertEquals(jsonData.length, 1)
  assertEquals(jsonData[0].name, 'testCollection')
  assertEquals(jsonData[0].data.length, 2)
  assert(jsonData[0].data.some((doc: Document) => (doc as any).name === 'Alice'))
  assert(jsonData[0].data.some((doc: Document) => (doc as any).name === 'Bob'))

  // Clean up
  await Deno.remove(filePath)
})
