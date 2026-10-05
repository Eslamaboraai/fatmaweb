---
name: awesome-design-md
description: Library of 74 ready-made DESIGN.md style guides extracted from real websites (Stripe, Linear, Vercel, Apple, Airbnb, Notion, Spotify, Tesla, and more). Use when the user wants a page or component to look like, or be inspired by, a named brand or site, asks which brand styles are available, or wants to adopt one of these as the project's DESIGN.md.
---

# Awesome DESIGN.md

Vendored from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT, see `LICENSE`).

Each `designs/<brand>/DESIGN.md` is a plain-markdown design system: YAML front matter with color, type, spacing, and radius tokens, followed by prose on layout, components, motion, and do/don't rules.

## Available brands

airbnb, airtable, apple, binance, bmw, bmw-m, bugatti, cal, claude, clay, clickhouse, cohere, coinbase, composio, cursor, dell-1996, elevenlabs, expo, ferrari, figma, framer, hashicorp, hp, ibm, intercom, kraken, lamborghini, linear.app, lovable, mastercard, meta, minimax, mintlify, miro, mistral.ai, mongodb, nike, nintendo-2001, notion, nvidia, ollama, opencode.ai, pinterest, playstation, posthog, raycast, renault, replicate, resend, revolut, runwayml, sanity, sentry, shopify, slack, spacex, spotify, starbucks, stripe, supabase, superhuman, tesla, theverge, together.ai, uber, vercel, vodafone, voltagent, warp, webflow, wired, wise, x.ai, zapier

## How to use

1. Match the user's request to a folder above (e.g. "Linear-style" → `linear.app`). If no brand fits or the request is ambiguous, list the closest options and ask.
2. Read `designs/<brand>/DESIGN.md` in full before writing UI code, and apply its tokens and rules to the work.
3. These files describe a style to be *inspired by*. Use the palette, type scale, spacing, and layout patterns, but never copy the brand's logos, wordmarks, trademarks, product names, or marketing copy into this project.
4. Only copy a file to the project root as `DESIGN.md` when the user explicitly asks to adopt that style as the project's design system. A root `DESIGN.md` is treated as design authority by other skills (e.g. Impeccable), so do not overwrite an existing one without confirmation.
5. Font families named in a guide may be proprietary. Substitute a close, freely licensed web font and say so.
