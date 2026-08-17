export function query(access_token: string, query: string) {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${access_token}`,
      'user-agent': 'islom (https://eeslom.uz, 0.1)',
    },
    body: JSON.stringify({ query }),
  })
    .then(r => r.json() as Promise<{ data: any }>)
    .then((r) => {
      if ('error' in r) {
        throw r
      }

      return r.data
    })
}
