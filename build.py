# app.html + templates.js + species.js -> index.html
import pathlib
root = pathlib.Path(__file__).parent
app = (root / 'app.html').read_text()
data = (root / 'templates.js').read_text() + '\n' + (root / 'species.js').read_text()
assert '/*__BUGS_DATA__*/' in app
(root / 'bugs-data.js').write_text(data)
photos = (root / 'photos.json').read_text() if (root / 'photos.json').exists() else '{}'
import json as _j
ph = {k: v for k, v in _j.loads(photos).items() if v}
html = app.replace('/*__BUGS_DATA__*/', data).replace('/*__PHOTOS__*/{}', _j.dumps(ph, ensure_ascii=False))
(root / 'index.html').write_text(html)
print('built index.html', len(app) + len(data), 'bytes')
