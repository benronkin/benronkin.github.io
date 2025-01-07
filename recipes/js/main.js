import { postWebApp, handleTokenQueryParam } from './io.js'
import { state } from './state.js'
import { initRecipes } from './recipes.js'
import { initShopping } from './shopping.js'

// ----------------------
// Globals
// ----------------------

const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const headerEl = document.querySelector('#header')
const modeSelect = document.querySelector('#mode-select')
const shoppingContainer = document.querySelector('#shopping-container')
const recipesContainer = document.querySelector('#recipes-container')

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

/* When fetching recipes fail */
document.addEventListener('recipes-fetch-fail', () => {
  loginContainer.classList.remove('hidden')
  headerEl.classList.add('hidden')
  recipeLinksPanel.classList.add('hidden')
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  window.state = state // avail `state` in browser console for debugging
  initRecipes()
  initShopping()
  handleTokenQueryParam()
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

// ------------------------
// Helper functions
// ------------------------
