import type { FC } from "hono/jsx";
import type { Theme } from "../utils/themes";

export const Layout: FC<{ title: string; theme?: Theme; children: any }> = ({ title, theme, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{GLOBAL_CSS}</style>
        {theme && (
          <style>{`
            :root {
              --bg: ${theme.bg};
              --card: ${theme.card};
              --card-hover: ${theme.cardHover};
              --text: ${theme.text};
              --subtext: ${theme.subtext};
              --accent: ${theme.accent};
              --border: ${theme.border};
            }
          `}</style>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
};

const GLOBAL_CSS = `
  :root {
    --bg: radial-gradient(900px 500px at 50% 0%, rgba(90,88,214,0.20) 0%, rgba(90,88,214,0) 60%), #0a0a12;
    --card: rgba(255,255,255,0.035);
    --card-hover: rgba(108,108,240,0.12);
    --text: #f2f2f7;
    --subtext: #888ca3;
    --accent: #6c6cf0;
    --border: rgba(255,255,255,0.07);
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--bg);
    background-attachment: fixed;
    color: var(--text);
    font-family: 'Inter', system-ui, sans-serif;
    min-height: 100vh;
  }
  h1, h2, h3, .display { font-family: 'Manrope', 'Inter', sans-serif; font-weight: 800; letter-spacing: -0.02em; }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }
  ::selection { background: var(--accent); color: #0a0a12; }

  .wrap { max-width: 960px; margin: 0 auto; padding: 0 20px; }
  .center-col { max-width: 460px; margin: 0 auto; padding: 48px 20px 80px; }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0;
  }
  .brand { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 18px; letter-spacing: -0.01em; color: var(--text); }
  .brand .accent-part { color: var(--accent); }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    padding: 12px 22px; border-radius: 999px; border: 1px solid var(--border);
    background: var(--card); color: var(--text); font-weight: 600; font-size: 14px;
    cursor: pointer; transition: transform .15s ease, background .15s ease, border-color .15s ease;
  }
  .btn:hover { background: var(--card-hover); transform: translateY(-1px); border-color: var(--accent); }
  .btn.primary { background: var(--accent); color: #fff; border-color: transparent; }
  .btn.primary:hover { filter: brightness(1.1); background: var(--accent); }
  .btn.block { width: 100%; }
  .btn.small { padding: 8px 14px; font-size: 13px; border-radius: 10px; }
  .btn.danger { color: #ff6b6b; }

  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: 22px;
  }

  input, textarea, select {
    width: 100%; background: rgba(255,255,255,0.035); border: 1px solid var(--border);
    color: var(--text); border-radius: 12px; padding: 11px 13px; font-size: 14px;
    font-family: inherit; outline: none; transition: border-color .15s ease;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--accent); }
  label { font-size: 11.5px; color: var(--subtext); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; display: block; margin-bottom: 7px; }
  .field { margin-bottom: 16px; }
  .hint { font-size: 12px; color: var(--subtext); margin-top: 6px; }

  /* --- Public profile page --- */
  .profile-header { text-align: center; margin-bottom: 32px; }
  .avatar {
    width: 92px; height: 92px; border-radius: 50%; object-fit: cover;
    border: 3px solid var(--border); margin-bottom: 16px; background: var(--card);
  }
  .display-name { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 22px; margin: 0 0 2px; }
  .handle { font-size: 13.5px; color: var(--subtext); margin: 0 0 12px; letter-spacing: .02em; }
  .bio-text { font-size: 14px; color: var(--subtext); line-height: 1.5; max-width: 380px; margin: 0 auto; }

  .link-list { display: flex; flex-direction: column; gap: 12px; }
  .link-btn {
    display: flex; align-items: center; gap: 14px; padding: 13px 20px 13px 13px;
    border-radius: 999px; background: var(--card); border: 1px solid var(--border);
    transition: transform .15s ease, background .15s ease, border-color .15s ease;
  }
  .link-btn:hover { background: var(--card-hover); transform: translateY(-2px); border-color: var(--accent); }
  .link-icon {
    width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; background: rgba(255,255,255,0.06);
  }
  .link-label { font-weight: 600; font-size: 14.5px; }

  .footer-badge {
    text-align: center; margin-top: 40px; font-size: 12px; color: var(--subtext);
  }
  .footer-badge a { color: var(--accent); font-weight: 600; }

  /* --- Dashboard --- */
  .dash-grid { display: grid; grid-template-columns: 1fr; gap: 20px; padding: 24px 0 60px; }
  @media (min-width: 860px) { .dash-grid { grid-template-columns: 340px 1fr; align-items: start; } }
  .panel { padding: 24px; }
  .panel h2 { font-size: 14px; margin: 0 0 16px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--subtext); }

  .theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .theme-swatch {
    height: 54px; border-radius: 14px; cursor: pointer; border: 2px solid transparent;
    display: flex; align-items: flex-end; padding: 8px; font-size: 10px; font-weight: 700;
  }
  .theme-swatch.selected { border-color: var(--accent); }

  .link-row {
    display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 16px;
    background: rgba(255,255,255,0.025); border: 1px solid var(--border); margin-bottom: 10px;
  }
  .link-row .grow { flex: 1; min-width: 0; }
  .link-row .meta { font-size: 12px; color: var(--subtext); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .reorder-btns { display: flex; flex-direction: column; gap: 2px; }
  .reorder-btns button { background: none; border: none; color: var(--subtext); cursor: pointer; padding: 0 4px; }
  .reorder-btns button:hover { color: var(--accent); }

  .toast { font-size: 13px; padding: 10px 16px; border-radius: 12px; margin-bottom: 16px; }
  .toast.ok { background: rgba(108,108,240,0.12); color: #9d9dff; border: 1px solid rgba(108,108,240,0.3); }
  .toast.err { background: rgba(255,107,107,0.12); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.3); }
`;
