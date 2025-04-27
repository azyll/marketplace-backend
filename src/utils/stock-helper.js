/**
 *
 * @param {number} quantity
 * @returns {'Out of Stock' | 'Low Stock' | 'In Stock' | 'Over Stock' | 'Re order'}
 */
export function calculateStockCondition(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  if (quantity > 50) return 'Over Stock';

  return 'In Stock';
}
