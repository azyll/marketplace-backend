import {DB} from '../../database/index.js';
import {calculateStockCondition} from '../stock-helper.js';
export async function bacommSeeders() {
  const createdAt = new Date(2025, 5, 5);
  const updatedAt = new Date(2025, 5, 5);
  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();
  await DB.Product.create(
    {
      name: 'Arts and Sciences Daily Polo',
      description: 'Arts and Sciences Daily Long Sleeve Blue Polo Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 410,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 410,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 410,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 410,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 410,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 410,
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
      name: 'Arts and Sciences Daily Necktie',
      description: 'Arts and Sciences Daily Uniform Blue Necktie. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
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
      name: 'Arts and Sciences Daily Pants',
      description: 'Arts and Sciences Daily Pants Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 450,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 450,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 450,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 460,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 460,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 460,
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
          price: 442,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 442,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 442,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 452,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 452,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 452,
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
      name: 'Arts and Sciences Blazer',
      description: 'Arts and Sciences Daily Blazer Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 750,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 750,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 750,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 870,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 870,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 950,
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
          price: 720,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 720,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 720,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 840,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 840,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 840,
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
      name: 'Arts and Sciences Scarf',
      description: 'Arts and Sciences Daily Uniform Blue Scarf. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: [
        {
          name: 'Female',
          price: 70,
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
      name: 'Arts and Sciences Daily Blouse',
      description: 'Arts and Sciences Daily Blue Long Sleeve Blouse Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: [
        {
          name: 'Female',
          size: 'Small',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 375,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 375,
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
      name: 'Arts and Sciences Daily Skirt',
      description: 'Arts and Sciences Daily Skirt Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: [
        {
          name: 'Female',
          size: 'Small',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Large',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 200,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 200,
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

