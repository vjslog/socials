export const Landing = () => (
  <div class="wrap">
    <div class="nav">
      <div class="brand">
        socials<span class="accent-part">.ejay.bio</span>
      </div>
      <a href="/auth/login" class="btn primary">
        Sign in with Discord
      </a>
    </div>

    <div style="max-width:640px; margin: 90px auto 0; text-align:center;">
      <h1 class="display" style="font-size: 44px; line-height:1.1; margin: 0 0 16px;">
        One link.<br />Every profile.
      </h1>
      <p style="color:var(--subtext); font-size:16px; line-height:1.6; max-width:460px; margin:0 auto 32px;">
        Build a link-in-bio page in seconds — signed in with Discord, hosted at your own{" "}
        <span style="color:var(--text); font-weight:600;">socials.ejay.bio/@handle</span>.
      </p>
      <a href="/auth/login" class="btn primary" style="padding: 14px 26px; font-size: 15px;">
        Get your page →
      </a>
      <p class="hint" style="margin-top: 14px;">
        Signing in also adds you to our Discord community.
      </p>
    </div>
  </div>
);
