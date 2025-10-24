import {DB} from '../../database/index.js';
import {calculateStockCondition} from '../stock-helper.js';
export async function hmSeeders() {
  const createdAt = new Date(2025, 5, 5);
  const updatedAt = new Date(2025, 5, 5);
  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();

  await DB.Product.create(
    {
      name: 'Hotel and Management Daily Polo',
      description: 'Hospitality Management Daily Long Sleeve White Polo Uniform. For Tertiary (BSHM)',
      image: 'products/hm-polo.png',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 400,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 400,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 400,
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
      name: 'Hotel and Management Daily Pants',
      description: 'Hotel and Management Daily Gray Pants Uniform. For Tertiary (BSHM)',
      image: 'products/pants.png',
      level: 'tertiary',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[2].id,
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
      name: 'Hotel and Management Blazer',
      description: 'Hotel and Management Daily Blazer Uniform. For Tertiary (BSHM)',
      image: 'products/blazer.png',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[2].id,
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
      name: 'Hotel and Management Daily Blouse',
      description: 'Hotel and Management Daily White Blouse Uniform. For Tertiary (BSHM)',
      image: 'products/hm-blouse.png',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'Female',
          size: 'Small',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Large',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 380,
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
      name: 'Hotel and Management Daily Skirt',
      description: 'Hotel and Management Daily Gray Skirt Uniform. For Tertiary (BSHM)',
      image: 'products/hm-skirt.png',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[2].id,
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

  // Hotel and Management  FOOD AND BEVERAGES

  await DB.Product.create(
    {
      name: 'Hotel and Management Vest',
      description: 'Hotel and Management Daily Vest Uniform. For Tertiary (BSHM)',
      image: 'products/hm-vest.png',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 380,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 390,
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
          price: 405,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 420,
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
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 360,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 360,
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
      name: 'Hotel and Management Chefs Polo',
      description: 'Hotel and Management Chef Polo',
      image: 'products/hm-chef-polo.png',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'Extra Small',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Small',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Medium',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '2 Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '3 Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '4 Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '5 Extra Large',
          price: 365,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management  Chefs Pants',
      description: 'Hotel and Management Chef Pants',
      image: 'products/hm-chef-pants.png',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'Extra Small',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Small',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Medium',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Large',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Extra Large',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '2 Extra Large',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '3 Extra Large',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '4 Extra Large',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '5 Extra Large',
          price: 315,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management Chef Apron',
      description: 'Hotel and Management Apron. For Tertiary (BSTM)',
      image: 'products/hm-apron.png',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 92,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
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
      name: 'Hotel and Management Chef Skull Cap',
      description: 'Hotel and Management Skull Cap. For Tertiary (BSTM)',
      image: 'products/hm-skull-cap.png',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 107,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
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
      name: 'Hotel and Management Blazer Fabric Special Size',
      description: 'Hotel and Management Blazer Fabric Special Size For Daily Uniform',
      image: 'products/blazer.png',
      level: 'tertiary',
      type: 'non-wearable',
      category: 'fabric',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: '2.5 Yards',
          price: 740,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management Polo and Blouse Fabric Special Size',
      description: 'Polo and Blouse Fabric Special Size For Daily Uniform',
      image: 'products/tm-polo.png',
      level: 'tertiary',
      type: 'non-wearable',
      category: 'fabric',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: '2.5 Yards',
          price: 410,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management Pants Fabric Special Size',
      description: 'Pants Fabric Special Size For ICT Daily Uniform',
      image: 'products/pants.png',
      level: 'tertiary',
      type: 'non-wearable',
      category: 'fabric',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: '2.5 Yards',
          price: 260,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management Vest Fabric Special Size',
      description: 'Vest Fabric Special Size For ICT Daily Uniform',
      image: 'products/hm-vest.png',
      level: 'tertiary',
      type: 'non-wearable',
      category: 'fabric',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: '2.5 Yards',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management Chef Polo Fabric Special Size',
      description: 'Chef Polo Fabric Special Size For ICT Daily Uniform',
      image: 'products/hm-chef-polo.png',
      level: 'tertiary',
      type: 'non-wearable',
      category: 'fabric',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: '2.5 Yards',
          price: 470,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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
      name: 'Hotel and Management Chef Pants Fabric Special Size',
      description: 'Chef Pants Fabric Special Size For ICT Daily Uniform',
      image: 'products/hm-chef-pants.png',
      level: 'tertiary',
      type: 'non-wearable',
      category: 'fabric',
      departmentId: departments[2].id,
      productVariant: [
        {
          name: 'N/A',
          size: '2.5 Yards',
          price: 400,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
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

