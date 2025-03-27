/**
 * @typedef  TProductVariant
 * @property {string} name
 * @property {string} size
 * @property {number} price
 * @property {number} stockQuantity
 */
/**
 * @typedef {Object} TProduct
 * @property {string} name - product name
 * @property {string} description - product description
 * @property {string} image - product image
 * @property {string} type - product image
 * @property {string} category - product image
 * @property {string} programId - product image
 * @property {TProductVariant[]} variants - product variants
 */

/**
 * @typedef {Object} TOrderItem
 * @property {string} productVariantId
 * @property {number} quantity
 */
export {};
