const devUrl = 'http://localhost:8787'
const prodUrl = 'https://recipes-cloudflare.ba201220a.workers.dev'

const stateObj = {
  data: {
    recipes: [],
    WEB_APP_URL: prodUrl
  },

  add(key, values) {
    const arr = this.get(key)
    for (let value of values) {
      if (!value) {
        continue
      }
      if (key !== 'recipes') {
        value = value.trim()
      }
      if (!arr.includes(value)) {
        arr.push(value)
      }
    }
    this.set(key, arr)
    return arr
  },

  delete(key, value) {
    if (!value) {
      return
    }
    let arr = this.get(key)
    if (key !== 'recipes') {
      value = value.trim()
      arr = arr.filter((v) => v !== value)
    } else {
      arr = arr.filter((v) => v.id !== value.id)
    }
    this.set(key, arr)
    return arr
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
    console.log(`state.getWebAppUrl is using ${this.data.WEB_APP_URL}`)
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
