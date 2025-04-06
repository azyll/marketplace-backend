// @ts-check

import {DatabaseError} from 'sequelize';
import {NotFoundException} from '../exceptions/notFound.js';
import {OrderService} from '../services/order.service.js';

/**
 * @typedef {import("../types/index.js").TOrderItem} TOrderItem
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 */

/**
 * Post => Create order
 * @param {import('express').Request<{studentId:string},{},{orderItems:TOrderItem[]}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const createOrder = async (req, res) => {
  const {studentId} = req.params;
  const {orderItems} = req.body;
  try {
    const order = await OrderService.createOrder(studentId, orderItems);
    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error?.message || 'error', error});
    }
    return res.status(400).json({message: 'error', error});
  }
};

/**
 * Get => All orders
 * @param {import('express').Request<{},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const getOrders = async (req, res) => {
  const query = req.query;
  try {
    const result = await OrderService.getOrders(query);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    return res.status(400).json({message: 'error', error});
  }
};

/**
 * Get => A single order
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const getOrder = async (req, res) => {
  const {orderId} = req.params;
  try {
    const result = await OrderService.getOrder(orderId);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error?.message || 'error', error});
    }
    if (error instanceof DatabaseError) {
      return res.status(404).json({message: 'Invalid Credential //Cannot Convert string to uuid', error});
    }
    return res.status(400).json({message: 'error', error});
  }
};

/**
 * Get => All orders of student
 * @param {import('express').Request<{studentId:string},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const getStudentOrder = async (req, res) => {
  const {studentId} = req.params;
  const query = req.query;
  try {
    const result = await OrderService.getStudentOrders(studentId, query);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error?.message || 'error', error});
    }
    return res.status(400).json({message: 'error', error});
  }
};

/**
 * Put => Update student order
 * @param {import('express').Request<{studentId:string},{},
 * {orderId:string,newStatus:"completed"| "ongoing"| "failed"}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const updateOrderStatus = async (req, res) => {
  const {studentId} = req.params;
  const {orderId, newStatus} = req.body;

  try {
    const result = await OrderService.updateOrderStatus(studentId, orderId, newStatus);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    return res.status(400).json({message: 'error', error});
  }
};

/**
 * Put => Update student order items
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const updateStudentOrder = async (req, res) => {
  const {studentId} = req.params;
  const {orderId, updateData} = req.body;

  try {
    const result = await OrderService.updateOrderStatus(studentId, orderId, updateData);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error?.message || 'error', error});
    }
    return res.status(400).json({message: 'error', error});
  }
};
/**
 * Delete => Archive / delete/ cancel student order
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const deleteStudentOrder = async (req, res) => {
  const {studentId} = req.params;
  const {orderId} = req.body;
  try {
    const result = await OrderService.archiveStudentOrder(studentId, orderId);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    return res.status(400).json({message: 'error', error});
  }
};
