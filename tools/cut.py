#!/usr/bin/env python3
# 흰 배경 캐릭터 그림을 부위별로 잘라 투명 PNG 로 만들고, hero.json (base64 + 피벗) 을 쓴다.
# 사용: .venv/bin/python cut.py <image.png> <spec.json> <out_dir>
#  spec.json: {"scale": 0.12, "parts": {"head": {"box": [x0,y0,x1,y1], "pivot": [px,py]}, ...}}
#  pivot 은 원본 이미지 좌표. 결과 json 의 pivot 은 잘린 조각 안의 좌표.
import sys, json, base64, io, pathlib
from PIL import Image, ImageDraw, ImageFilter
src, spec, outd = pathlib.Path(sys.argv[1]), json.loads(pathlib.Path(sys.argv[2]).read_text()), pathlib.Path(sys.argv[3])
outd.mkdir(parents=True, exist_ok=True)
im = Image.open(src).convert('RGB')
W, H = im.size
# 배경 제거: 네 귀퉁이에서 흰색 영역을 채워 마스크를 만든다
fill = im.copy()
KEY = (255, 0, 255)
for xy in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1), (W // 2, 0), (W // 2, H - 1), (0, H // 2), (W - 1, H // 2)]:
    if fill.getpixel(xy) != KEY: ImageDraw.floodfill(fill, xy, KEY, thresh=spec.get('thresh', 48))
mask = Image.new('L', (W, H), 255)
px, mp = fill.load(), mask.load()
for y in range(H):
    for x in range(W):
        if px[x, y] == KEY: mp[x, y] = 0
# 가장자리 살짝 부드럽게 (1px) 후 다시 또렷하게
mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
# 발밑 회색 그림자 제거: 채도 낮고 밝은 회색 픽셀
if spec.get('shadow_y'):
    sy = spec['shadow_y']; ip = im.load(); mp = mask.load()  # 필터 후 새 마스크 객체를 다시 잡는다
    for y in range(sy, H):
        for x in range(W):
            r, g, b = ip[x, y]
            if mp[x, y] and max(r, g, b) - min(r, g, b) < 45 and (r + g + b) // 3 > 110: mp[x, y] = 0
rgba = im.convert('RGBA'); rgba.putalpha(mask)
rgba.save(outd / 'full.png')
out = {'scale': spec.get('scale', 0.12) / spec.get('downscale', 1), 'root': spec.get('root', [0, 0]), 'parts': {}}
for name, p in spec['parts'].items():
    x0, y0, x1, y1 = p['box']
    part = rgba.crop((x0, y0, x1, y1))
    if p.get('erase'):  # 조각 안에서 지울 사각형들 (다른 부위가 겹친 곳)
        d = ImageDraw.Draw(part)
        for ex0, ey0, ex1, ey1 in p['erase']: d.rectangle((ex0 - x0, ey0 - y0, ex1 - x0, ey1 - y0), fill=(0, 0, 0, 0))
    ds = spec.get('downscale', 1)
    if ds != 1: part = part.resize((max(1, round(part.width * ds)), max(1, round(part.height * ds))), Image.LANCZOS)
    part.save(outd / f'{name}.png')
    buf = io.BytesIO(); part.save(buf, 'PNG', optimize=True)
    out['parts'][name] = {'w': part.width, 'h': part.height, 'pivot': [(p['pivot'][0] - x0) * ds, (p['pivot'][1] - y0) * ds], 'at': [round((p['pivot'][0] - spec['root'][0]) * spec['scale'], 2), round((p['pivot'][1] - spec['root'][1]) * spec['scale'], 2)], 'png': base64.b64encode(buf.getvalue()).decode()}
    print(name, part.size, len(buf.getvalue()), 'bytes')
(outd / 'hero.json').write_text(json.dumps(out))
print('hero.json', (outd / 'hero.json').stat().st_size, 'bytes')
