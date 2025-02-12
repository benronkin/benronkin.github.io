import { postWebApp } from './io.js'
import { initDialog } from './modal.js'

// ----------------------
// Globals
// ----------------------

const headerEl = document.querySelector('#header')
const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const loginBtn = document.querySelector('#login-btn')
const loginMessageEl = document.querySelector('#login-message')
const messageEl = document.querySelector('#message')
const modeSelect = document.querySelector('#mode-select')
const shoppingContainer = document.querySelector('#shopping-container')
const recipesContainer = document.querySelector('#recipes-container')
const recipeLinksPanel = document.querySelector('#recipe-links-panel')
const recipesPanel = document.querySelector('#recipes-panel')
const leftPanelToggle = document.querySelector('#left-panel-toggle')

// ------------------------
// Exported functions
// ------------------------

/**
 * Set event listeners for top-level UI
 */
export function initUi() {
  /* When login form is submitted */
  loginForm.addEventListener('submit', handleLoginFormSubmit)

  /* When fetching recipes or shopping list fails */
  document.addEventListener('fetch-fail', handleFetchFail)

  /* When fetching recipes or shopping list warns */
  document.addEventListener('fetch-warn', handleFetchWarn)

  /* When the left panel toggle is clicked */
  leftPanelToggle.addEventListener('click', () => {
    handleLeftPanelToggle()
  })

  /* When mode select is changed */
  modeSelect.addEventListener('change', (e) => {
    handleModeSelectChange(e)
  })

  // init dialog
  initDialog()

  setMessage('Loading...')

  const mode = localStorage.getItem('mode')
  if (mode) {
    modeSelect.value = mode
  }
}

/**
 * Set the mode select value using local storage
 */
export function activateUi() {
  setMessage('')
  const mode = localStorage.getItem('mode')
  if (mode) {
    handleModeSelectChange({ target: { value: mode } })
  }
}

/**
 * Set message at top of page
 */
export function setMessage(value) {
  messageEl.innerHTML = value
}

/**
 * Detect if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle login form submit
 */
async function handleLoginFormSubmit(e) {
  e.preventDefault()
  loginBtn.disabled = true
  loginMessageEl.textContent = 'Checking. Please wait...'

  const formData = new FormData(loginForm)
  const email = formData.get('email')
  try {
    const { error, message } = await postWebApp(
      `${state.getWebAppUrl()}/email-submit`,
      {
        email
      }
    )
    if (error) {
      throw new Error(error)
    }
    loginMessageEl.textContent = message
  } catch (err) {
    loginMessageEl.textContent = err.message
    loginBtn.disabled = false
    console.log(err)
  }
}

/**
 * Handle getWebApp or postWebApp errors
 */
function handleFetchFail() {
  loginContainer.classList.remove('hidden')
  recipeLinksPanel.classList.add('hidden')
  headerEl.classList.add('hidden')
}

/**
 * Handle getWebApp or postWebApp warnings
 */
function handleFetchWarn(e) {
  setMessage(e.detail.warn)
  recipeLinksPanel.classList.add('hidden')
}

/**
 * Handle mode select change
 */
function handleModeSelectChange(e) {
  const mode = e.target.value

  switch (mode) {
    case 'recipes':
      shoppingContainer.classList.add('hidden')
      leftPanelToggle.classList.remove('hidden')
      recipesContainer.classList.remove('hidden')
      if (recipeLinksPanel.classList.contains('hidden')) {
        leftPanelToggle.click()
      }
      break
    case 'shopping':
      leftPanelToggle.classList.add('hidden')
      recipesContainer.classList.add('hidden')
      shoppingContainer.classList.remove('hidden')
      break
  }
  localStorage.setItem('mode', mode)
}

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  recipeLinksPanel.classList.toggle('hidden')
}

// ------------------------
// Helper functions
// ------------------------

/**
 * Resize the textarea
 */
export function resizeTextarea(textarea) {
  // First, set the textarea to the default height
  textarea.style.height = 'auto'
  textarea.style.height = '0'

  // Get the scroll height of the textarea content
  let minHeight = textarea.scrollHeight

  // If the scroll height is more than the default height, expand the textarea
  if (minHeight > textarea.clientHeight) {
    textarea.style.height = minHeight + 'px'
  }
}
