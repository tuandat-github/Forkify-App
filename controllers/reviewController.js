import Review from "../models/reviewModel.js";
// import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";

export const getAllReviews = factory.getAll(Review);

export const setRecipeUserIds = (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.recipeId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const createReview = factory.createOne(Review);
export const deleteReview = factory.deleteOne(Review);
export const updateReview = factory.updateOne(Review);
export const getReview = factory.getOne(Review);
