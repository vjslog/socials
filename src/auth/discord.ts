export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}

export interface DiscordEnv {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
  DISCORD_REDIRECT_URI: string;
}

// Scopes: identify (who they are) + guilds.join (lets our bot drop them
// straight into the server without them ever clicking an invite link).
const SCOPES = "identify guilds.join";

export function buildAuthorizeUrl(env: DiscordEnv, state: string) {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    state,
    prompt: "consent",
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(env: DiscordEnv, code: string) {
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
  });
  if (!res.ok) throw new Error(`Discord token exchange failed: ${await res.text()}`);
  return res.json<{ access_token: string; refresh_token: string; token_type: string }>();
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Discord user fetch failed: ${await res.text()}`);
  return res.json();
}

// Adds the authenticated user directly into your guild using the bot token.
// Requires: the bot must already be a member of the guild, and the user must
// have granted the `guilds.join` scope during OAuth.
export async function autoJoinGuild(env: DiscordEnv, discordUserId: string, userAccessToken: string) {
  const res = await fetch(
    `https://discord.com/api/guilds/${env.DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: userAccessToken }),
    }
  );
  // 201 = newly added, 204 = already a member. Both are success states.
  // We deliberately swallow failures here (e.g. bot missing permissions) so
  // that login never breaks just because the auto-invite step failed —
  // worst case the user falls back to the plain invite link.
  return res.status === 201 || res.status === 204;
}

export function discordAvatarUrl(user: DiscordUser) {
  if (!user.avatar) {
    // Default Discord avatar based on id, per Discord's CDN scheme.
    const index = (BigInt(user.id) >> 22n) % 6n;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
  const ext = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
}
