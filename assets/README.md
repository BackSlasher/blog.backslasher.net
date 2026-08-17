# Hero / share image specs

Notes on what a post's hero image needs to be so the link preview renders as a big
card on Facebook, LinkedIn and WhatsApp. Researched 2026-08-17 — re-check the
official links at the bottom if something stops rendering.

## The short version

One image satisfies all three platforms:

- **1200 × 630 px** (1.91:1)
- **JPEG**, sRGB, no alpha
- **under 300 KB**
- served over **HTTPS at an absolute URL**, publicly reachable (no auth, no `robots.txt` block)
- keep text/faces inside the centre **~1080 × 600** safe zone — the edges get cropped
  differently per platform and per client

The 300 KB is the binding constraint: Facebook and LinkedIn are happy with megabytes,
WhatsApp is the one that quietly drops the image.

## Per-platform detail

| | Facebook | LinkedIn | WhatsApp |
|---|---|---|---|
| Recommended | ≥ 1200 × 630 | ≥ 1200 × 627 | ~1200 × 630 |
| Aspect ratio | 1.91:1 (else cropped) | 1.91:1 | anything up to 4:1 W/H |
| Minimum | 200 × 200 | 401 px wide (below that → small thumbnail) | 300 px wide |
| Max file size | 8 MB | 5 MB | 600 KB official, ~300 KB in practice |
| Formats | JPG/PNG (WebP works, not guaranteed) | JPG, PNG, GIF | JPG/PNG; **WebP is unreliable** |

Facebook's fallback ladder: ≥1200 × 630 gives the full-width card; 600 × 315 to
1199 × 629 still gives a large card but softer; below 600 × 315 collapses to a small
square thumbnail beside the text.

WhatsApp is the fussiest of the three — it fetches the image inline on the sender's
device with a tight budget, so an oversized or WebP image silently degrades to the
text-only preview.

## How this blog picks the image

`_includes/seo.html` (Minimal Mistakes) resolves `og:image` in this order:

1. `page.header.og_image`
2. `page.header.overlay_image`
3. `page.header.image`
4. `page.header.teaser` / `site.og_image`

`site.og_image` is **commented out** in `_config.yml`, so a post with no `header:` block
gets *no* `og:image` at all and shares as a bare text link. Several existing posts are
in that state.

`overlay_image` doubles as the on-page banner, which wants a wide letterbox crop, not
1.91:1. When the banner crop and the share crop disagree, set both:

```yaml
header:
  overlay_image: /assets/breezy/12-case-render.png   # on-page banner
  og_image: /assets/breezy/share.jpg                 # 1200x630, <300KB
```

The theme runs both through `absolute_url`, so site-relative paths are fine.

## Making one

```sh
# from an existing photo/render: fill 1200x630, centre-crop, strip metadata
magick input.jpg \
  -resize 1200x630^ -gravity center -extent 1200x630 \
  -colorspace sRGB -background white -alpha remove -alpha off \
  -strip -sampling-factor 4:2:0 -quality 82 \
  share.jpg

# check it landed under 300KB
identify -format "%wx%h %b\n" share.jpg
```

`-alpha remove -background white` matters for PNG sources: transparency renders as
black on most preview clients.

Optionally pin the dimensions in the head so the first ever share renders large
instead of waiting for the crawler to measure the file:

```html
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

## Verifying

Previews are cached per-URL and per-platform; after changing an image you must
re-scrape, not just reload.

- Facebook — <https://developers.facebook.com/tools/debug/> ("Scrape Again")
- LinkedIn — <https://www.linkedin.com/post-inspector/>
- WhatsApp — no official tool. It reuses Facebook's crawler cache, so scrape via the
  FB debugger first, then test in a chat with yourself. Appending `?v=2` to the URL
  forces a fresh fetch if the cache is stuck.

## Sources

- [Facebook: sharing best practices for images](https://developers.facebook.com/docs/sharing/webmasters/images/)
- [WhatsApp link previews (Meta for Developers)](https://developers.facebook.com/documentation/business-messaging/whatsapp/link-previews/)
- [LinkedIn: making your website shareable](https://www.linkedin.com/help/linkedin/answer/a521928)
- [The Open Graph protocol](https://ogp.me/)
