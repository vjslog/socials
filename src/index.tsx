import { Hono } from "hono";
import { Landing } from "./pages/Landing";
import { Layout } from "./pages/Layout";
import { authRoutes } from "./routes/auth";
import { dashboardRoutes } from "./routes/dashboard";
import { publicRoutes } from "./routes/public";

export interface Env {
  DB: D1Database;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
  DISCORD_REDIRECT_URI: string;
  DISCORD_INVITE_URL: string;
  SESSION_SECRET: string;
  PUBLIC_BASE_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) =>
  c.html(
    <Layout title="socials.ejay.bio — your link in bio">
      <Landing />
    </Layout>
  )
);

app.route("/auth", authRoutes);
app.route("/dashboard", dashboardRoutes);
app.route("/", publicRoutes); // handles /@:slug

app.notFound((c) => c.text("Not found.", 404));

export default app;
