import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema, ValidationResult } from 'joi';

export const validatePost = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error }: ValidationResult = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  };
  
  export const validateGet = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error }: ValidationResult = schema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.details[0].message }); 
      }
      next();
    };
  };

  export const schemas = {
    register: Joi.object({
      email: Joi.string().email().required(),
      pseudo: Joi.string().required(),
      password: Joi.string().required(),
    }),
  };