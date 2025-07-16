/**
 *
 * @param {number} quantity
 * @returns {'out-of-stock' | 'low-stock' | 'in-stock'}
 */
export function calculateStockCondition(quantity) {
  if (quantity === 0) return 'out-of-stock';
  if (quantity < 10) return 'low-stock';

  return 'in-stock';
}
