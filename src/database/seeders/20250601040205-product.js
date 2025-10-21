'use strict';

import {DB} from '../index.js';
import {
  productVariantWithGender,
  productVariantWithGenderButNoSize,
  productVariantWithMaleAndFemale,
  productVariantWithoutGenderButHaveSize,
  productWithNoVariant
} from '../../utils/product-seeder.helper.js';
import {ictSeeders} from '../../utils/seeder-helper/ict-helper.js';
import {shSeeders} from '../../utils/seeder-helper/sh-helper.js';
import {hmSeeders} from '../../utils/seeder-helper/hm-helper.js';
import {bmSeeders} from '../../utils/seeder-helper/bm-helper.js';
import {tmSeeders} from '../../utils/seeder-helper/tm-helper.js';
import {bacommSeeders} from '../../utils/seeder-helper/bacomm-helper.js';
import {calculateStockCondition} from '../../utils/stock-helper.js';

export async function up(queryInterface, Sequelize) {
  const createdAt = new Date(2025, 5, 5);
  const updatedAt = new Date(2025, 5, 5);
  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();

  // ICT
  await ictSeeders();
  await shSeeders();
  await hmSeeders();
  await bmSeeders();
  await tmSeeders();
  await bacommSeeders();

  //SH
  await DB.Product.create(
    {
      name: 'Tertiary School ID Lace',
      description: 'Tertiary School ID Lace. For Tertiary Students',
      image: 'ict.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 100,
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

  // BM

  await DB.Product.create(
    {
      name: 'Business and Management Student Pin',
      description: 'Business & Management. STI Students',
      image: 'bm-pin.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 75,
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
      name: 'Tourism Student Pin',
      description: 'Tourism. STI Students',
      image: 'tourism.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 75,
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
      name: 'Culinary Student Pin',
      description: 'Culinary. STI Students',
      image: 'hm-pin.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 75,
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
      name: 'Information Technology Student Pin',
      description: 'Information Technology. STI Students',
      image: 'ict-pin.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 75,
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
      name: 'Engineering Student Pin',
      description: 'Engineering. STI Students',
      image: 'engineering.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 75,
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
      name: 'Arts and Sciences Student Pin',
      description: 'Arts & Sciences. STI Students',
      image: 'arts-and-sciences-pin.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 75,
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
      name: 'STI Sticker Set',
      description: 'STI Sticker Set',
      image: 'sti-sticker-set.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 25,
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
      name: 'ID Lace and Case Holder',
      description: 'ID Lace & Case Holder',
      image: 'ict.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 40,
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
      name: 'STI Aqua Flask',
      description: 'STI Aqua Flask Limited Edition',
      image: 'sti-aqua-flask.png',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'Blue',
          size: 'N/A',
          price: 25,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[2].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'Yellow',
          size: 'N/A',
          price: 25,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[2].id,
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
      name: 'Exam Pen Box 10 pcs',
      description: 'ID Lace & Case Holder',
      image: 'exam-pen.jpg',
      level: 'all',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'N/A',
          price: 50,
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
      name: 'Tertiary PE Uniform TShirt',
      description: 'Physical Education T-Shirt Uniform  For Tertiary',
      image: 'tertiary-pe.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'Small',
          price: 175,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Medium',
          price: 175,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Large',
          price: 175,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Extra Large',
          price: 175,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '2 Extra Large',
          price: 175,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '3 Extra Large',
          price: 175,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },

        {
          name: 'N/A',
          size: '5 Extra Large',
          price: 175,
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
      name: 'Tertiary PE Uniform Pants',
      description: 'Physical Education Pants Uniform For Tertiary',
      image: 'tertiary-pe.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'Small',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Medium',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Large',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Extra Large',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '2 Extra Large',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '3 Extra Large',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '4 Extra Large',
          price: 310,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '5 Extra Large',
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
      name: '42nd STI Anniversary TShirt',
      description: '2025 STI Anniversary T-Shirt',
      image: '42-sti-anniv-shirt.jpg',
      type: 'upper-wear',
      level: 'all',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 240,
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
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 195,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 200,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 200,
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
      name: '41st STI Anniversary TShirt',
      description: '2024 STI Anniversary T-Shirt',
      image: 'anniv-shirt-2024.jpg',
      type: 'upper-wear',
      level: 'all',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 275,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 275,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 275,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 275,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 275,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 275,
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
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 390,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
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
      name: 'Tertiary NSTP Uniform',
      description: 'Tertiary National Service Training Program Uniform',
      image: 'nstp.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'N/A',
          size: 'Extra Small',
          price: 220,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Small',
          price: 220,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id
        },
        {
          name: 'N/A',
          size: 'Medium',
          price: 220,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Large',
          price: 220,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: 'Extra Large',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '2 Extra Large',
          price: 240,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '3 Extra Large',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '4 Extra Large',
          price: 250,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[0].id,
          createdAt: new Date(2025, 5, 5),
          updatedAt: new Date()
        },
        {
          name: 'N/A',
          size: '5 Extra Large',
          price: 250,
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
      name: 'Tertiary Wash Day Shirt',
      description: 'Tertiary Wash Day Uniform',
      image: 'washday.png',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '5 Extra Large',
          price: 245,
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
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '5 Extra Large',
          price: 245,
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
      name: 'Senior High Wash Day Shirt',
      description: 'Senior High Wash Day Uniform',
      image: 'washday.png',
      type: 'upper-wear',
      level: 'shs',
      category: 'uniform',
      departmentId: departments[6].id,
      productVariant: [
        {
          name: 'Male',
          size: 'Small',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Medium',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: 'Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '2 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '3 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Male',
          size: '5 Extra Large',
          price: 245,
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
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Medium',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: 'Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '2 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 225,
          stockQuantity: 50,
          stockCondition: calculateStockCondition(50),
          productAttributeId: productAttributes[1].id,
          createdAt,
          updatedAt
        },
        {
          name: 'Female',
          size: '3 Extra Large',
          price: 245,
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Products', null, {});
}

