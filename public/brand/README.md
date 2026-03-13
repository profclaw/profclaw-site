# profClaw Brand Assets

## Quick Reference

| Platform | Image | Size | File |
|----------|-------|------|------|
| GitHub profile | App icon | 400x400 | `png/social/profile-400x400.png` |
| GitHub repo social | Preview card | 1280x640 | `png/social/github-social-preview-1280x640.png` |
| LinkedIn logo | App icon | 400x400 | `png/social/profile-400x400.png` |
| LinkedIn banner | Wide banner | 1128x191 | `png/social/linkedin-banner-1128x191.png` |
| Twitter/X profile | App icon | 400x400 | `png/social/profile-400x400.png` |
| Twitter/X header | Wide banner | 1500x500 | `png/social/twitter-header-1500x500.png` |
| OG/share image | Card preview | 1200x630 | `png/social/og-image-dark-1200x630.png` |
| App Store | Icon | 1024x1024 | `png/icon/appicon-1024.png` |
| Android/PWA | Icon | 512x512 | `png/icon/appicon-512.png` |
| Apple touch | Icon | 180x180 | `png/icon/appicon-180.png` |

## Folder Structure

```
brand/
  *.svg                     Source SVGs (original designs)
  social-svg/               Social preview SVG templates
  png/
    icon/                   Square icons (16-1024px)
      appicon-{size}.png        Main app icon (coral crab, dark bg)
      appicon-shadow-{size}.png Shadow variant
      favicon-coral-bg-*.png    Dark crab on coral background
      favicon-coral-body-*.png  Coral crab on dark background
      favicon-shadow-*.png      Shadow crab on dark background
      mark-coral-*.png          Standalone coral crab (transparent bg)
      mark-white-*.png          White silhouette (transparent bg)
    wordmark/               Horizontal logo + text
      wordmark-dark-*.png       For dark backgrounds (white text)
      wordmark-light-*.png      For light backgrounds (dark text)
    social/                 Ready-to-upload social images
      github-social-preview-1280x640.png
      og-image-dark-1200x630.png
      og-image-light-1200x630.png
      og-image-dark-2400x1260.png   (2x retina)
      twitter-header-1500x500.png
      linkedin-banner-1128x191.png
      linkedin-banner-2256x382.png  (2x retina)
      profile-400x400.png
      profile-800x800.png          (2x retina)
  generate.sh               Regenerate all PNGs from SVGs
```

## Regenerating

Requires `rsvg-convert` (from librsvg):

```bash
brew install librsvg
cd public/brand
bash generate.sh
```

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Coral 400 | `#fb7185` | Light accent, gradient start |
| Rose 600 | `#e11d48` | Primary, gradient end |
| Rose 500 | `#f43f5e` | Primary accent |
| Rose 800 | `#9f1239` | Dark accent details |
| Rose 900 | `#4c0519` | Pupils, darkest accent |
| Deep Space | `#050810` | Dark background |
| Dark Surface | `#0a0810` | Card/surface background |
| Navy | `#1a1a2e` | Light mode text |
