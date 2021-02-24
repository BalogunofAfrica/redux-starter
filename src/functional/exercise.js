import { pipe } from "lodash/fp";

// Question 1
const input = { tag: "JAVASCRIPT" };

const getTag = ({ tag }) => tag;
const toLower = (str) => str.toLowerCase();
const wrap = (open, close) => (str) => `${open}${str}${close}`;
const transform = pipe(getTag, toLower, wrap("(", ")"));

console.log(transform(input));

// Question 2
const recipe = {
  name: "Spaghetti Bolognese",
  ingredients: ["egg", "salt"],
};

// Add a new ingridient
const newRecipe = { ...recipe, ingredients: [...recipe.ingredients, "cream"] };

console.log(newRecipe);

// Replace egg with egg white
const newIngredient = recipe.ingredients.map((ingridient) =>
  ingridient === "egg" ? "egg white" : recipe
);
const newRecipe1 = { ...recipe, ingredients: newIngredient };

console.log(newRecipe1);

// Remove ingredient egg
const newIngredient1 = recipe.ingredients.filter(
  (ingredient) => ingredient != "egg"
);
const newRecipe2 = { ...recipe, ingredients: newIngredient1 };

console.log(newRecipe2);
