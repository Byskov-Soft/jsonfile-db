import { parseISO } from 'date-fns'
import { z } from 'zod'

// Schema for an ISO8601 date string
export const ISO8601DateString = z.string().refine(
  (arg): boolean => {
    if (parseISO(arg).toString() === 'Invalid Date') {
      console.error(`Parsing of '${arg}' as ISO8601 date failed`)
      return false
    }

    return true
  },
  { message: `Value is not a valid date` },
)

export type ISO8601DateString = z.TypeOf<typeof ISO8601DateString>

// Base parser for a database record
export const Data = z.object({
  _id: z.union([z.string(), z.number()]),
  _created: ISO8601DateString,
  _updated: ISO8601DateString,
}).catchall(z.any())

// Parser for the database file
export const DBJson = z.array(
  z.object({
    name: z.string(),
    data: z.array(Data),
  }),
)

export type DBJson = z.TypeOf<typeof DBJson>
