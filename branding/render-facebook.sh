#!/usr/bin/env bash
# Render banner-facebook.html to the two Facebook cover masters, both themes.
# Usage: branding/render-facebook.sh [dark|light]   (run from anywhere)
set -euo pipefail

cd "$(dirname "$0")"

THEME="${1:-dark}"
case "$THEME" in
  dark)  WORDMARK="light-txt.svg"; WATERMARK="light.svg" ;;
  light) WORDMARK="dark-txt.svg";  WATERMARK="dark.svg"  ;;
  *) echo "usage: $0 [dark|light]" >&2; exit 1 ;;
esac

render() {
  local w="$1" h="$2" out="$3"
  # Theme the body class and swap both logo assets — the light wordmark is
  # white and disappears on a light background, so it must be paired with the
  # dark mark, exactly as banner-light.html does.
  sed -e "s|<body class=\"dark\">|<body class=\"$THEME\">|" \
      -e "s|devalon-logos/light-txt.svg|devalon-logos/$WORDMARK|" \
      -e "s|devalon-logos/light.svg|devalon-logos/$WATERMARK|" \
      banner-facebook.html > "./.banner-facebook.render.html"

  chromium --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size="$w,$h" \
    --screenshot="$out" \
    "./.banner-facebook.render.html" >/dev/null 2>&1

  rm -f "./.banner-facebook.render.html"
  echo "  wrote $out"
}

echo "Rendering Facebook covers ($THEME)..."
# 1640x624 = 2x of 820x312 (Facebook desktop cover)
render 1640 624 "devalon-facebook-cover-$THEME-1640x624.png"
# 1280x720 = 2x of 640x360 (Facebook mobile cover)
render 1280 720 "devalon-facebook-cover-$THEME-1280x720.png"
