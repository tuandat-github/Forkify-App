import express from "express";
import * as authController from "../controllers/authController.js";
import * as recipeController from "../controllers/recipeController.js";
import reviewRouter from "../routes/reviewRoutes.js";

const router = express.Router();

router.use("/:recipeId/reviews", reviewRouter);

router
  .route("/")
  .get(recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .patch(authController.protect, recipeController.updateRecipe)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    recipeController.deleteRecipe
  );

export default router;
