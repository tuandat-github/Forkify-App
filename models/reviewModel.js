import mongoose from "mongoose";
import Recipe from "./recipeModel.js";

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Revuew can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: { type: Date, default: Date.now },
    recipe: {
      type: mongoose.Schema.ObjectId,
      ref: "Recipe",
      required: [true, "Review must belong to a recipe."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (recipeId) {
  const stats = await this.aggregate([
    {
      $match: { recipe: recipeId },
    },
    {
      $group: {
        _id: "$recipe",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Recipe.findByIdAndUpdate(recipeId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Recipe.findByIdAndUpdate(recipeId, {
      ratingsAverage: 4,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.recipe);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.recipe);
});

export default mongoose.model("Review", reviewSchema);
