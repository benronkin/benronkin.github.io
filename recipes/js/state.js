let recipes = []
let afterRecipeId = null // for pagination

export const state = {
  // -----------------------
  // pagination
  // -----------------------

  getAfterRecipeId: function () {
    return afterRecipeId
  },

  setAfterRecipeId: function (newAfterRecipeId) {
    afterRecipeId = newAfterRecipeId
  },

  // -----------------------
  // recipes
  // -----------------------

  addRecipe: function (recipe) {
    recipes.push(recipe)
  },

  getRecipeById: function (id) {
    return recipes.find((recipe) => recipe.id === id)
  },

  getRecipes: function () {
    return recipes
  },

  setRecipes: function (newRecipes) {
    recipes = newRecipes
  },

  setRecipeSection: function (id, section, value) {
    const recipe = this.getRecipeById(id)
    recipe[section] = value
  }
}
