import {DB} from '../../database/index.js';
import {calculateStockCondition} from '../stock-helper.js';
export async function ictSeeders() {
  const createdAt = new Date(2025, 5, 5);
  const updatedAt = new Date(2025, 5, 5);
  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();
  await DB.Product.create(
    {
      name: 'ICT Daily Polo',
      description: 'Information and Communication Technology Daily Polo Uniform. For Tertiary (BSIT,BSCS, and BSCpE)',
      image: 'ict.jpg',
      type: 'upper-wear',
      category: 'uniform',
      level: 'tertiary',
      departmentId: departments[0].id,
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
      name: 'ICT Daily Blouse',
      description:
        'Information and Communication Technology Daily Blouse Uniform. For Tertiary (BSIT,BSCS, and BSCpE) Female Students',
      image: 'ict.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[0].id,
      productVariant: [
        {
          name: 'Female',
          size: 'Small',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 390,
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
      name: 'ICT Daily Pants',
      description: 'Information and Communication Technology Daily Pants Uniform. For Tertiary (BSIT,BSCS, and BSCpE)',
      image: 'ict.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[0].id,
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
      name: 'ICT Daily Skirt',
      description: 'Information and Communication Technology Daily Skirt Uniform. For Tertiary (BSIT,BSCS,and BSCpE)',
      image: 'ict.jpg',
      level: 'tertiary',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[0].id,
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

