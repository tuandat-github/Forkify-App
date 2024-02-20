import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    publisher: {
      type: String,
      required: [true, "A recipe must have a publisher"],
      minLength: [2, "A recipe must have more or equal 2 characters"],
      maxLength: [40, "A recipe must have less or equal 40 characters"],
    },
    ingredients: [
      {
        quantity: {
          type: Number,
        },
        unit: {
          type: String,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    image: {
      type: String,
      required: [true, "A recipe must have a image"],
    },
    title: {
      type: String,
      required: [true, "A recipe must have a title"],
      minLength: [2, "A recipe must have more or equal 10 characters"],
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    sourceUrl: String,
    servings: {
      type: Number,
      min: 1,
      required: [true, "A recipe must have the number of servings"],
    },
    cookingTime: {
      type: Number,
      required: [true, "A recipe must have the cooking time"],
      min: 1,
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    meal: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

recipeSchema.index({ cookingTime: 1 });
recipeSchema.index({ meal: 1 });

recipeSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "recipe",
  localField: "_id",
});

recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creatorId",
    select: "-__v -passwordChangedAt",
  });
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
