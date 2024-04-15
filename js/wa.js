async function collect(data) {
  data.location = window.location
  data.referrer = document.referrer
  data.cookies = document.cookie

  const url =
    'http://127.0.0.1:5001/web-analytics-2024/us-central1/requestApp/collect'
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const req = new Request(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })

  const resp = await fetch(req)
  const { cookie, message } = await resp.json()

  if (cookie) {
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 2)
    const expiresUTC = expirationDate.toUTCString()
    const newCookie = `brwa=${cookie}; expires=${expiresUTC}; path=/`
    document.cookie = newCookie
  }
}

collect({ type: 'page-view' })
