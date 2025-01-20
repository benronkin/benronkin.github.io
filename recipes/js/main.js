import { initRecipes } from './recipes.js'
import { initShopping } from './shopping.js'
import { initAuth } from './auth.js'
import { initUi, activateUi, setMessage } from './ui.js'

// ----------------------
// Globals
// ----------------------

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleDOMContentLoaded()
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  initUi()
  initAuth()
  // parallel execution of async functions
  const [recipesResult, shoppingResult] = await Promise.all([initRecipes(), initShopping()])
  const error = recipesResult.error || shoppingResult.error
  if (error) {
    setMessage(error)
    return
  }
  activateUi()
}

// ------------------------
// Helper functions
// ------------------------
