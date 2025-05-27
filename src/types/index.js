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
 * @property {string} departmentId - product image
 * @property {TProductVariant[]} variants - product variants
 */

/**
 * @typedef {Object} TOrderItem
 * @property {string} productVariantId
 * @property {number} quantity
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number|string} currentPage - The current page number
 * @property {number|string} itemsPerPage - The number of items per page
 * @property {number|string} totalItems - The total number of items
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {InstanceType[]} data - The array of items (model instances)
 * @property {PaginationMeta} meta - Pagination metadata
 */

/**
 * @typedef {Object} QueryParams
 * @property {string|number} limit
 * @property {string|number} page
 */

/**
 * @typedef {'user'|'application'|'stock'|'sales'|'order'} TLog
 */
export {};
