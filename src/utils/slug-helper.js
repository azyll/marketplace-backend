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

