// ----------------------
// Globals
// ----------------------

const headerEl = document.querySelector('#header')
const loginContainer = document.querySelector('#login-container')
const loginForm = document.querySelector('#login-form')
const recipeLinksPanel = document.querySelector('#recipe-links-panel')

// ----------------------
// Exported functions
// ----------------------

export function initAuth() {
  /* When fetching recipes fail */
  document.addEventListener('recipes-fetch-fail', () => {
    loginContainer.classList.remove('hidden')
    headerEl.classList.add('hidden')
    recipeLinksPanel.classList.add('hidden')
  })

  /* When login form is submitted */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    handleLoginFormSubmit()
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
    const { error, ...rest } = await postWebApp(state.getWebAppUrl(), {
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
