import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

export class CarouselAnnouncementImageService {
  static async addCarouselAnnouncement(announcement) {
    return await DB.sequelize.transaction(async (transaction) => {
      let fields = {
        title: 'A new carousel announcement image added',
        content: 'new carousel image',
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await DB.CarouselAnnouncementImage.create({
        image: announcement.image
      });
    });
  }
  static async removeCarouselAnnouncement(id) {
    return await DB.sequelize.transaction(async (transaction) => {
      const announcementImage = await DB.CarouselAnnouncementImage.findByPk(id);

      if (!announcementImage) throw new NotFoundException('Carousel Image not found');

      let fields = {
        title: 'A  carousel announcement image was put to archive',
        content: 'carousel image was archive',
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
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
      let fields = {
        title: 'A  carousel announcement image was put to active ',
        content: 'carousel image is active',
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await announcementImage.restore({transaction});
    });
  }
  static async getCarouselAnnouncement() {
    const carouselAnnouncementImages = await DB.CarouselAnnouncementImage.findAll();
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

