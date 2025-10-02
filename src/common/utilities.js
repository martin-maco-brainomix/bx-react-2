/**
 * Determines whether a given object is empty.
 *
 * This function checks if an object has no enumerable properties, no entries,
 * or no own property names, and returns true if the object is empty, otherwise false.
 *
 * @param {Object} obj - The object to be checked for emptiness.
 * @returns {boolean} Returns true if the object is empty, otherwise false.
 */
export const isEmptyObject = (obj) =>
  typeof obj === 'object' &&
  (!Object.keys(obj).length ||
    !Object.entries(obj).length ||
    !Object.getOwnPropertyNames(obj).length)
