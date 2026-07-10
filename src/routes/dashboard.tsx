import { Hono } from "hono";
import type { Env } from "../index";
import { readSession } from "../auth/session";
import {
  getUserById,
  getLinks,
  updateProfile,
  updateTheme,
  addLink,
  deleteLink,
  moveLink,
  slugTaken,
} from "../db";
import { Dashboard } from "../pages/Dashboard";
import { Layout } from "../pages/Layout";
import { getTheme } from "../utils/themes";
import type { UserRow } from "../db";

export const dashboardRoutes = new Hono<{ Bindings: Env; Variables: { user: UserRow } }>();

// Auth guard: every route below requires a valid session cookie.
dashboardRoutes.use("*", async (c, next) => {
  const session = await readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
  if (!session) return c.redirect("/auth/login");
  const user = await getUserById(c.env.DB, session.userId);
  if (!user) return c.redirect("/auth/login");
  c.set("user", user);
  await next();
});

function render(c: any, toast?: { type: "ok" | "err"; message: string }) {
  const user = c.get("user");
  return getLinks(c.env.DB, user.id).then((links) =>
    c.html(
      <Layout title="Your dashboard" theme={getTheme(user.theme)}>
        <Dashboard user={user} links={links} publicBaseUrl={c.env.PUBLIC_BASE_URL} toast={toast} />
      </Layout>
    )
  );
}

dashboardRoutes.get("/", (c) => render(c));

dashboardRoutes.post("/profile", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();
  const display_name = String(body.display_name ?? "").trim().slice(0, 40) || user.display_name;
  const bio = String(body.bio ?? "").trim().slice(0, 160);
  const avatar_url = String(body.avatar_url ?? "").trim();
  let slug = String(body.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "");

  if (!slug || slug.length < 3) {
    return render(c, { type: "err", message: "Handle must be at least 3 characters (letters, numbers, _ or .)." });
  }
  if (await slugTaken(c.env.DB, slug, user.id)) {
    return render(c, { type: "err", message: `@${slug} is already taken — try another handle.` });
  }

  await updateProfile(c.env.DB, user.id, { display_name, slug, bio, avatar_url });
  c.set("user", { ...user, display_name, slug, bio, avatar_url });
  return render(c, { type: "ok", message: "Profile saved." });
});

dashboardRoutes.post("/theme", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();
  const theme = String(body.theme ?? "aurora");
  await updateTheme(c.env.DB, user.id, theme);
  c.set("user", { ...user, theme });
  return render(c, { type: "ok", message: "Theme updated." });
});

dashboardRoutes.post("/links/add", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();
  const url = String(body.url ?? "").trim();
  const label = String(body.label ?? "").trim().slice(0, 60);

  try {
    new URL(url);
  } catch {
    return render(c, { type: "err", message: "That doesn't look like a valid URL." });
  }
  if (!label) return render(c, { type: "err", message: "Give the button some text." });

  await addLink(c.env.DB, user.id, url, label);
  return render(c, { type: "ok", message: "Link added." });
});

dashboardRoutes.post("/links/:id/delete", async (c) => {
  const user = c.get("user");
  await deleteLink(c.env.DB, user.id, Number(c.req.param("id")));
  return render(c, { type: "ok", message: "Link removed." });
});

dashboardRoutes.post("/links/:id/move", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();
  const direction = body.direction === "up" ? "up" : "down";
  await moveLink(c.env.DB, user.id, Number(c.req.param("id")), direction);
  return render(c);
});
