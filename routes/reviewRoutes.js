import express from "express";
import * as authController from "../controllers/authController.js";
import * as reviewController from "../controllers/reviewController.js";

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setRecipeUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
