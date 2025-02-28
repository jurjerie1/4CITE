import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema, ValidationResult } from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - pseudo
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         pseudo:
 *           type: string
 *         password:
 *           type: string
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     UpdateUser:
 *       type: object
 *       required:
 *         - email
 *         - pseudo
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         pseudo:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: number
 *           default: null
 */

/**
 * Middleware to validate POST requests.
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against.
 * @returns {Function} Middleware function.
 */
export const validatePost = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.body);
      
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      } else {
        next();
      }
    };
  };
  
/**
 * Middleware to validate GET requests.
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against.
 * @returns {Function} Middleware function.
 */
export const validateGet = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error }: ValidationResult = schema.validate(req.query);
      if (error) {
        res.status(400).json({ error: error.details[0].message }); 
      }
      next();
    };
  };

/**
 * Middleware to validate PUT requests.
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against.
 * @returns {Function} Middleware function.
 */
export const validatePut = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error }: ValidationResult = schema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message }); 
      }
      next();
    };
  };

/**
 * Joi schemas for validation.
 */
export const schemas = {
    register: Joi.object({
      email: Joi.string().email().required(),
      pseudo: Joi.string().required(),
      password: Joi.string().required(),
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    updateUser: Joi.object({
      email: Joi.string().email().required(),
      pseudo: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.number().default(null),
    }),
};