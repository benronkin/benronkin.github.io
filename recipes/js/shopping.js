import { getWebAppData, postWebApp } from './io.js'
import { resizeTextarea } from './ui.js'
import { state } from './state.js'

// ----------------------
// Globals
// ----------------------

const shoppingEl = document.querySelector('#shopping-list')

// ----------------------
// Exported functions
// ----------------------
/**
 * Set recipe event listeners
 */
export async function initShopping() {
  /* When shopping list changes */
  shoppingEl.addEventListener('change', (e) => {
    handleShoppingListChange(e)
  })

  const { shopping, token, error } = await getWebAppData(`${state.getWebAppUrl()}?path=shopping`)
  if (error) {
    console.log(`getShoppingList error: ${error}`)
    return { error }
  }
  if (token) {
    localStorage.setItem('token', token)
  }
  shoppingEl.value = shopping
}

// ------------------------
// Event handler functions
// ------------------------

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
