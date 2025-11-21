import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {validate} from 'uuid';
export class CarouselAnnouncementImageService {
  static async addCarouselAnnouncement(announcement) {
    return await DB.sequelize.transaction(async (transaction) => {
      let productId = announcement.productId;
      if (!announcement.productId || !validate(announcement.productId)) {
        productId = null;
      }
      let message = announcement.message;
      if (!announcement.message || announcement.message.trim() === '' || announcement.message.trim() === ' ') {
        message = null;
      }
      return await DB.CarouselAnnouncementImage.create(
        {title: announcement.title, productId, message, image: announcement.image},
        {
          transaction
        }
      );
    });
  }
  static async updateAnnouncementCarousel(announcementId, announcementData) {
    return await DB.sequelize.transaction(async (transaction) => {
      const announcement = await DB.CarouselAnnouncementImage.findByPk(announcementId, {
        transaction
      });
      if (!announcement) throw new NotFoundException('announcement not found');
      let productId = announcementData.productId;
      if (!announcementData.productId || !validate(announcementData.productId)) {
        productId = null;
      }
      let message = announcementData.message;
      if (
        !announcementData.message ||
        announcementData.message.trim() === '' ||
        announcementData.message.trim() === ' '
      ) {
        message = null;
      }

      await announcement.update(
        {title: announcementData.title, productId, message, image: announcementData.image},
        {transaction}
      );
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
    if (query.search) {
      const search = query.search.trim();
      where[Op.or] = [{title: {[Op.iLike]: `%${search}%`}}, {message: {[Op.iLike]: `%${search}%`}}];
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
  static async getCarouselAnnouncementById(id) {
    const carouselAnnouncementImages = await DB.CarouselAnnouncementImage.findByPk(id, {
      include: [
        {
          model: DB.Product,
          as: 'product'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return carouselAnnouncementImages;
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

