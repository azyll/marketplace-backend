import {DatabaseError} from 'sequelize';
import {NotFoundException} from '../exceptions/notFound.js';
import {OrderService} from '../services/order.service.js';

import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {defaultErrorMessage} from '../utils/error-message.js';

export const createOrder = async (req, res) => {
  const {userId} = req.params;
  const {orderItems} = req.body;
  const {orderType} = req.query;
  try {
    const order = await OrderService.createOrder(userId, orderItems, orderType);
    return res.status(200).json({message: 'Order created successfully', data: order});
  } catch (error) {
    console.log('error', error);
    const message = 'Failed to create an order';
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

export const getOrders = async (req, res) => {
  const query = req.query;
  try {
    const data = await OrderService.getOrders(query);
    return res.status(200).json({message: 'Orders retrieve successfully', ...data});
  } catch (error) {
    const message = 'Failed to get orders';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

export const getOrder = async (req, res) => {
  const {orderId} = req.params;
  try {
    const data = await OrderService.getOrder(orderId);
    return res.status(200).json({message: 'Order retrieve successfully', data});
  } catch (error) {
    const message = 'Failed to get an order';
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

export const getStudentOrder = async (req, res) => {
  const {userId} = req.params;
  const query = req.query;
  try {
    const data = await OrderService.getStudentOrders(userId, query);
    return res.status(200).json({message: 'Order created successfully', ...data});
  } catch (error) {
    const message = 'Failed to get student order';
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

export const getAnnualOrders = async (req, res) => {
  try {
    const data = await OrderService.getOrdersPerMonth();
    return res.status(200).json({message: 'Annual Orders retrieve successfully', data});
  } catch (error) {
    const message = 'Failed to get annual orders';
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

export const updateOrderStatus = async (req, res) => {
  const {userId} = req.params;
  const {orderId, newStatus, oracleInvoice} = req.body;

  try {
    await OrderService.updateOrderStatus(userId, orderId, newStatus, oracleInvoice);
    return res.status(200).json({message: 'Order update successfully'});
  } catch (error) {
    const message = 'Failed to update order status';
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

export const deleteStudentOrder = async (req, res) => {
  const {userId} = req.params;
  const {orderId} = req.body;
  try {
    const data = await OrderService.archiveStudentOrder(userId, orderId);
    return res.status(200).json({message: 'Order delete successfully', data});
  } catch (error) {
    const message = 'Failed to delete student order';
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

/**
 *  Update student order items
 *  *Suggestion ni sir bern nung mini capstone defense
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const updateStudentOrder = async (req, res) => {
  const {userId} = req.params;
  const {orderId, updateData} = req.body;

  try {
    const data = await OrderService.updateStudentOrder(userId, orderId, updateData);
    return res.status(200).json({message: 'Order update successfully', data});
  } catch (error) {
    const message = 'Failed to update student order';
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
