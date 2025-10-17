import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

export class CarouselAnnouncementImageService {
  static async addCarouselAnnouncement(announcement) {
    return await DB.sequelize.transaction(async (transaction) => {
      return await DB.CarouselAnnouncementImage.create({
        image: announcement.image
      });
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

