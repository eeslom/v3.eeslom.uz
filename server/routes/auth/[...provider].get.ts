const organizationQuery = `{
  viewer {
    id
    name
    avatarUrl
    organizations(first: 100) {
      edges {
        node {
          id
        }
      }
    }
  }
}`

export default defineEventHandler(async (event) => {
  const { code, error, error_description, error_uri } = getQuery(event)

  if (import.meta.dev) {
    console.log(event.path)
  }

  if (error) {
    console.log(error, error_description, error_uri)
    return sendRedirect(event, '/?auth_error=true')
  }

  if (!code) {
    throw createError({
      status: 422,
      message: 'Missing authorization code.',
    })
  }

  const config = useRuntimeConfig(event)
  const { access_token } = await $fetch<{ access_token: string }>(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      body: {
        client_id: config.public.githubClientId,
        client_secret: config.github.clientSecret,
        code,
      },
    },
  ).catch((err) => {
    console.error('access', err)
    return {} as { access_token?: string }
  })

  if (access_token) {
    const [viewer] = await Promise.all([
      query(access_token, organizationQuery)
        .then((r) => {
          const viewer = r?.viewer || {}
          viewer.orgs = viewer.organizations.edges.map((e: any) => e.node.id) || []
          return viewer
        })
        .catch((err) => {
          console.error('viewer', err)
          return {}
        }),
    ])

    await setUserSession(event, {
      authenticated: true,
      avatar: viewer.avatarUrl,
      name: viewer.name,
    })
  }

  return sendRedirect(event, '/')
})
