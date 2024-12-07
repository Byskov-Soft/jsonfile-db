import { v4 as uuidv4 } from 'uuid'

/**
 * Get the current datetime
 * @returns {Date}
 */
export const now = (): Date => {
  return new Date()
}

/**
 * Generate a random UUID
 * @returns {string}
 */
export const generateUUID = () => {
  return uuidv4()
}

/**
 * Check if a string is numeric
 * @param {string} value
 * @returns {boolean}
 */
export const isNumeric = (value: string): boolean => {
  if (typeof value !== 'string' || value.trim() === '') {
    return false
  }

  return !isNaN(Number(value))
}
