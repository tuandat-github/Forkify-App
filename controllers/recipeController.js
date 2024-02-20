import Recipe from "../models/recipeModel.js";
// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/appError.js";
// import APIFeatures from "../utils/apiFeatures.js";
import * as factory from "./handlerFactory.js";

export const getAllRecipes = factory.getAll(Recipe);
export const getRecipe = factory.getOne(Recipe, { path: "reviews" });
export const createRecipe = factory.createOne(Recipe);
export const updateRecipe = factory.updateOne(Recipe);
export const deleteRecipe = factory.deleteOne(Recipe);
