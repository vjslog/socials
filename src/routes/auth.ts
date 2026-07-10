import { Hono } from "hono";
import type { Env } from "../index";
import { buildAuthorizeUrl, exchangeCodeForToken, fetchDiscordUser, autoJoinGuild, discordAvatarUrl } from "../auth/discord";
import { createSessionCookie, clearSessionCookie } from "../auth/session";
import { createUser, getUserByDiscordId, slugTaken } from "../db";

export const authRoutes = new Hono<{ Bindings: Env }>();

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9_.]/g, "")
      .slice(0, 24) || `user${Math.floor(Math.random() * 100000)}`
  );
}

authRoutes.get("/login", (c) => {
  const state = crypto.randomUUID();
  const url = buildAuthorizeUrl(
    {
      DISCORD_CLIENT_ID: c.env.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: c.env.DISCORD_CLIENT_SECRET,
      DISCORD_BOT_TOKEN: c.env.DISCORD_BOT_TOKEN,
      DISCORD_GUILD_ID: c.env.DISCORD_GUILD_ID,
      DISCORD_REDIRECT_URI: c.env.DISCORD_REDIRECT_URI,
    },
    state
  );
  c.header("Set-Cookie", `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
  return c.redirect(url);
});

authRoutes.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const cookieState = (c.req.header("Cookie") ?? "").match(/oauth_state=([^;]+)/)?.[1];

  if (!code || !state || !cookieState || state !== cookieState) {
    return c.text("Invalid OAuth state. Please try signing in again.", 400);
  }

  const env = {
    DISCORD_CLIENT_ID: c.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: c.env.DISCORD_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: c.env.DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID: c.env.DISCORD_GUILD_ID,
    DISCORD_REDIRECT_URI: c.env.DISCORD_REDIRECT_URI,
  };

  try {
    const token = await exchangeCodeForToken(env, code);
    const discordUser = await fetchDiscordUser(token.access_token);

    // Fire-and-forget style, but awaited: never block login on this failing.
    await autoJoinGuild(env, discordUser.id, token.access_token).catch(() => false);

    let user = await getUserByDiscordId(c.env.DB, discordUser.id);
    if (!user) {
      const baseSlug = slugify(discordUser.username);
      let slug = baseSlug;
      let attempt = 0;
      // Ensure slug uniqueness with a small numeric suffix if it's already taken.
      while (await slugTaken(c.env.DB, slug)) {
        attempt += 1;
        slug = `${baseSlug}${attempt}`;
      }
      user = await createUser(c.env.DB, {
        discord_id: discordUser.id,
        slug,
        display_name: discordUser.global_name ?? discordUser.username,
        avatar_url: discordAvatarUrl(discordUser),
      });
    }

    if (!user) return c.text("Could not create your account. Please try again.", 500);

    const cookie = await createSessionCookie(
      { userId: user.id, discordId: user.discord_id, iat: Date.now() },
      c.env.SESSION_SECRET
    );
    c.header("Set-Cookie", cookie);
    return c.redirect("/dashboard");
  } catch (err: any) {
    return c.text(`Sign-in failed: ${err.message ?? "unknown error"}`, 500);
  }
});

authRoutes.get("/logout", (c) => {
  c.header("Set-Cookie", clearSessionCookie());
  return c.redirect("/");
});
