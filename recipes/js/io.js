// ------------------------
// Exported functions
// ------------------------

/**
 * If the user clicked on the email link then the token will be in the query param.
 * Save the token to local storage and remove it from the URL.
 */
export function handleTokenQueryParam() {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('t')
  if (!token) {
    return
  }
  localStorage.setItem('token', token)
  // remove query param from address bar url
  window.history.replaceState({}, document.title, window.location.pathname)
}

/**
 * Get data from Web app
 */
export async function getWebApp(path) {
  const token = localStorage.getItem('token')
  if (!token) {
    return { error: 'getWebApp error: No token' }
  }
  path += (path.includes('?') ? `&` : `?`) + `t=${token}`

  const headers = new Headers()
  headers.append('Content-Type', 'text/plain;charset=utf-8')

  const req = new Request(path, {
    redirect: 'follow',
    headers
  })
  try {
    const res = await fetch(req)
    const jsn = await res.json()
    return jsn
  } catch (err) {
    return {
      error: `getWebApp error: ${err}\nRes: ${await res.text()}`
    }
  }
}

/**
 * Post data to Web app
 */
export async function postWebApp(path, data) {
  // user does not need a token to access unprotected paths
  const unprotectedPaths = ['login']
  if (!unprotectedPaths.includes(data.path)) {
    const token = localStorage.getItem('token')
    if (!token) {
      return { error: 'postWebApp error: No token' }
    }
    path += (path.includes('?') ? `&` : `?`) + `t=${token}`
  }

  const headers = new Headers()
  headers.append('Content-Type', 'text/plain;charset=utf-8')

  const req = new Request(path, {
    method: 'POST',
    redirect: 'follow',
    headers,
    body: JSON.stringify(data)
  })
  let res
  try {
    res = await fetch(req)
    const jsn = await res.json()
    return jsn
  } catch (err) {
    const message = `postWebApp error: ${err}\nFetch payload: ${JSON.stringify(
      data
    )}\nres:${res ? JSON.stringify(res) : 'no res'}`
    return { error: message }
  }
}
