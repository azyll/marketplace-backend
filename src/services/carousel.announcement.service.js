import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

export class CarouselAnnouncementImageService {
  static async addCarouselAnnouncement(announcement) {
    return await DB.sequelize.transaction(async (transaction) => {
      return await DB.CarouselAnnouncementImage.create(announcement, {
        transaction
      });
    });
  }
  static async updateAnnouncementCarousel(announcementId, announcement) {
    return await DB.sequelize.transaction(async (transaction) => {
      const announcement = await DB.CarouselAnnouncementImage.findByPk(announcementId, {
        transaction
      });

      await announcement.update(announcement, {transaction});
      return announcement;
    });
  }
  static async removeCarouselAnnouncement(id) {
    return await DB.sequelize.transaction(async (transaction) => {
      const announcementImage = await DB.CarouselAnnouncementImage.findByPk(id);
      if (!announcementImage) throw new NotFoundException('Carousel Image not found');
      return await announcementImage.destroy({transaction});
    });
  }
  static async restoreCarouselAnnouncement(id) {
    return await DB.sequelize.transaction(async (transaction) => {
      const announcementImage = await DB.CarouselAnnouncementImage.findByPk(id, {
        transaction,
        paranoid: false
      });
      if (!announcementImage) throw new NotFoundException('Carousel Image not found');
      return await announcementImage.restore({transaction});
    });
  }
  static async getCarouselAnnouncement(query) {
    const where = {};

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    let isAll = false;

    if (query.all === 'true') {
      isAll = true;
    } else if (query.all === 'false') {
      isAll = false;
    }
    if (query.status === 'archived') {
      where.deletedAt = {
        [Op.not]: null
      };
    } else if (query.status === 'active') {
      where.deletedAt = {
        [Op.is]: null
      };
    }

    const carouselAnnouncementImages = await DB.CarouselAnnouncementImage.findAndCountAll({
      distinct: true,
      where,
      paranoid: !isAll,
      offset: (page - 1) * limit,
      include: [
        {
          model: DB.Product,
          as: 'product'
        }
      ],
      limit,
      order: [['createdAt', 'DESC']]
    });
    return {
      data: carouselAnnouncementImages.rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: carouselAnnouncementImages.count
      }
    };
  }
  static async getArchivedCarouselAnnouncement() {
    const carouselAnnouncementImages = await DB.CarouselAnnouncementImage.findAll({
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null
        }
      }
    });
    return carouselAnnouncementImages;
  }
}

