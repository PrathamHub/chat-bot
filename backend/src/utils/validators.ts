import { ValidationChain, body, validationResult } from "express-validator";

// Middleware to run validations
export const validate = (validations: ValidationChain[]) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ errors: errors.array() });
  };
};

// Login validator
export const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should contain at least 6 characters"),
];

// Sign up validator
export const signUpValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  ...loginValidator,
];
export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message is required"),
  // ...loginValidator,
];
