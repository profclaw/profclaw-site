<p align="center">
  <img src="public/brand/profclaw-mark-coral-256.png" alt="profClaw" width="80" />
</p>

<h1 align="center">profClaw Landing Page</h1>

<p align="center">
  <strong>Smart, lightweight AI agent engine. Run locally on anything.</strong>
</p>

<p align="center">
  <a href="https://profclaw.ai">Website</a> &middot;
  <a href="https://github.com/profclaw/profclaw">Main Repo</a> &middot;
  <a href="https://x.com/profclaw">Twitter</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/astro-5.x-FF5D01?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/tailwind-4.x-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
  <img src="https://img.shields.io/badge/deploy-vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## About

Landing page for [profClaw](https://github.com/profclaw/profclaw) - an open-source AI agent engine that runs locally on Docker, VPS, home PC, or Mac.

Built with Astro 5 (static output, zero JS shipped) and Tailwind v4. Designed for performance - targets 100/100 Lighthouse score.

## Tech Stack

- **Framework**: [Astro 5](https://astro.build) - static site generator
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) - utility-first CSS
- **Fonts**: Plus Jakarta Sans, Manrope, JetBrains Mono (Google Fonts)
- **Hosting**: [Vercel](https://vercel.com) / Cloudflare Pages
- **OG Image**: Custom Astro component + Playwright screenshot

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (port 6001)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate OG image (requires dev server running)
pnpm og
```

## Project Structure

```
profclaw-site/
  public/
    brand/          # SVG/PNG brand assets (mascot, wordmarks, favicons)
    favicon/        # Favicon set (ico, png, webmanifest)
    og-image.png    # 1200x630 social sharing image
    robots.txt
    sitemap.xml
  src/
    layouts/
      BaseLayout.astro    # HTML shell, meta tags, JSON-LD, theme toggle
    pages/
      index.astro         # Main landing page
      og.astro            # OG image template (screenshot to PNG)
    components/
      Hero.astro           # Hero section with mascot + terminal
      Features.astro       # 12-card feature grid
      DeploymentModes.astro # Pico/Mini/Pro deployment cards
      Providers.astro      # Provider/integration marquee
      ClawFamily.astro     # Timeline: OpenClaw -> profClaw
      QuickStart.astro     # Terminal install blocks
      OpenSource.astro     # AGPL-3.0 / privacy section
      Footer.astro         # CTA banner + footer
    styles/
      global.css           # Theme tokens, starfield, animations
  scripts/
    generate-og.mjs        # OG image generation script
```

## Features

- Dark/light theme with smooth transition
- Deep space parallax starfield with realistic shooting meteors
- Scroll-triggered fade-in animations with stagger
- Responsive: mobile, tablet, desktop
- Full SEO: OG tags, Twitter cards, JSON-LD, sitemap, robots.txt
- Accessible: ARIA labels, reduced-motion support, semantic HTML
- Zero JavaScript shipped (all interactions via `is:inline` scripts)

## OG Image

The OG image is generated from a custom Astro component at `/og`. To regenerate:

```bash
# Start dev server first
pnpm dev

# In another terminal
pnpm og
```

This screenshots `http://localhost:6001/og` at 1200x630 using Playwright.

## Maintained By

<table>
  <tr>
    <td align="center">
      <a href="https://glincker.com">
        <strong>GLINR Studios</strong>
      </a>
      <br />
      <sub>by Glincker LLC</sub>
    </td>
  </tr>
</table>

## Partners

- [askVerdict.ai](https://askverdict.ai) - AI-powered legal research

## License

MIT License - see [LICENSE](LICENSE) for details.

The profClaw engine itself is licensed under [AGPL-3.0](https://github.com/profclaw/profclaw/blob/main/LICENSE). This landing page site is MIT.
