import { initRecipes } from './recipes.js'
import { initShopping } from './shopping.js'
import { initAuth } from './auth.js'
import { initUi } from './ui.js'

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
  initAuth()
  initRecipes()
  initShopping()
  initUi()
}

// ------------------------
// Helper functions
// ------------------------
