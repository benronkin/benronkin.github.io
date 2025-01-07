import { initRecipes } from './recipes.js'
import { initShopping } from './shopping.js'
import { initAuth } from './auth.js'

// ----------------------
// Globals
// ----------------------

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

/* When mode select is changed */
modeSelect.addEventListener('change', (e) => {
  handleModeSelectChange(e)
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  initRecipes()
  initShopping()
  initAuth()
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

// ------------------------
// Helper functions
// ------------------------
