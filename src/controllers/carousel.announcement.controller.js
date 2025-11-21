import {CarouselAnnouncementImageService} from '../services/carousel.announcement.service.js';

export async function createCarouselAnnouncement(req, res) {
  try {
    const image = await CarouselAnnouncementImageService.addCarouselAnnouncement(req.body);

    return res.status(200).json(image);
  } catch (error) {
    const message = 'Failed to create announcement image';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}
export async function getCarouselAnnouncement(req, res) {
  try {
    const carouselImages = await CarouselAnnouncementImageService.getCarouselAnnouncement(req.query);

    return res.status(200).json({...carouselImages});
  } catch (error) {
    const message = 'Failed retrieve carousel announcement images';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}
export async function getCarouselAnnouncementById(req, res) {
  try {
    const carouselImage = await CarouselAnnouncementImageService.getCarouselAnnouncementById(req.params.id);

    return res.status(200).json(carouselImage);
  } catch (error) {
    const message = 'Failed retrieve carousel announcement images';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}
export async function getArchivedCarouselAnnouncement(req, res) {
  try {
    const carouselImages = await CarouselAnnouncementImageService.getArchivedCarouselAnnouncement();

    return res.status(200).json({data: carouselImages});
  } catch (error) {
    const message = 'Failed retrieve carousel announcement images';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}
export async function deleteCarouselAnnouncement(req, res) {
  try {
    const {id} = req.params;

    const removeCarouselAnnouncement = await CarouselAnnouncementImageService.removeCarouselAnnouncement(id);

    return res.status(200).json(removeCarouselAnnouncement);
  } catch (error) {
    const message = 'Failed to delete carousel announcement images';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}
export async function restoreCarouselAnnouncement(req, res) {
  try {
    const {id} = req.params;

    const removeCarouselAnnouncement = await CarouselAnnouncementImageService.restoreCarouselAnnouncement(id);

    return res.status(200).json(removeCarouselAnnouncement);
  } catch (error) {
    const message = 'Failed to delete carousel announcement images';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}
export async function updateAnnouncementCarousel(req, res) {
  try {
    const {id} = req.params;

    const removeCarouselAnnouncement = await CarouselAnnouncementImageService.updateAnnouncementCarousel(id, req.body);

    return res.status(200).json(removeCarouselAnnouncement);
  } catch (error) {
    const message = 'Failed to delete carousel announcement images';

    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
}

