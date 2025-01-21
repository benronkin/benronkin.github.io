/**
 * Get data from Web app
 */
async function getWebAppData(path) {
  const token = localStorage.getItem('token')
  if (!token) {
    return { error: 'getWebAppData error: No token' }
  }
  if (token.startsWith('reg')) {
    return { error: 'Unexpected reg token in local storage' }
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
      error: `getWebAppData error: ${err}.`
    }
  }
}

/**
 * Post data to Web app
 */
async function postWebApp(path, data) {
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
    const message = `postWebApp error: ${err}\nFetch payload: ${JSON.stringify(data)}\nres:${
      res ? JSON.stringify(res) : 'no res'
    }`
    return { error: message }
  }
}

export { getWebAppData, postWebApp }
