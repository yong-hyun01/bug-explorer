# 이 저장소 작업 중 주고받은 "내가 보낸 요청(프롬프트)"만 모아 docs/PROMPTS.md 로 저장한다.
# 사용법: python3 tools/export_prompts.py
import json, pathlib, sys

# 이 프로젝트를 진행한 세션 하나만 읽는다 (다른 프로젝트 대화가 섞이지 않도록).
SESSION = sys.argv[1] if len(sys.argv) > 1 else '5ce0f1e2-4378-470d-bbf1-0f74ab9bdcdf'
SRC = [str(pathlib.Path.home() / f'.claude/projects/-Users-kyh/{SESSION}.jsonl')]
root = pathlib.Path(__file__).resolve().parent.parent

SKIP_PREFIX = ('Caveat:', 'This session is being continued')
SKIP_CONTAINS = ('<local-command', '<command-name>', 'system-reminder', '<task-notification>')


def text_of(rec):
    msg = rec.get('message') or {}
    c = msg.get('content')
    if isinstance(c, list):
        return ''.join(p.get('text', '') for p in c if isinstance(p, dict) and p.get('type') == 'text').strip()
    if isinstance(c, str):
        return c.strip()
    return ''


rows = []
for f in SRC:
    with open(f, encoding='utf-8') as fh:
        for line in fh:
            try:
                rec = json.loads(line)
            except Exception:
                continue
            if rec.get('type') != 'user':
                continue
            # isMeta: 스킬 안내문 등 시스템이 끼워 넣은 글, isSidechain: 하위 에이전트 대화
            if rec.get('isMeta') or rec.get('isSidechain'):
                continue
            t = text_of(rec)
            if not t or t.startswith('<'):
                continue
            if t.startswith(SKIP_PREFIX) or any(s in t for s in SKIP_CONTAINS):
                continue
            rows.append((rec.get('timestamp', '')[:19].replace('T', ' '), t))

# 연속 중복 제거 (같은 요청이 재전송된 경우)
ded = []
for r in rows:
    if ded and ded[-1][1] == r[1]:
        continue
    ded.append(r)

lines = ['# 작업 요청 기록 (프롬프트 로그)', '',
         f'이 파일은 `tools/export_prompts.py` 로 자동 생성됩니다. 총 {len(ded)}건.', '']
for i, (ts, t) in enumerate(ded, 1):
    lines.append(f'## {i}. {ts} UTC')
    lines.append('')
    lines.append('```text')
    lines.append(t)
    lines.append('```')
    lines.append('')

out = root / 'docs' / 'PROMPTS.md'
out.parent.mkdir(exist_ok=True)
out.write_text('\n'.join(lines), encoding='utf-8')
print(f'{out} 에 {len(ded)}건 저장')
