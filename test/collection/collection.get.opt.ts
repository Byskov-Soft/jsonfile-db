import { assertEquals } from '@std/assert'
import { type AttributeCriteria, Collection } from '../../src/collection.ts'
import { Database } from '../../src/database.ts'

Deno.test('Collection - getByAttribute with beginsWith option', () => {
    const db = new Database()
    const collection = new Collection('testCollection', db)

    // Add documents to the collection
    collection.createDocument({ name: 'Alice', amount: 123 })
    collection.createDocument({ name: 'Bob', amount: 456 })
    collection.createDocument({ name: 'Charlie', amount: 789 })

    // Use getByAttribute with beginsWith option
    const criteria: AttributeCriteria[] = [{ name: 'name', value: 'A', opt: 'beginsWith' }]
    const result = collection.getByAttribute(criteria)

    // Verify the results
    assertEquals(result.length, 1)
    assertEquals(result[0].getProperty('name'), 'Alice')
})

Deno.test('Collection - getByAttribute with endsWith option', () => {
    const db = new Database()
    const collection = new Collection('testCollection', db)

    // Add documents to the collection
    collection.createDocument({ name: 'Alice', amount: 123 })
    collection.createDocument({ name: 'Bob', amount: 456 })
    collection.createDocument({ name: 'Charlie', amount: 789 })

    // Use getByAttribute with endsWith option
    const criteria: AttributeCriteria[] = [{ name: 'name', value: 'e', opt: 'endsWith' }]
    const result = collection.getByAttribute(criteria)

    // Verify the results
    assertEquals(result.length, 2)
    assertEquals(result[0].getProperty('name'), 'Alice')
    assertEquals(result[1].getProperty('name'), 'Charlie')
})

Deno.test('Collection - getByAttribute with contains option', () => {
    const db = new Database()
    const collection = new Collection('testCollection', db)

    // Add documents to the collection
    collection.createDocument({ name: 'Alice', amount: 123 })
    collection.createDocument({ name: 'Bob', amount: 456 })
    collection.createDocument({ name: 'Charlie', amount: 789 })

    // Use getByAttribute with contains option
    const criteria: AttributeCriteria[] = [{ name: 'name', value: 'li', opt: 'contains' }]
    const result = collection.getByAttribute(criteria)

    // Verify the results
    assertEquals(result.length, 2)
    assertEquals(result[0].getProperty('name'), 'Alice')
    assertEquals(result[1].getProperty('name'), 'Charlie')
})

Deno.test('Collection - getByAttribute by number value', () => {
    const db = new Database()
    const collection = new Collection('testCollection', db)

    // Add documents to the collection
    collection.createDocument({ name: 'Alice', amount: 1.23 })
    collection.createDocument({ name: 'Bob', amount: 456 })
    collection.createDocument({ name: 'Charlie', amount: 789 })

    // Use getByAttribute with beginsWith option
    const criteria: AttributeCriteria[] = [{ name: 'amount', value: 456 }]
    const result = collection.getByAttribute(criteria)

    // Verify the results
    assertEquals(result.length, 1)
    assertEquals(result[0].getProperty('amount'), 456)
})

Deno.test('Collection - getByAttribute with beginsWith option (number value)', () => {
    const db = new Database()
    const collection = new Collection('testCollection', db)

    // Add documents to the collection
    collection.createDocument({ name: 'Alice', amount: 1.23 })
    collection.createDocument({ name: 'Bob', amount: 456 })
    collection.createDocument({ name: 'Charlie', amount: 789 })

    // Use getByAttribute with beginsWith option
    const criteria: AttributeCriteria[] = [{ name: 'amount', value: 1.23, opt: 'beginsWith' }]
    const result = collection.getByAttribute(criteria)

    // Verify the results
    assertEquals(result.length, 1)
    assertEquals(result[0].getProperty('amount'), 1.23)
})
