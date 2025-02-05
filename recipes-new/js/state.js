const stateObj = {
  data: {
    recipes: [],
    // WEB_APP_URL: 'http://localhost:8787'
    WEB_APP_URL: 'https://recipes-cloudflare.ba201220a.workers.dev'
  },

  get: function (key) {
    return this.data[key]
  },

  set: function (key, value) {
    this.data[key] = value
  },

  push: function (key, value) {
    this.data[key].push(value)
  },

  // -----------------------
  // misc
  // -----------------------

  getWebAppUrl: function () {
    return this.data.WEB_APP_URL
  },

  // -----------------------
  // recipes
  // -----------------------

  getRecipeById: function (id) {
    return this.data.recipes.find((recipe) => recipe.id === id)
  },

  getRecipes: function () {
    return [...this.data.recipes]
  },

  setRecipes: function (newRecipes) {
    this.data.recipes = [...newRecipes]
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
