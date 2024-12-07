import { assertEquals, assertThrows } from '@std/assert'
import { throwError } from '../src/errorManager.ts'

Deno.test('throwError - throws collection creation error (101)', () => {
  const error = assertThrows(
    () => throwError(101, 'test'),
    Error,
  )
  assertEquals(
    error.message,
    "Error 101: Can't create collection with name `test`, Another collection exists with the same name.",
  )
})

Deno.test('throwError - throws collection not found error (103)', () => {
  const error = assertThrows(
    () => throwError(102, 'test'),
    Error,
  )
  assertEquals(
    error.message,
    'Error 102: Collection with name `test` not found.',
  )
})

Deno.test('throwError - throws property reserved error (201)', () => {
  const error = assertThrows(
    () => throwError(201, '_id'),
    Error,
  )
  assertEquals(
    error.message,
    "Error 201: Can't set property with key `_id`, it's reserved for the system.",
  )
})

Deno.test('throwError - throws unknown error code', () => {
  const error = assertThrows(
    () => throwError(999, 'test'),
    Error,
  )
  assertEquals(
    error.message,
    'Error 999: Unknown error code.',
  )
})
