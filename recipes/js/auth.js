import { postWebApp } from './io.js'

// ----------------------
// Globals
// ----------------------

const headerEl = document.querySelector('#header')
const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const loginBtn = document.querySelector('#"login-btn"')
const recipeLinksPanel = document.querySelector('#recipe-links-panel')
const loginMessageEl = document.querySelector('#login-message')

// ----------------------
// Exported functions
// ----------------------

export function initAuth() {
  /* When fetching recipes or shopping list fails */
  document.addEventListener('fetch-fail', () => {
    loginContainer.classList.remove('hidden')
    headerEl.classList.add('hidden')
    recipeLinksPanel.classList.add('hidden')
  })

  /* When login form is submitted */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    loginBtn.disabled = true
    loginMessageEl.textContent = 'Checking. Please wait...'
    await handleLoginFormSubmit()
    loginBtn.disabled = false
  })

  handleTokenQueryParam()
}

// ----------------------
// Helper functions
// ----------------------

/**
 * Handle form submit
 */
async function handleLoginFormSubmit() {
  const formData = new FormData(loginForm)
  const email = formData.get('email')
  try {
    const { error, message } = await postWebApp(state.getWebAppUrl(), {
      email,
      path: 'login'
    })
    if (error) {
      throw new Error(error)
    }
    loginMessageEl.textContent = message
  } catch (err) {
    loginMessageEl.textContent = err.message
    console.log(err)
  }
}

/**
 * If the user clicked on the email link then the token will be in the query param.
 * Save the token to local storage and remove it from the URL.
 */
function handleTokenQueryParam() {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('t')
  if (!token) {
    return
  }
  localStorage.setItem('token', token)
  window.history.replaceState({}, document.title, window.location.pathname)
}
