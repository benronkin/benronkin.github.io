// ----------------------
// Globals
// ----------------------

const headerEl = document.querySelector('#header')
const loginContainer = document.querySelector('#login-container')
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
 * Handle mode select change
 */
export function initUi() {
  /* When the left panel toggle is clicked */
  leftPanelToggle.addEventListener('click', () => {
    handleLeftPanelToggle()
  })

  /* When mode select is changed */
  modeSelect.addEventListener('change', (e) => {
    handleModeSelectChange(e)
  })

  // recall user's selection from local storage
  setModeSelectValue()

  // user is logged in
  if (loginContainer.classList.contains('hidden')) {
    headerEl.classList.remove('hidden')
    recipesContainer.classList.remove('hidden')
  }
}

/**
 * Detect if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle mode select change
 */
function handleModeSelectChange(e) {
  const mode = e.target.value
  if (mode === 'recipes') {
    leftPanelToggle.classList.remove('hidden')
    recipesContainer.classList.remove('hidden')
    shoppingContainer.classList.add('hidden')
  } else {
    leftPanelToggle.classList.add('hidden')
    recipesContainer.classList.add('hidden')
    shoppingContainer.classList.remove('hidden')
  }
  localStorage.setItem('mode', mode)
}

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  recipeLinksPanel.classList.toggle('hidden')
  recipesPanel.classList.toggle('ml220')
  recipesPanel.classList.toggle('ml20')
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

/**
 * Set the mode select value using local storage
 */
function setModeSelectValue() {
  const mode = localStorage.getItem('mode')
  if (mode) {
    modeSelect.value = mode
    handleModeSelectChange({ target: { value: mode } })
  }
}
