# OG Images — 영주선비AI

This directory holds Open Graph preview images for heritage detail pages.

## File naming convention

Each heritage page references its OG image as:

```
/og/{heritage.id}.jpg
```

(See `src/app/heritage/[id]/page.tsx` → `generateMetadata`.)

| Heritage ID         | Expected file              |
| ------------------- | -------------------------- |
| buseoksa            | `buseoksa.jpg`             |
| sosuseowon          | `sosuseowon.jpg`           |
| sunbichon           | `sunbichon.jpg`            |
| museom              | `museom.jpg`               |
| sobaeksan           | `sobaeksan.jpg`            |
| sosu-museum         | `sosu-museum.jpg`          |
| yeongju-hyanggyo    | `yeongju-hyanggyo.jpg`     |
| punggi-ginseng      | `punggi-ginseng.jpg`       |

## Specs

- Format: JPEG (`.jpg`)
- Dimensions: **1200 × 630 px** (Open Graph standard)
- Twitter card: `summary_large_image` (same image is reused)
- Target file size: < 300 KB per image

## Status

OG image generation is deferred — files are referenced by URL but not yet
produced. Crawlers that fail to resolve the image will simply fall back to
the default site preview, so missing files do not break page rendering.
