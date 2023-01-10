import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  cover: {
    in: ["body"],
    isURL: {
      errorMessage: "Category is a mandatory field and needs to be a url!",
    },
  },
  "readTime.value": {
    in: ["body"],
    isInt: {
      errorMessage: "Category is a mandatory field and needs to be a number!",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  "author.avatar": {
    in: ["body"],
    isURL: {
      errorMessage: "Category is a mandatory field and needs to be a url!",
    },
  },
  content: "HTML",
};

export const checkblogSchema = checkSchema(blogSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during blog validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
