import { postWebApp } from './io.js'
import { state } from './state.js'
import { setMessage } from './ui.js'
import { initDragging, makeElementDraggable } from './drag.js'

// ----------------------
// Globals
// ----------------------

const modeSelect = document.querySelector('#mode-select')
const shoppingForm = document.querySelector('#shopping-form')
const shoppingInput = document.querySelector('#shopping-input')
const shoppingContainer = document.querySelector('#shopping-container')
const shoppingDiv = document.querySelector('#shopping-div')
const suggestionsSwitch = document.querySelector('#suggestions-switch')
const suggestionsEl = document.querySelector('#shopping-suggestions')

// ----------------------
// Exported functions
// ----------------------

/**
 * Set recipe event listeners
 */
export async function initShopping(shoppingList, shoppingSuggestions) {
  initDragging()
  displayShoppingList(shoppingList)
  localStorage.setItem('shopping-suggestions', shoppingSuggestions)
  if (modeSelect.value === 'shopping') {
    shoppingContainer.classList.remove('hidden')
    shoppingInput.focus()
  }
}

/**
 * Add an array of items to the shopping list
 */
export function addItemsToShoppingList(newItems) {
  newItems = newItems.map((item) => item.trim()).filter((item) => item.toString().length > 0)
  // avoid duplicating existing items in shopping list
  const items = getShoppingListItems()
  newItems = newItems.filter((item) => !items.includes(item))
  // append to list
  for (const item of newItems) {
    addShoppingItemToList(item)
  }
  document.dispatchEvent(new CustomEvent('list-changed'))
}

// ------------------------
// Event handler
// ------------------------

/* when suggestions switch is clicked */
suggestionsSwitch.addEventListener('click', () => {
  if (suggestionsSwitch.classList.contains('disabled')) {
    return
  }
  handleSuggestionsSwitchClick()
})

/* when shopping list changes */
document.addEventListener('list-changed', (e) => {
  handleShoppingListChange()
})

/* when clearSelection is dispatched */
document.addEventListener('clear-selection', () => {
  clearSelection()
})

/* when shopping input key is pressed */
shoppingInput.addEventListener('keyup', (e) => {
  if (shoppingInput.value.trim() === '') {
    shoppingInput.dataset.index = ''
    document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))
  }
})

/* when shopping form is submitted */
shoppingForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const itemId = shoppingInput.dataset.index
  const value = shoppingInput.value
  const itemEl = document.getElementById(itemId)

  clearSelection()
  if (itemEl) {
    // existing item is edited
    itemEl.querySelector('span').innerText = value
  } else {
    // new item is added
    if (inShoppingList(value)) {
      setMessage('Already in list')
      return
    }

    addShoppingItemToList(value)
  }
  document.dispatchEvent(new CustomEvent('list-changed'))
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * handle suggestions switch clicks
 */
function handleSuggestionsSwitchClick() {
  suggestionsEl.innerHTML = ''
  suggestionsSwitch.classList.toggle('on')
  if (suggestionsSwitch.classList.contains('on')) {
    let suggestions = localStorage.getItem('shopping-suggestions')
    if (suggestions) {
      suggestions = suggestions.split(',').filter((s) => s.toString().trim().length > 1)
    } else {
      suggestions = ['apples', 'carrots', 'berries']
    }
    displaySuggestions(suggestions)
  }
}

/**
 * Handle shopping list change
 */
async function handleShoppingListChange() {
  const items = getShoppingListItems()
  updateLocalStorageSuggestions(items)
  const value = items.join(',')

  try {
    const { message, error } = await postWebApp(state.getWebAppUrl(), {
      path: 'shopping-list-update',
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
// Helpers
// ------------------------

/**
 *
 */
function createShoppingItem(item) {
  const shoppingItem = document.createElement('div')
  shoppingItem.classList.add('shopping-item')
  shoppingItem.id = generateUUID()
  shoppingItem.innerHTML = `
    <div><i class="fa-solid fa-bars"></i><span>${item.toString().trim().toLowerCase()}</span></div>
    <i class="fa fa-trash hidden"></i>`

  /* when trash icon is clicked */
  shoppingItem.querySelector('i.fa-trash').addEventListener('click', (e) => {
    e.stopPropagation()
    shoppingItem.remove()
    clearSelection()
    document.dispatchEvent(new CustomEvent('list-changed'))
  })

  /* When shopping item is clicked */
  shoppingItem.addEventListener('click', (e) => {
    document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))
    const parent = e.target.closest('.shopping-item')
    parent.classList.toggle('checked')
    if (parent.classList.contains('checked')) {
      shoppingInput.value = parent.innerText
      shoppingInput.dataset.index = parent.id
      parent.querySelector('i.fa-trash').classList.remove('hidden')
    } else {
      clearSelection()
    }
    shoppingInput.focus()
  })

  return shoppingItem
}

/**
 * Add shopping item to list
 */
function addShoppingItemToList(value) {
  let shoppingItem = createShoppingItem(value)
  shoppingItem = makeElementDraggable(shoppingItem)
  shoppingDiv.appendChild(shoppingItem)
}

/**
 * Display shopping list
 */
function displayShoppingList(shoppingList) {
  if (shoppingList.length > 0) {
    const values = shoppingList.split(',')
    addItemsToShoppingList(values)
  }
}

/**
 * Display a list of suggestions
 */
function displaySuggestions(suggestions) {
  const shoppingItems = getShoppingListItems()
  suggestions = suggestions.filter((s) => !shoppingItems.includes(s))
  suggestions.sort()
  for (const s of suggestions) {
    const div = document.createElement('DIV')

    div.innerHTML = `<div class="shopping-suggestion"><div><i class="fa-solid fa-plus"></i><span>${s}</span></div>
    <i class="fa fa-trash hidden"></i></div>`

    suggestionsEl.appendChild(div)

    div.addEventListener('click', () => {
      div.querySelector('.fa-trash').classList.toggle('hidden')
    })

    div.querySelector('.fa-plus').addEventListener('click', () => {
      addShoppingItemToList(s)
      div.remove()
      shoppingInput.focus()
    })

    div.querySelector('.fa-trash').addEventListener('click', async () => {
      const item = div.querySelector('span').innerText
      const items = getShoppingListItems()
        .filter((i) => i !== item)
        .join(',')
      localStorage.setItem('shopping-suggestions', items)
      div.remove()
      await postWebApp(state.getWebAppUrl(), {
        path: 'shopping-suggestions-update',
        value: items
      })
    })
  }
}

/**
 *
 */
function clearSelection() {
  shoppingInput.value = ''
  shoppingInput.dataset.index = ''
  document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))
  document.querySelectorAll('.shopping-item').forEach((el) => el.classList.remove('checked'))
}

/**
 * Create a uuid
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Check if item is in list
 */
function inShoppingList(item) {
  const items = getShoppingListItems()
  return items.includes(item.toString().trim().toLowerCase())
}

/**
 * Get shopping list items
 */
function getShoppingListItems() {
  const items = [...shoppingDiv.querySelectorAll('.shopping-item')].map((el) => el.innerText.toLowerCase().trim())
  return items
}

/**
 * Update local storage suggestions
 */
function updateLocalStorageSuggestions(items) {
  let localStorageSuggestions = (localStorage.getItem('shopping-suggestions') || '').split(',')
  for (const item of items) {
    if (item && !localStorageSuggestions.includes(item)) {
      localStorageSuggestions.push(item)
    }
  }
  localStorage.setItem('shopping-suggestions', localStorageSuggestions.join(','))
}
