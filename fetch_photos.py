# species.js 의 한국어 이름으로 위키백과 요약(사진·설명)을 모아 photos.json 에 저장한다.
import json, re, urllib.request, urllib.parse, pathlib, time, sys
root = pathlib.Path(__file__).parent
src = (root / 'species.js').read_text()
rows = [r for r in re.findall(r"^\['(\w+)', '([^']+)', '([^']+)'", src, re.M)]
ALIAS = json.loads((root / 'wiki_alias.json').read_text()) if (root / 'wiki_alias.json').exists() else {}
out = json.loads((root / 'photos.json').read_text()) if (root / 'photos.json').exists() else {}
UA = {'User-Agent': 'bug-explorer-kids-app/1.0 (educational; contact via github yong-hyun01)'}
def summary(lang, title):
    url = f'https://{lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}'
    d = None
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
                d = json.load(r); break
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(8 * (attempt + 1)); continue
            return None
        except Exception:
            return None
    if d is None: return None
    if d.get('type') == 'disambiguation' or not d.get('thumbnail'): return None
    img = d.get('originalimage', {}).get('source') or d['thumbnail']['source']
    th = d['thumbnail']['source']
    # 썸네일을 640px 로
    th = re.sub(r'\?.*$', '', re.sub(r'/(\d+)px-', '/500px-', th)).replace('thumb.wikimedia.org', 'upload.wikimedia.org')  # 허용 폭: 250/330/500/960/1280
    return {'title': d.get('title'), 'img': th, 'extract': d.get('extract', ''), 'url': d.get('content_urls', {}).get('desktop', {}).get('page'), 'lang': lang, 'sci': d.get('description', '')}
miss = []
for sid, name, grp in rows:
    if sid in out and out[sid]: continue
    cands = []
    if sid in ALIAS: cands += ALIAS[sid] if isinstance(ALIAS[sid], list) else [ALIAS[sid]]
    cands.append(('ko', name.replace(' 암컷', '').replace(' 애벌레', '')))
    res = None
    for c in cands:
        lang, title = c if isinstance(c, (list, tuple)) else ('ko', c)
        res = summary(lang, title)
        if res: break
        time.sleep(1.0)
    out[sid] = res
    if not res: miss.append((sid, name))
    time.sleep(1.0)
(root / 'photos.json').write_text(json.dumps(out, ensure_ascii=False, indent=0))
print('total', len(rows), 'found', sum(1 for v in out.values() if v), 'missing', len(miss))
print(' '.join(f'{s}({n})' for s, n in miss))
