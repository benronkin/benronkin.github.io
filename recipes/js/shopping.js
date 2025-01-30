import { postWebApp } from './io.js'
import { state } from './state.js'
import { setMessage } from './ui.js'
import { makeDragStyles, enableDragContainers, enableDragging, disableDragging } from './drag.js'

// ----------------------
// Globals
// ----------------------

const modeSelect = document.querySelector('#mode-select')
const shoppingForm = document.querySelector('#shopping-form')
const shoppingInput = document.querySelector('#shopping-input')
const shoppingContainer = document.querySelector('#shopping-container')
const shoppingDiv = document.querySelector('#shopping-div')
const suggestionsContainer = document.querySelector('#shopping-suggestions')
const suggestSwitch = document.querySelector('#suggest-switch')
const sortSwitch = document.querySelector('#sort-switch')

// ----------------------
// Exported functions
// ----------------------

/**
 * Set recipe event listeners
 */
export async function initShopping(shoppingList, shoppingSuggestions) {
  makeDragStyles()
  enableDragContainers()
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

/* when sort switch is clicked */
sortSwitch.addEventListener('click', handleSortSwitchClick)

/* when suggest switch is clicked */
suggestSwitch.addEventListener('click', handleSuggestSwitchClick)

/* when shopping list changes */
document.addEventListener('list-changed', handleShoppingListChange)

/* when clearSelection is dispatched */
document.addEventListener('clear-selection', clearSelection)

/* when shopping input key is pressed */
shoppingInput.addEventListener('keyup', (e) => {
  if (shoppingInput.value.trim() === '') {
    shoppingInput.dataset.index = ''
    document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))
  }
})

/* when shopping form is submitted */
shoppingForm.addEventListener('submit', (e) => handleShoppingFormSubmit(e, 'prepend'))

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle sort switch click
 */
function handleSortSwitchClick() {
  sortSwitch.classList.toggle('on')
  const shoppingItems = document.querySelectorAll('.shopping-item')
  const shoppingTrashes = document.querySelectorAll('i.fa-trash')
  const shoppingBars = document.querySelectorAll('#shopping-container i.fa-bars')

  if (sortSwitch.classList.contains('on')) {
    enableDragging()
    clearSelection()
    shoppingBars.forEach((el) => el.classList.remove('hidden'))
    shoppingItems.forEach((el) => el.removeEventListener('click', handleShoppingItemClick))
    shoppingTrashes.forEach((el) => el.removeEventListener('click', handleShoppingTrashClick))
  } else {
    disableDragging()
    shoppingBars.forEach((el) => el.classList.add('hidden'))
    shoppingItems.forEach((el) => el.addEventListener('click', handleShoppingItemClick))
    shoppingTrashes.forEach((el) => el.addEventListener('click', handleShoppingTrashClick))
  }
}

/**
 * handle suggest switch click
 */
function handleSuggestSwitchClick() {
  clearSelection()
  suggestSwitch.classList.toggle('on')
  suggestionsContainer.classList.toggle('hidden')
  displaySuggestions()
}

/**
 * Handle shopping form submit
 */
function handleShoppingFormSubmit(e, prepend) {
  e.preventDefault()
  setMessage('')

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

    addShoppingItemToList(value, prepend)
  }
  document.dispatchEvent(new CustomEvent('list-changed'))
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

/**
 *
 */
function handleShoppingItemClick(e) {
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
  // shoppingInput.focus()
}

/**
 * Handle shopping item trash click
 */
function handleShoppingTrashClick(e) {
  e.stopPropagation()
  e.target.closest('.shopping-item').remove()
  clearSelection()
  document.dispatchEvent(new CustomEvent('list-changed'))
  displaySuggestions()
}

/**
 * Handle suggestion item click
 */
function handleSuggestionItemClick(e) {
  const div = e.target.closest('.shopping-suggestion')
  div.querySelector('.fa-trash').classList.toggle('hidden')
}

/**
 * Handle suggestion plus click
 */
function handleSuggestionPlusClick(e) {
  const div = e.target.closest('.shopping-suggestion')
  addShoppingItemToList(div.innerText, 'prepend')
  div.remove()
}

/**
 * Handle suggestion trash click
 */
function handleSuggestionTrashClick(e) {
  const div = e.target.closest('.shopping-suggestion')
  const item = div.textContent
  div.remove()
  let localStorageSuggestions = (localStorage.getItem('shopping-suggestions') || '').split(',')
  localStorageSuggestions = localStorageSuggestions.filter((i) => i !== item)
  localStorage.setItem('shopping-suggestions', localStorageSuggestions)
  postWebApp(state.getWebAppUrl(), {
    path: 'shopping-suggestions-update',
    value: localStorageSuggestions
  })
}

// ------------------------
// Helpers
// ------------------------

/**
 * Create a shopping item element
 */
function createShoppingItem(item) {
  const div = document.createElement('div')
  div.classList.add('shopping-item')
  div.id = generateUUID()
  div.innerHTML = `
    <div><i class="fa-solid fa-bars hidden"></i><span>${item.toString().trim().toLowerCase()}</span></div>
    <i class="fa fa-trash hidden"></i>`

  div.addEventListener('click', handleShoppingItemClick)
  div.querySelector('i.fa-trash').addEventListener('click', handleShoppingTrashClick)
  return div
}

/**
 * Create a shopping suggestion element
 */
function createShoppingSuggestion(item) {
  const div = document.createElement('DIV')
  div.classList.add('shopping-suggestion')
  div.innerHTML = `<div><i class="fa-solid fa-plus"></i><span>${item}</span></div>
    <i class="fa fa-trash hidden"></i>`

  div.addEventListener('click', handleSuggestionItemClick)
  div.querySelector('.fa-plus').addEventListener('click', handleSuggestionPlusClick)
  div.querySelector('.fa-trash').addEventListener('click', handleSuggestionTrashClick)
  return div
}

/**
 * Add shopping item to list
 */
function addShoppingItemToList(value, prepend) {
  const shoppingItem = createShoppingItem(value)
  if (prepend) {
    shoppingDiv.insertBefore(shoppingItem, shoppingDiv.firstChild)
  } else {
    shoppingDiv.appendChild(shoppingItem)
  }
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
function displaySuggestions() {
  let suggestions = localStorage.getItem('shopping-suggestions')
  if (suggestions) {
    suggestions = suggestions.split(',').filter((s) => s.toString().trim().length > 1)
  } else {
    suggestions = ['apples', 'carrots', 'berries']
  }
  suggestionsContainer.innerHTML = ''
  const shoppingItems = getShoppingListItems()
  suggestions = suggestions.filter((s) => !shoppingItems.includes(s))
  suggestions.sort()
  for (const s of suggestions) {
    const div = createShoppingSuggestion(s)
    suggestionsContainer.appendChild(div)
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
