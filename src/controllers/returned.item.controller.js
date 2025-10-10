import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {ReturnedItemService} from '../services/returned.items.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

export const createReturnItem = async (req, res) => {
  try {
    await ReturnedItemService.createReturnedItem(req.body);
    return res.status(200).json({message: 'Program create successfully'});
  } catch (error) {
    const message = 'Failed to create program';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const restoreReturnedItems = async (req, res) => {
  const {returnItemId} = req.params;
  try {
    await ReturnedItemService.restoreReturnedItem(returnItemId);
    return res.status(200).json({message: 'Program deleted successfully'});
  } catch (error) {
    const message = 'Failed to delete program';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const updateReturnItemQuantity = async (req, res) => {
  const {returnItemId} = req.params;
  const {quantity} = req.body;

  try {
    await ReturnedItemService.updateReturnedItemQuantity(returnItemId, quantity);
    return res.status(200).json({message: 'Program update successfully'});
  } catch (error) {
    const message = 'Failed to update program';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const getReturnItems = async (req, res) => {
  try {
    const program = await ReturnedItemService.getReturnedItems(req.query);
    return res.status(200).json({message: 'Program retrieve successfully', data: program});
  } catch (error) {
    const message = 'Failed to get programs';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

