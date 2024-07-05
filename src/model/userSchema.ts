import Joi from "joi";

const userSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required(),
  password: Joi.string().min(8).required(),
});

export default userSchema;
