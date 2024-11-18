import { v4 as uuidv4 } from 'uuid'

export const now = (): Date => {
  return new Date()
}

export const generateUUID = () => {
  return uuidv4()
}

export const isNumeric = (s: unknown): boolean => {
  if (typeof s !== 'string' || s.trim() === '') {
    return false
  }

  return !isNaN(Number(s))
}
