# 재시작 안내 (2026-11-18 기준)

PC를 껐다 켠 뒤 이 파일부터 읽으면 바로 이어서 작업할 수 있습니다.

## 지금 상태

- 곤충·생물·구름 **326종**, 맵 17곳 (풀밭·숲·연못·강·계곡·습지·하천·마당·집안·바다·산·하늘·심해·땅속·바위틈·동굴·사막)
- 모든 종에 위키백과·위키미디어 사진 연결 완료
- 배포 주소
  - GitHub Pages: https://yong-hyun01.github.io/bug-explorer/
  - Artifact: https://claude.ai/code/artifact/c7889990-e46d-4b4d-a25f-671a2a7bff4d

## 파일 구조

| 파일 | 역할 |
|---|---|
| `app.html` | 화면·CSS·게임 로직 원본. **여기를 고친다**. 맵은 `PLACES`·`ICO`·도감 칩·`draw()` 분기·`drawXxx()` 함수 한 세트 |
| `templates.js` | 곤충 SVG 그림 템플릿 (`T.beetle` 처럼 종류별 함수) |
| `species.js` | 종 데이터 배열 `RAW` (이름·맵·시간·희귀도·설명 등) |
| `photos.json` | 종별 위키 사진 주소. `fetch_photos.py` 로 수집 |
| `wiki_alias.json` | 사진이 엉뚱하게 잡힐 때 쓰는 검색어 교정표 |
| `hero/hero.json` | (실험용, 현재 미사용) 사람 캐릭터 부위별 그림과 피벗. `tools/cut.py` 가 `hero/source.png` + `hero/spec.json` 으로 생성 |
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

## 탐험가 캐릭터 바꾸기 (현재는 쓰지 않음)

현재 탐험가는 `drawPlayer()` 가 코드로 그리는 시바견이다. 사람 캐릭터 실험(ComfyUI 그림을 부위별로 잘라 관절에서 돌리는 방식)은 커밋 812dbeb 까지의 코드와 아래 도구로 다시 살릴 수 있다. ComfyUI(Flux Schnell, http://127.0.0.1:8188) 사용.

```bash
python3 tools/gen.py explorer 11,22,33,44 "<프롬프트>"      # ComfyUI 로 후보 생성 → tools/hero/*.png (약 70초/장)
~/ComfyUI/.venv/bin/python tools/cut.py hero/source.png hero/spec.json /tmp/parts   # 부위 자르기 → hero.json
cp /tmp/parts/hero.json hero/hero.json && python3 build.py
```

- `hero/spec.json` 의 `box` 는 원본(1024px) 좌표의 부위 사각형, `pivot` 은 관절 위치(머리=목, 위팔=어깨, 아래팔=팔꿈치, 다리=엉덩이, 몸통=엉덩이 중심), `root` 는 발밑 중심, `sample` 은 팔꿈치 덮개 색을 뽑을 소매 위치.
- 부위 8개: head, torso, armL_up, armL_lo, armR_up, armR_lo, legL, legR. 팔은 `drawArm()` 이 어깨 각도 + 팔꿈치 굽힘으로 그린다.
- 그림은 흰 배경·A 포즈(팔을 옆으로 곧게)·정면이어야 자르기가 쉽다. 팔은 몸통에서 `erase` 로 소매 밑동을 지운다.
- 움직임은 `app.html` 의 `drawPlayer()` 에서 각 부위 각도로 만든다 (걷기 다리 흔들기, 통통 튀기, 숨쉬기, 깜빡임, 휘두르기, 점프, 하늘 풍선, 심해 물안경).

## 최근에 한 일 (새 작업 → 오래된 작업)

1. 곤충 행동 고도화: go/pause 상태(가다 서서 둘러보기·정지 비행), 비행 습성(나비 나풀·잠자리 급가속/정지·벌 지그재그), 물고기 헤엄-멈춤, 점프 준비 웅크림, 놀람(움찔) 후 도망, 속도 비례 날갯짓
2. 탐험가 리디자인: 큰 머리·통통한 몸 비율, 큰 눈+하이라이트, 입체감 있는 재킷·배낭·파우치, 먼 손이 채를 쥐고 가까운 손은 2관절 IK 로 손잡이를 받침(grip), 귀·후드·가방·채 관성
3. 탐험가 애니메이션 전면 개선: 목표 자세 + 부위별 스프링(pose/updatePose), 걷기·달리기·살금살금 구분과 보폭 역산, 4단계 점프, 휘두르기 준비·마무리, 살아있는 idle
4. 움직임 물리 리팩터링: 탐험가·곤충 가속/감속, 스프링 회전, 부드러운 돌아서기, 흔들림·탄성, 잔상·착지 먼지·그림자 변화, 카메라 선행
5. 탐험가를 시바견(코드 드로잉)으로 되돌림. 사람 캐릭터 자료는 hero/ 와 tools/ 에 보관
6. 탐험가 캐릭터를 다른 후보(seed 44)로 바꾸고 팔을 위팔·아래팔로 나눠 팔꿈치가 굽혀지게 함
7. 탐험가를 시바견(코드 드로잉)에서 ComfyUI 로 만든 사람 아이 캐릭터로 교체, 부위별 관절 애니메이션
8. 하늘 맵 추가: 구름 11종·무지개·제비·칼새·새끼거미를 잡을 수 있고, 탐험가는 풍선을 달고 자유롭게 날아다님 (`free`+`fly` 플래그, `drawSky`, `cloud`·`rainbow`·`bird` 템플릿)
9. 플레이 화면 10:9 비율, 키패드 확대·간격 조정, 터치 기기 길게 누르기·확대 방지
10. 강·계곡·습지·하천 맵과 생물 37종 추가, 동굴·사막·집안 맵 추가
11. 도감 사진 로딩 속도 개선. 목록 썸네일을 500px에서 250px로, 사진 호스트 통일, 위키미디어 서버 미리 연결
12. 희귀 곤충 출현 확률 상향, 아직 못 잡은 종이 더 자주 나오도록 조정
13. 처음 잡은 곤충만 카드 팝업, 두 번째부터는 알림만
14. 도감 제목 줄을 탭 아래 고정하고 초기화 버튼을 그 줄로 이동
15. 맵별 종 67종 추가 (174종 → 241종)

## 움직임 구조 메모

- 탐험가 그림: `HB` 가 뼈 길이(골반/어깨 높이, 허벅지·종아리·위팔·아래팔), `fk()` 순기구학, `ik2()` 2관절 IK. 먼 팔(B)이 채를 쥐고, 가까운 팔(F)은 `pose.grip` 이 1이면 IK 로 손잡이(먼 손에서 `GRIP_D` 만큼 채 쪽)를 받치고 0이면 자유 자세. 그리기 순서: 배낭 → 먼 팔 → 몸통 → 가까운 팔 → 머리 → 채+두 손.
- 탐험가 자세: `pose` 객체가 부위별 각도(lean·hip·twist·head·팔·다리·net·look 등)와 속도를 들고, `updatePose(dt)` 가 입력·물리에서 목표값을 정한 뒤 `spr()` 감쇠 스프링으로 따라간다. 강성이 낮을수록(머리 55, 어깨 70, 아래팔 95, 위팔 150, 다리 230) 늦게 따라와 시간차가 생긴다. `drawPlayer()` 는 pose 만 읽어 그린다. 걸음 위상은 속도/(24×보폭) 으로 진행해 발이 미끄러지지 않는다. 점프는 `pose.jumpPrep`(0.08초 준비) 뒤 도약.
- 탐험가: `player.vx/vfy/vgy` 가 실제 속도. `tick()` 에서 입력 방향 속도로 가속(accel), 입력이 없으면 감속(damp). `player.face` 는 -1~1 로 보간돼 돌아설 때 몸이 얇아진다. 급반전 시 `skid` 로 흙먼지.
- 곤충 행동: `u.st`('go'/'pause')와 `u.stT` 타이머로 가다 서다, `u.style`(flyStyle: flutter/dart/buzz/plain)로 비행 습성, `u.crouch` 점프 준비, `u.startle` 놀람(flee → 0.12초 뒤 fleeNow), `u.look` 둘러보기 회전, `u.animT` 속도 비례 프레임.
- 곤충: `u.vxv/vyv` 실제 속도, 이동 종류별 목표 속도(tvx/tvy)로 가속. `u.rot` 은 감쇠 스프링(K=70)으로 목표 각도를 따라가고, `u.face` 는 옆모습 템플릿의 좌우 보간, `u.sqz` 는 점프 탄성, `u.trail` 은 잔상.

## 디버깅 메모

- 게임 내부 상태는 브라우저 콘솔에서 `window.__dbg` 로 봅니다. `bugs()`, `player`, `keys`, `swing()` 이 들어 있습니다.
- 저장 데이터는 `localStorage['bug-explorer-v2']` 입니다.
- Artifact 화면에서는 외부 사진이 차단되어 그림으로 대체됩니다. 사진 확인은 GitHub Pages 쪽에서 합니다.
