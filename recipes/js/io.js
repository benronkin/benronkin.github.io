// ------------------------
// Exported functions
// ------------------------

/**
 * If the user clicked on the email link then the token will be in the query param.
 * Save the token to local storage and remove it from the URL.
 */
export function handleTokenQueryParam() {
  const urlParams = new URLSearchParams(window.location.search)
  const tokenParam = urlParams.get('token')
  if (!tokenParam) {
    return
  }

  localStorage.setItem('authToken', tokenParam)

  // remove query param from address bar url
  window.history.replaceState({}, document.title, window.location.pathname)
}

/**
 * Get data from Web app
 */
export async function getWebApp(path) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const token = localStorage.getItem('authToken')
  if (!token) {
    console.log('getWebApp no token. aborting')
    return
  }
  headers.append('Auth-Token', token)

  const req = new Request(path, {
    headers
  })
  let res
  try {
    res = await fetch(req)
    const { status, message, data } = await res.json()

    if (status !== 200) {
      console.log(`getWebApp ${status} error:`, message)
      return { error: message }
    }
    return { ...data, message }
  } catch (error) {
    if (path.includes('localhost')) {
      console.warn('Is cloudflare running?')
      return { warn: 'Is CloudFlare running locally?' }
    }

    console.log('getWebapp error:', error)

    return {
      error: `getWebApp error: ${error}\nRes: ${
        res ? await res.text() : 'res is empty'
      }`
    }
  }
}

/**
 * Post data to Web app
 */
export async function postWebApp(path, clientData) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const token = localStorage.getItem('authToken')
  if (!token && !path.includes('/email-submit')) {
    console.log('postWebApp no token. aborting')
    return
  }
  headers.append('Auth-Token', token)

  const req = new Request(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(clientData)
  })
  let res
  try {
    res = await fetch(req)
    const resp = await res.json()
    return resp
  } catch (err) {
    if (path.includes('localhost')) {
      console.warn('Is cloudflare running?')
    }
    const errorMessage = `postWebApp error: ${err}\nFetch payload: ${JSON.stringify(
      clientData
    )}`
    return { error: errorMessage }
  }
}
