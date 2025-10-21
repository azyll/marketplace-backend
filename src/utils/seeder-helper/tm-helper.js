import {DB} from '../../database/index.js';
import {calculateStockCondition} from '../stock-helper.js';
export async function tmSeeders() {
  const createdAt = new Date(2025, 5, 5);
  const updatedAt = new Date(2025, 5, 5);
  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();
  await DB.Product.create(
    {
      name: 'Tourism Management Daily Polo',
      description: 'Tourism Management Daily Long Sleeve White Polo Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Enamel Pin',
      description: 'Tourism Management Pin. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'N/A',
          price: 70,
          size: '88',
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Daily Necktie',
      description: 'Tourism Management Daily Uniform NeckTie. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Male',
          price: 125,
          size: 'N/A',
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Daily Cloth Pants',
      description: 'Tourism Management Daily Gray Pants Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Medium',
          price: 330,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 345,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Daily Blazer',
      description: 'Tourism Management Daily Blazer Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 790,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 790,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 790,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 790,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        // Female
        {
          name: 'Female',
          size: 'Small',
          price: 760,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 760,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 760,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 760,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 760,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 760,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Beret',
      description: 'Tourism Management Daily Uniform Beret. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Female',
          price: 70,
          size: 'N/A',
          stockQuantity: 122,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Scarf',
      description: 'Tourism Management Daily Uniform Yellow Scarf. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Female',
          price: 70,
          size: 'N/A',
          stockQuantity: 75,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Daily Blouse',
      description: 'Tourism Management Daily White Blouse Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Female',
          size: 'Small',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
  await DB.Product.create(
    {
      name: 'Tourism Management Daily Skirt',
      description: 'Tourism Management Daily Gray Skirt Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: [
        {
          name: 'Female',
          size: 'Small',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Large',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        }
      ],
      createdAt,
      updatedAt
    },
    {
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant'
        }
      ]
    }
  );
}

