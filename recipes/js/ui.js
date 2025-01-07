// ----------------------
// Globals
// ----------------------

const modeSelect = document.querySelector('#mode-select')
const shoppingContainer = document.querySelector('#shopping-container')
const recipesContainer = document.querySelector('#recipes-container')

// ------------------------
// Exported functions
// ------------------------

/**
 * Handle mode select change
 */
export function initUi() {
  /* When mode select is changed */
  modeSelect.addEventListener('change', (e) => {
    handleModeSelectChange(e)
  })
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
    recipesContainer.classList.remove('hidden')
    shoppingContainer.classList.add('hidden')
  } else {
    recipesContainer.classList.add('hidden')
    shoppingContainer.classList.remove('hidden')
  }
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
    textarea.style.height = minHeight + 10 + 'px'
  }
}
