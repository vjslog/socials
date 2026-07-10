import { Hono } from "hono";
import type { Env } from "../index";
import { getUserBySlug, getLinks } from "../db";
import { PublicProfile } from "../pages/PublicProfile";
import { Layout } from "../pages/Layout";
import { getTheme } from "../utils/themes";

export const publicRoutes = new Hono<{ Bindings: Env }>();

publicRoutes.get("/@:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const user = await getUserBySlug(c.env.DB, slug);
  if (!user) return c.text("This page doesn't exist (yet).", 404);

  const links = await getLinks(c.env.DB, user.id);
  return c.html(
    <Layout title={`${user.display_name} (@${user.slug})`} theme={getTheme(user.theme)}>
      <PublicProfile user={user} links={links} />
    </Layout>
  );
});
