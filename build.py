# app.html + templates.js + species.js -> index.html
import pathlib
root = pathlib.Path(__file__).parent
app = (root / 'app.html').read_text()
data = (root / 'templates.js').read_text() + '\n' + (root / 'species.js').read_text()
assert '/*__BUGS_DATA__*/' in app
(root / 'bugs-data.js').write_text(data)
(root / 'index.html').write_text(app.replace('/*__BUGS_DATA__*/', data))
print('built index.html', len(app) + len(data), 'bytes')
