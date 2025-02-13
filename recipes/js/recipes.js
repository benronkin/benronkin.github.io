import { getWebApp, postWebApp } from './io.js'
import { resizeTextarea, isMobile } from './ui.js'
import { state } from './state.js'
import { filterIngredient, transformIngredient } from './ingredients.js'
import { addItemsToShoppingList } from './shopping.js'
import { MODAL, setDialog } from './modal.js'

// ----------------------
// Globals
// ----------------------

const switchEl = document.querySelector('#related-recipes-switch')
const addRecipeBtn = document.querySelector('#add-recipe')
const shopIngredientsBtn = document.querySelector('#shop-ingredients')
const searchRecipesEl = document.querySelector('#search-recipes')
const searchRecipesMessageEl = document.querySelector('#search-recipes-message')
const recipesContainer = document.querySelector('#recipes-container')
const recipeLinksPanel = document.querySelector('#recipe-links-panel')
const recipesPanel = document.querySelector('#recipes-panel')
const recipesList = document.querySelector('#recipes-list')
const recipeEl = document.querySelector('#recipe')
const recipeTitleEl = document.querySelector('#recipe-title')
const recipeRelated = document.querySelector('#recipe-related')
const relatedRecipesEl = document.querySelector('#related-recipe-links')
const recipeIngredients = document.querySelector('#recipe-ingredients')
const recipeMethod = document.querySelector('#recipe-method')
const recipeNotes = document.querySelector('#recipe-notes')
const recipeCategory = document.querySelector('#recipe-category')
const recipeTags = document.querySelector('#recipe-tags')
const recipeIdEl = document.querySelector('#recipe-id')
const recipeDeleteBtn = document.querySelector('#bottom-btn-group .fa-trash')

// ----------------------
// Exported functions
// ----------------------

/**
 * Set recipe event listeners
 */
export async function initRecipes(recipes) {
  /* When related recipes switch is toggled */
  switchEl.addEventListener('click', handleRelatedSwitchClick)

  /* When recipes container is populated */
  recipesContainer.addEventListener(
    'recipes-loaded',
    handleRecipeContainerPopulated
  )

  /* When add recipe button is clicked */
  addRecipeBtn.addEventListener('click', async () => {
    await handleRecipeCreate()
  })

  /* When shop ingredients button is clicked */
  shopIngredientsBtn.addEventListener('click', async () => {
    handleShopIngredientsClick()
  })

  /* When search recipes input key down */
  searchRecipesEl.addEventListener('keydown', async (e) => {
    await handleRecipeSearch(e)
  })

  /* When recipe field loses focus */
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', (e) => {
      handleFieldChange(e.target)
    })
  })

  /* When related recipe is changed */
  recipeRelated.addEventListener('change', (e) => {
    populateRelatedRecipes(e.target.value)
  })

  /* When the trash recipe button is clicked */
  recipeDeleteBtn.addEventListener('click', handleRecipeDeleteBtnClick)

  /* When a recipe is confirmed delete */
  document.addEventListener('delete-recipe', handleDeleteRecipe)

  /**
   * Handle button click to show delete modal
   */
  function handleRecipeDeleteBtnClick() {
    setDialog({
      type: MODAL.DELETE_RECIPE,
      header: 'Delete recipe',
      body: `Delete the ${recipeTitleEl.value} recipe?`,
      id: recipeIdEl.innerText
    })
    const dialog = document.querySelector('dialog')
    dialog.showModal()
  }

  /**
   * Handle delete recipe confirmation
   */
  async function handleDeleteRecipe(e) {
    const modalMessageEl = document.querySelector('#modal-message')
    modalMessageEl.innerText = ''
    const id = e.detail.id
    const password = document.querySelector('#modal-delete-input').value
    const { error } = await getWebApp(
      `${state.getWebAppUrl()}/recipe-delete?id=${id}&password=${password}`
    )

    if (error) {
      modalMessageEl.innerText = error
      return
    }
    state.delete('recipes', id)
    const tab = document.querySelector('.tab.active')
    handleTabCloseClick(tab)
    document.querySelector(`.recipe-link[data-id="${id}"`).remove()
    console.log(`handleDeleteRecipe message: ${message}`)
    document.querySelector('dialog').close()
  }

  state.setRecipes(recipes)
  populateRecipes()
}

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle related switch click
 */
function handleRelatedSwitchClick() {
  switchEl.classList.toggle('on')
  recipeRelated.classList.toggle('hidden')
  resizeTextarea(recipeRelated)
}

/**
 * Handle recipe container populated
 */
function handleRecipeContainerPopulated() {
  const recipeLinks = document.querySelectorAll('.recipe-link')
  for (const recipeLink of recipeLinks) {
    recipeLink.addEventListener('click', async (e) => {
      handleRecipeLinkClick(e.target)
    })
  }
}

/**
 * Handle recipe create
 */
async function handleRecipeCreate() {
  addRecipeBtn.disabled = true
  addRecipeBtn.textContent = 'Creating...'
  const { id } = await getWebApp(`${state.getWebAppUrl()}/recipe-create`)

  const newRecipe = {
    id,
    title: 'New recipe',
    ingredients: '',
    method: '',
    notes: '',
    category: '',
    tags: '',
    related: ''
  }
  state.push('recipes', newRecipe)

  const li = makeRecipeLinkEl(id, newRecipe.title)
  recipesList.appendChild(li)
  li.click()
  addRecipeBtn.disabled = false
  addRecipeBtn.textContent = 'New recipe'
}

/**
 * Handle recipe search
 */
async function handleRecipeSearch(e) {
  if (e.key !== 'Enter') {
    return
  }
  const value = e.target.value.toLowerCase().trim()
  if (value.length === 0) {
    return
  }
  searchRecipesMessageEl.textContent = 'Searching...'
  const { recipes } = await getSearchedRecipes(value)
  if (recipes.length === 0) {
    searchRecipesMessageEl.textContent = 'No recipes found'
  } else {
    searchRecipesMessageEl.textContent = ''
  }
  const openRecipes = getOpenRecipes()
  state.setRecipes([...openRecipes, ...recipes])
  populateRecipes()
}

/**
 * Handle recipe field change
 */
async function handleFieldChange(elem) {
  // const recipeSection = elem.id.replace('recipe-', '')
  const recipeSection = elem.name
  if (recipeSection === 'title') {
    document
      .querySelector('.tab.active')
      .querySelector('.text-tab').textContent = elem.value
    document.querySelector('.recipe-link.active').textContent = elem.value
  }
  const id = recipeIdEl.textContent
  state.setRecipeSection(id, recipeSection, elem.value)

  try {
    const { message, error } = await postWebApp(
      `${state.getWebAppUrl()}/recipe-update`,
      {
        id,
        value: elem.value,
        section: recipeSection
      }
    )
    if (error) {
      throw new Error(error)
    }
    console.log(message)
  } catch (err) {
    console.log(err)
  }
}

/**
 * Handle recipe link click
 */
async function handleRecipeLinkClick(elem) {
  shopIngredientsBtn.classList.remove('hidden')
  shopIngredientsBtn.disabled = false
  document.querySelector('.recipe-link.active')?.classList.remove('active')

  // hide the left panel if mobile
  if (isMobile()) {
    recipeLinksPanel.classList.add('hidden')
  }

  // if this li is a related link then clicking it
  // needs to activate its li in the sidebar
  // so don't use: elem.classList.add('active')
  document
    .querySelector(`.recipe-link[data-id="${elem.dataset.id}"]`)
    .classList.add('active')
  const recipeId = elem.dataset.id
  const recipe = state.getRecipeById(recipeId)
  if (!recipe) {
    console.log(
      `handleRecipeLinkClick error: Recipe not found for id: ${recipeId}`
    )
    console.log('recipes:', state.getRecipes())
    return
  }

  loadRecipe(recipe)
  const resp = await postWebApp(`${state.getWebAppUrl()}/recipe-access`, {
    id: recipeId
  })
  const { message } = resp
  console.log(message)
}

/**
 * Handle tab click
 */
function handleTabClick(elem) {
  const recipeId = elem.id.replace('tab-', '')
  const recipe = state.getRecipeById(recipeId)

  document.querySelector('.recipe-link.active').classList.remove('active')
  document
    .querySelector(`.recipe-link[data-id="${recipeId}"]`)
    .classList.add('active')

  loadRecipe(recipe)
}

/**
 * Handle tab close click
 */
function handleTabCloseClick(tab) {
  tab.remove()
  const activeTab = document.querySelector('.tab.active')
  if (!activeTab) {
    document.querySelector('.recipe-link.active').classList.remove('active')
    const firstTab = document.querySelector('.tab')
    if (firstTab) {
      const firstTabId = firstTab.id.replace('tab-', '')
      document.querySelector(`.recipe-link[data-id="${firstTabId}"]`).click()
    } else {
      recipeEl.classList.add('hidden')
      shopIngredientsBtn.classList.add('hidden')
    }
  }
}

/**
 * Handle shop ingredients click
 */
function handleShopIngredientsClick() {
  shopIngredientsBtn.disabled = true
  const shoppingArr = []

  const tabs = [...document.querySelectorAll('.tab')]
  let title
  let tabId
  let id
  let recipe
  let ingredients

  for (const tab of tabs) {
    title = tab.querySelector('.text-tab').textContent
    tabId = tab.id
    id = tabId.replace('tab-', '')
    recipe = state.getRecipeById(id)
    ingredients = recipe.ingredients
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter(filterIngredient)
      .map(transformIngredient)
    shoppingArr.push(...ingredients)
  }
  addItemsToShoppingList(shoppingArr)
}

// ------------------------
// Helper functions
// ------------------------

/**
 * Populate the recipes list
 */
function populateRecipes() {
  const recipes = state.getRecipes()
  if (!recipes) {
    console.log(
      `populateRecipes error: state does not have recipes: ${recipes}`
    )
    return
  }

  recipesContainer.classList.remove('hidden')
  recipesList.innerHTML = ''
  for (const recipe of recipes) {
    const li = document.createElement('li')
    li.textContent = recipe.title
    li.classList.add('recipe-link')
    li.dataset.id = recipe.id
    recipesList.appendChild(li)
  }
  recipesContainer.dispatchEvent(new CustomEvent('recipes-loaded'))
}

/**
 * Load the recipe object to the page
 */
function loadRecipe(recipe) {
  if (switchEl.classList.contains('on')) {
    switchEl.dispatchEvent(new Event('click'))
  }

  switchEl.classList.remove('on')
  const activeTab = document.querySelector('.tab.active')
  if (activeTab) {
    activeTab.classList.remove('active')
  }
  const tabId = `tab-${recipe.id}`
  let tab = document.querySelector(`#${tabId}`)
  if (!tab) {
    tab = document.createElement('div')
    tab.id = tabId
    tab.classList.add('tab')
    tab.classList.add('active')
    tab.innerHTML = `<span class="text-tab">${recipe.title}</span> <i class="close-tab fa-regular fa-circle-xmark"></i>`
    document
      .querySelector('#tabs')
      .insertBefore(tab, document.querySelector('#tabs').lastElementChild)
    tab.querySelector('.text-tab').addEventListener('click', (e) => {
      handleTabClick(tab)
    })
    tab.querySelector('.close-tab').addEventListener('click', (e) => {
      e.stopPropagation()
      handleTabCloseClick(tab)
    })
  }
  tab.classList.add('active')
  recipeEl.classList.remove('hidden')
  recipeTitleEl.value = recipe.title
  recipeRelated.value = recipe.related
  populateRelatedRecipes(recipe.related)
  recipeIngredients.value = recipe.ingredients
  resizeTextarea(recipeIngredients)
  recipeMethod.value = recipe.method
  resizeTextarea(recipeMethod)
  recipeNotes.value = recipe.notes
  resizeTextarea(recipeNotes)
  recipeCategory.value = recipe.category || ''
  resizeTextarea(recipeCategory)
  recipeTags.value = recipe.tags
  resizeTextarea(recipeTags)
  recipeIdEl.textContent = recipe.id
}

/**
 * Get the searched recipes
 */
async function getSearchedRecipes(q) {
  const data = await getWebApp(`${state.getWebAppUrl()}/recipes-search?q=${q}`)

  const { recipes, message } = data
  if (message) {
    console.log(`getSearchedRecipes error: ${message}`)
    return { error: message }
  }
  return { recipes }
}

/**
 * Populate related recipes
 */
function populateRelatedRecipes(ids) {
  relatedRecipesEl.innerHTML = ''
  if (!ids) {
    return
  }
  const splitRegEx = /,|\n|\s/
  const idsArr = ids
    .split(splitRegEx)
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
  const ulEl = document.createElement('ul')

  for (const id of idsArr) {
    const recipe = state.getRecipeById(id)
    if (!recipe) {
      console.log(`populateRelatedRecipes: Oops, id ${id} was not found`)
      continue
    }
    const title = recipe.title
    const li = makeRecipeLinkEl(id, title)
    ulEl.appendChild(li)
  }
  relatedRecipesEl.appendChild(ulEl)
}

/**
 * Make a recipe link element
 */
function makeRecipeLinkEl(id, title) {
  const li = document.createElement('li')
  li.textContent = title
  li.classList.add('recipe-link')
  li.dataset.id = id
  li.addEventListener('click', () => {
    handleRecipeLinkClick(li)
  })
  return li
}

/**
 * Get an array of recipes that are currently showing in the tabs
 */
function getOpenRecipes() {
  const tabs = [...document.querySelectorAll('.tab')]
  const openRecipes = tabs.map((tab) => {
    const id = tab.id.replace('tab-', '')
    return state.getRecipeById(id)
  })
  return openRecipes
}
