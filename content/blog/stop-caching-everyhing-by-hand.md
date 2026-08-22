---
title: "Stop Caching Everything By Hand: Let Route Rules Do the Work"
date: 2026-08-22
tags: [nuxt, cloudflare, caching, performance]
---

# Stop Caching Everything By Hand: Let Route Rules Do the Work

When I first wired up a TMDB proxy for a Nuxt project running on Cloudflare Workers, my instinct was the same as most developers': write a caching layer by hand. Check a KV key, if it's missing fetch fresh data, write it back, set a TTL, repeat. It works. It also turns into a mess fast — cache invalidation logic scattered across handlers, config values duplicated everywhere, and a `defineCachedEventHandler` fighting with `useRuntimeConfig(event)` in ways that are miserable to debug.

Here's the tip: **let your framework's routing layer own caching, not your handler code.**

## The problem with caching inside the handler

A typical first attempt looks like this:

```ts
export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const res = await $fetch(`https://api.themoviedb.org/3/movie/popular`, {
    headers: { Authorization: `Bearer ${config.tmdbToken}` }
  })
  return res
}, {
  maxAge: 60 * 10
})
```

Looks fine until you actually deploy it. `defineCachedEventHandler` wraps your handler in its own execution context, and depending on your Nitro preset, `useRuntimeConfig(event)` inside that wrapped context doesn't always resolve the way you'd expect. You end up debugging *why* your config is undefined instead of building features — and the caching logic is now tangled up with your business logic, which means every route that needs caching needs its own copy of this dance.

## Move it up a layer

Nitro's `routeRules` let you declare caching behavior for a path pattern, completely separate from the handler that serves it:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/api/tmdb/**': {
      cache: {
        maxAge: 60 * 10,
        staleMaxAge: 60 * 60,
        swr: true
      }
    }
  }
})
```

Now your handler goes back to being a plain, boring event handler:

```ts
// server/api/tmdb/[...path].ts
export default defineEventHandler(async (event) => {
  const path = event.context.params.path
  const config = useRuntimeConfig(event) // works normally again
  return $fetch(`https://api.themoviedb.org/3/${path}`, {
    headers: { Authorization: `Bearer ${config.tmdbToken}` }
  })
})
```

The `swr: true` flag is the part worth calling out — it gives you stale-while-revalidate for free. The first request after expiry gets a slightly stale response immediately, while Nitro fetches a fresh copy in the background and serves that to the *next* request. Your users almost never see a slow, uncached response, even on a cold cache.

## Why this matters more on the edge

If you're deploying to Cloudflare Workers (via the `cloudflare_module` preset), this separation matters even more. Workers have a strict execution model, and KV-backed caching through route rules plays nicely with that model because Nitro handles the storage adapter for you. You're not manually reading and writing to `event.context.cloudflare.env.YOUR_KV_NAMESPACE` in every handler — you configure it once and every matching route gets consistent behavior.

There's a bonus here too: because the caching decision lives in config rather than code, you can change your caching strategy for an entire section of your API without touching a single handler. Need to make search results cache for less time than movie details? Two lines in `routeRules`, not two different handler implementations.

## The general principle

This isn't really about TMDB or Cloudflare specifically. It's a broader habit worth building: **when a cross-cutting concern — caching, auth, rate limiting — starts showing up inside multiple handlers, that's usually a sign it belongs one layer up.** Handlers should answer "what does this endpoint do." Routing config should answer "how does this endpoint behave." Mixing the two together is how you end up with a handler that's 30% business logic and 70% infrastructure plumbing.

Next time you catch yourself writing the same `if (cached) return cached` block for the third time, stop and ask whether your framework already has a declarative way to say what you're trying to do by hand.

---

*This is the first post on this blog — more notes like this will follow as I keep building things and hitting walls worth writing about.*