# Local fonts

All fonts are licensed under the SIL Open Font License 1.1 (see `OFL.txt` in
each directory) and are served locally — the site never requests fonts from
third-party services at runtime.

| Directory | Family | Source |
| --- | --- | --- |
| `noto-serif-sc/` | Noto Serif SC | Google Fonts (split subsets, unicode-range) |
| `lxgw-wenkai/` | LXGW WenKai | lxgw/LxgwWenKai v1.522, subset to GB2312 + ASCII + CJK punctuation with pyftsubset |
| `cormorant-garamond/` | Cormorant Garamond | Google Fonts (split subsets, unicode-range) |
| `ibm-plex-mono/` | IBM Plex Mono | Google Fonts (split subsets, unicode-range) |

Regenerating the LXGW WenKai subset:

```bash
# 1. Download LXGWWenKai-Regular.ttf from github.com/lxgw/LxgwWenKai/releases
# 2. Build chars.txt from the GB2312 range plus ASCII and CJK punctuation
# 3. pyftsubset LXGWWenKai-Regular.ttf --text-file=chars.txt \
#      --flavor=woff2 --output-file=LXGWWenKai-Regular.woff2 --no-hinting
```
