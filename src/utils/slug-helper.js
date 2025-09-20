/**
 *
 * @param {string} text
 * @returns {sting}
 */
export function convertToSlug(text) {
  return text
    .normalize('NFKD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase() // Lowercase
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 *
 * @param {string} slug
 * @returns {string}
 */
export function convertFromSlug(slug) {
  return slug
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
}

/**
 * Checks if the input string contains characters that will be changed or removed by convertToSlug.
 * @param {string} text
 * @returns {boolean} - true if any change will occur, false otherwise
 */
export function hasInvalidSlugCharacters(text) {
  // Characters that will be removed or replaced by convertToSlug
  const invalidCharsRegex = /[^\w\s-]/g; // Matches characters that are not letters, numbers, spaces, or hyphens

  // Check if the string contains invalid characters that will be removed
  return invalidCharsRegex.test(text);
}

