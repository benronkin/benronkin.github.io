import { getWebAppData, postWebApp, handleTokenQueryParam } from './io.js'

// ----------------------
// Globals
// ----------------------

const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbzUYReY4jAwZ0m_jbW1WUPGJxsGtZqJO3QwhxNIn-uOnLHQoCdztG0NHjDbNdZ4QDd5/exec'
let recipesArr
let afterRecipe = null

const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const headerEl = document.querySelector('#header')
const modeSelect = document.querySelector('#mode-select')
const shoppingContainer = document.querySelector('#shopping-container')
const shoppingEl = document.querySelector('#shopping-list')
const addRecipeBtn = document.querySelector('#add-recipe')
const searchRecipesEl = document.querySelector('#search-recipes')
const recipesContainer = document.querySelector('#recipes-container')
const recipeLinksPanel = document.querySelector('#recipe-links-panel')
const recipesList = document.querySelector('#recipes-list')
const recipeEl = document.querySelector('#recipe')
const recipeTitleEl = document.querySelector('#recipe-title')
const recipeIngredients = document.querySelector('#recipe-ingredients')
const recipeMethod = document.querySelector('#recipe-method')
const recipeNotes = document.querySelector('#recipe-notes')
const recipeCategory = document.querySelector('#recipe-category')
const recipeTags = document.querySelector('#recipe-tags')
const recipeIdEl = document.querySelector('#recipe-id')

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', async () => {
  handleTokenQueryParam()
  const { recipes, error } = await getLatestRecipes()

  if (error) {
    loginContainer.classList.remove('hidden')
    headerEl.classList.add('hidden')
    recipeLinksPanel.classList.add('hidden')
    return
  }

  // if (!localStorage.getItem('recipes')) {
  //   if (recipes?.length > 0) {
  //     localStorage.setItem('recipes', JSON.stringify(recipes))
  //   }
  // }
  // recipesArr = JSON.parse(localStorage.getItem('recipes'))
  recipesArr = recipes
  populateRecipes(recipesArr)
  const shopping = await getShoppingList()
  shoppingEl.value = shopping
})

/* When login form is submitted */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  handleLoginFormSubmit()
})

/* When mode select is changed */
modeSelect.addEventListener('change', (e) => {
  const mode = e.target.value
  if (mode === 'recipes') {
    recipesContainer.classList.remove('hidden')
    shoppingContainer.classList.add('hidden')
  } else {
    recipesContainer.classList.add('hidden')
    shoppingContainer.classList.remove('hidden')
  }
})

/* When recipes container is popualted */
recipesContainer.addEventListener('recipes-loaded', () => {
  handleRecipeContainerPopulated()
})

/* When add recipe button is clicked */
addRecipeBtn.addEventListener('click', async () => {
  await handleRecipeCreate()
})

/* When serach recipes input key down */
searchRecipesEl.addEventListener('keydown', async (e) => {
  await handleRecipeSearch(e)
})

/* When recipe field loses focus */
document.querySelectorAll('.field').forEach((field) => {
  field.addEventListener('change', (e) => {
    handleFieldChange(e.target)
  })
})

/* When shopping list changes */
shoppingEl.addEventListener('change', (e) => {
  handleShoppingListChange(e)
})

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle form submit
 */
async function handleLoginFormSubmit() {
  const formData = new FormData(loginForm)
  const email = formData.get('email')
  try {
    const { error, ...rest } = await postWebApp(WEB_APP_URL, {
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
 * Handle recipe link click
 */
async function handleRecipeLinkClick(elem) {
  document.querySelector('.recipe-link.active')?.classList.remove('active')
  elem.classList.add('active')
  const recipeId = elem.dataset.id
  const recipe = recipesArr.find((r) => r.id === recipeId)
  if (!recipe) {
    console.log(`Recipe not found for id: ${recipeId}`)
    console.log('recipesArr:', recipesArr)

    return
  }

  loadRecipe(recipe)
  const { message, error } = await postWebApp(WEB_APP_URL, {
    path: 'recipe-access',
    id: recipeId
  })
  if (error) {
    console.log(error)
  }
  console.log(message)
}

/**
 * Handle tab click
 */
function handleTabClick(elem) {
  const recipeId = elem.id.replace('tab-', '')
  const recipe = recipesArr.find((r) => r.id === recipeId)

  document.querySelector('.recipe-link.active').classList.remove('active')
  document.querySelector(`.recipe-link[data-id="${recipeId}"]`).classList.add('active')

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
    }
  }
}

/**
 * Handle recipe field change
 */
async function handleFieldChange(elem) {
  const recipeSection = elem.id.replace('recipe-', '')
  if (recipeSection === 'title') {
    document.querySelector('.tab.active').querySelector('.text-tab').textContent = elem.value
    document.querySelector('.recipe-link.active').textContent = elem.value
  }
  const id = recipeIdEl.textContent

  recipesArr.find((r) => r.id === id)[recipeSection] = elem.value

  try {
    const { message, error } = await postWebApp(WEB_APP_URL, {
      path: 'recipe-update',
      id,
      value: elem.value,
      section: recipeSection
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
 * Handle recipe create
 */
async function handleRecipeCreate() {
  addRecipeBtn.disabled = true
  addRecipeBtn.textContent = 'Creating...'
  const { id } = await getWebAppData(`${WEB_APP_URL}?path=recipe-create`)

  const newRecipe = {
    id,
    title: 'New Recipe',
    ingredients: '',
    method: '',
    notes: '',
    category: '',
    tags: ''
  }
  recipesArr.push(newRecipe)
  const li = document.createElement('li')
  li.textContent = newRecipe.title
  li.classList.add('recipe-link')
  li.dataset.id = newRecipe.id
  recipesList.appendChild(li)
  li.addEventListener('click', () => {
    handleRecipeLinkClick(li)
  })
  li.click()
  addRecipeBtn.disabled = false
  addRecipeBtn.textContent = 'NEW RECIPE'
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
  const { recipes } = await getSearchedRecipes(value)
  recipesArr = recipes
  populateRecipes(recipesArr)
}

/**
 * Handle shopping list change
 */
async function handleShoppingListChange(e) {
  const { value } = e.target
  try {
    const { message, error } = await postWebApp(WEB_APP_URL, {
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

// ------------------------
// Recipe functions
// ------------------------

/**
 * Get the latest recipes
 */
async function getLatestRecipes() {
  const { recipes, token, error } = await getWebAppData(`${WEB_APP_URL}?path=recipes`)
  if (error) {
    console.log(`getLatestRecipes error: ${error}`)
    return { error }
  }
  if (token) {
    localStorage.setItem('token', token)
  }
  return recipes
}

/**
 * Get the searched recipes
 */
async function getSearchedRecipes(q) {
  const { recipes, token, error } = await getWebAppData(`${WEB_APP_URL}?path=recipes&q=${q}`)
  if (error) {
    console.log(`getSearchedRecipes error: ${error}`)
    return { error }
  }
  return recipes
}

/**
 * Load the recipe
 */
function loadRecipe(recipe) {
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
    document.querySelector('#tabs').appendChild(tab)
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
 * Populate the recipes list
 */
function populateRecipes(recipes) {
  if (!recipes) {
    console.log(`populateRecipes error: No recipes: ${recipes}`)
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

// ------------------------
// Shopping functions
// ------------------------

/**
 * Get the shopping list
 */
async function getShoppingList() {
  const { shopping, token, error } = await getWebAppData(`${WEB_APP_URL}?path=shopping`)
  if (error) {
    console.log(`getShoppingList error: ${error}`)
    return { error }
  }
  if (token) {
    localStorage.setItem('token', token)
  }
  return shopping
}

// ------------------------
// Helper functions
// ------------------------

/**
 * Resize the textarea
 */
function resizeTextarea(textarea) {
  // First, set the textarea to the default height
  textarea.style.height = 'auto'
  textarea.style.height = '0'

  // Get the scroll height of the textarea content
  let minHeight = textarea.scrollHeight

  // If the scroll height is more than the default height, expand the textarea
  if (minHeight > textarea.clientHeight) {
    textarea.style.height = minHeight + 10 + 'px'
  }
}
