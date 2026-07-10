# socials.ejay.bio

A Discord-only "link in bio" builder: sign in with Discord, get auto-added to
your server, and get a page at `socials.ejay.bio/@handle` with themeable,
labeled link buttons that auto-detect the platform icon.

Built as a single Cloudflare Worker (Hono + D1) — no separate frontend build,
no other database to manage, deploys with one `wrangler` command.

## 1. Create the Discord application

1. Go to https://discord.com/developers/applications → **New Application**.
2. **OAuth2 → General**: copy the **Client ID** and **Client Secret**.
3. **OAuth2 → Redirects**: add `https://socials.ejay.bio/auth/callback`
   (must match `DISCORD_REDIRECT_URI` in `wrangler.toml` exactly).
4. **Bot** tab → **Add Bot** → copy the **Bot Token**.
5. Invite the bot to your server (**OAuth2 → URL Generator**, scope `bot`,
   permission `Manage Server` is the simplest option to make sure it can add
   members — you can lock this down later). Use the generated URL once to
   drop the bot into your server: https://discord.gg/pwafWvnyDe is your
   existing invite for humans; the bot needs its own `bot`-scope invite.
6. Grab your **Server ID** (right-click your server icon → Copy Server ID,
   with Developer Mode on) — this is `DISCORD_GUILD_ID`.

Why `guilds.join`: this scope lets your bot add the signed-in user straight
into your server via the API the moment they log in — no invite link click
required. If the bot ever lacks permission, login still succeeds; the
auto-add silently no-ops so people aren't locked out over a permissions
hiccup (you can direct them to `https://discord.gg/pwafWvnyDe` as a fallback).

## 2. Create the D1 database

```bash
npm install
npx wrangler d1 create ejay_links_db
```

Copy the `database_id` it prints into `wrangler.toml` (`REPLACE_WITH_YOUR_D1_DATABASE_ID`).

```bash
npx wrangler d1 migrations apply ejay_links_db --local   # for local dev
npx wrangler d1 migrations apply ejay_links_db --remote  # for production
```

## 3. Set your secrets

```bash
npx wrangler secret put DISCORD_CLIENT_ID
npx wrangler secret put DISCORD_CLIENT_SECRET
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put DISCORD_GUILD_ID
npx wrangler secret put SESSION_SECRET   # any long random string
```

## 4. Point the domain at the Worker

Since you already host `ejay.bio` on Cloudflare:

1. Add a DNS record for `socials` (an `A` record to `192.0.2.1`, proxied
   orange-cloud on — the IP is a placeholder Cloudflare ignores once the
   Worker route below is active).
2. `wrangler.toml` already declares:
   ```toml
   [[routes]]
   pattern = "socials.ejay.bio/*"
   zone_name = "ejay.bio"
   ```
   Deploy and Cloudflare will route all traffic on that hostname to this Worker.

## 5. Deploy

```bash
npx wrangler deploy
```

Visit `https://socials.ejay.bio`.

## How it's organized

```
src/
  index.tsx           entry point, mounts all routes
  db.ts               D1 queries (users, links)
  auth/
    discord.ts        OAuth exchange + auto-join-guild call
    session.ts         signed HttpOnly session cookie (HMAC, no JWT lib needed)
  routes/
    auth.ts           /auth/login, /auth/callback, /auth/logout
    dashboard.ts       /dashboard/* — profile, theme, link CRUD (auth-gated)
    public.ts          /@:slug — the public bio page
  pages/              server-rendered JSX views (Hono's built-in JSX, no React)
  utils/
    icons.tsx          URL → platform detection + icon/color
    themes.ts           theme presets
migrations/0001_init.sql  D1 schema
```

## Extending it

- **More themes**: add an entry to `THEMES` in `src/utils/themes.ts` — it
  automatically shows up as a swatch in the dashboard.
- **More platforms**: add a hostname pattern to `HOST_MAP` in
  `src/utils/icons.tsx`.
- **Custom avatar uploads** instead of pasting a URL: would need R2 (object
  storage) wired in — happy to add that next if you want real file uploads
  instead of the current "paste an image URL" field.
- **Click analytics per link**: add a `clicks` counter column and route link
  clicks through a redirect endpoint (`/@handle/l/:linkId`) instead of
  linking straight out.
