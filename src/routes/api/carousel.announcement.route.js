import express from 'express';
import {login} from '../../controllers/auth.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import {
  createCarouselAnnouncement,
  deleteCarouselAnnouncement,
  getArchivedCarouselAnnouncement,
  getCarouselAnnouncement,
  getCarouselAnnouncementById,
  restoreCarouselAnnouncement,
  updateAnnouncementCarousel
} from '../../controllers/carousel.announcement.controller.js';
import {uploadFormData} from '../../middleware/upload-image-formdata.js';
import {uploadCarouselImageFormData} from '../../middleware/upload-carousel-image-formdata.js';
import {auth} from '../../middleware/auth.js';

const router = express.Router();

// User Login
router.post('/', auth(['admin', 'employee']), uploadCarouselImageFormData(), createCarouselAnnouncement);
router.delete('/:id', auth(['admin', 'employee']), deleteCarouselAnnouncement);
router.put('/:id/update', auth(['admin', 'employee']), uploadCarouselImageFormData(), updateAnnouncementCarousel);
router.put('/:id', auth(['admin', 'employee']), restoreCarouselAnnouncement);
router.get('/archived', auth(['admin', 'employee', 'student']), getArchivedCarouselAnnouncement);
router.get('/:id', auth(['admin', 'employee', 'student']), getCarouselAnnouncementById);
router.get('/', getCarouselAnnouncement);

export default router;

