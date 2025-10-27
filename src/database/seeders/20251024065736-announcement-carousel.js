'use strict';
import {v4 as uuid} from 'uuid';

import {DB} from '../index.js';
import {ProductService} from '../../services/product.service.js';
import {convertFromSlug} from '../../utils/slug-helper.js';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const product = await ProductService.getProduct(convertFromSlug('ict-daily-blouse'));
  const aquaFlask = await ProductService.getProduct(convertFromSlug('sti-aqua-flask'));
  const itPin = await ProductService.getProduct(convertFromSlug('information-technology-student-pin'));
  await queryInterface.bulkInsert('CarouselAnnouncementImages', [
    {
      id: uuid(),
      image: 'carousel/1761286815670-ryqf8k5hxy.png',
      title: 'Test',
      message: 'test',
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    },
    {
      id: uuid(),
      image: 'carousel/1761286824499-zq1o0lludq.png',
      title: 'Test',
      message: 'test',
      productId: aquaFlask.id,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    },
    {
      id: uuid(),
      image: 'carousel/1761286820659-nuulsmr8q2o.png',
      title: 'Test',
      message: 'test',
      productId: aquaFlask.id,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    },
    {
      id: uuid(),
      image: 'carousel/1761286828486-d4lmmjczskq.png',
      title: 'Test',
      message: 'test',
      productId: itPin.id,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    }
  ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete('CarouselAnnouncementImages', null, {});
}

