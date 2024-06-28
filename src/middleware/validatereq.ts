import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Middleware to validate request body against Joi schema
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    next();
  };
};

export default validateRequest;
