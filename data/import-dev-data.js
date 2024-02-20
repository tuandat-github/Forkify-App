import mongoosee from "mongoose";
import "dotenv/config.js";
import fs from "fs";
import Recipe from "../models/recipeModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoosee.connect(DB).then(() => {
  console.log("DB connection successful");
});

// READ JSON FILE
const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/recipes.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// Mapping data
const mapping = {
  cooking_time: "cookingTime",
  image_url: "image",
  source_url: "sourceUrl",
};

const updateRecipeProperties = (recipe, mapping) => {
  for (const [oldPro, newPro] of Object.entries(mapping)) {
    recipe[newPro] = recipe[oldPro];
    delete recipe[oldPro];
  }
};

recipes.forEach((recipe) => {
  updateRecipeProperties(recipe, mapping);
});

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Recipe.create(recipes);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);

    console.log("Data sucessfully loaded!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Recipe.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log("Data sucessfully deleted!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
