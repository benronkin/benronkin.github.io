async function collect(data) {
  data.location = window.location
  data.referrer = document.referrer

  const url = 'https://requestapp-55p23hikza-uc.a.run.app/collect'
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const req = new Request(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })

  await fetch(req)
}

collect({ type: 'page-view' })
