export default defineNuxtPlugin({
  enforce: 'pre',
  env: { islands: false },
  setup() {
    if (import.meta.test || import.meta.dev)
      return

    useScriptCloudflareWebAnalytics({ token: '17266004675c4a189aa23218df003314' })
  },
})
