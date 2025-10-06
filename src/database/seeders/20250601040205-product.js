'use strict';

import {DB} from '../index.js';
import {
  productVariantWithGender,
  productVariantWithGenderButNoSize,
  productVariantWithMaleAndFemale,
  productVariantWithoutGenderButHaveSize,
  productWithNoVariant
} from '../../utils/product-seeder.helper.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const createdAt = new Date(2025, 5, 5);
  const updatedAt = new Date(2025, 5, 5);
  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();

  // ICT
  await DB.Product.create(
    {
      name: 'ICT Polo',
      description: 'Information and Communication Technology Daily Polo Uniform. For Tertiary (BSIT,BSCS, and BSCpE)',
      image: 'ict.jpg',
      type: 'upper-wear',
      category: 'uniform',
      level: 'tertiary',
      departmentId: departments[0].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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
      name: 'ICT Blouse',
      description: 'Information and Communication Technology Daily Blouse Uniform. For Tertiary (BSIT,BSCS, and BSCpE)',
      image: 'ict.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[0].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'ICT Pants',
      description: 'Information and Communication Technology Daily Pants Uniform. For Tertiary (BSIT,BSCS, and BSCpE)',
      image: 'ict.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[0].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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
      name: 'ICT Skirt',
      description: 'Information and Communication Technology Daily Skirt Uniform. For Tertiary (BSIT,BSCS,and BSCpE)',
      image: 'ict.jpg',
      level: 'tertiary',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[0].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'ICT Pin',
      description: 'ICT Pin. For Tertiary (BSIT,BSCS, and BSCpE)',
      image: 'ict-pin.jpg',
      level: 'tertiary',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[0].id,
      productVariant: productWithNoVariant(productAttributes[0].id),
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

  //SH
  await DB.Product.create(
    {
      name: 'Senior High Polo',
      description: 'Senior High School Daily White Polo with Gray Vest Uniform. For Senior High Students',
      image: 'sh.jpg',
      level: 'shs',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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
      name: 'Senior High Slacks',
      description: 'Senior High School Daily Dark Blue Slacks. For Senior High Students',
      image: 'sh.jpg',
      type: 'lower-wear',
      level: 'shs',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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

  // Female SH

  await DB.Product.create(
    {
      name: 'Senior Blouse',
      description: 'Senior High School White Blouse with Gray Vest. For Senior High Students',
      image: 'sh.jpg',
      level: 'shs',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'Senior Skirt',
      description: 'Senior High School Dark Blue Pencil-Cut Skirt. For Senior High Students',
      image: 'sh.jpg',
      level: 'shs',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'Senior Neck Tie',
      description: 'Senior High School Neck Tie. For Senior High Students',
      image: 'sh.jpg',
      type: 'upper-wear',
      level: 'shs',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGenderButNoSize('Male', productAttributes[0].id),
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
      name: 'Senior School ID Lace',
      description: 'Senior High School School ID Lace. For Senior High Students',
      image: 'sh.jpg',
      level: 'shs',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[5].id,
      productVariant: productWithNoVariant(productAttributes[0].id),
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
      name: 'Tertiary School ID Lace',
      description: 'Tertiary School ID Lace. For Tertiary Students',
      image: 'ict.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[6].id,
      productVariant: productWithNoVariant(productAttributes[0].id),
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
      name: 'BM Pants',
      description: 'Business & Management Daily Pants Uniform. For Tertiary (BSBA)',
      image: 'bm.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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
      name: 'BM Female Skirt',
      description: 'Business & Management Daily Skirt Uniform. For Tertiary (BSBA)',
      image: 'bm.jpg',
      level: 'tertiary',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'BM Long Sleeve Polo Male',
      description: 'Business & Management Daily Long Sleeve Polo Uniform Male. For Tertiary (BSBA)',
      image: 'bm.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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
      name: 'BM Long Sleeve Blouse Female',
      description: 'Business & Management Daily Long Sleeve Blouse Uniform Female. For Tertiary (BSBA)',
      image: 'bm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'BM Blazer',
      description: 'Business & Management Daily Blazer Uniform. For Tertiary (BSBA)',
      image: 'bm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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
      name: 'BM Red Scarf',
      description: 'Business & Management Daily Red Scarf Uniform. For Tertiary (BSBA)',
      image: 'bm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithGenderButNoSize('Female', productAttributes[1].id),
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
      name: 'BM Red Necktie',
      description: 'Business & Management Daily Red Necktie Uniform. For Tertiary (BSBA)',
      image: 'bm.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithGenderButNoSize('Male', productAttributes[1].id),
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
      name: 'BM Pin',
      description: 'Business & Management Pin. For Tertiary (BSBM)',
      image: 'bm-pin.jpg',
      level: 'tertiary',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[1].id,
      productVariant: productWithNoVariant(productAttributes[0].id),
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

  // TM
  await DB.Product.create(
    {
      name: 'TM Long Sleeve White Polo',
      description: 'Tourism Management Daily Long Sleeve White Polo Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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
      name: 'TM Pin',
      description: 'Tourism Management Pin. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[3].id,
      productVariant: productWithNoVariant(productAttributes[0].id),
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
      name: 'TM Necktie',
      description: 'Tourism Management Daily Uniform NeckTie. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGenderButNoSize('Male', productAttributes[1].id),
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
      name: 'TM Gray Pants',
      description: 'Tourism Management Daily Gray Pants Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'lower-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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
      name: 'TM Blazer',
      description: 'Tourism Management Daily Blazer Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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
      name: 'TM Beret',
      description: 'Tourism Management Daily Uniform Beret. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGenderButNoSize('Female', productAttributes[1].id),
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
      name: 'TM Yellow Scarf',
      description: 'Tourism Management Daily Uniform Yellow Scarf. For Tertiary (BSTM)',
      image: 'tm.jpg',
      level: 'tertiary',
      type: 'upper-wear',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGenderButNoSize('Female', productAttributes[1].id),
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
      name: 'TM White Blouse',
      description: 'Tourism Management Daily White Blouse Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'TM Gray Skirt',
      description: 'Tourism Management Daily Gray Skirt Uniform. For Tertiary (BSTM)',
      image: 'tm.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[3].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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

  // Arts and Sciences
  await DB.Product.create(
    {
      name: 'Arts and Sciences Long Sleeve Blue Polo',
      description: 'Arts and Sciences Daily Long Sleeve Blue Polo Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id),
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
      name: 'Arts and Sciences Blue Necktie Male',
      description: 'Arts and Sciences Daily Uniform Blue Necktie. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: productVariantWithGenderButNoSize('Male', productAttributes[1].id),
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
      name: 'Arts and Sciences Pants',
      description: 'Arts and Sciences Daily Pants Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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
      name: 'Arts and Sciences Blue Scarf',
      description: 'Arts and Sciences Daily Uniform Blue Scarf. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'Arts and Sciences Blue Long Sleeve Blouse',
      description: 'Arts and Sciences Daily Blue Long Sleeve Blouse Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'Arts and Sciences Skirt',
      description: 'Arts and Sciences Daily Skirt Uniform. For Tertiary (BACOMM)',
      image: 'arts-and-sciences.jpg',
      type: 'lower-wear',
      level: 'tertiary',
      category: 'uniform',
      departmentId: departments[4].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id),
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
      name: 'Arts and Sciences Pin',
      description: 'Arts and Sciences Pin. For Tertiary (BACOMM)',
      image: 'arts-and-sciences-pin.jpg',
      level: 'tertiary',
      type: 'accessory',
      category: 'proware-item',
      departmentId: departments[4].id,
      productVariant: productWithNoVariant(productAttributes[0].id),
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
      productVariant: productVariantWithoutGenderButHaveSize(productAttributes[0].id),
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
      productVariant: productVariantWithoutGenderButHaveSize(productAttributes[0].id),
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
      name: '2024 STI Anniversary TShirt',
      description: '2024 STI Anniversary T-Shirt',
      image: 'anniv-shirt-2024.jpg',
      type: 'upper-wear',
      level: 'all',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: productVariantWithoutGenderButHaveSize(productAttributes[0].id),
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
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: productVariantWithoutGenderButHaveSize(productAttributes[0].id),
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
      name: 'Tertiary Wash Day Uniform',
      description: 'Tertiary Wash Day Uniform',
      image: 'washday.png',
      type: 'upper-wear',
      level: 'tertiary',
      category: 'proware-item',
      departmentId: departments[6].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id),
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

