import { detectPlatform } from "../utils/icons";

export interface PublicLink {
  id: number;
  url: string;
  label: string;
}

export interface PublicUser {
  slug: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

export const PublicProfile = ({ user, links }: { user: PublicUser; links: PublicLink[] }) => (
  <div class="center-col">
    <div class="profile-header">
      <img class="avatar" src={user.avatar_url} alt={user.display_name} />
      <p class="display-name">{user.display_name}</p>
      <p class="handle">@{user.slug}</p>
      {user.bio && <p class="bio-text">{user.bio}</p>}
    </div>

    <div class="link-list">
      {links.map((link) => {
        const platform = detectPlatform(link.url);
        const Glyph = platform.glyph;
        return (
          <a class="link-btn" href={link.url} target="_blank" rel="noopener noreferrer">
            <span class="link-icon" style={`color:${platform.color}`}>
              <Glyph size={19} />
            </span>
            <span class="link-label">{link.label}</span>
          </a>
        );
      })}
      {links.length === 0 && (
        <p class="hint" style="text-align:center;">
          This page doesn't have any links yet.
        </p>
      )}
    </div>

    <div class="footer-badge">
      make your own at <a href="/">socials.ejay.bio</a>
    </div>
  </div>
);
