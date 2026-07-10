import { THEMES } from "../utils/themes";
import { detectPlatform } from "../utils/icons";

export interface DashUser {
  id: number;
  slug: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: string;
}
export interface DashLink {
  id: number;
  url: string;
  label: string;
  position: number;
}

export const Dashboard = ({
  user,
  links,
  publicBaseUrl,
  toast,
}: {
  user: DashUser;
  links: DashLink[];
  publicBaseUrl: string;
  toast?: { type: "ok" | "err"; message: string };
}) => (
  <div class="wrap">
    <div class="nav">
      <div class="brand">
        socials<span class="accent-part">.ejay.bio</span>
      </div>
      <div style="display:flex; gap:10px;">
        <a class="btn small" href={`${publicBaseUrl}/@${user.slug}`} target="_blank">
          View my page
        </a>
        <a class="btn small danger" href="/auth/logout">
          Log out
        </a>
      </div>
    </div>

    {toast && <div class={`toast ${toast.type}`}>{toast.message}</div>}

    <div class="dash-grid">
      {/* Left column: profile + theme */}
      <div style="display:flex; flex-direction:column; gap:20px;">
        <form class="card panel" method="post" action="/dashboard/profile">
          <h2>Profile</h2>
          <div class="field">
            <label>Display name</label>
            <input type="text" name="display_name" value={user.display_name} maxlength={40} required />
          </div>
          <div class="field">
            <label>Handle (your @, used in the URL)</label>
            <input type="text" name="slug" value={user.slug} pattern="[a-z0-9_.]{3,30}" maxlength={30} required />
            <p class="hint">
              {publicBaseUrl}/@{user.slug || "handle"}
            </p>
          </div>
          <div class="field">
            <label>Bio</label>
            <textarea name="bio" rows={3} maxlength={160}>
              {user.bio}
            </textarea>
          </div>
          <div class="field">
            <label>Avatar URL</label>
            <input type="url" name="avatar_url" value={user.avatar_url} placeholder="https://..." />
          </div>
          <button class="btn primary block" type="submit">
            Save profile
          </button>
        </form>

        <div class="card panel">
          <h2>Theme</h2>
          <form method="post" action="/dashboard/theme">
            <div class="theme-grid">
              {Object.values(THEMES).map((t) => (
                <label>
                  <input
                    type="radio"
                    name="theme"
                    value={t.key}
                    checked={t.key === user.theme}
                    style="display:none;"
                    onchange="this.form.requestSubmit()"
                  />
                  <div class={`theme-swatch ${t.key === user.theme ? "selected" : ""}`} style={`background:${t.bg}; color:${t.text}`}>
                    {t.name}
                  </div>
                </label>
              ))}
            </div>
          </form>
          <p class="hint">Tap a swatch to preview it live on your page.</p>
        </div>
      </div>

      {/* Right column: links */}
      <div class="card panel">
        <h2>Links</h2>

        <form method="post" action="/dashboard/links/add" style="margin-bottom:18px;">
          <div class="field">
            <label>Paste a link</label>
            <input type="url" name="url" placeholder="https://tiktok.com/@yourname" required />
          </div>
          <div class="field">
            <label>Button text</label>
            <input type="text" name="label" placeholder="e.g. TikTok, or '10% off with code XYZ'" maxlength={60} required />
          </div>
          <button class="btn primary block" type="submit">
            Add link
          </button>
        </form>

        <div>
          {links.map((link, i) => {
            const platform = detectPlatform(link.url);
            const Glyph = platform.glyph;
            return (
              <div class="link-row">
                <span class="link-icon" style={`color:${platform.color}; width:32px;height:32px;`}>
                  <Glyph size={16} />
                </span>
                <div class="grow">
                  <div style="font-weight:600; font-size:14px;">{link.label}</div>
                  <div class="meta">{link.url}</div>
                </div>
                <div class="reorder-btns">
                  <form method="post" action={`/dashboard/links/${link.id}/move`}>
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" disabled={i === 0}>
                      ▲
                    </button>
                  </form>
                  <form method="post" action={`/dashboard/links/${link.id}/move`}>
                    <input type="hidden" name="direction" value="down" />
                    <button type="submit" disabled={i === links.length - 1}>
                      ▼
                    </button>
                  </form>
                </div>
                <form method="post" action={`/dashboard/links/${link.id}/delete`}>
                  <button class="btn small danger" type="submit">
                    Remove
                  </button>
                </form>
              </div>
            );
          })}
          {links.length === 0 && <p class="hint">No links yet — add your first one above.</p>}
        </div>
      </div>
    </div>
  </div>
);
