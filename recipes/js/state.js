let recipes = []
let afterRecipeId = null // for pagination to be implemented later
const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbzUYReY4jAwZ0m_jbW1WUPGJxsGtZqJO3QwhxNIn-uOnLHQoCdztG0NHjDbNdZ4QDd5/exec'

const stateObj = {
  // -----------------------
  // misc
  // -----------------------

  getWebAppUrl: function () {
    return WEB_APP_URL
  },

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

// Make `state` globally accessible via `window` for debugging
if (typeof window !== 'undefined') {
  window.state = stateObj
}

export const state = stateObj
