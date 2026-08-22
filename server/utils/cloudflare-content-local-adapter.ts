// The production Cloudflare Worker uses the D1 adapter. This placeholder keeps
// Nuxt Content's build-time local adapter out of the Worker bundle.
export default function cloudflareContentLocalAdapter(): never {
  throw new Error('The local content adapter is unavailable in Cloudflare Workers.')
}
