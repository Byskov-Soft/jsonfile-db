import { v4 as uuidv4 } from 'uuid'

/**
 * Get the current datetime
 *
 * @returns {Date} The current datetime
 */
export const now = (): Date => {
  return new Date()
}

/**
 * Generate a random UUID
 *
 * @returns {string} The generated UUID
 */
export const generateUUID = () => {
  return uuidv4()
}

/**
 * Check if a string is numeric
 *
 * @param {string} value The string to check
 * @returns {boolean} true if the string is numeric, false otherwise
 */
export const isNumeric = (value: string): boolean => {
  if (typeof value !== 'string' || value.trim() === '') {
    return false
  }

  return !isNaN(Number(value))
}
