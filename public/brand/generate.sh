#!/bin/bash
# profClaw Brand Asset Generator
# Generates all PNG sizes from source SVGs using rsvg-convert
# Run: cd public/brand && bash generate.sh

set -euo pipefail

BRAND_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$BRAND_DIR"

# Check for rsvg-convert
if ! command -v rsvg-convert &>/dev/null; then
  echo "Error: rsvg-convert not found. Install with: brew install librsvg"
  exit 1
fi

echo "=== profClaw Brand Asset Generator ==="
echo ""

# Clean old generated PNGs (keep source SVGs and existing hand-crafted PNGs)
rm -rf png/
mkdir -p png/{icon,wordmark,social}

# ─────────────────────────────────────────
# 1. SQUARE ICONS (from appicon.svg)
#    Source: 160x160 viewBox, renders sharp at any size
# ─────────────────────────────────────────
echo "Generating square icons..."

for size in 16 32 48 64 128 180 192 256 400 512 1024; do
  rsvg-convert -w $size -h $size profclaw-appicon.svg -o "png/icon/appicon-${size}.png"
  echo "  appicon-${size}.png"
done

# App icon shadow variant
for size in 256 512 1024; do
  rsvg-convert -w $size -h $size profclaw-appicon-shadow.svg -o "png/icon/appicon-shadow-${size}.png"
  echo "  appicon-shadow-${size}.png"
done

# Favicon coral background (dark crab on coral)
for size in 64 128 256 512; do
  rsvg-convert -w $size -h $size profclaw-favicon-coral-bg.svg -o "png/icon/favicon-coral-bg-${size}.png"
  echo "  favicon-coral-bg-${size}.png"
done

# Favicon coral body (coral crab on dark)
for size in 64 128 256 512; do
  rsvg-convert -w $size -h $size profclaw-favicon-coral-body.svg -o "png/icon/favicon-coral-body-${size}.png"
  echo "  favicon-coral-body-${size}.png"
done

# Favicon shadow variant
for size in 64 128 256 512; do
  rsvg-convert -w $size -h $size profclaw-favicon-shadow.svg -o "png/icon/favicon-shadow-${size}.png"
  echo "  favicon-shadow-${size}.png"
done

# Standalone mark (no background)
for size in 64 128 256 512 1024; do
  rsvg-convert -w $size -h $size profclaw-mark-coral.svg -o "png/icon/mark-coral-${size}.png"
  echo "  mark-coral-${size}.png"
done

# Mono white mark
for size in 64 128 256 512 1024; do
  rsvg-convert -w $size -h $size profclaw-mono-white.svg -o "png/icon/mark-white-${size}.png"
  echo "  mark-white-${size}.png"
done

# ─────────────────────────────────────────
# 2. WORDMARKS (horizontal logo + text)
#    Uses system-font render SVGs for reliable text
# ─────────────────────────────────────────
echo ""
echo "Generating wordmarks..."

# Dark bg version (white text) - at multiple widths
for width in 320 640 960 1280 1920; do
  height=$((width * 72 / 320))
  rsvg-convert -w $width -h $height "social-svg/wordmark-dark-render.svg" -o "png/wordmark/wordmark-dark-${width}w.png"
  echo "  wordmark-dark-${width}w.png"
done

# Light bg version (dark text)
for width in 320 640 960 1280 1920; do
  height=$((width * 72 / 320))
  rsvg-convert -w $width -h $height "social-svg/wordmark-light-render.svg" -o "png/wordmark/wordmark-light-${width}w.png"
  echo "  wordmark-light-${width}w.png"
done

# ─────────────────────────────────────────
# 3. SOCIAL MEDIA IMAGES (ready to upload)
# ─────────────────────────────────────────
echo ""
echo "Generating social media images..."

# GitHub social preview (1280x640)
rsvg-convert -w 1280 -h 640 "social-svg/github-social-preview.svg" -o "png/social/github-social-preview-1280x640.png"
echo "  github-social-preview-1280x640.png"

# OG image dark (1200x630)
rsvg-convert -w 1200 -h 630 "social-svg/og-image-dark.svg" -o "png/social/og-image-dark-1200x630.png"
echo "  og-image-dark-1200x630.png"

# OG image light (1200x630)
rsvg-convert -w 1200 -h 630 "social-svg/og-image-light.svg" -o "png/social/og-image-light-1200x630.png"
echo "  og-image-light-1200x630.png"

# 2x OG images for retina
rsvg-convert -w 2400 -h 1260 "social-svg/og-image-dark.svg" -o "png/social/og-image-dark-2400x1260.png"
echo "  og-image-dark-2400x1260.png (2x retina)"

# Twitter/X header (1500x500)
rsvg-convert -w 1500 -h 500 "social-svg/twitter-header.svg" -o "png/social/twitter-header-1500x500.png"
echo "  twitter-header-1500x500.png"

# LinkedIn banner (1128x191)
rsvg-convert -w 1128 -h 191 "social-svg/linkedin-banner.svg" -o "png/social/linkedin-banner-1128x191.png"
echo "  linkedin-banner-1128x191.png"

# 2x LinkedIn banner
rsvg-convert -w 2256 -h 382 "social-svg/linkedin-banner.svg" -o "png/social/linkedin-banner-2256x382.png"
echo "  linkedin-banner-2256x382.png (2x retina)"

# Profile photos (square, from appicon)
rsvg-convert -w 400 -h 400 profclaw-appicon.svg -o "png/social/profile-400x400.png"
echo "  profile-400x400.png (LinkedIn/Twitter/GitHub)"

rsvg-convert -w 800 -h 800 profclaw-appicon.svg -o "png/social/profile-800x800.png"
echo "  profile-800x800.png (2x retina)"

# ─────────────────────────────────────────
# 4. LEGACY COMPATIBILITY
#    Update root-level PNGs to match new high-res versions
# ─────────────────────────────────────────
echo ""
echo "Updating root-level PNGs..."

cp "png/icon/appicon-192.png" "profclaw-appicon-192.png"
cp "png/icon/appicon-512.png" "profclaw-appicon-512.png"
cp "png/icon/favicon-coral-bg-128.png" "profclaw-favicon-coral-bg-128.png"
cp "png/icon/favicon-coral-bg-64.png" "profclaw-favicon-coral-bg-64.png"
cp "png/icon/favicon-coral-body-128.png" "profclaw-favicon-coral-body-128.png"
cp "png/icon/favicon-shadow-128.png" "profclaw-favicon-shadow-128.png"
cp "png/icon/favicon-shadow-64.png" "profclaw-favicon-shadow-64.png"
cp "png/icon/mark-coral-256.png" "profclaw-mark-coral-256.png"
cp "png/icon/mark-coral-64.png" "profclaw-mark-coral-64.png"
echo "  Updated all root-level PNGs"

# ─────────────────────────────────────────
# Summary
# ─────────────────────────────────────────
echo ""
echo "=== Generation Complete ==="
echo ""
echo "Output structure:"
echo "  png/"
echo "    icon/         Square icons (16-1024px) - appicon, favicon, mark variants"
echo "    wordmark/     Horizontal logos (320-1920px) - dark and light versions"
echo "    social/       Ready-to-upload social images:"
echo "                  - github-social-preview-1280x640.png"
echo "                  - og-image-dark-1200x630.png / og-image-light-1200x630.png"
echo "                  - twitter-header-1500x500.png"
echo "                  - linkedin-banner-1128x191.png"
echo "                  - profile-400x400.png / profile-800x800.png"
echo ""

TOTAL=$(find png/ -name "*.png" | wc -l | tr -d ' ')
echo "Total PNGs generated: $TOTAL"
echo ""
echo "Quick reference - which image for which platform:"
echo "  GitHub profile:    png/social/profile-400x400.png"
echo "  GitHub repo social: png/social/github-social-preview-1280x640.png"
echo "  LinkedIn logo:     png/social/profile-400x400.png"
echo "  LinkedIn banner:   png/social/linkedin-banner-1128x191.png"
echo "  Twitter/X profile: png/social/profile-400x400.png"
echo "  Twitter/X header:  png/social/twitter-header-1500x500.png"
echo "  OG/share image:    png/social/og-image-dark-1200x630.png"
echo "  App Store icon:    png/icon/appicon-1024.png"
echo "  Android icon:      png/icon/appicon-512.png"
echo "  Apple touch icon:  png/icon/appicon-180.png"
