import joi from "joi";

const clientSchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
});

export default clientSchema;
