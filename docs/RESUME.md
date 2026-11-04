# 재시작 안내 (2026-11-04 기준)

PC를 껐다 켠 뒤 이 파일부터 읽으면 바로 이어서 작업할 수 있습니다.

## 지금 상태

- 곤충·생물 **241종**, 맵 9곳 (풀밭·숲·연못·마당·바다·산·심해·땅속·바위틈)
- 모든 종에 위키백과·위키미디어 사진 연결 완료
- 배포 주소
  - GitHub Pages: https://yong-hyun01.github.io/bug-explorer/
  - Artifact: https://claude.ai/code/artifact/c7889990-e46d-4b4d-a25f-671a2a7bff4d

## 파일 구조

| 파일 | 역할 |
|---|---|
| `app.html` | 화면·CSS·게임 로직 원본. **여기를 고친다** |
| `templates.js` | 곤충 SVG 그림 템플릿 (`T.beetle` 처럼 종류별 함수) |
| `species.js` | 종 데이터 배열 `RAW` (이름·맵·시간·희귀도·설명 등) |
| `photos.json` | 종별 위키 사진 주소. `fetch_photos.py` 로 수집 |
| `wiki_alias.json` | 사진이 엉뚱하게 잡힐 때 쓰는 검색어 교정표 |
| `index.html` | **자동 생성물**. 직접 고치지 말 것 |

## 작업 순서

```bash
python3 build.py                 # app.html + templates.js + species.js + photos.json → index.html
python3 -m http.server 8032      # http://localhost:8032/index.html 에서 확인
python3 fetch_photos.py          # 새 종을 추가했을 때만 (사진 수집)
python3 tools/export_prompts.py  # 요청 기록을 docs/PROMPTS.md 로 갱신
```

빌드 후에는 문법 검사를 한 번 돌립니다.

```bash
node -e "const s=require('fs').readFileSync('index.html','utf8');new Function(s.match(/<script>([\s\S]*)<\/script>/)[1]);console.log('ok')"
```

## 최근에 한 일 (새 작업 → 오래된 작업)

1. 도감 사진 로딩 속도 개선. 목록 썸네일을 500px에서 250px로, 사진 호스트 통일, 위키미디어 서버 미리 연결
2. 희귀 곤충 출현 확률 상향, 아직 못 잡은 종이 더 자주 나오도록 조정
3. 처음 잡은 곤충만 카드 팝업, 두 번째부터는 알림만
4. 도감 제목 줄을 탭 아래 고정하고 초기화 버튼을 그 줄로 이동
5. 맵별 종 67종 추가 (174종 → 241종)

## 디버깅 메모

- 게임 내부 상태는 브라우저 콘솔에서 `window.__dbg` 로 봅니다. `bugs()`, `player`, `keys`, `swing()` 이 들어 있습니다.
- 저장 데이터는 `localStorage['bug-explorer-v2']` 입니다.
- Artifact 화면에서는 외부 사진이 차단되어 그림으로 대체됩니다. 사진 확인은 GitHub Pages 쪽에서 합니다.
