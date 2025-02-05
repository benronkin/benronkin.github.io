import { handleTokenQueryParam, getWebApp } from './io.js'
import { initRecipes } from './recipes.js'
import { initShopping } from './shopping.js'
import { initUi, activateUi, setMessage } from './ui.js'

// ----------------------
// Globals
// ----------------------
const loginContainer = document.querySelector('#login-container')
const headerEl = document.querySelector('#header')

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

  handleTokenQueryParam()

  const token = urlParams.get('token')
  if (!token) {
    console.log('handleDOMContentLoaded: no token')
    loginContainer.classList.remove('hidden')
    headerEl.classList.add('hidden')
    setMessage('Pleases log in to authenticate')
    return
  }

  const { recipes, shoppingList, shoppingSuggestions, error } = await getWebApp(
    `${state.getWebAppUrl()}/session-opener`
  )

  if (error) {
    setMessage(error)
    document.dispatchEvent(new CustomEvent('fetch-fail'))
    return { error }
  }

  initRecipes(recipes)
  initShopping(shoppingList, shoppingSuggestions)
  activateUi()
}
