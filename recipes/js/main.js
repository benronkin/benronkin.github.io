import { handleTokenQueryParam, getWebApp } from './io.js'
import { initRecipes } from './recipes.js'
import { initShopping } from './shopping.js'
import { initUi, activateUi, setMessage } from './ui.js'

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
  handleTokenQueryParam()
  initUi()

  const { recipes, shoppingList, shoppingSuggestions, token, error } =
    await getWebApp(`${state.getWebAppUrl()}?path=session-opener`)

  if (error) {
    setMessage(error)
    document.dispatchEvent(new CustomEvent('fetch-fail'))
    return { error }
  }

  if (token) {
    localStorage.setItem('token', token)
  }

  initRecipes(recipes)
  initShopping(shoppingList, shoppingSuggestions)
  activateUi()
}
