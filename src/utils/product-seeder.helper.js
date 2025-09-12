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
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Male',
      size: 'Medium',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Male',
      size: 'Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Male',
      size: 'Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Male',
      size: '2 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Male',
      size: '3 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Male',
      size: '4 Extra Large',
      price: 500,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: 'Small',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: 'Medium',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: 'Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: 'Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: '2 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: '3 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'Female',
      size: '4 Extra Large',
      price: 500,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
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
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: gender,
      size: 'Medium',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: gender,
      size: 'Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: gender,
      size: 'Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: gender,
      size: '2 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: gender,
      size: '3 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: gender,
      size: '4 Extra Large',
      price: 500,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    }
  ];
};
/**
 *
 * @param {'Female'|'Male'} gender
 * @param {string} productAttributeId
 * @returns
 */
export const productVariantWithGenderButNoSize = (gender, productAttributeId, size = 'N/A') => {
  return [
    {
      name: gender,
      price: 350,
      size,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    }
  ];
};
/**
 *
 * @param {'Female'|'Male'} gender
 * @param {string} productAttributeId
 * @returns
 */
export const productVariantWithoutGenderButHaveSize = (productAttributeId) => {
  return [
    {
      name: 'N/A',
      size: 'Small',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId
    },
    {
      name: 'N/A',
      size: 'Medium',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'N/A',
      size: 'Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'N/A',
      size: 'Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'N/A',
      size: '2 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'N/A',
      size: '3 Extra Large',
      price: 350,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    },
    {
      name: 'N/A',
      size: '4 Extra Large',
      price: 500,
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
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
      stockAvailable: 50,
      stockCondition: calculateStockCondition(50),
      productAttributeId,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date()
    }
  ];
};

