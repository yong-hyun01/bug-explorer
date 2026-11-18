#!/usr/bin/env python3
# ComfyUI HTTP API 로 Flux Schnell 이미지를 생성해 scratchpad/hero/ 에 저장한다.
# 사용: gen.py <prefix> <seed,seed,...> <prompt>  [--size WxH]
import json, sys, time, urllib.request, urllib.parse, pathlib, uuid
API = 'http://127.0.0.1:8188'
out = pathlib.Path(__file__).parent / 'hero'; out.mkdir(exist_ok=True)
prefix, seeds, prompt = sys.argv[1], [int(x) for x in sys.argv[2].split(',')], sys.argv[3]
w, h = 1024, 1024
if '--size' in sys.argv: w, h = [int(v) for v in sys.argv[sys.argv.index('--size') + 1].split('x')]

def wf(seed):
    return {
        '1': {'class_type': 'CheckpointLoaderSimple', 'inputs': {'ckpt_name': 'flux1-schnell-fp8.safetensors'}},
        '2': {'class_type': 'CLIPTextEncode', 'inputs': {'text': prompt, 'clip': ['1', 1]}},
        '3': {'class_type': 'CLIPTextEncode', 'inputs': {'text': '', 'clip': ['1', 1]}},
        '4': {'class_type': 'EmptyLatentImage', 'inputs': {'width': w, 'height': h, 'batch_size': 1}},
        '5': {'class_type': 'KSampler', 'inputs': {'seed': seed, 'steps': 4, 'cfg': 1.0, 'sampler_name': 'euler', 'scheduler': 'simple', 'denoise': 1.0,
                                                  'model': ['1', 0], 'positive': ['2', 0], 'negative': ['3', 0], 'latent_image': ['4', 0]}},
        '6': {'class_type': 'VAEDecode', 'inputs': {'samples': ['5', 0], 'vae': ['1', 2]}},
        '7': {'class_type': 'SaveImage', 'inputs': {'images': ['6', 0], 'filename_prefix': f'{prefix}_{seed}'}},
    }

def post(path, data):
    req = urllib.request.Request(API + path, data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req, timeout=30))

cid = str(uuid.uuid4())
ids = {}
for sd in seeds:
    r = post('/prompt', {'prompt': wf(sd), 'client_id': cid}); ids[r['prompt_id']] = sd
    print('queued seed', sd, r['prompt_id'], flush=True)
t0 = time.time(); done = {}
while len(done) < len(ids) and time.time() - t0 < 3600:
    time.sleep(5)
    for pid, sd in ids.items():
        if pid in done: continue
        hist = json.load(urllib.request.urlopen(API + '/history/' + pid, timeout=30))
        if pid not in hist: continue
        st = hist[pid].get('status', {})
        if st.get('status_str') == 'error': print('ERROR seed', sd, json.dumps(st)[:500], flush=True); done[pid] = None; continue
        outs = hist[pid].get('outputs', {})
        if not outs: continue
        for node in outs.values():
            for im in node.get('images', []):
                q = f"filename={urllib.parse.quote(im['filename'])}&subfolder={urllib.parse.quote(im.get('subfolder', ''))}&type={im.get('type', 'output')}"
                data = urllib.request.urlopen(API + '/view?' + q, timeout=60).read()
                dst = out / f'{prefix}_{sd}.png'; dst.write_bytes(data); done[pid] = dst
                print(f'done seed {sd} -> {dst} ({len(data)} bytes, {time.time() - t0:.0f}s)', flush=True)
print('all done', len([d for d in done.values() if d]), '/', len(ids))
