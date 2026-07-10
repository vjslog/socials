export interface UserRow {
  id: number;
  discord_id: string;
  slug: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: string;
  created_at: number;
}

export interface LinkRow {
  id: number;
  user_id: number;
  url: string;
  label: string;
  position: number;
  created_at: number;
}

export async function getUserByDiscordId(db: D1Database, discordId: string) {
  return db.prepare("SELECT * FROM users WHERE discord_id = ?").bind(discordId).first<UserRow>();
}

export async function getUserBySlug(db: D1Database, slug: string) {
  return db.prepare("SELECT * FROM users WHERE slug = ?").bind(slug).first<UserRow>();
}

export async function getUserById(db: D1Database, id: number) {
  return db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<UserRow>();
}

export async function slugTaken(db: D1Database, slug: string, excludeUserId?: number) {
  const row = await db
    .prepare("SELECT id FROM users WHERE slug = ? AND id != ?")
    .bind(slug, excludeUserId ?? -1)
    .first<{ id: number }>();
  return !!row;
}

export async function createUser(
  db: D1Database,
  data: { discord_id: string; slug: string; display_name: string; avatar_url: string }
) {
  await db
    .prepare("INSERT INTO users (discord_id, slug, display_name, avatar_url) VALUES (?, ?, ?, ?)")
    .bind(data.discord_id, data.slug, data.display_name, data.avatar_url)
    .run();
  return getUserByDiscordId(db, data.discord_id);
}

export async function updateProfile(
  db: D1Database,
  userId: number,
  data: { display_name: string; slug: string; bio: string; avatar_url: string }
) {
  await db
    .prepare("UPDATE users SET display_name = ?, slug = ?, bio = ?, avatar_url = ? WHERE id = ?")
    .bind(data.display_name, data.slug, data.bio, data.avatar_url, userId)
    .run();
}

export async function updateTheme(db: D1Database, userId: number, theme: string) {
  await db.prepare("UPDATE users SET theme = ? WHERE id = ?").bind(theme, userId).run();
}

export async function getLinks(db: D1Database, userId: number) {
  const { results } = await db
    .prepare("SELECT * FROM links WHERE user_id = ? ORDER BY position ASC, id ASC")
    .bind(userId)
    .all<LinkRow>();
  return results ?? [];
}

export async function addLink(db: D1Database, userId: number, url: string, label: string) {
  const max = await db
    .prepare("SELECT COALESCE(MAX(position), -1) as maxPos FROM links WHERE user_id = ?")
    .bind(userId)
    .first<{ maxPos: number }>();
  const position = (max?.maxPos ?? -1) + 1;
  await db
    .prepare("INSERT INTO links (user_id, url, label, position) VALUES (?, ?, ?, ?)")
    .bind(userId, url, label, position)
    .run();
}

export async function deleteLink(db: D1Database, userId: number, linkId: number) {
  await db.prepare("DELETE FROM links WHERE id = ? AND user_id = ?").bind(linkId, userId).run();
}

export async function moveLink(db: D1Database, userId: number, linkId: number, direction: "up" | "down") {
  const links = await getLinks(db, userId);
  const idx = links.findIndex((l) => l.id === linkId);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= links.length) return;

  const a = links[idx];
  const b = links[swapWith];
  await db.batch([
    db.prepare("UPDATE links SET position = ? WHERE id = ?").bind(b.position, a.id),
    db.prepare("UPDATE links SET position = ? WHERE id = ?").bind(a.position, b.id),
  ]);
}
