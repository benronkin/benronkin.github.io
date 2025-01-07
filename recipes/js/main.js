import { getWebAppData, postWebApp, handleTokenQueryParam } from './io.js'
import { state } from './state.js'
import { setRecipeEventListeners, populateRecipes, getLatestRecipes } from './recipes.js' // set recipe event listeners implicitly

// ----------------------
// Globals
// ----------------------

const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const headerEl = document.querySelector('#header')
const modeSelect = document.querySelector('#mode-select')
const shoppingContainer = document.querySelector('#shopping-container')
const shoppingEl = document.querySelector('#shopping-list')
const recipesContainer = document.querySelector('#recipes-container')
const recipeLinksPanel = document.querySelector('#recipe-links-panel')

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleDOMContentLoaded()
})

/* When login form is submitted */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  handleLoginFormSubmit()
})

/* When mode select is changed */
modeSelect.addEventListener('change', (e) => {
  handleModeSelectChange(e)
})

/* When shopping list changes */
shoppingEl.addEventListener('change', (e) => {
  handleShoppingListChange(e)
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  window.state = state // avail `state` in browser console for debugging

  setRecipeEventListeners()

  handleTokenQueryParam()
  const { recipes, error } = await getLatestRecipes()

  if (error) {
    loginContainer.classList.remove('hidden')
    headerEl.classList.add('hidden')
    recipeLinksPanel.classList.add('hidden')
    return
  }
  state.setRecipes(recipes)
  populateRecipes()
  const shopping = await getShoppingList()
  shoppingEl.value = shopping
}

/**
 * Handle mode select change
 */
function handleModeSelectChange(e) {
  const mode = e.target.value
  if (mode === 'recipes') {
    recipesContainer.classList.remove('hidden')
    shoppingContainer.classList.add('hidden')
  } else {
    recipesContainer.classList.add('hidden')
    shoppingContainer.classList.remove('hidden')
  }
}

/**
 * Handle form submit
 */
async function handleLoginFormSubmit() {
  const formData = new FormData(loginForm)
  const email = formData.get('email')
  try {
    const { error, ...rest } = await postWebApp(state.getWebAppUrl(), {
      email,
      path: 'login'
    })
    if (error) {
      throw new Error(error)
    }
    console.log(rest)
  } catch (err) {
    console.log(err)
  }
}

/**
 * Handle shopping list change
 */
async function handleShoppingListChange(e) {
  const { value } = e.target
  try {
    const { message, error } = await postWebApp(state.getWebAppUrl(), {
      path: 'shopping-update',
      value
    })
    if (error) {
      throw new Error(error)
    }
    console.log(message)
  } catch (err) {
    console.log(err)
  }
}

// ------------------------
// Shopping functions
// ------------------------

/**
 * Get the shopping list
 */
async function getShoppingList() {
  const { shopping, token, error } = await getWebAppData(`${state.getWebAppUrl()}?path=shopping`)
  if (error) {
    console.log(`getShoppingList error: ${error}`)
    return { error }
  }
  if (token) {
    localStorage.setItem('token', token)
  }
  return shopping
}

// ------------------------
// Helper functions
// ------------------------
