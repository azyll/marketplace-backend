'use strict';

import {DB} from '../index.js';
import {
  productVariantWithGender,
  productVariantWithMaleAndFemale,
  productWithNoVariant
} from '../../utils/product-seeder.helper.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */

  const departments = await DB.Department.findAll();
  const productAttributes = await DB.ProductAttribute.findAll();

  await DB.Product.create(
    {
      name: 'ICT Polo',
      description: 'Information and Communication Technology Daily Polo Uniform. For Tertiary (BSIT,BSCS,and BSCpE)',
      image: 'ict.jpg',
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[0].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id)
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
      description: 'Information and Communication Technology Daily Pants Uniform. For Tertiary (BSIT,BSCS,and BSCpE)',
      image: 'ict.jpg',
      type: 'Lower Wear',
      category: 'Uniform',
      departmentId: departments[0].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id)
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
      type: 'Lower Wear',
      category: 'Uniform',
      departmentId: departments[0].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id)
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
      name: 'Senior High Polo',
      description: 'Senior High School Daily White Polo with Gray Vest Uniform. For Senior High Students',
      image: 'sh.jpg',
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id)
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
      type: 'Lower Wear',
      category: 'Uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Male', productAttributes[1].id)
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
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id)
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
      type: 'Lower Wear',
      category: 'Uniform',
      departmentId: departments[5].id,
      productVariant: productVariantWithGender('Female', productAttributes[1].id)
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
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[5].id,
      productVariant: productWithNoVariant(productAttributes[0].id)
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
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[5].id,
      productVariant: productWithNoVariant(productAttributes[0].id)
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
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[6].id,
      productVariant: productWithNoVariant(productAttributes[0].id)
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
      type: 'Lower Wear',
      category: 'Uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id)
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
      name: 'BM Long Sleeve Polo',
      description: 'Business & Management Daily Long Sleeve Polo Uniform. For Tertiary (BSBA)',
      image: 'bm.jpg',
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id)
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
      type: 'Upper Wear',
      category: 'Uniform',
      departmentId: departments[1].id,
      productVariant: productVariantWithMaleAndFemale(productAttributes[1].id)
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

