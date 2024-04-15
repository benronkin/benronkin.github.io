async function collect(data) {
  data.location = window.location
  data.referrer = document.referrer

  const url =
    'http://127.0.0.1:5001/web-analytics-2024/us-central1/requestApp/collect'
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
