import {calculateStockCondition} from './stock-helper.js';

/**
 *
 * @param {string} productAttributeId
 */
export const productVariantWithMaleAndFemale = (productAttributeId) => {
  return [
    {
      name: 'Male',
      size: 'Small',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Male',
      size: 'Medium',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Male',
      size: 'Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Male',
      size: 'Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Male',
      size: '2 Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Male',
      size: '3 Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Male',
      size: '4 Extra Large',
      price: 500,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: 'Small',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: 'Medium',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: 'Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: 'Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: '2 Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: '3 Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'Female',
      size: '4 Extra Large',
      price: 500,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    }
  ];
};

/**
 *
 * @param {'Female'|'Male'} gender
 * @param {string} productAttributeId
 * @returns
 */
export const productVariantWithGender = (gender, productAttributeId) => {
  return [
    {
      name: gender,
      size: 'Small',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: gender,
      size: 'Medium',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: gender,
      size: 'Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: gender,
      size: 'Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: gender,
      size: '2 Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: gender,
      size: '3 Extra Large',
      price: 350,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: gender,
      size: '4 Extra Large',
      price: 500,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    }
  ];
};
/**
 *
 * @param {string} productAttributeId
 */
export const productWithNoVariant = (productAttributeId) => {
  return [
    {
      name: 'N/A',
      size: 'N/A',
      price: 100,
      stockQuantity: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    }
  ];
};

