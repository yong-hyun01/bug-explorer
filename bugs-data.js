// ======================= 곤충 삽화 템플릿 (도감 삽화풍 SVG) =======================
// 겹눈, 마디 다리, 체절, 날개맥을 갖춘 사실적 구조. 옵션(o)으로 색·무늬를 바꾼다. 옆모습은 오른쪽을 본다.
const OL = '#241C2A';
// 동작 프레임: 0 중립, 1 앞, 3 뒤. 다리·몸 꿈틀거림에 쓰인다
let FRAME = 0; const setFrame = f => { FRAME = f; }; const PH = () => FRAME * Math.PI / 2; const WAVE = () => Math.sin(PH());
const dark = (hex, k) => { if (hex[0] !== '#') return hex; const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
const G = (id, a, b, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .38 : cx}" cy="${cy == null ? .32 : cy}" r="${r || .8}"><stop offset="0" stop-color="${dark(a, 1.12)}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${b || dark(a, .5)}"/></radialGradient>`;
const LG = (id, a, b, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const FACET = `<pattern id="fc" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".75" fill="#000" opacity=".35"/></pattern>`;
const HAIR = `<pattern id="hr" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M1 3 L2 0" stroke="#000" stroke-width=".7" opacity=".28"/></pattern>`;
const SW = extra => /stroke-width/.test(extra || '') ? '' : 'stroke-width="2"';
const SK = extra => /\sstroke=|^stroke=/.test(' ' + (extra || '')) ? '' : `stroke="${OL}"`;
const E = (cx, cy, rx, ry, fill, extra) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${SK(extra)} ${SW(extra)} ${extra || ''}/>`;
const C = (cx, cy, r, fill, extra) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra || ''}/>`;
const P = (d, fill, extra) => `<path d="${d}" fill="${fill}" ${SK(extra)} ${SW(extra)} stroke-linejoin="round" ${extra || ''}/>`;
const L = (d, w, col, extra) => `<path d="${d}" fill="none" stroke="${col || OL}" stroke-width="${w || 3}" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}/>`;
const SHINE = (cx, cy, rx, ry, rot, op) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op == null ? .32 : op}" transform="rotate(${rot == null ? -30 : rot} ${cx} ${cy})"/>`;
const mirror = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${(200 - x).toFixed(1)} ${y}`);
const both = (d, fn) => fn(d) + fn(mirror(d));
// 입체 조명: 알파를 부풀려 법선을 만든 뒤 확산광(왼쪽 위)과 반사광을 곱·더하고, 마지막에 바닥 그림자
const LIT = `<filter id="sh" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="bump"/>
<feDiffuseLighting in="bump" surfaceScale="7" diffuseConstant="1.25" lighting-color="#fff" result="diff"><feDistantLight azimuth="230" elevation="52"/></feDiffuseLighting>
<feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="lit"/>
<feSpecularLighting in="bump" surfaceScale="7" specularConstant=".75" specularExponent="22" lighting-color="#fff" result="spec"><fePointLight x="55" y="30" z="170"/></feSpecularLighting>
<feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
<feComposite in="specIn" in2="lit" operator="arithmetic" k1="0" k2=".55" k3="1" k4="0" result="out"/>
<feDropShadow in="out" dx="0" dy="5" stdDeviation="4" flood-color="#000" flood-opacity=".3"/>
</filter>`;
const wrap = (defs, body, shift) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>${FACET}${HAIR}${defs}${LIT}</defs><g filter="url(#sh)"${shift ? ` transform="translate(0 ${shift})"` : ''}>${body}</g></svg>`;
// 겹눈: 그라데이션 + 낱눈 패턴 + 하이라이트
function ceye(cx, cy, rx, ry, col, rot) {
  const tr = rot ? `transform="rotate(${rot} ${cx} ${cy})"` : '';
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}" stroke="${OL}" stroke-width="1.6" ${tr}/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#fc)" ${tr}/><ellipse cx="${cx - rx * .3}" cy="${cy - ry * .35}" rx="${rx * .3}" ry="${ry * .2}" fill="#fff" opacity=".55" ${tr}/>`;
}
// 마디 다리: 점 배열을 따라 굵기가 줄어드는 마디 + 관절 + 발톱
function leg(pts0, col, w0) {
  const w = w0 || 5; let s = '', inner = '';
  const par = (Math.round((pts0[0][0] + pts0[0][1] * 3) / 11) % 2) ? 1 : -1, off = WAVE() * 3.5 * par;
  const pts = pts0.map((p, i) => (i === 0 || i === pts0.length - 1) ? p : [p[0] + off, p[1] + (i === pts0.length - 2 ? off * .6 : 0)]);
  for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], wi = Math.max(1.4, w - i * 1.3); s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${OL}" stroke-width="${wi + 2}" stroke-linecap="round"/>`; inner += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${wi}" stroke-linecap="round"/>`; }
  for (let i = 1; i < pts.length - 1; i++) inner += C(pts[i][0], pts[i][1], 1.4, dark(col, .6));
  const [ex, ey] = pts[pts.length - 1], [px, py] = pts[pts.length - 2], ang = Math.atan2(ey - py, ex - px);
  inner += L(`M${ex} ${ey} l${Math.cos(ang + .6) * 4} ${Math.sin(ang + .6) * 4} M${ex} ${ey} l${Math.cos(ang - .6) * 4} ${Math.sin(ang - .6) * 4}`, 1.4, OL);
  return s + inner;
}
// 가시 달린 종아리
function spines(x1, y1, x2, y2, n, len, col) { let s = ''; const dx = x2 - x1, dy = y2 - y1, ln = Math.hypot(dx, dy), nx = -dy / ln, ny = dx / ln; for (let i = 1; i <= n; i++) { const k = i / (n + 1), px = x1 + dx * k, py = y1 + dy * k; s += L(`M${px} ${py} l${nx * len} ${ny * len}`, 1.6, col || OL); } return s; }
// 마디 더듬이
const antenna = (d, col, w) => L(d, (w || 2.2) + 1.4, OL) + L(d, w || 2.2, col || '#6B5A4A') + L(d, w || 2.2, OL, 'stroke-dasharray="1 3" opacity=".55"');
// 날개: 막 + 맥
const wing = (d, tint, op, veins, vcol) => `<path d="${d}" fill="${tint || '#E6F3FF'}" fill-opacity="${op == null ? .5 : op}" stroke="${OL}" stroke-width="1.8" stroke-linejoin="round"/>` + (veins || []).map(v => L(v, 1.1, vcol || '#5A6C86', 'opacity=".8"')).join('');
// 체절 선
const segs = (x1, y1, x2, y2, n, col, curve) => { let s = ''; for (let i = 1; i < n; i++) { const k = i / n, x = x1 + (x2 - x1) * k, y = y1 + (y2 - y1) * k; s += curve ? L(`M${x - curve} ${y} Q${x} ${y + 5} ${x + curve} ${y}`, 1.4, col || OL, 'opacity=".55"') : L(`M${x} ${y}`, 1, col); } return s; };
const hairs = (cx, cy, r, n, col) => { let s = ''; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; s += L(`M${x} ${y} l${Math.cos(a) * 5} ${Math.sin(a) * 5}`, 1.2, col || OL, 'opacity=".6"'); } return s; };

const T = {
  // ====== 딱정벌레 (위) ======
  beetle: o => {
    const a = o.a || '#7A4A22', b = o.b || dark(a, .45), shape = o.shape || 'oval', col = o.leg || dark(a, .75);
    const sh = o.jaws ? 14 : 0;
    const wx = shape === 'round' ? 60 : shape === 'long' ? 34 : 46, top = 84, bot = shape === 'long' ? 186 : 180;
    let s = '';
    // 다리 6개 (앞·가운데·뒤)
    s += leg([[82, 96], [56, 84], [36, 102], [26, 124]], col) + leg([[118, 96], [144, 84], [164, 102], [174, 124]], col);
    s += leg([[76, 118], [46, 118], [30, 142], [22, 164]], col) + leg([[124, 118], [154, 118], [170, 142], [178, 164]], col);
    s += leg([[80, 140], [52, 158], [44, 182], [38, 196]], col) + leg([[120, 140], [148, 158], [156, 182], [162, 196]], col);
    // 딱지날개 두 장 + 홈 줄
    const ely = `M100 ${top} C${100 - wx * .95} ${top} ${100 - wx} ${top + 36} ${100 - wx} ${top + 60} C${100 - wx} ${bot - 30} ${100 - wx * .55} ${bot} 100 ${bot} Z`;
    s += P(ely, 'url(#el)') + P(mirror(ely), 'url(#el)');
    if (o.edge) s += P(`M${100 - wx + 2} ${top + 60} C${100 - wx + 2} ${bot - 28} ${100 - wx * .55} ${bot - 2} 100 ${bot - 2} C${100 - wx * .55} ${bot - 8} ${100 - wx + 8} ${bot - 30} ${100 - wx + 8} ${top + 60} Z`, o.edge, 'stroke-width="1"') + P(mirror(`M${100 - wx + 2} ${top + 60} C${100 - wx + 2} ${bot - 28} ${100 - wx * .55} ${bot - 2} 100 ${bot - 2} C${100 - wx * .55} ${bot - 8} ${100 - wx + 8} ${bot - 30} ${100 - wx + 8} ${top + 60} Z`), o.edge, 'stroke-width="1"');
    if (o.striae !== false) for (let i = 1; i <= 4; i++) { const k = i / 5, x = 100 - wx * k * .92; s += both(`M${x} ${top + 8 + k * 10} C${x - 2} ${top + 60} ${x} ${bot - 40 - k * 20} ${100 - (100 - x) * .5} ${bot - 6 - k * 14}`, d => L(d, 1.1, dark(a, .55), 'opacity=".55"')); }
    (o.spots || []).forEach(([x, y, r, c]) => { s += C(x, y, r, c || '#15121A'); });
    if (o.stripes) for (let i = 0; i < o.stripes; i++) { const y = top + 22 + i * 24; s += L(`M${100 - wx + 6} ${y} Q100 ${y + 8} ${100 + wx - 6} ${y}`, 3, o.stripeColor || dark(a, .5)); }
    s += SHINE(100 - wx * .5, top + 34, wx * .18, 26, -12, .28);
    // 작은방패판, 앞가슴등판, 머리
    s += P(`M92 ${top} L108 ${top} L100 ${top + 14} Z`, dark(a, .6));
    s += P('M64 84 C62 62 78 50 100 50 C122 50 138 62 136 84 C124 80 76 80 64 84 Z', 'url(#pr)') + SHINE(84, 64, 10, 5, -20, .25);
    s += P('M80 56 C80 40 88 32 100 32 C112 32 120 40 120 56 C112 52 88 52 80 56 Z', o.head || dark(a, .6));
    if (o.cheeks) s += C(88, 48, 5, '#F3EFE4') + C(112, 48, 5, '#F3EFE4');
    s += ceye(85, 44, 5, 6, '#15121A', -20) + ceye(115, 44, 5, 6, '#15121A', 20);
    // 큰턱
    if (o.jaws) {
      const js = o.jaws === true ? 'wide' : o.jaws, jc = dark(a, .55);
      if (js === 'long') { const d = 'M92 34 C84 24 76 4 84 -12 C90 -13 93 -4 91 8 C91 20 95 28 100 32 Z'; s += P(d, jc) + P(mirror(d), jc) + L('M88 -2 l5 2 M90 10 l5 1', 1.6) + L('M112 -2 l-5 2 M110 10 l-5 1', 1.6); }
      else { const d = 'M90 34 C76 22 62 4 70 -10 C78 -12 84 -2 82 10 C82 20 90 28 100 32 Z'; s += P(d, jc) + P(mirror(d), jc);
        if (js === 'saw') s += L('M72 -4 l5 2 M74 4 l5 2 M77 12 l5 2 M82 20 l5 1', 1.6) + L('M128 -4 l-5 2 M126 4 l-5 2 M123 12 l-5 2 M118 20 l-5 1', 1.6); else s += L('M74 6 l6 3 M70 -2 l6 2', 1.6) + L('M126 6 l-6 3 M130 -2 l-6 2', 1.6); }
    }
    else s += L('M94 32 l-4 -6 M106 32 l4 -6', 2);
    if (o.horn) s += P('M95 36 C97 20 103 10 108 2 C109 10 106 22 104 36 Z', dark(a, .7));
    // 더듬이
    if (o.antLong) s += antenna('M90 36 C62 22 30 34 10 70 C6 84 10 96 16 104', col) + antenna('M110 36 C138 22 170 34 190 70 C194 84 190 96 184 104', col);
    else if (o.antClub) s += antenna('M90 36 C80 26 72 20 64 10', col) + antenna('M110 36 C120 26 128 20 136 10', col) + P('M60 14 C56 6 66 2 70 10 Z', dark(a, .5)) + P('M140 14 C144 6 134 2 130 10 Z', dark(a, .5));
    else s += antenna('M90 36 C82 28 76 26 66 22', col) + antenna('M110 36 C118 28 124 26 134 22', col);
    return wrap(G('el', a, b) + G('pr', dark(a, .9), dark(a, .4)), s, sh);
  },
  // ====== 장수풍뎅이 (옆) ======
  rhino: o => {
    const a = o.a || '#7A4A22', b = dark(a, .4), col = dark(a, .7);
    let s = leg([[64, 140], [48, 150], [40, 170], [32, 186]], col) + leg([[96, 146], [92, 164], [84, 184], [70, 192]], col) + leg([[134, 140], [148, 158], [166, 170], [178, 184]], col);
    s += spines(92, 164, 84, 184, 3, -4) + spines(148, 158, 166, 170, 3, 4);
    s += P('M34 118 C38 86 76 72 128 80 C156 86 170 104 166 126 C160 144 118 152 70 148 C44 144 30 134 34 118 Z', 'url(#el)');
    for (let i = 0; i < 5; i++) s += L(`M${44 + i * 4} ${100 + i * 8} C${80 + i * 8} ${92 + i * 10} ${130 + i * 4} ${96 + i * 8} ${160 - i * 2} ${110 + i * 6}`, 1.1, dark(a, .5), 'opacity=".5"');
    s += SHINE(84, 100, 28, 9, -10, .25);
    s += P('M128 90 C148 84 170 94 176 112 L160 122 C154 106 142 100 128 104 Z', 'url(#pr)');
    if (o.horn === 'big') s += P('M152 90 C160 68 176 52 198 44 C196 50 190 54 186 60 C180 72 176 84 174 100 L162 98 Z', dark(a, .8)) + L('M198 44 L186 48', 2) + P('M138 84 C140 74 148 70 154 72 C150 80 146 86 144 92 Z', dark(a, .7));
    else if (o.horn === 'small') s += P('M154 90 C160 80 170 74 182 72 C178 82 172 92 168 100 L160 98 Z', dark(a, .8));
    s += P('M126 110 C138 102 152 106 158 120 C150 128 136 128 126 122 Z', b) + ceye(150, 113, 5, 6, '#15121A', 10) + leg([[150, 124], [156, 136], [152, 146]], col, 3) + antenna('M144 122 C140 130 134 132 128 130', col, 1.6);
    return wrap(G('el', a, b) + G('pr', dark(a, .9), dark(a, .4)), s);
  },
  // ====== 나비 (위) ======
  butterfly: o => {
    const a = o.a || '#F4F4F8', b = o.b || dark(a, .8), lo = o.lo || a, tip = o.tip || '#1E1A26', body = o.body || '#2E2A33';
    const fw = 'M100 98 C84 70 56 44 28 42 C14 42 10 56 14 68 C22 90 60 106 98 108 Z';
    const hw = o.tails ? 'M98 108 C60 112 30 136 42 166 C52 186 68 164 64 186 C78 178 92 150 100 128 Z' : 'M98 108 C62 110 34 134 44 158 C52 176 86 162 100 128 Z';
    const fv = ['M100 100 C80 86 60 70 36 52', 'M100 100 C84 92 64 82 30 60', 'M100 102 C80 96 56 92 22 74', 'M100 104 C78 102 54 104 28 94', 'M60 70 C58 80 56 88 52 96'];
    const hv = ['M98 110 C80 118 62 132 52 150', 'M98 112 C84 124 72 140 66 160', 'M98 114 C90 128 84 144 82 158'];
    let s = wing(fw, 'url(#w)', 1, fv, dark(b, .7)) + wing(mirror(fw), 'url(#w)', 1, fv.map(mirror), dark(b, .7)) + wing(hw, 'url(#w2)', 1, hv, dark(lo, .7)) + wing(mirror(hw), 'url(#w2)', 1, hv.map(mirror), dark(lo, .7));
    if (o.tipStyle !== 'none') s += both('M28 42 C40 40 54 44 64 50 C50 60 34 64 18 62 C12 56 16 44 28 42 Z', d => P(d, tip, 'stroke-width="1"'));
    if (o.stripes) s += both('M42 56 L68 92', d => L(d, 5, tip)) + both('M58 46 L78 88', d => L(d, 5, tip));
    if (o.band) s += both('M14 66 C34 60 56 62 72 74 C52 90 32 92 16 82 Z', d => P(d, tip, 'opacity=".85" stroke-width="1"'));
    (o.spots || []).forEach(([x, y, r, c]) => { s += C(x, y, r, c || '#1E1A26') + C(200 - x, y, r, c || '#1E1A26'); });
    (o.eyes || []).forEach(([x, y, r, c, c2]) => { s += both(`${x} ${y}`, p => { const [px, py] = p.split(' ').map(Number); return C(px, py, r, c) + C(px, py, r * .6, c2 || '#1E1A26') + C(px - r * .2, py - r * .2, r * .22, '#fff'); }); });
    // 몸: 털 난 가슴, 체절 배, 머리, 곤봉 더듬이, 빨대 입
    s += E(100, 118, 7, 30, 'url(#bd)') + segs(100, 96, 100, 148, 7, dark(body, .4), 6) + E(100, 86, 11, 13, 'url(#bd)') + `<ellipse cx="100" cy="86" rx="11" ry="13" fill="url(#hr)"/>` + C(100, 70, 8, dark(body, 1.1), `stroke="${OL}" stroke-width="2"`);
    s += ceye(94, 68, 4, 5, '#15121A') + ceye(106, 68, 4, 5, '#15121A') + antenna('M95 64 C86 50 76 40 68 34', dark(body, 1.2), 1.8) + antenna('M105 64 C114 50 124 40 132 34', dark(body, 1.2), 1.8) + C(67, 33, 3, OL) + C(133, 33, 3, OL) + L('M100 78 C104 84 108 84 106 78', 1.4);
    return wrap(G('w', a, b, .4, .4) + G('w2', lo, dark(lo, .82)) + G('bd', body, dark(body, .5)), s);
  },
  // ====== 나방 (위) ======
  moth: o => {
    const a = o.a || '#E8D8B8', b = dark(a, .72), body = o.body || '#7A5A3A', lo = o.lo || dark(a, .9);
    const fw = 'M100 100 C76 60 30 46 14 68 C6 80 14 100 32 110 C56 122 84 118 98 112 Z', hw = 'M98 112 C64 114 38 134 48 160 C58 178 86 162 100 134 Z';
    const fv = ['M100 102 C78 92 50 76 24 66', 'M100 104 C76 100 44 96 18 86', 'M100 108 C80 110 56 114 34 110'], hv = ['M98 114 C80 124 60 140 54 156', 'M98 116 C86 130 78 146 76 160'];
    let s = wing(fw, 'url(#w)', 1, fv, dark(b, .7)) + wing(mirror(fw), 'url(#w)', 1, fv.map(mirror), dark(b, .7)) + wing(hw, 'url(#w2)', 1, hv, dark(lo, .7)) + wing(mirror(hw), 'url(#w2)', 1, hv.map(mirror), dark(lo, .7));
    if (o.bands) s += both('M20 80 C50 86 76 96 98 104', d => L(d, 3.5, dark(a, .55), 'opacity=".8"')) + both('M26 96 C52 100 76 106 98 110', d => L(d, 2, dark(a, .55), 'opacity=".6"'));
    if (o.eyespot !== false) s += both('50 84', p => { const [x, y] = p.split(' ').map(Number); return C(x, y, 11, o.spot || body) + C(x, y, 7, a) + C(x, y, 3.5, OL) + C(x - 2, y - 2, 1.4, '#fff'); });
    s += E(100, 120, 11, 30, 'url(#bd)') + `<ellipse cx="100" cy="120" rx="11" ry="30" fill="url(#hr)"/>` + segs(100, 100, 100, 150, 6, dark(body, .4), 9) + E(100, 86, 16, 15, 'url(#bd)') + `<ellipse cx="100" cy="86" rx="16" ry="15" fill="url(#hr)"/>` + hairs(100, 86, 15, 18, dark(body, .6));
    s += C(100, 70, 8, dark(body, 1.1), `stroke="${OL}" stroke-width="2"`) + ceye(94, 68, 4, 5, '#15121A') + ceye(106, 68, 4, 5, '#15121A');
    if (o.feather !== false) { for (const d of [-1, 1]) { s += L(`M${100 + d * 4} 64 C${100 + d * 14} 50 ${100 + d * 22} 40 ${100 + d * 30} 32`, 2, dark(body, .7)); for (let i = 0; i < 7; i++) { const k = i / 7, x = 100 + d * (4 + 26 * k), y = 64 - 32 * k; s += L(`M${x} ${y} l${d * (7 - i * .6)} ${-3} M${x} ${y} l${d * (7 - i * .6)} ${3}`, 1.1, dark(body, .7)); } } }
    else s += antenna('M96 64 C86 50 76 42 66 36', dark(body, .8), 1.6) + antenna('M104 64 C114 50 124 42 134 36', dark(body, .8), 1.6);
    return wrap(G('w', a, b, .4, .4) + G('w2', lo, dark(lo, .8)) + G('bd', body, dark(body, .5)), s);
  },
  // ====== 벌 (위) ======
  bee: o => {
    const a = o.a || '#F2B830', b = dark(a, .7), th = o.th || '#8A5A2B', st = o.stripe || '#1E1A26', col = dark(th, .8), slim = o.slim;
    let s = '';
    const fw = 'M94 86 C70 62 30 60 22 80 C18 96 60 102 94 94 Z', hw = 'M92 96 C74 98 46 104 44 114 C46 122 76 112 94 102 Z';
    const fv = ['M94 88 C70 76 44 70 26 76', 'M94 92 C72 86 48 86 28 90', 'M60 72 C56 80 52 88 50 96', 'M44 70 C42 78 40 86 40 94'];
    s += wing(fw, '#E6F3FF', .55, fv) + wing(mirror(fw), '#E6F3FF', .55, fv.map(mirror)) + wing(hw, '#E6F3FF', .5, []) + wing(mirror(hw), '#E6F3FF', .5, []);
    s += leg([[86, 84], [60, 76], [44, 86], [36, 100]], col, 4) + leg([[114, 84], [140, 76], [156, 86], [164, 100]], col, 4);
    s += leg([[84, 98], [52, 104], [40, 124], [34, 140]], col, 4) + leg([[116, 98], [148, 104], [160, 124], [166, 140]], col, 4);
    s += leg([[86, 110], [60, 130], [54, 156], [50, 172]], col, 4.5) + leg([[114, 110], [140, 130], [146, 156], [150, 172]], col, 4.5);
    if (o.pollen !== false && !slim) s += E(56, 146, 7, 9, '#F7D34A', 'stroke-width="1"') + E(144, 146, 7, 9, '#F7D34A', 'stroke-width="1"');
    // 배 (체절 + 줄무늬)
    const rx = slim ? 20 : 30, ry = slim ? 44 : 40, cy = slim ? 136 : 130;
    s += E(100, cy, rx, ry, 'url(#ab)');
    const n = o.stripes == null ? 4 : o.stripes;
    for (let i = 0; i < n; i++) { const y = cy - ry + 14 + i * (ry * 2 - 20) / Math.max(1, n), w = rx * Math.sqrt(Math.max(.1, 1 - Math.pow((y - cy) / ry, 2))); s += P(`M${100 - w} ${y} Q100 ${y + 6} ${100 + w} ${y} L${100 + w - 1} ${y + 9} Q100 ${y + 15} ${100 - w + 1} ${y + 9} Z`, st, 'stroke-width="1"'); }
    for (let i = 0; i < 5; i++) { const y = cy - ry + 10 + i * (ry * 2 - 16) / 5, w = rx * Math.sqrt(Math.max(.1, 1 - Math.pow((y - cy) / ry, 2))); s += L(`M${100 - w} ${y} Q100 ${y + 5} ${100 + w} ${y}`, 1.2, OL, 'opacity=".5"'); }
    if (o.sting) s += P('M97 ' + (cy + ry - 2) + ' L100 ' + (cy + ry + 12) + ' L103 ' + (cy + ry - 2) + ' Z', OL);
    if (slim) s += L('M92 92 L96 100', 7) + L('M108 92 L104 100', 7);
    // 가슴 (털), 머리, 겹눈, 홑눈, 더듬이, 턱
    s += E(100, 88, 26, 22, 'url(#th)') + `<ellipse cx="100" cy="88" rx="26" ry="22" fill="url(#hr)"/>` + hairs(100, 88, 22, 26, dark(th, .6));
    s += P('M80 60 C80 44 88 36 100 36 C112 36 120 44 120 60 C116 70 84 70 80 60 Z', o.headc || dark(a, .95));
    s += ceye(86, 52, 6, 10, '#2A2230', -8) + ceye(114, 52, 6, 10, '#2A2230', 8) + C(96, 42, 1.5, OL) + C(100, 40, 1.5, OL) + C(104, 42, 1.5, OL);
    s += antenna('M94 44 L86 30 L74 24', dark(th, .7), 2) + antenna('M106 44 L114 30 L126 24', dark(th, .7), 2) + L('M95 66 l2 6 M105 66 l-2 6', 2);
    return wrap(G('ab', a, b) + G('th', th, dark(th, .55)), s);
  },
  // ====== 메뚜기·여치·귀뚜라미 (옆) ======
  hopper: o => {
    const a = o.a || '#8CCB4A', b = dark(a, .5), w = o.wing || dark(a, .9), col = dark(a, .8), long = o.long;
    let s = '';
    // 뒷다리: 넓적다리(무늬) + 가시 종아리 + 발목
    s += leg([[72, 128], [48, 98], [22, 148], [10, 158]], col, 7) + spines(48, 98, 22, 148, 5, -4, OL);
    s += P('M70 132 C58 122 50 108 50 98 C56 100 66 118 74 126 Z', dark(a, .7), 'stroke-width="1"') + L('M56 104 l10 6 M54 112 l10 6 M54 120 l8 6', 1.2, dark(a, .5));
    // 앞·가운데 다리
    s += leg([[102, 134], [92, 150], [78, 160], [66, 166]], col, 4) + leg([[122, 134], [126, 154], [136, 166], [148, 170]], col, 4);
    // 몸통과 배 체절
    const body = long ? 'M30 124 C70 108 130 102 170 104 C186 106 190 116 184 122 C150 132 80 138 30 136 Z' : 'M40 118 C60 96 120 92 160 100 L164 120 C130 134 80 140 40 134 Z';
    s += P(body, 'url(#g)');
    for (let i = 0; i < 6; i++) { const x = 48 + i * 16; s += L(`M${x} ${long ? 124 : 118} L${x + 2} ${long ? 134 : 132}`, 1.2, dark(a, .5), 'opacity=".6"'); }
    if (o.hump) s += P('M60 118 C70 90 110 84 140 96 L136 104 C110 96 80 102 66 122 Z', 'url(#g)');
    // 앞날개 (맥)
    const wd = long ? 'M60 108 C100 98 150 98 176 108 L170 114 C140 108 100 110 66 118 Z' : 'M70 102 C100 90 150 92 166 104 L160 110 C130 102 100 102 76 112 Z';
    s += P(wd, w) + L(long ? 'M66 114 C100 104 140 102 170 110 M70 112 C100 102 140 100 166 106' : 'M76 110 C100 100 140 98 160 106 M80 108 C100 98 140 96 158 102', 1, dark(w, .6), 'opacity=".6"');
    for (let i = 0; i < 8; i++) s += L(`M${72 + i * 11} ${long ? 116 - i * .5 : 110 - i * .6} l2 -7`, .9, dark(w, .6), 'opacity=".5"');
    if (o.bands) s += L('M80 116 L84 132', 2.5, b) + L('M100 112 L104 130', 2.5, b) + L('M120 110 L124 128', 2.5, b);
    // 앞가슴등판(안장), 머리, 겹눈, 더듬이, 입
    s += P('M136 96 C146 88 160 88 166 98 L164 118 C156 122 142 122 136 118 Z', dark(a, .85)) + L('M140 100 L140 116 M148 98 L148 118', 1, dark(a, .55));
    s += P('M156 92 C170 84 186 96 182 116 C178 126 166 126 156 120 Z', o.head || a) + ceye(172, 102, 6, 8, '#2A2230', 10) + C(166, 92, 1.2, OL) + L('M174 120 l0 6 M178 118 l2 6', 2);
    s += o.antLong ? antenna('M174 92 C186 60 196 40 198 20', col, 1.6) + antenna('M170 90 C190 70 198 56 200 44', col, 1.6) : antenna('M174 92 C182 70 192 56 198 44', col, 1.8) + antenna('M170 90 C184 74 192 66 198 60', col, 1.8);
    if (o.cerci) s += L('M40 128 L18 136 M42 132 L22 146', 2.5, col);
    if (o.ovip) s += L('M40 126 L6 132', 4.5, b);
    s += L('M110 132 L124 110 L150 132', 6) + L('M110 132 L124 110 L150 132', 3.5, a) + spines(124, 110, 150, 132, 4, -3.5);
    return wrap(G('g', a, b), s);
  },
  // ====== 사마귀 (옆) ======
  mantis: o => {
    const a = o.a || '#8CCB4A', b = dark(a, .5), col = dark(a, .85);
    let s = leg([[92, 128], [78, 150], [62, 168], [50, 178]], col, 4) + leg([[118, 126], [128, 150], [146, 168], [158, 178]], col, 4) + leg([[70, 124], [54, 144], [36, 156], [22, 162]], col, 4);
    s += P('M40 128 C60 104 100 100 132 104 L140 126 C110 136 70 142 40 138 Z', 'url(#m)');
    for (let i = 0; i < 7; i++) s += L(`M${50 + i * 12} 128 L${52 + i * 12} 138`, 1.1, b, 'opacity=".5"');
    s += P('M60 110 C90 100 120 100 136 108 L132 114 C110 108 90 110 66 118 Z', dark(a, 1.1)) + L('M66 116 C90 108 116 106 132 112 M70 114 C92 104 118 104 134 108', .9, dark(a, .6), 'opacity=".6"');
    s += P('M126 104 C132 80 140 64 150 56 L160 64 C152 74 146 90 140 108 Z', 'url(#m)');
    // 삼각 머리, 큰 겹눈, 홑눈
    s += P('M136 60 C146 42 176 42 182 58 C184 70 170 80 152 76 C144 74 138 68 136 60 Z', a) + ceye(170, 56, 9, 11, '#9BD24A', 15) + C(170, 56, 1.8, OL) + C(156, 50, 1.2, OL) + C(160, 46, 1.2, OL) + C(164, 50, 1.2, OL);
    s += antenna('M160 46 C172 30 186 22 196 18', col, 1.4) + antenna('M166 48 C184 38 194 34 200 32', col, 1.4) + L('M166 74 l2 6 M172 72 l2 6', 2);
    // 낫 같은 앞다리: 밑마디·넓적다리(가시)·종아리(가시)
    s += leg([[138, 96], [160, 86], [180 , 108]], col, 7) + spines(160, 86, 180, 108, 6, 4) + leg([[180, 108], [162, 110], [148, 100]], col, 4) + spines(180, 108, 162, 110, 5, -3);
    s += leg([[134, 100], [158, 100], [168, 120]], col, 6) + spines(158, 100, 168, 120, 5, 4);
    return wrap(G('m', a, b), s);
  },
  // ====== 개미 (위) ======
  ant: o => {
    const a = o.a || '#6B3E1E', b = dark(a, .45), col = dark(a, .8), big = o.big;
    let s = leg([[88, 100], [60, 82], [40, 96], [32, 114]], col, 3.5) + leg([[112, 100], [140, 82], [160, 96], [168, 114]], col, 3.5) + leg([[86, 108], [50, 112], [34, 130], [28, 146]], col, 3.5) + leg([[114, 108], [150, 112], [166, 130], [172, 146]], col, 3.5) + leg([[90, 116], [62, 140], [54, 164], [50, 178]], col, 3.5) + leg([[110, 116], [138, 140], [146, 164], [150, 178]], col, 3.5);
    s += E(100, 152, big ? 28 : 24, big ? 32 : 28, 'url(#a)') + segs(100, 126, 100, 180, 5, dark(a, .4), 18) + SHINE(90, 140, 7, 10, -10, .3);
    s += E(100, 118, 6, 7, dark(a, .8)) + E(100, 102, 14, 18, 'url(#a)') + E(100, 88, 10, 8, dark(a, .9));
    s += P('M78 72 C78 54 88 46 100 46 C112 46 122 54 122 72 C116 82 84 82 78 72 Z', big && o.head ? o.head : 'url(#a)');
    s += ceye(86, 62, 4, 5, '#15121A', -10) + ceye(114, 62, 4, 5, '#15121A', 10) + C(100, 52, 1.2, OL);
    s += P('M92 78 C86 86 86 92 92 96 L98 84 Z', dark(a, .6)) + P('M108 78 C114 86 114 92 108 96 L102 84 Z', dark(a, .6)) + L('M90 90 l4 2 M110 90 l-4 2', 1.2);
    s += antenna('M94 50 L80 38 L62 42', col, 1.8) + antenna('M106 50 L120 38 L138 42', col, 1.8) + C(80, 38, 2, OL) + C(120, 38, 2, OL);
    return wrap(G('a', a, b), s);
  },
  // ====== 노린재 (위) ======
  shield: o => {
    const a = o.a || '#7CBF4A', b = dark(a, .5), sc = o.sc || dark(a, 1.15), col = dark(a, .7);
    let s = leg([[80, 96], [52, 86], [34, 104], [26, 124]], col, 4) + leg([[120, 96], [148, 86], [166, 104], [174, 124]], col, 4) + leg([[76, 116], [46, 122], [32, 146], [26, 164]], col, 4) + leg([[124, 116], [154, 122], [168, 146], [174, 164]], col, 4) + leg([[80, 136], [56, 160], [46, 184], [40, 196]], col, 4) + leg([[120, 136], [144, 160], [154, 184], [160, 196]], col, 4);
    // 배 가장자리 줄무늬(연결판) + 앞날개(가죽부분·막질부분) + 작은방패판
    s += P('M100 52 C136 52 158 72 156 100 C154 140 128 168 100 176 C72 168 46 140 44 100 C42 72 64 52 100 52 Z', 'url(#s)');
    for (let i = 0; i < 6; i++) { const y = 98 + i * 12; s += L(`M${48 + i * 1.5} ${y} l6 1`, 4, i % 2 ? dark(a, .5) : '#F3E7C3', 'opacity=".9"') + L(`M${152 - i * 1.5} ${y} l-6 1`, 4, i % 2 ? dark(a, .5) : '#F3E7C3', 'opacity=".9"'); }
    s += P('M60 96 C64 124 80 150 100 160 C120 150 136 124 140 96 C128 90 72 90 60 96 Z', dark(a, .92), 'stroke-width="1.2"') + P('M70 134 C80 150 90 158 100 160 C110 158 120 150 130 134 C118 146 82 146 70 134 Z', '#DCE8F0', 'fill-opacity=".7" stroke-width="1"') + L('M100 96 L100 158', 1.4, dark(a, .5));
    s += P('M74 80 L126 80 L100 132 Z', sc) + L('M100 80 L100 130', 1, dark(sc, .6), 'opacity=".6"');
    s += P('M62 80 C62 66 80 58 100 58 C120 58 138 66 138 80 C126 84 74 84 62 80 Z', dark(a, .8)) + L('M62 80 L52 76 M138 80 L148 76', 3, dark(a, .7));
    (o.spots || [[62, 104], [138, 104], [84, 150], [116, 150]]).forEach(([x, y, r, c]) => { s += C(x, y, r || 3.5, c || dark(a, .5)); });
    s += P('M86 60 C86 46 92 40 100 40 C108 40 114 46 114 60 C108 64 92 64 86 60 Z', dark(a, .9)) + ceye(89, 50, 3.5, 4.5, '#15121A') + ceye(111, 50, 3.5, 4.5, '#15121A') + antenna('M92 42 L84 26 L72 18 L62 14', col, 1.8) + antenna('M108 42 L116 26 L128 18 L138 14', col, 1.8) + L('M100 62 L100 80', 1.6, dark(a, .5)) + SHINE(80, 100, 7, 18, -8, .25);
    return wrap(G('s', a, b), s);
  },
  // ====== 매미 (위) ======
  cicada: o => {
    const a = o.a || '#9AB85A', b = dark(a, .45), h = o.h || dark(a, .8), col = dark(a, .7), wt = o.wing || '#EAF4FF', wo = o.wingOp == null ? .55 : o.wingOp;
    const wd = 'M96 72 C52 90 30 150 52 184 C76 180 90 140 100 96 Z';
    const vv = ['M96 76 C70 100 56 140 54 178', 'M98 80 C76 110 66 150 66 178', 'M98 86 C84 120 78 150 80 172', 'M62 120 C74 118 84 112 92 104', 'M58 146 C70 144 80 136 88 124', 'M56 166 C66 162 76 152 86 140'];
    let s = wing(wd, wt, wo, vv, '#6B7A8E') + wing(mirror(wd), wt, wo, vv.map(mirror), '#6B7A8E');
    s += leg([[84, 100], [58, 92], [44, 104], [40, 118]], col, 4) + leg([[116, 100], [142, 92], [156, 104], [160, 118]], col, 4) + leg([[82, 112], [52, 120], [38, 136]], col, 4) + leg([[118, 112], [148, 120], [162, 136]], col, 4) + leg([[86, 124], [62, 142], [54, 160]], col, 4) + leg([[114, 124], [138, 142], [146, 160]], col, 4);
    s += E(100, 124, 26, 50, 'url(#c)') + segs(100, 92, 100, 174, 7, dark(a, .45), 22);
    s += P('M68 80 C68 60 84 52 100 52 C116 52 132 60 132 80 C128 96 72 96 68 80 Z', 'url(#ch)') + L('M86 62 L100 84 L114 62', 1.4, dark(h, .5), 'opacity=".6"') + SHINE(84, 66, 8, 4, -20, .3);
    s += P('M66 54 C66 40 84 34 100 34 C116 34 134 40 134 54 C124 60 76 60 66 54 Z', h) + ceye(70, 46, 8, 7, '#2A2230', -10) + ceye(130, 46, 8, 7, '#2A2230', 10) + C(96, 40, 1.6, '#C0392B') + C(100, 36, 1.6, '#C0392B') + C(104, 40, 1.6, '#C0392B') + antenna('M84 40 L80 30', col, 1.4) + antenna('M116 40 L120 30', col, 1.4) + L('M100 58 L100 96', 2, dark(h, .5));
    return wrap(G('c', a, b) + G('ch', h, dark(h, .5)), s);
  },
  // ====== 대벌레 (옆) ======
  stick: o => {
    const a = o.a || '#9CB36B', b = dark(a, .6), col = dark(a, .9);
    let s = leg([[60, 158], [34, 124], [18, 140], [10, 156]], col, 2.6) + leg([[92, 150], [72, 104], [50, 100], [34, 106]], col, 2.6) + leg([[128, 122], [148, 72], [140, 48], [136, 30]], col, 2.6) + leg([[110, 136], [140, 150], [168, 142], [184, 138]], col, 2.6) + leg([[150, 110], [184, 118], [196, 146], [198, 160]], col, 2.6) + leg([[70, 156], [80, 186], [106, 194], [122, 196]], col, 2.6);
    s += P('M30 170 C70 140 100 110 150 90 C164 84 176 84 184 92 L176 100 C166 96 156 100 146 104 C100 124 80 150 40 180 Z', 'url(#sk)');
    for (let i = 0; i < 9; i++) { const k = i / 9, x = 36 + 110 * k, y = 174 - 78 * k; s += L(`M${x} ${y} l5 5`, 1, b, 'opacity=".6"'); }
    s += E(182, 96, 10, 7, dark(a, .85), 'transform="rotate(-25 182 96)"') + ceye(186, 94, 3, 3.5, '#15121A') + antenna('M186 88 C190 76 196 66 200 50', col, 1.3) + antenna('M190 90 C196 82 200 76 200 60', col, 1.3);
    return wrap(LG('sk', dark(a, 1.1), b, true), s);
  },
  // ====== 반딧불이 (위) ======
  firefly: o => {
    const a = '#3A3344', b = '#1A1620', col = '#2A2430', pr = o.pron || '#E25A2D';
    let s = `<circle cx="100" cy="152" r="48" fill="url(#gl)" opacity=".6"/>`;
    s += leg([[84, 92], [58, 84], [42, 98], [36, 112]], col, 3.5) + leg([[116, 92], [142, 84], [158, 98], [164, 112]], col, 3.5) + leg([[82, 108], [50, 114], [36, 134]], col, 3.5) + leg([[118, 108], [150, 114], [164, 134]], col, 3.5) + leg([[84, 124], [58, 146], [50, 166]], col, 3.5) + leg([[116, 124], [142, 146], [150, 166]], col, 3.5);
    const ely = 'M100 84 C78 84 72 104 72 124 C72 150 82 166 100 170 Z';
    s += P(ely, 'url(#ff)') + P(mirror(ely), 'url(#ff)') + L('M80 96 C78 120 82 150 92 166 M88 90 C86 120 90 150 98 168', 1, '#555', 'opacity=".5"') + L(mirror('M80 96 C78 120 82 150 92 166 M88 90 C86 120 90 150 98 168'), 1, '#555', 'opacity=".5"');
    s += P('M78 150 C90 146 110 146 122 150 L124 166 C116 176 84 176 76 166 Z', '#FFE566') + L('M78 158 Q100 162 122 158', 1.6, '#D9A000') + SHINE(86, 110, 5, 16, -8, .25);
    s += P('M70 84 C70 58 84 48 100 48 C116 48 130 58 130 84 C120 80 80 80 70 84 Z', 'url(#pr)') + C(100, 70, 5, '#15121A') + E(86, 62, 5, 4, '#F6D7B0', 'opacity=".8" stroke-width="1"') + E(114, 62, 5, 4, '#F6D7B0', 'opacity=".8" stroke-width="1"');
    s += P('M88 52 C88 44 94 42 100 42 C106 42 112 44 112 52 Z', '#15121A') + ceye(91, 50, 3, 3.5, '#15121A') + ceye(109, 50, 3, 3.5, '#15121A') + antenna('M92 44 L84 30 L70 24', col, 1.6) + antenna('M108 44 L116 30 L130 24', col, 1.6);
    return wrap(G('ff', a, b) + G('pr', pr, dark(pr, .55)) + G('gl', '#FFF59D', '#FFB300', .5, .5), s);
  },
  // ====== 거미 (위) ======
  spider: o => {
    const a = o.a || '#4A3E5A', b = dark(a, .45), col = dark(a, .85);
    let s = '';
    const legsL = [[[92, 92], [66, 60], [52, 32], [44, 14]], [[90, 98], [56, 76], [30, 58], [16, 46]], [[90, 106], [58, 112], [28, 134], [14, 150]], [[92, 112], [68, 142], [52, 172], [44, 192]]];
    legsL.forEach(pts => { s += leg(pts, col, 4.5) + leg(pts.map(([x, y]) => [200 - x, y]), col, 4.5); for (let i = 1; i < 3; i++) { const [x, y] = pts[i]; s += L(`M${x} ${y} l-3 -4 M${x} ${y} l3 -4 M${200 - x} ${y} l-3 -4 M${200 - x} ${y} l3 -4`, 1, col, 'opacity=".7"'); } });
    s += E(100, 132, o.fat ? 36 : 30, o.fat ? 40 : 36, 'url(#sp)') + `<ellipse cx="100" cy="132" rx="${o.fat ? 36 : 30}" ry="${o.fat ? 40 : 36}" fill="url(#hr)"/>`;
    if (o.mark) s += P('M100 110 L108 128 L100 152 L92 128 Z', o.mark, 'stroke-width="1"');
    if (o.bands) s += L('M72 118 Q100 124 128 118 M68 136 Q100 142 132 136 M74 154 Q100 160 126 154', 4, o.bands);
    s += SHINE(88, 118, 6, 10, -8, .25) + E(100, 86, 22, 20, 'url(#sp)') + `<ellipse cx="100" cy="86" rx="22" ry="20" fill="url(#hr)"/>`;
    s += ceye(92, 78, o.bigEyes ? 7 : 4, o.bigEyes ? 7 : 4, '#15121A') + ceye(108, 78, o.bigEyes ? 7 : 4, o.bigEyes ? 7 : 4, '#15121A') + C(84, 72, 2.2, '#15121A') + C(116, 72, 2.2, '#15121A') + C(94, 70, 1.6, '#15121A') + C(106, 70, 1.6, '#15121A') + C(88, 86, 1.6, '#15121A') + C(112, 86, 1.6, '#15121A');
    s += P('M94 100 C92 108 94 112 98 112 L100 102 Z', dark(a, .6)) + P('M106 100 C108 108 106 112 102 112 L100 102 Z', dark(a, .6)) + leg([[90, 100], [78, 108], [70, 118]], col, 3) + leg([[110, 100], [122, 108], [130, 118]], col, 3);
    return wrap(G('sp', a, b), s);
  },
  // ====== 잠자리 (위) ======
  dragonfly: o => {
    const a = o.a || '#3FA7D6', b = dark(a, .5), e = o.eye || '#5FB85F', wt = o.wing || '#EAF4FF', wo = o.wingOp == null ? .45 : o.wingOp, col = dark(a, .55), thin = o.thin;
    let s = '';
    const mesh = (d, flip) => { let v = ''; for (let i = 0; i < 4; i++) v += L(flip ? mirror(d[i]) : d[i], 1, '#5A6C86', 'opacity=".75"'); return v; };
    if (o.folded) {
      const fw = 'M96 84 C84 100 80 150 92 176 C100 170 100 120 100 92 Z';
      s += wing(fw, wt, wo, ['M97 90 C90 110 88 140 93 170', 'M98 96 C94 120 92 150 96 172']) + wing(mirror(fw), wt, wo, ['M103 90 C110 110 112 140 107 170', 'M102 96 C106 120 108 150 104 172']);
    } else {
      const fw = 'M96 74 C60 56 10 60 8 76 C8 90 60 92 96 82 Z', hw = 'M96 84 C64 86 16 94 14 108 C16 120 64 112 96 92 Z';
      const fv = ['M94 76 C60 66 30 66 12 74', 'M94 78 C62 72 34 72 10 78', 'M94 80 C62 80 36 82 12 84', 'M94 82 C66 86 40 88 14 88'], hv = ['M94 86 C60 86 30 92 16 100', 'M94 88 C62 90 34 98 16 106', 'M94 90 C66 96 40 104 20 112', 'M94 92 C70 100 46 108 24 114'];
      s += wing(fw, wt, wo, []) + wing(mirror(fw), wt, wo, []) + wing(hw, wt, wo, []) + wing(mirror(hw), wt, wo, []) + mesh(fv) + mesh(fv, 1) + mesh(hv) + mesh(hv, 1);
      for (let i = 0; i < 10; i++) { const k = i / 10, x = 18 + 76 * k; s += L(`M${x} ${74 - k * 6} L${x} ${88 - k * 4}`, .8, '#5A6C86', 'opacity=".5"') + L(`M${200 - x} ${74 - k * 6} L${200 - x} ${88 - k * 4}`, .8, '#5A6C86', 'opacity=".5"') + L(`M${x - 2} ${92 + k * 4} L${x + 2} ${108 - k * 14}`, .8, '#5A6C86', 'opacity=".5"') + L(`M${200 - x + 2} ${92 + k * 4} L${200 - x - 2} ${108 - k * 14}`, .8, '#5A6C86', 'opacity=".5"'); }
      s += P('M22 70 l8 -1 l1 5 l-8 1 Z', '#4A3E30', 'stroke-width=".8"') + P('M178 70 l-8 -1 l-1 5 l8 1 Z', '#4A3E30', 'stroke-width=".8"');
    }
    s += leg([[94, 70], [78, 62], [66, 70]], col, 3) + leg([[106, 70], [122, 62], [134, 70]], col, 3) + leg([[94, 76], [76, 80], [66, 92]], col, 3) + leg([[106, 76], [124, 80], [134, 92]], col, 3) + leg([[94, 82], [80, 96], [72, 108]], col, 3) + leg([[106, 82], [120, 96], [128, 108]], col, 3);
    const th = thin ? 4.5 : 6;
    s += P(`M${100 - th} 92 L${100 + th} 92 L${100 + th - 1.5} 190 L${100 - th + 1.5} 190 Z`, 'url(#df)') + segs(100, 92, 100, 190, 10, dark(a, .35), th - 1);
    if (!thin) for (let i = 0; i < 9; i++) s += L(`M${100 - th + 1} ${98 + i * 10} l${th * 2 - 2} 0`, 2, dark(a, .55), 'opacity=".35"');
    s += E(100, 78, thin ? 10 : 15, thin ? 14 : 18, 'url(#df)') + L('M90 68 L96 88 M110 68 L104 88', 2, dark(a, .5), 'opacity=".7"');
    s += P('M78 54 C78 38 88 32 100 32 C112 32 122 38 122 54 C116 62 84 62 78 54 Z', dark(e, .8)) + ceye(89, 48, thin ? 7 : 9, thin ? 8 : 11, e, -12) + ceye(111, 48, thin ? 7 : 9, thin ? 8 : 11, e, 12) + C(100, 40, 1.6, OL) + L('M94 60 l2 4 M106 60 l-2 4', 2) + antenna('M94 38 L92 30', col, 1.2) + antenna('M106 38 L108 30', col, 1.2);
    return wrap(G('df', a, b), s);
  },
  // ====== 소금쟁이 (위) ======
  strider: o => {
    const a = o.a || '#5E5266', b = dark(a, .45), col = dark(a, .8);
    let s = `<ellipse cx="100" cy="150" rx="70" ry="14" fill="none" stroke="#9FD8FF" stroke-width="1.6" opacity=".6"/><ellipse cx="100" cy="150" rx="44" ry="9" fill="none" stroke="#9FD8FF" stroke-width="1.6" opacity=".6"/>`;
    s += leg([[92, 104], [60, 92], [30, 110], [10, 150]], col, 2.6) + leg([[108, 104], [140, 92], [170, 110], [190, 150]], col, 2.6) + leg([[94, 114], [66, 128], [40, 150], [22, 176]], col, 2.6) + leg([[106, 114], [134, 128], [160, 150], [178, 176]], col, 2.6) + leg([[96, 92], [82, 80], [66, 86], [60, 96]], col, 2.6) + leg([[104, 92], [118, 80], [134, 86], [140, 96]], col, 2.6);
    s += E(100, 112, 10, 28, 'url(#sr)') + segs(100, 90, 100, 138, 6, dark(a, .4), 7) + E(100, 82, 10, 10, 'url(#sr)') + ceye(93, 80, 4, 4.5, '#15121A') + ceye(107, 80, 4, 4.5, '#15121A') + antenna('M94 72 L86 62 L80 60', col, 1.4) + antenna('M106 72 L114 62 L120 60', col, 1.4);
    return wrap(G('sr', a, b), s);
  },
  // ====== 물속 딱정벌레 (위) ======
  waterbeetle: o => {
    const a = o.a || '#4E9A5A', b = dark(a, .35), col = dark(a, .7);
    let s = leg([[70, 128], [40, 134], [22, 156], [18, 172]], col, 5) + leg([[130, 128], [160, 134], [178, 156], [182, 172]], col, 5);
    for (let i = 0; i < 6; i++) s += L(`M${34 + i * 3} ${140 + i * 5} l-6 3 M${166 - i * 3} ${140 + i * 5} l6 3`, 1.2, col, 'opacity=".8"');
    s += leg([[76, 100], [48, 90], [36, 100]], col, 3.5) + leg([[124, 100], [152, 90], [164, 100]], col, 3.5) + leg([[76, 114], [46, 118], [34, 130]], col, 3.5) + leg([[124, 114], [154, 118], [166, 130]], col, 3.5);
    s += E(100, 118, 46, 60, 'url(#db)');
    if (o.edge) s += P('M58 112 C60 150 80 172 100 178 C120 172 140 150 142 112 C140 150 120 170 100 174 C80 170 60 150 58 112 Z', o.edge, 'stroke-width="1"');
    s += L('M100 70 L100 176', 1.6, dark(a, .5)) + L('M88 74 C84 110 86 150 94 174 M112 74 C116 110 114 150 106 174 M78 84 C72 120 76 150 86 170 M122 84 C128 120 124 150 114 170', 1, dark(a, .5), 'opacity=".45"') + SHINE(80, 96, 9, 20, -8, .3);
    s += P('M70 70 C70 54 84 48 100 48 C116 48 130 54 130 70 C120 66 80 66 70 70 Z', dark(a, .75)) + P('M80 50 C80 40 88 36 100 36 C112 36 120 40 120 50 Z', dark(a, .55)) + ceye(88, 46, 4.5, 5, '#15121A') + ceye(112, 46, 4.5, 5, '#15121A') + antenna('M90 40 L82 30 L70 26', col, 1.6) + antenna('M110 40 L118 30 L130 26', col, 1.6);
    return wrap(G('db', a, b), s);
  },
  // ====== 물장군·물자라 (위) ======
  waterbug: o => {
    const a = o.a || '#8A6A3A', b = dark(a, .45), col = dark(a, .75), sm = o.small;
    let s = leg([[72, 96], [36, 82], [24, 104], [32, 116]], col, 6) + leg([[128, 96], [164, 82], [176, 104], [168, 116]], col, 6) + leg([[66, 124], [32, 132], [18, 148]], col, 4.5) + leg([[134, 124], [168, 132], [182, 148]], col, 4.5) + leg([[68, 146], [36, 164], [26, 184]], col, 4.5) + leg([[132, 146], [164, 164], [174, 184]], col, 4.5);
    for (let i = 0; i < 5; i++) s += L(`M${40 + i * 1} ${134 + i * 5} l-5 2 M${160 - i} ${134 + i * 5} l5 2 M${42 + i * 2} ${156 + i * 6} l-5 3 M${158 - i * 2} ${156 + i * 6} l5 3`, 1.1, col, 'opacity=".8"');
    s += P(sm ? 'M100 62 C132 62 146 92 142 126 C138 154 122 172 100 176 C78 172 62 154 58 126 C54 92 68 62 100 62 Z' : 'M100 54 C140 54 156 90 150 130 C146 160 128 180 100 184 C72 180 54 160 50 130 C44 90 60 54 100 54 Z', 'url(#wb)');
    s += L('M100 84 L100 176', 1.6, b) + P('M70 84 L130 84 L100 118 Z', dark(a, .8)) + P('M64 118 C70 150 84 170 100 176 C116 170 130 150 136 118 C124 128 76 128 64 118 Z', dark(a, .9), 'stroke-width="1.2"') + L('M78 110 C86 140 92 160 100 174 M122 110 C114 140 108 160 100 174', 1, dark(a, .5), 'opacity=".5"');
    if (o.eggs) s += [[80, 130], [100, 126], [120, 130], [90, 146], [110, 146], [100, 162], [84, 160], [116, 160]].map(([x, y]) => E(x, y, 6, 7, '#EFE2C0', 'stroke-width="1"')).join('');
    s += P('M78 62 C78 48 88 42 100 42 C112 42 122 48 122 62 C114 70 86 70 78 62 Z', b) + ceye(84, 56, 6, 7, '#2A2230', -10) + ceye(116, 56, 6, 7, '#2A2230', 10) + L('M100 66 L100 84', 2, dark(a, .4)) + L('M96 184 L94 196 M104 184 L106 196', 2.5, col);
    return wrap(G('wb', a, b), s);
  },
  // ====== 하루살이 (옆) ======
  mayfly: o => {
    const a = o.a || '#B8A070', b = dark(a, .55), col = dark(a, .8);
    const fw = 'M104 92 C110 50 130 20 150 22 C156 50 140 84 112 100 Z', hw = 'M106 100 C122 86 148 86 158 96 C148 108 124 112 108 104 Z';
    let s = wing(fw, '#EAF4FF', .55, ['M108 96 C116 70 130 46 146 32', 'M110 98 C120 78 134 60 148 48', 'M112 98 C124 84 136 72 150 64', 'M122 90 C128 70 136 52 144 36']) + wing(hw, '#EAF4FF', .5, ['M110 102 C126 94 140 92 152 96']);
    s += L('M60 118 L24 150 M62 122 L18 162 M60 126 L26 176', 1.6, col) + leg([[96, 120], [84, 146], [70, 150]], col, 3) + leg([[112, 116], [118, 146], [134, 152]], col, 3) + leg([[126, 110], [146, 134], [160, 140]], col, 3);
    s += P('M56 118 C90 102 120 96 150 100 L152 112 C122 112 92 118 58 128 Z', 'url(#mf)');
    for (let i = 0; i < 8; i++) { const x = 64 + i * 11; s += L(`M${x} ${124 - (x - 56) * .2} L${x + 2} ${112 - (x - 56) * .2}`, 1.2, b, 'opacity=".6"'); }
    s += E(154, 104, 14, 11, dark(a, .85)) + ceye(158, 100, 6, 6, '#2A2230') + antenna('M160 94 L170 86', col, 1.2) + antenna('M164 98 L176 94', col, 1.2);
    return wrap(G('mf', a, b), s);
  },
  // ====== 게아재비·장구애비 (위) ======
  waterscorpion: o => {
    const a = o.a || '#8A6A3A', b = dark(a, .5), col = dark(a, .8);
    let s = L('M100 62 L100 4', 4.5, OL) + L('M100 62 L100 4', 2, dark(a, 1.2)) + L('M100 62 L100 4', 2, OL, 'stroke-dasharray="1 4" opacity=".5"');
    s += leg([[84, 84], [50, 68], [36, 92]], col, 5.5) + spines(50, 68, 36, 92, 4, 4) + leg([[116, 84], [150, 68], [164, 92]], col, 5.5) + spines(150, 68, 164, 92, 4, -4);
    s += leg([[80, 116], [46, 128], [26, 148]], col, 3.5) + leg([[120, 116], [154, 128], [174, 148]], col, 3.5) + leg([[82, 140], [52, 162], [40, 182]], col, 3.5) + leg([[118, 140], [148, 162], [160, 182]], col, 3.5);
    s += P(o.wide ? 'M100 64 C130 64 142 92 140 122 C138 152 122 176 100 184 C78 176 62 152 60 122 C58 92 70 64 100 64 Z' : 'M100 64 C120 64 128 90 126 120 C124 150 116 176 100 184 C84 176 76 150 74 120 C72 90 80 64 100 64 Z', 'url(#ws)');
    s += L('M100 90 L100 180', 1.6, b) + P('M82 92 L118 92 L100 116 Z', dark(a, .85)) + segs(100, 116, 100, 182, 7, dark(a, .5), o.wide ? 34 : 22) + SHINE(90, 110, 6, 16, -6, .25);
    s += E(100, 64, 16, 10, b) + ceye(90, 62, 4, 4.5, '#2A2230') + ceye(110, 62, 4, 4.5, '#2A2230');
    return wrap(G('ws', a, b), s);
  },
  // ====== 파리·등에·모기 (위) ======
  fly: o => {
    const a = o.a || '#3E3846', b = dark(a, .5), e = o.eye || '#B5382B', col = dark(a, .8), slim = o.slim;
    const fw = 'M96 86 C60 56 16 64 20 90 C24 112 70 110 96 96 Z';
    let s = wing(fw, '#EAF4FF', .55, ['M94 88 C70 76 44 72 26 80', 'M94 92 C72 86 50 86 30 92', 'M94 96 C76 98 56 100 36 102', 'M60 74 C58 84 56 92 56 100']) + wing(mirror(fw), '#EAF4FF', .55, ['M94 88 C70 76 44 72 26 80', 'M94 92 C72 86 50 86 30 92', 'M94 96 C76 98 56 100 36 102', 'M60 74 C58 84 56 92 56 100'].map(mirror));
    s += C(80, 104, 3.5, '#C8B890', `stroke="${OL}" stroke-width="1"`) + C(120, 104, 3.5, '#C8B890', `stroke="${OL}" stroke-width="1"`) + L('M84 100 L90 94 M116 100 L110 94', 1.4, col);
    const lw = slim ? 2.2 : 3.5, lx = slim ? 1.6 : 1;
    s += leg([[88, 94], [58, 80], [40, 92 * lx], [32, 110 * lx]], col, lw) + leg([[112, 94], [142, 80], [160, 92 * lx], [168, 110 * lx]], col, lw) + leg([[86, 104], [50, 110], [36, 130 * lx], [30, 150 * lx]], col, lw) + leg([[114, 104], [150, 110], [164, 130 * lx], [170, 150 * lx]], col, lw) + leg([[90, 112], [62, 140], [54, 166], [50, 182]], col, lw) + leg([[110, 112], [138, 140], [146, 166], [150, 182]], col, lw);
    s += E(100, slim ? 140 : 130, slim ? 9 : 26, slim ? 46 : 36, 'url(#fb)') + segs(100, slim ? 100 : 100, 100, slim ? 184 : 164, 6, dark(a, .4), slim ? 7 : 22);
    if (o.stripes) for (let i = 0; i < 3; i++) s += L(`M${100 - 22 + i * 3} ${114 + i * 18} Q100 ${120 + i * 18} ${100 + 22 - i * 3} ${114 + i * 18}`, 5, o.stripes);
    if (!slim) s += hairs(100, 130, 34, 22, dark(a, .5)) + hairs(100, 92, 22, 14, dark(a, .5));
    s += E(100, 92, slim ? 13 : 24, slim ? 14 : 22, o.th || b) + `<ellipse cx="100" cy="92" rx="${slim ? 13 : 24}" ry="${slim ? 14 : 22}" fill="url(#hr)"/>` + L('M90 76 L92 108 M110 76 L108 108', 1.6, dark(a, .4), 'opacity=".5"');
    s += E(100, 60, slim ? 11 : 22, slim ? 12 : 20, o.head || a);
    if (slim) s += ceye(93, 58, 6, 7, e) + ceye(107, 58, 6, 7, e) + L('M100 70 L100 24', 2.5, col) + antenna('M92 50 L82 34', col, 1.2) + antenna('M108 50 L118 34', col, 1.2) + [1, 2, 3, 4].map(i => L(`M${90 - i * 2} ${46 - i * 3} l-4 -1 M${90 - i * 2} ${46 - i * 3} l-3 -3 M${110 + i * 2} ${46 - i * 3} l4 -1 M${110 + i * 2} ${46 - i * 3} l3 -3`, .8, col)).join('');
    else s += ceye(86, 60, 13, 15, e, -8) + ceye(114, 60, 13, 15, e, 8) + C(97, 46, 1.4, OL) + C(100, 43, 1.4, OL) + C(103, 46, 1.4, OL) + antenna('M96 68 L94 76', col, 1.6) + antenna('M104 68 L106 76', col, 1.6) + L('M100 74 L100 84 L96 90', 2.5, col) + hairs(100, 60, 20, 10, dark(a, .5));
    return wrap(G('fb', a, b), s);
  },
  // ====== 애벌레 (옆) ======
  caterpillar: o => {
    const a = o.a || '#8CCB4A', b = dark(a, .55), col = dark(a, .7);
    let s = '';
    const xs = [40, 62, 84, 106, 128, 150];
    const yof = i => 120 - Math.sin(i / 5 * Math.PI) * 14 - Math.sin(i * 1.3 + PH()) * 5;
    xs.forEach((x, i) => { const y = yof(i); if (i >= 2 && i <= 4) s += P(`M${x - 7} ${y + 14} C${x - 9} ${y + 26} ${x + 9} ${y + 26} ${x + 7} ${y + 14} Z`, dark(a, .85), 'stroke-width="1.6"'); });
    s += leg([[150, 130], [146, 142], [150, 150]], col, 2.5) + leg([[162, 128], [162, 142], [168, 150]], col, 2.5) + leg([[172, 126], [176, 140], [182, 146]], col, 2.5);
    xs.forEach((x, i) => { const y = yof(i); s += C(x, y, 20, 'url(#cp)', `stroke="${OL}" stroke-width="2"`); s += L(`M${x - 18} ${y - 6} Q${x} ${y - 14} ${x + 18} ${y - 6}`, 1, dark(a, .5), 'opacity=".5"'); s += C(x, y + 8, 1.8, dark(a, .45)); if (o.dots) s += C(x, y - 6, 3.5, o.dots); if (o.bands) s += L(`M${x} ${y - 20} L${x} ${y + 20}`, 3, o.bands); for (let k = 0; k < 3; k++) s += L(`M${x - 10 + k * 10} ${y - 18} l${k - 1} -5`, 1, col, 'opacity=".7"'); });
    const hy = 118 - Math.sin(6 * 1.3 + PH()) * 5;
    s += C(170, hy, 20, o.head || dark(a, .9), `stroke="${OL}" stroke-width="2"`) + L(`M170 ${hy - 18} L170 ${hy + 18}`, 1.2, dark(a, .5), 'opacity=".6"') + SHINE(60, 104, 8, 4);
    if (o.eyespot) s += C(150, 98, 8, '#FFD54A') + C(150, 98, 4, OL) + C(130, 96, 6, '#FFD54A') + C(130, 96, 3, OL);
    if (o.horn) s += L('M40 100 L30 80', 5, o.horn);
    s += `<g transform="translate(0 ${(hy - 118).toFixed(1)})">` + [0, 1, 2].map(k => C(178 + k * 2, 112 + k * 4, 1.4, OL)).join('') + L('M176 124 Q182 130 188 126', 2, OL) + antenna('M180 102 L188 92', col, 1.4) + P('M186 124 C190 128 190 132 186 134 L184 126 Z', dark(a, .5)) + '</g>';
    return wrap(G('cp', a, b, .35, .3), s);
  },
  // ====== 집게벌레 (옆) ======
  earwig: o => {
    const a = o.a || '#7A4E22', b = dark(a, .5), col = dark(a, .8);
    let s = leg([[70, 128], [60, 150], [44, 158]], col, 3.5) + leg([[100, 130], [96, 154], [80, 162]], col, 3.5) + leg([[130, 126], [138, 150], [154, 158]], col, 3.5);
    s += P('M40 118 C70 104 120 100 160 104 C176 106 180 116 176 122 C140 130 80 136 40 132 Z', 'url(#ew)') + [50, 62, 74, 86, 98, 110].map(x => L(`M${x} 108 L${x} 130`, 1.4, b, 'opacity=".6"')).join('');
    s += P('M112 104 C130 96 160 98 170 106 L166 112 C140 106 120 108 114 114 Z', dark(a, 1.15)) + L('M140 104 L140 112', 1.2, b);
    s += L('M42 124 C26 118 14 104 10 92', 4.5, OL) + L('M42 128 C26 134 14 146 12 156', 4.5, OL) + L('M42 124 C26 118 14 104 10 92 M42 128 C26 134 14 146 12 156', 2.5, dark(a, .6));
    s += E(170, 112, 14, 10, b) + ceye(176, 108, 4.5, 4.5, '#15121A') + antenna('M178 102 L196 82', col, 1.4) + antenna('M182 106 L198 98', col, 1.4) + L('M182 118 l4 6 M178 120 l2 6', 1.8);
    return wrap(G('ew', a, b), s);
  },
  // ====== 풀잠자리·명주잠자리 (위) ======
  lacewing: o => {
    const a = o.a || '#8CCB4A', b = dark(a, .55), e = o.eye || '#E0A020', col = dark(a, .8), wt = o.wing || '#F0FFF0';
    const fw = 'M96 78 C70 60 40 70 38 110 C38 150 70 176 96 176 C100 150 100 100 100 86 Z';
    let s = wing(fw, wt, .55, []) + wing(mirror(fw), wt, .55, []);
    for (let i = 0; i < 6; i++) { const y = 84 + i * 16; s += L(`M98 ${y} C80 ${y - 6} 56 ${y + 6} 42 ${y + 18}`, 1, '#6F8F6F', 'opacity=".7"') + L(`M102 ${y} C120 ${y - 6} 144 ${y + 6} 158 ${y + 18}`, 1, '#6F8F6F', 'opacity=".7"'); }
    for (let i = 0; i < 8; i++) { const x = 46 + i * 7; s += L(`M${x} ${100 + i * 3} L${x + 1} ${170 - i * 6}`, .7, '#6F8F6F', 'opacity=".5"') + L(`M${200 - x} ${100 + i * 3} L${200 - x - 1} ${170 - i * 6}`, .7, '#6F8F6F', 'opacity=".5"'); }
    s += leg([[94, 78], [76, 68], [64, 78]], col, 2.5) + leg([[106, 78], [124, 68], [136, 78]], col, 2.5) + leg([[94, 84], [74, 90], [62, 104]], col, 2.5) + leg([[106, 84], [126, 90], [138, 104]], col, 2.5);
    s += P('M95 88 L105 88 L103 180 L97 180 Z', 'url(#lw)') + segs(100, 88, 100, 180, 9, dark(a, .4), 4) + E(100, 74, 12, 14, 'url(#lw)') + E(100, 54, 14, 12, dark(a, .9)) + ceye(91, 54, 6, 6, e) + ceye(109, 54, 6, 6, e) + antenna('M94 42 Q80 20 60 10', col, 1.2) + antenna('M106 42 Q120 20 140 10', col, 1.2);
    return wrap(G('lw', a, b), s);
  },
  // ====== 바퀴 (위) ======
  roach: o => {
    const a = o.a || '#7A4E22', b = dark(a, .5), col = dark(a, .8);
    let s = antenna('M90 56 C70 30 40 20 20 24', col, 1.6) + antenna('M110 56 C130 30 160 20 180 24', col, 1.6);
    s += leg([[82, 100], [50, 86], [36, 104], [28, 124]], col, 4) + leg([[118, 100], [150, 86], [164, 104], [172, 124]], col, 4) + leg([[78, 118], [44, 126], [30, 150], [24, 170]], col, 4) + leg([[122, 118], [156, 126], [170, 150], [176, 170]], col, 4) + leg([[80, 140], [56, 166], [46, 188], [42, 198]], col, 4.5) + leg([[120, 140], [144, 166], [154, 188], [158, 198]], col, 4.5);
    s += spines(50, 86, 36, 104, 3, -3) + spines(150, 86, 164, 104, 3, 3) + spines(44, 126, 30, 150, 3, -3) + spines(156, 126, 170, 150, 3, 3) + spines(56, 166, 46, 188, 3, -3) + spines(144, 166, 154, 188, 3, 3);
    s += E(100, 124, 36, 56, 'url(#rc)') + L('M100 80 L100 178', 1.6, b) + L('M84 82 C78 120 82 150 94 176 M116 82 C122 120 118 150 106 176 M76 100 C72 130 76 150 88 170 M124 100 C128 130 124 150 112 170', 1, dark(a, .5), 'opacity=".45"') + SHINE(84, 110, 8, 20, -8, .25);
    s += P('M68 78 C68 56 84 48 100 48 C116 48 132 56 132 78 C124 86 76 86 68 78 Z', dark(a, .85)) + SHINE(84, 62, 8, 4, -20, .3) + P('M84 52 C84 42 92 38 100 38 C108 38 116 42 116 52 Z', b) + ceye(90, 48, 3.5, 4.5, '#15121A') + ceye(110, 48, 3.5, 4.5, '#15121A') + L('M92 180 L86 194 M108 180 L114 194', 2.5, col);
    return wrap(G('rc', a, b), s);
  },
  // ====== 달팽이 (옆) ======
  snail: o => {
    const a = o.a || '#C89060', b = dark(a, .55), body = o.body || '#C0A878';
    let s = P('M30 150 C60 130 120 130 170 136 C184 138 186 152 170 156 C120 160 60 160 30 156 Z', 'url(#sb)') + L('M40 150 Q100 142 160 148', 1, dark(body, .6), 'opacity=".5"');
    for (let i = 0; i < 9; i++) s += L(`M${46 + i * 14} 152 l0 4`, 1, dark(body, .6), 'opacity=".5"');
    s += L('M154 136 L162 110', 3.5, dark(body, .8)) + L('M168 138 L182 112', 3.5, dark(body, .8)) + C(162, 108, 5, body, `stroke="${OL}" stroke-width="2"`) + C(182, 110, 5, body, `stroke="${OL}" stroke-width="2"`) + C(163, 108, 2.2, OL) + C(183, 110, 2.2, OL) + L('M150 146 L138 150 M152 150 L142 156', 2, dark(body, .8));
    s += C(96, 100, 44, 'url(#sn)', `stroke="${OL}" stroke-width="2"`) + L('M140 100 C140 76 118 60 96 62 C74 64 60 80 62 100 C64 118 80 130 98 128 C112 126 122 114 120 100 C118 90 108 84 98 86 C90 88 86 96 90 102', 2.4, b);
    for (let i = 0; i < 10; i++) { const ang = -1.2 + i * .42, r1 = 44, r2 = 36; s += L(`M${96 + Math.cos(ang) * r1} ${100 + Math.sin(ang) * r1} L${96 + Math.cos(ang) * r2} ${100 + Math.sin(ang) * r2}`, 1, dark(a, .6), 'opacity=".5"'); }
    s += SHINE(80, 82, 10, 6);
    return wrap(G('sn', a, b) + G('sb', body, dark(body, .7)), s);
  },
  // ====== 지네 (위) ======
  centipede: o => {
    const a = o.a || '#B0462A', b = dark(a, .5), col = o.leg || '#D9A066';
    let s = '';
    for (let i = 0; i < 9; i++) { const y = 48 + i * 17; s += leg([[90, y], [66, y - 8], [50, y + 2], [42, y + 10]], col, 2.8) + leg([[110, y], [134, y - 8], [150, y + 2], [158, y + 10]], col, 2.8); }
    for (let i = 8; i >= 0; i--) { const y = 48 + i * 17; s += P(`M84 ${y - 8} L116 ${y - 8} L118 ${y + 8} L82 ${y + 8} Z`, 'url(#cn)') + L(`M86 ${y - 4} L114 ${y - 4}`, 1, dark(a, 1.2), 'opacity=".5"'); }
    s += E(100, 34, 18, 13, dark(a, .85)) + ceye(93, 32, 3, 3, '#15121A') + ceye(107, 32, 3, 3, '#15121A') + P('M92 46 C86 52 84 58 88 62 L96 50 Z', dark(a, .5)) + P('M108 46 C114 52 116 58 112 62 L104 50 Z', dark(a, .5)) + antenna('M92 24 L80 10 L72 4', col, 1.6) + antenna('M108 24 L120 10 L128 4', col, 1.6) + leg([[92, 194], [84, 200]], col, 2.5) + leg([[108, 194], [116, 200]], col, 2.5);
    return wrap(G('cn', a, b), s);
  },
  // ====== 공벌레 (위) ======
  pillbug: o => {
    const a = o.a || '#7E7E8C', b = dark(a, .5), col = dark(a, .8);
    let s = '';
    for (let i = 0; i < 7; i++) { const y = 70 + i * 15; s += leg([[74, y + 4], [58, y + 10], [50, y + 16]], col, 2.5) + leg([[126, y + 4], [142, y + 10], [150, y + 16]], col, 2.5); }
    s += E(100, 118, 42, 62, 'url(#pb)');
    for (let i = 0; i < 7; i++) { const y = 78 + i * 14; const w = 42 * Math.sqrt(Math.max(.05, 1 - Math.pow((y - 118) / 62, 2))); s += P(`M${100 - w} ${y} Q100 ${y + 9} ${100 + w} ${y} L${100 + w} ${y + 6} Q100 ${y + 15} ${100 - w} ${y + 6} Z`, dark(a, .9 + (i % 2) * .08), 'stroke-width="1.4"'); }
    s += SHINE(82, 100, 8, 18, -8, .22) + P('M70 66 C70 50 84 44 100 44 C116 44 130 50 130 66 C120 72 80 72 70 66 Z', dark(a, .85)) + ceye(86, 60, 3.5, 4, '#15121A') + ceye(114, 60, 3.5, 4, '#15121A') + antenna('M90 48 L78 38 L64 30', col, 1.6) + antenna('M110 48 L122 38 L136 30', col, 1.6) + L('M92 180 L88 190 M108 180 L112 190', 1.8, col);
    return wrap(G('pb', a, b), s);
  },
  // ====== 지렁이 (옆) ======
  worm: o => {
    const a = o.a || '#D88C8C', b = dark(a, .65);
    const w = WAVE() * 10;
    let s = P(`M20 ${140 + w} C40 ${100 - w} 70 ${100 - w} 90 ${130 + w} C110 ${160 - w} 140 ${160 - w} 160 ${120 + w} C170 104 182 100 190 108 L184 118 C176 114 170 120 164 ${130 + w} C140 ${170 - w} 100 ${170 - w} 80 ${136 + w} C66 ${114 - w} 50 ${114 - w} 32 ${146 + w} Z`, 'url(#wm)');
    for (let i = 0; i < 26; i++) { const k = i / 26, x = 24 + 160 * k; const y = x < 90 ? 128 - Math.sin((x - 20) / 70 * Math.PI) * 24 : 142 + Math.sin((x - 90) / 80 * Math.PI) * 18; s += L(`M${x} ${y - 6} l0 12`, 1, b, 'opacity=".55"'); }
    s += P('M128 150 C134 140 146 140 152 150 C146 162 134 162 128 150 Z', dark(a, .85), 'stroke-width="1.4"') + SHINE(60, 112, 10, 4, -40, .3);
    return wrap(G('wm', a, b), s);
  },
};

// ====== 전용 삽화: 사슴벌레 (위에서 본 모습) ======
// jaw: 'dorcus'(넓적형) | 'lucanus'(사슴뿔형) | 'saw'(톱니형) | 'female'
function lamellate(x0, y0, dx, dy, col) { // 꺾인 더듬이 + 빗살 곤봉
  const x1 = x0 + dx, y1 = y0 + dy, x2 = x1 + dx * .5, y2 = y1 - 12;
  let s = L(`M${x0} ${y0} L${x1} ${y1}`, 3.2, OL) + L(`M${x0} ${y0} L${x1} ${y1}`, 1.8, col) + L(`M${x1} ${y1} L${x2} ${y2}`, 2.6, OL) + L(`M${x1} ${y1} L${x2} ${y2}`, 1.4, col);
  for (let i = 0; i < 3; i++) s += E(x2 + Math.sign(dx) * (2 + i * 3), y2 - 4 - i * 2.5, 4, 1.8, dark(col, .8), 'stroke-width="1" transform="rotate(' + (Math.sign(dx) * 25) + ' ' + (x2 + Math.sign(dx) * (2 + i * 3)) + ' ' + (y2 - 4 - i * 2.5) + ')"');
  return s;
}
function stagJaw(style, col) {
  const jc = dark(col, .75), tooth = (x, y, dx, dy) => P(`M${x} ${y} L${x + dx} ${y + dy} L${x + dx * .4} ${y + dy * .4 + 3} Z`, jc, 'stroke-width="1.2"');
  let d, teeth = '';
  if (style === 'female') { d = 'M84 50 C78 44 76 36 82 30 C88 28 92 34 92 40 C92 44 96 48 100 50 Z'; teeth = tooth(86, 36, 5, 1, 0); }
  else if (style === 'lucanus') { d = 'M84 50 C74 40 66 24 70 6 C72 2 78 2 82 6 C84 10 82 14 80 18 C80 28 88 40 100 48 Z'; teeth = tooth(80, 18, 6, 3) + tooth(82, 28, 6, 2) + tooth(86, 36, 6, 2) + P('M70 6 L66 0 L74 2 Z', jc, 'stroke-width="1"'); }
  else if (style === 'saw') { d = 'M84 50 C72 42 62 28 66 12 C68 6 76 4 82 8 C86 12 86 18 84 24 C84 32 90 42 100 48 Z'; for (let i = 0; i < 6; i++) teeth += tooth(79 + i * 1.2 + (i > 2 ? 2 : 0), 16 + i * 5, 5, 1); }
  else { d = 'M84 50 C70 40 62 24 70 10 C76 4 86 6 92 12 C94 16 92 20 88 22 C84 26 86 36 100 48 Z'; teeth = tooth(84, 24, 8, 4) + tooth(90, 14, 4, 4); }
  return P(d, jc) + teeth + L(d.replace(/Z$/, ''), 1, dark(col, 1.3), 'opacity=".25"') + P(mirror(d), jc) + teeth.replace(/<path d="([^"]+)"/g, (m, dd) => `<path d="${mirror(dd)}"`);
}
Object.assign(T, {
  stagTop: o => {
    const a = o.a || '#3A2416', b = dark(a, .35), col = o.leg || dark(a, .85), jaw = o.jaw || 'dorcus', hw = o.headW || 34;
    let s = '';
    // 다리: 앞다리 종아리 바깥쪽 톱니, 가운데·뒷다리 가시
    s += leg([[70, 92], [46, 76], [30, 94], [22, 112]], col, 5.5) + leg([[130, 92], [154, 76], [170, 94], [178, 112]], col, 5.5) + spines(46, 76, 30, 94, 4, -4) + spines(154, 76, 170, 94, 4, 4);
    s += leg([[62, 124], [36, 128], [24, 150], [20, 166]], col, 5) + leg([[138, 124], [164, 128], [176, 150], [180, 166]], col, 5) + spines(36, 128, 24, 150, 3, -3.5) + spines(164, 128, 176, 150, 3, 3.5);
    s += leg([[68, 154], [44, 176], [38, 194], [34, 200]], col, 5) + leg([[132, 154], [156, 176], [162, 194], [166, 200]], col, 5);
    // 딱지날개: 매끈한 광택 + 가는 세로 홈
    const ely = 'M100 112 C64 112 56 132 56 152 C56 174 72 196 100 200 Z';
    s += P(ely, 'url(#el)') + P(mirror(ely), 'url(#el)') + P('M96 112 L104 112 L100 122 Z', b);
    for (let i = 1; i <= 5; i++) { const x = 100 - i * 7.5; s += L(`M${x} ${116 + i * 2} C${x - 2} 150 ${x + 1} 176 ${100 - i * 4} 196`, .9, dark(a, .5), 'opacity=".45"') + L(mirror(`M${x} ${116 + i * 2} C${x - 2} 150 ${x + 1} 176 ${100 - i * 4} 196`), .9, dark(a, .5), 'opacity=".45"'); }
    s += SHINE(78, 140, 7, 28, -6, .28) + SHINE(122, 140, 4, 22, 6, .14);
    // 앞가슴등판: 넓고 납작, 가운데 세로선, 뒷모서리
    s += P('M52 84 C54 70 72 64 100 64 C128 64 146 70 148 84 L146 110 C130 114 70 114 54 110 Z', 'url(#pr)') + L('M100 68 L100 110', 1.4, dark(a, .45), 'opacity=".7"') + SHINE(76, 80, 12, 5, -10, .22) + SHINE(124, 80, 8, 4, 10, .12);
    if (o.spots) o.spots.forEach(([x, y, r]) => { s += C(x, y, r, '#15121A'); });
    // 머리: 넓고 납작, 겹눈 + 눈 가장자리 돌기
    s += P(`M${100 - hw} 62 C${100 - hw} 48 ${100 - hw + 12} 42 100 42 C${100 + hw - 12} 42 ${100 + hw} 48 ${100 + hw} 62 L${100 + hw - 2} 80 C${100 + hw - 16} 84 ${100 - hw + 16} 84 ${100 - hw + 2} 80 Z`, 'url(#hd)') + L(`M${100 - hw + 6} 56 L${100 - hw + 2} 48 M${100 + hw - 6} 56 L${100 + hw - 2} 48`, 2, OL);
    s += ceye(100 - hw + 8, 66, 4, 6, '#15121A', -10) + ceye(100 + hw - 8, 66, 4, 6, '#15121A', 10);
    // 큰턱 + 더듬이(꺾임, 빗살 곤봉)
    s += stagJaw(jaw, a);
    s += lamellate(100 - hw + 14, 48, -14, -10, col) + lamellate(100 + hw - 14, 48, 14, -10, col);
    return wrap(G('el', dark(a, 1.05), b, .4, .3) + G('pr', dark(a, .95), dark(a, .4)) + G('hd', dark(a, .9), dark(a, .45)), s, o.shift == null ? 0 : o.shift);
  },
  // ====== 전용 삽화: 장수풍뎅이 (위에서 본 모습) ======
  rhinoTop: o => {
    const a = o.a || '#5A2E14', b = dark(a, .35), col = dark(a, .8), male = o.horn !== 'none';
    let s = '';
    s += leg([[68, 112], [44, 96], [28, 114], [20, 134]], col, 6) + leg([[132, 112], [156, 96], [172, 114], [180, 134]], col, 6) + spines(44, 96, 28, 114, 3, -4.5) + spines(156, 96, 172, 114, 3, 4.5);
    s += leg([[60, 142], [34, 146], [22, 168], [18, 184]], col, 5.5) + leg([[140, 142], [166, 146], [178, 168], [182, 184]], col, 5.5) + L('M34 146 l-6 -5 M166 146 l6 -5', 2.5, OL);
    s += leg([[66, 168], [42, 186], [36, 198], [32, 200]], col, 5.5) + leg([[134, 168], [158, 186], [164, 198], [168, 200]], col, 5.5);
    // 딱지날개: 둥글고 볼록, 광택 (암컷은 잔털)
    const ely = 'M100 130 C58 130 50 150 52 168 C54 188 74 198 100 200 Z';
    s += P(ely, 'url(#el)') + P(mirror(ely), 'url(#el)') + P('M95 130 L105 130 L100 140 Z', b) + L('M100 130 L100 198', 1.6, dark(a, .4));
    if (!male) s += `<path d="${ely}" fill="url(#hr)"/><path d="${mirror(ely)}" fill="url(#hr)"/>`;
    for (let i = 1; i <= 3; i++) { const x = 100 - i * 12; s += L(`M${x} ${134 + i * 3} C${x - 3} 160 ${x} 180 ${100 - i * 7} 197`, .9, dark(a, .5), 'opacity=".4"') + L(mirror(`M${x} ${134 + i * 3} C${x - 3} 160 ${x} 180 ${100 - i * 7} 197`), .9, dark(a, .5), 'opacity=".4"'); }
    s += SHINE(78, 156, 9, 22, -6, male ? .32 : .18) + SHINE(124, 160, 5, 18, 6, .14);
    // 앞가슴등판: 크고 볼록, 수컷은 앞쪽 가운데 가슴뿔(끝이 둘로 갈라짐)
    s += P('M48 100 C50 80 72 70 100 70 C128 70 150 80 152 100 L150 128 C130 132 70 132 50 128 Z', 'url(#pr)') + SHINE(74, 92, 14, 6, -12, .25);
    if (male) s += P('M92 74 C92 60 96 50 100 44 C104 50 108 60 108 74 Z', dark(a, .7)) + L('M100 44 L97 50 M100 44 L103 50', 1.4, OL);
    // 머리 + 머리뿔: 몸 길이의 절반 가까이 앞으로 뻗고 끝이 Y자로 갈라지며 각 가지가 다시 둘로 나뉨
    s += P('M80 72 C80 60 90 54 100 54 C110 54 120 60 120 72 Z', 'url(#hd)');
    if (male) {
      s += P('M93 58 C90 42 91 26 95 16 L80 8 L83 2 L97 9 L100 4 L103 9 L117 2 L120 8 L105 16 C109 26 110 42 107 58 Z', 'url(#hn)') + L('M100 14 L100 56', 1.2, dark(a, .4), 'opacity=".6"') + L('M83 2 L86 6 M117 2 L114 6', 1.2, OL) + SHINE(96, 34, 2, 12, 0, .25);
    } else s += P('M92 56 C94 50 106 50 108 56 Z', dark(a, .6));
    s += ceye(84, 68, 4, 5, '#15121A', -10) + ceye(116, 68, 4, 5, '#15121A', 10);
    s += lamellate(86, 64, -12, -8, col) + lamellate(114, 64, 12, -8, col);
    return wrap(G('el', dark(a, 1.05), b, .4, .3) + G('pr', dark(a, .95), dark(a, .4)) + G('hd', dark(a, .9), dark(a, .45)) + G('hn', dark(a, .85), dark(a, .45), .3, .2), s);
  },

});

// ====== 바다 생물 틀 ======
Object.assign(T, {
  // 게 (위) — bigClaw: 한쪽 집게가 큼(농게), shell: 소라 껍데기(소라게)
  crab: o => {
    const a = o.a || '#B85C38', b = dark(a, .5), col = dark(a, .85);
    let s = '';
    const legsL = [[[66, 110], [36, 92], [20, 104], [10, 120]], [[62, 120], [30, 116], [14, 134], [6, 150]], [[62, 132], [32, 140], [18, 162], [12, 178]], [[68, 142], [44, 162], [34, 184], [30, 198]]];
    legsL.forEach(pts => { s += leg(pts, col, 4.5) + leg(pts.map(([x, y]) => [200 - x, y]), col, 4.5); });
    if (o.shell) s += C(100, 150, 42, 'url(#shl)', `stroke="${OL}" stroke-width="2"`) + L('M142 150 C142 128 124 112 102 114 C82 116 70 132 72 150 C74 166 88 178 104 176 C116 174 126 164 124 150 C122 140 112 136 104 138', 2.2, dark(o.shellC || '#C89060', .55)) + SHINE(86, 134, 10, 6);
    // 등딱지: 옆으로 넓은 육각형에 가까운 모양
    s += P(o.shell ? 'M60 112 C66 90 134 90 140 112 C146 126 136 140 100 142 C64 140 54 126 60 112 Z' : 'M56 108 C62 80 138 80 144 108 C150 126 138 148 100 150 C62 148 50 126 56 108 Z', 'url(#cb)') + L('M76 100 Q100 94 124 100', 1.2, dark(a, .5), 'opacity=".5"') + L('M70 116 Q100 110 130 116', 1.2, dark(a, .5), 'opacity=".5"') + SHINE(80, 100, 10, 5, -10, .28);
    // 눈자루 + 겹눈
    s += L('M88 86 L86 74', 3, OL) + L('M112 86 L114 74', 3, OL) + ceye(86, 72, 4, 4.5, '#15121A') + ceye(114, 72, 4, 4.5, '#15121A');
    // 집게발
    const claw = (x, big, flip) => { const k = big ? 1.5 : 1, f = flip ? -1 : 1; return P(`M${x} 100 C${x - 14 * f} ${92 - 10 * k} ${x - 26 * f} ${84 - 10 * k} ${x - 34 * f} ${66 - 14 * k} L${x - 22 * f} ${62 - 12 * k} C${x - 20 * f} ${74 - 8 * k} ${x - 12 * f} ${84 - 6 * k} ${x - 2 * f} 94 Z`, dark(a, 1.05)) + P(`M${x - 34 * f} ${66 - 14 * k} C${x - 42 * f} ${52 - 16 * k} ${x - 30 * f} ${40 - 18 * k} ${x - 20 * f} ${50 - 14 * k} L${x - 22 * f} ${62 - 12 * k} Z`, dark(a, .95)) + P(`M${x - 34 * f} ${66 - 14 * k} C${x - 48 * f} ${62 - 12 * k} ${x - 46 * f} ${44 - 14 * k} ${x - 36 * f} ${42 - 16 * k} L${x - 30 * f} ${48 - 14 * k} C${x - 36 * f} ${52 - 12 * k} ${x - 38 * f} ${60 - 10 * k} ${x - 32 * f} ${64 - 12 * k} Z`, dark(a, .8)); };
    s += claw(74, o.bigClaw, false) + claw(126, false, true);
    return wrap(G('cb', a, b) + G('shl', o.shellC || '#C89060', dark(o.shellC || '#C89060', .55)), s);
  },
  // 불가사리 (위)
  starfish: o => {
    const a = o.a || '#E07A3A', b = dark(a, .55);
    let d = ''; for (let i = 0; i < 5; i++) { const ang = -Math.PI / 2 + i * Math.PI * 2 / 5, ang2 = ang + Math.PI / 5; const tx = 100 + Math.cos(ang) * 86, ty = 108 + Math.sin(ang) * 86, ix = 100 + Math.cos(ang2) * 30, iy = 108 + Math.sin(ang2) * 30; d += (i ? 'L' : 'M') + `${tx.toFixed(1)} ${ty.toFixed(1)} Q${(100 + Math.cos(ang2) * 40).toFixed(1)} ${(108 + Math.sin(ang2) * 40).toFixed(1)} ${ix.toFixed(1)} ${iy.toFixed(1)} `; }
    let s = P(d + 'Z', 'url(#sf)');
    for (let i = 0; i < 5; i++) { const ang = -Math.PI / 2 + i * Math.PI * 2 / 5; for (let k = 1; k <= 5; k++) { const r = 14 + k * 13; s += C(100 + Math.cos(ang) * r, 108 + Math.sin(ang) * r, 4 - k * .4, dark(a, 1.25), 'opacity=".9"'); s += C(100 + Math.cos(ang + .12) * (r - 6), 108 + Math.sin(ang + .12) * (r - 6), 2, dark(a, .7), 'opacity=".6"') + C(100 + Math.cos(ang - .12) * (r - 6), 108 + Math.sin(ang - .12) * (r - 6), 2, dark(a, .7), 'opacity=".6"'); } }
    s += C(100, 108, 7, dark(a, 1.2), `stroke="${OL}" stroke-width="1.2"`) + SHINE(86, 92, 8, 5, -30, .25);
    return wrap(G('sf', a, b, .4, .35), s);
  },
  // 따개비 (바위에 붙은 모습)
  barnacle: o => {
    const a = o.a || '#C9C2B2', b = dark(a, .6);
    let s = P('M20 160 C40 150 70 146 100 146 C130 146 160 150 180 160 C170 176 130 184 100 184 C70 184 30 176 20 160 Z', '#6E6A66') + SHINE(60, 158, 14, 4, -5, .15);
    const cone = (cx, cy, r, h) => { let c = P(`M${cx - r} ${cy} C${cx - r * .6} ${cy - h} ${cx + r * .6} ${cy - h} ${cx + r} ${cy} Z`, 'url(#bn)'); for (let i = 0; i < 6; i++) { const k = (i + .5) / 6, x = cx - r + 2 * r * k; c += L(`M${x} ${cy} L${cx + (x - cx) * .35} ${cy - h * .9}`, 1.2, b, 'opacity=".6"'); } c += P(`M${cx - r * .3} ${cy - h * .82} C${cx - r * .1} ${cy - h * .95} ${cx + r * .1} ${cy - h * .95} ${cx + r * .3} ${cy - h * .82} C${cx + r * .1} ${cy - h * .72} ${cx - r * .1} ${cy - h * .72} ${cx - r * .3} ${cy - h * .82} Z`, '#3A3A44', 'stroke-width="1.2"'); return c; };
    s += cone(60, 156, 22, 44) + cone(140, 158, 20, 40) + cone(100, 150, 30, 64) + cone(90, 172, 12, 22);
    return wrap(G('bn', a, b, .4, .3), s);
  },
});

// ====== 심해·땅속 생물 틀 ======
Object.assign(T, {
  jellyfish: o => {
    const a = o.a || '#9FD8FF', b = dark(a, .7);
    let s = '';
    for (let i = 0; i < 7; i++) { const x = 58 + i * 14, len = 70 + ((i * 37) % 40), sw = WAVE() * 8 * (i % 2 ? 1 : -1); s += L(`M${x} 118 C${x - 8 + sw} ${118 + len * .4} ${x + 10 - sw} ${118 + len * .7} ${x - 2 + sw} ${118 + len}`, 2.2, a, 'opacity=".8"'); }
    for (let i = 0; i < 4; i++) { const x = 76 + i * 16; s += L(`M${x} 120 C${x - 12} 150 ${x + 12} 170 ${x} 196`, 5, dark(a, .9), 'opacity=".6"'); }
    const k = 1 + WAVE() * .07;
    s += P(`M${100 - 70 * k} 112 C${100 - 70 * k} ${112 - 62 / k} ${100 + 70 * k} ${112 - 62 / k} ${100 + 70 * k} 112 C140 124 60 124 ${100 - 70 * k} 112 Z`, 'url(#jf)', 'fill-opacity=".85"') + P('M44 108 C44 70 156 70 156 108 C130 102 70 102 44 108 Z', '#fff', 'fill-opacity=".18" stroke="none"');
    for (let i = 0; i < 5; i++) s += L(`M${52 + i * 24} 112 C${54 + i * 24} 90 ${58 + i * 24} 80 ${62 + i * 24} 70`, 1.2, '#fff', 'opacity=".5"');
    s += SHINE(70, 76, 18, 8, -20, .45);
    return wrap(G('jf', a, b, .45, .35), s);
  },
  anglerfish: o => {
    const a = o.a || '#3A3A50', b = dark(a, .45);
    let s = L('M96 70 C80 40 60 30 50 44', 3.5, OL) + L('M96 70 C80 40 60 30 50 44', 2, dark(a, 1.3)) + `<circle cx="48" cy="48" r="12" fill="url(#gl)" opacity=".8"/>` + C(48, 48, 5, '#FFF59D', `stroke="${OL}" stroke-width="1.5"`);
    s += P('M170 110 C150 60 60 60 34 104 C30 110 30 118 34 124 C60 170 150 170 170 120 L196 100 L190 128 L172 118 Z', 'url(#af)');
    s += P('M100 68 C90 50 80 54 84 70 Z', dark(a, .9)) + P('M120 70 C112 48 100 50 106 72 Z', dark(a, .9)) + P('M110 158 C100 180 90 176 94 160 Z', dark(a, .9));
    s += P('M34 116 C60 108 100 108 130 118 C100 132 60 136 34 124 Z', dark(a, .6)); for (let i = 0; i < 8; i++) s += P(`M${44 + i * 11} 112 L${48 + i * 11} 124 L${52 + i * 11} 112 Z`, '#F6F0E0', 'stroke-width="1"') + P(`M${50 + i * 11} 130 L${54 + i * 11} 118 L${58 + i * 11} 130 Z`, '#F6F0E0', 'stroke-width="1"');
    s += ceye(80, 90, 11, 11, '#C8D8FF') + C(82, 92, 5, '#15121A') + SHINE(120, 86, 20, 8, -10, .18);
    return wrap(G('af', a, b, .4, .35) + G('gl', '#FFF59D', '#FFB300', .5, .5), s);
  },
  squid: o => {
    const a = o.a || '#E07A6A', b = dark(a, .6);
    let s = '';
    for (let i = 0; i < 8; i++) { const x = 72 + i * 8; s += L(`M${x} 120 C${x - 10 + i * 2} 150 ${x + 6 - i * 2} 170 ${x - 4 + i} 192`, 4, dark(a, .9)); }
    s += L('M66 120 C40 150 36 180 30 196', 5, dark(a, .85)) + L('M134 120 C160 150 164 180 170 196', 5, dark(a, .85)) + P('M30 196 C24 186 36 182 36 194 Z', dark(a, .85)) + P('M170 196 C176 186 164 182 164 194 Z', dark(a, .85));
    s += P('M100 4 C128 30 134 80 130 118 C120 128 80 128 70 118 C66 80 72 30 100 4 Z', 'url(#sq)') + P('M100 20 C120 40 126 60 124 70 C110 56 90 56 76 70 C74 60 80 40 100 20 Z', dark(a, .85), 'stroke-width="1.2"');
    for (let i = 0; i < 12; i++) s += C(84 + (i * 23) % 36, 50 + (i * 17) % 60, 2, dark(a, .55), 'opacity=".6"');
    s += ceye(78, 104, 9, 9, '#C8D8FF') + ceye(122, 104, 9, 9, '#C8D8FF') + C(80, 106, 4, '#15121A') + C(124, 106, 4, '#15121A') + SHINE(88, 50, 6, 24, 0, .3);
    return wrap(G('sq', a, b, .4, .3), s);
  },
  shrimp: o => {
    const a = o.a || '#E9A0A0', b = dark(a, .65), col = dark(a, .85);
    let s = antenna('M150 70 C170 50 190 36 198 20', col, 1.4) + antenna('M152 76 C180 70 196 72 200 80', col, 1.4);
    for (let i = 0; i < 5; i++) s += L(`M${110 - i * 14} 118 C${106 - i * 14} 140 ${100 - i * 14} 150 ${96 - i * 14} 160`, 3, col);
    s += P('M150 60 C176 70 176 110 150 126 C120 134 90 130 60 140 C44 146 36 160 30 176 L24 170 C28 150 36 136 50 124 C70 110 100 106 120 100 C136 96 140 80 150 60 Z', 'url(#sh2)');
    for (let i = 0; i < 6; i++) { const x = 130 - i * 16, y = 108 + i * 6; s += L(`M${x} ${y - 10} Q${x - 6} ${y} ${x - 4} ${y + 12}`, 1.4, b, 'opacity=".6"'); }
    s += P('M30 176 C20 170 14 178 20 186 L34 182 Z', dark(a, .9)) + P('M24 170 C14 164 8 172 14 180 L28 178 Z', dark(a, .9));
    s += P('M150 60 C160 54 170 60 168 72 C160 70 154 66 150 60 Z', dark(a, .8)) + ceye(160, 66, 5, 5, '#15121A') + L('M156 80 L170 96 M160 82 L176 92', 2, col);
    return wrap(G('sh2', a, b, .4, .3), s);
  },
  grub: o => {
    const a = o.a || '#F3E7C3', b = dark(a, .7), col = dark(a, .6);
    let s = '';
    const pts = []; const sq2 = 1 + WAVE() * .06; for (let i = 0; i < 9; i++) { const ang = -1.2 + i * (.42 * sq2); pts.push([110 + Math.cos(ang) * 56 / sq2, 100 + Math.sin(ang) * 56]); }
    for (let i = pts.length - 1; i >= 0; i--) { const [x, y] = pts[i]; s += C(x, y, 20 - (i > 6 ? (i - 6) * 3 : 0), 'url(#gb)', `stroke="${OL}" stroke-width="2"`); if (i < 7) s += C(x + 8, y - 6, 2, '#8A6A4A', 'opacity=".8"'); }
    s += leg([[pts[0][0] + 6, pts[0][1] + 14], [pts[0][0] + 2, pts[0][1] + 28]], col, 3) + leg([[pts[1][0] + 10, pts[1][1] + 10], [pts[1][0] + 12, pts[1][1] + 26]], col, 3) + leg([[pts[2][0] + 10, pts[2][1] + 4], [pts[2][0] + 18, pts[2][1] + 18]], col, 3);
    s += C(pts[0][0] - 12, pts[0][1] - 10, 15, '#A86E3A', `stroke="${OL}" stroke-width="2"`) + L(`M${pts[0][0] - 18} ${pts[0][1] - 2} l-6 8 M${pts[0][0] - 8} ${pts[0][1] + 2} l-2 9`, 2.5, OL) + C(pts[0][0] - 18, pts[0][1] - 14, 2, OL) + SHINE(pts[4][0] - 6, pts[4][1] - 8, 7, 4, -20, .3);
    return wrap(G('gb', a, b, .4, .3), s);
  },
  nymph: o => {
    const a = o.a || '#8A6A4A', b = dark(a, .5), col = dark(a, .8);
    let s = leg([[72, 92], [40, 76], [26, 86], [20, 100]], col, 7) + spines(40, 76, 26, 86, 3, 4) + leg([[128, 92], [160, 76], [174, 86], [180, 100]], col, 7) + spines(160, 76, 174, 86, 3, -4);
    s += leg([[70, 120], [40, 128], [26, 148]], col, 4) + leg([[130, 120], [160, 128], [174, 148]], col, 4) + leg([[74, 140], [50, 162], [40, 184]], col, 4) + leg([[126, 140], [150, 162], [160, 184]], col, 4);
    s += E(100, 128, 36, 48, 'url(#ny)') + segs(100, 100, 100, 176, 7, dark(a, .45), 30) + P('M64 92 C64 70 80 62 100 62 C120 62 136 70 136 92 C124 100 76 100 64 92 Z', dark(a, .9)) + P('M70 66 C70 50 84 44 100 44 C116 44 130 50 130 66 C120 72 80 72 70 66 Z', dark(a, .8));
    s += ceye(76, 58, 6, 6, '#2A2230') + ceye(124, 58, 6, 6, '#2A2230') + L('M100 70 L100 94', 2, b) + P('M86 104 C92 96 108 96 114 104 L112 114 C104 108 96 108 88 114 Z', dark(a, .75), 'stroke-width="1.2"') + SHINE(84, 116, 7, 16, -8, .22);
    return wrap(G('ny', a, b), s);
  },
  antlion_larva: o => {
    const a = o.a || '#9A8A6A', b = dark(a, .5), col = dark(a, .8);
    let s = leg([[80, 100], [56, 90], [44, 102]], col, 3.5) + leg([[120, 100], [144, 90], [156, 102]], col, 3.5) + leg([[76, 116], [48, 124], [38, 140]], col, 3.5) + leg([[124, 116], [152, 124], [162, 140]], col, 3.5) + leg([[80, 134], [58, 156], [52, 172]], col, 3.5) + leg([[120, 134], [142, 156], [148, 172]], col, 3.5);
    s += E(100, 130, 46, 50, 'url(#al)') + `<ellipse cx="100" cy="130" rx="46" ry="50" fill="url(#hr)"/>` + hairs(100, 130, 48, 30, dark(a, .6)) + segs(100, 92, 100, 176, 6, dark(a, .45), 40);
    s += P('M72 92 C72 72 86 64 100 64 C114 64 128 72 128 92 C118 100 82 100 72 92 Z', dark(a, .85)) + P('M80 66 C82 50 86 36 70 10 C76 8 82 14 86 26 C90 40 92 54 94 64 Z', dark(a, .5)) + P(mirror('M80 66 C82 50 86 36 70 10 C76 8 82 14 86 26 C90 40 92 54 94 64 Z'), dark(a, .5)) + L('M78 34 l6 2 M82 46 l6 2 M122 34 l-6 2 M118 46 l-6 2', 1.5);
    s += ceye(84, 78, 3.5, 3.5, '#15121A') + ceye(116, 78, 3.5, 3.5, '#15121A') + SHINE(84, 116, 8, 14, -8, .22);
    return wrap(G('al', a, b), s);
  },
  springtail: o => {
    const a = o.a || '#8A9AB0', b = dark(a, .55), col = dark(a, .8);
    let s = L('M60 150 C40 170 30 180 24 192', 4, OL) + L('M60 150 C40 170 30 180 24 192', 2.2, dark(a, 1.1)) + L('M24 192 L16 198 M24 192 L30 200', 2, OL);
    s += leg([[90, 128], [76, 146], [64, 156]], col, 3) + leg([[112, 124], [112, 148], [100, 162]], col, 3) + leg([[132, 112], [146, 136], [142, 154]], col, 3);
    s += P('M56 146 C70 112 110 96 150 92 C166 90 176 98 172 108 C150 124 110 138 62 152 Z', 'url(#sp2)') + segs(70, 140, 150, 100, 6, dark(a, .45), 6);
    s += E(164, 100, 14, 12, dark(a, .9)) + ceye(170, 96, 4, 4, '#15121A') + antenna('M174 90 C182 76 190 70 196 62', col, 1.4) + antenna('M176 94 C186 90 192 90 198 92', col, 1.4) + SHINE(100, 118, 18, 5, -20, .3);
    return wrap(G('sp2', a, b), s);
  },
  mole: o => {
    const a = o.a || '#4A3A3A', b = dark(a, .5);
    let s = P('M40 110 C60 70 140 66 170 104 C180 118 178 142 164 154 C130 170 70 168 40 148 C28 138 30 122 40 110 Z', 'url(#ml)') + `<path d="M40 110 C60 70 140 66 170 104 C180 118 178 142 164 154 C130 170 70 168 40 148 C28 138 30 122 40 110 Z" fill="url(#hr)"/>`;
    s += P('M166 112 C180 110 194 118 194 128 C188 134 176 132 168 126 Z', '#E8A0A0') + C(190, 126, 3, '#3A2A2A') + L('M178 118 L196 108 M180 126 L200 124 M178 132 L196 140', 1.2, '#2A1E1E');
    s += C(160, 108, 2.5, '#15121A') + P('M110 150 C100 162 80 164 72 176 C86 182 104 176 112 168 Z', '#E8B8A8') + L('M78 176 l-4 6 M86 178 l-2 7 M94 176 l0 8 M102 174 l2 7', 2, OL) + P('M138 152 C136 166 124 170 118 180 C132 184 146 178 150 166 Z', '#E8B8A8') + L('M120 180 l-2 6 M128 182 l0 7 M136 180 l2 7 M144 176 l3 6', 2, OL);
    s += L('M40 128 C30 126 22 130 18 138', 3, dark(a, .9)) + SHINE(90, 94, 22, 8, -10, .18);
    return wrap(G('ml', a, b, .4, .3), s);
  },
});

// ====== 바위틈 생물 틀 ======
Object.assign(T, {
  silverfish: o => { // 좀 (옆)
    const a = o.a || '#B8BCC8', b = dark(a, .55), col = dark(a, .7);
    let s = antenna('M160 92 C178 70 192 50 200 30', col, 1.4) + antenna('M164 98 C186 90 196 92 200 96', col, 1.4);
    s += L('M40 118 C26 130 14 146 6 166 M40 120 C30 140 26 160 24 180 M42 122 C40 142 44 160 52 176', 1.6, col);
    s += leg([[90, 128], [76, 146], [62, 156]], col, 2.6) + leg([[112, 124], [112, 148], [100, 162]], col, 2.6) + leg([[134, 116], [146, 138], [142, 156]], col, 2.6);
    s += P('M40 118 C70 104 120 92 160 90 C176 90 180 100 170 108 C140 120 90 136 44 126 Z', 'url(#sf2)');
    for (let i = 0; i < 9; i++) { const k = i / 9, x = 50 + 110 * k; s += L(`M${x} ${126 - 24 * k} L${x + 2} ${112 - 22 * k}`, 1.2, b, 'opacity=".5"'); }
    s += SHINE(100, 108, 30, 4, -8, .45) + E(164, 98, 12, 9, dark(a, .9)) + ceye(170, 95, 3.5, 3.5, '#15121A');
    return wrap(G('sf2', dark(a, 1.05), b), s);
  },
  scorpion: o => { // 전갈 (위)
    const a = o.a || '#B88A3A', b = dark(a, .5), col = dark(a, .8);
    let s = '';
    [[[88, 96], [60, 84], [44, 98], [36, 116]], [[86, 106], [52, 108], [36, 128], [30, 146]], [[86, 116], [54, 128], [40, 150], [34, 168]], [[90, 126], [62, 146], [52, 170], [48, 186]]].forEach(pts => { s += leg(pts, col, 4) + leg(pts.map(([x, y]) => [200 - x, y]), col, 4); });
    // 꼬리: 마디 5개가 위로 휘어 독침
    const tail = [[100, 150], [100, 170], [112, 184], [130, 184], [142, 168], [140, 148]];
    for (let i = 0; i < tail.length - 1; i++) { const [x1, y1] = tail[i], [x2, y2] = tail[i + 1]; s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${OL}" stroke-width="${13 - i}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${dark(a, 1 - i * .06)}" stroke-width="${10 - i}" stroke-linecap="round"/>`; }
    s += P('M140 148 C146 138 142 128 134 126 C136 134 136 142 140 148 Z', dark(a, .5)) + P('M134 126 L130 118 L138 124 Z', '#15121A');
    s += E(100, 118, 22, 36, 'url(#sc)') + segs(100, 90, 100, 150, 7, dark(a, .45), 16) + P('M80 92 C80 72 120 72 120 92 C112 100 88 100 80 92 Z', dark(a, .9)) + ceye(94, 84, 3, 3, '#15121A') + ceye(106, 84, 3, 3, '#15121A') + C(100, 78, 1.6, '#15121A');
    // 집게 (더듬이다리)
    for (const d of [-1, 1]) { const x = 100 + d * 22; s += leg([[100 + d * 12, 92], [x + d * 12, 72], [x + d * 24, 56]], col, 6) + P(`M${x + d * 24} 56 C${x + d * 36} 40 ${x + d * 40} 28 ${x + d * 30} 22 L${x + d * 22} 30 C${x + d * 26} 38 ${x + d * 24} 46 ${x + d * 20} 52 Z`, dark(a, .95)) + P(`M${x + d * 24} 56 C${x + d * 12} 44 ${x + d * 12} 30 ${x + d * 20} 24 L${x + d * 24} 30 C${x + d * 20} 38 ${x + d * 22} 46 ${x + d * 28} 52 Z`, dark(a, .8)); }
    return wrap(G('sc', a, b), s);
  },
  slug: o => { // 민달팽이 (옆)
    const a = o.a || '#8A7A5A', b = dark(a, .55);
    const w = WAVE() * 8;
    let s = P(`M${20 + w} 150 C${30 + w} 118 70 104 120 106 C156 108 178 120 186 134 C190 142 184 150 170 152 C120 160 60 160 ${20 + w} 154 Z`, 'url(#sl)') + P('M80 118 C100 100 150 100 170 118 C150 112 100 112 80 118 Z', dark(a, .85), 'stroke-width="1.4"');
    for (let i = 0; i < 10; i++) { const x = 30 + i * 14; s += L(`M${x} ${150 - Math.sin(i / 10 * Math.PI) * 34} l0 10`, 1.2, b, 'opacity=".5"'); }
    s += C(150, 128, 4, dark(a, .6), 'opacity=".8"') + L('M172 128 L180 108 M178 132 L190 118', 3, dark(a, .8)) + C(180, 106, 4, dark(a, 1.1), `stroke="${OL}" stroke-width="2"`) + C(190, 116, 4, dark(a, 1.1), `stroke="${OL}" stroke-width="2"`) + C(181, 105, 1.8, OL) + C(191, 115, 1.8, OL) + L('M170 140 L160 146 M172 144 L164 150', 2, dark(a, .8)) + SHINE(100, 118, 26, 5, -8, .3);
    return wrap(G('sl', a, b), s);
  },
  eel: o => { // 펠리컨장어 (옆) — 펠리컨 부리 같은 커다란 주머니 입을 벌린 모습, 가늘고 긴 꼬리 끝의 빛 기관
    const a = o.a || '#23202E', b = dark(a, .5), w = WAVE() * 6;
    const tail = `M122 100 C96 98 74 ${110 + w} 54 ${106 - w} C40 ${102 - w} 26 ${116 + w} 14 110`;
    let s = L(tail, 9, OL) + L(tail, 6, a);
    s += `<circle cx="14" cy="110" r="12" fill="url(#eg)" opacity=".85"/>` + C(14, 110, 4.5, '#FF8A9A', `stroke="${OL}" stroke-width="1.5"`);
    // 입 안쪽 (크게 벌린 입)
    s += P('M196 84 C170 92 146 98 124 98 L124 112 C150 112 174 108 192 104 Z', '#6A2236', 'stroke-width="1.5"');
    // 아래턱 주머니 (펠리컨 부리처럼 늘어진 큰 주머니)
    s += P('M192 104 C184 134 156 160 122 152 C106 148 104 124 124 112 C150 112 174 108 192 104 Z', 'url(#ep)');
    s += L('M190 106 C180 126 160 146 134 148', 1.2, dark(a, 1.8), 'opacity=".45"');
    // 머리·몸통과 위턱
    s += P('M196 84 C186 72 168 62 148 64 C130 66 118 80 116 92 C116 98 120 100 124 98 C146 98 170 92 196 84 Z', 'url(#ee)');
    s += L('M196 84 C170 92 146 98 124 98', 2, dark(a, 1.8), 'opacity=".5"');
    s += L(`M118 86 C100 88 86 ${94 + w * .5} 66 ${98 - w * .5}`, 1.5, dark(a, 1.6), 'opacity=".6"');
    s += ceye(184, 78, 3.6, 3.6, '#CFE3FF') + C(185, 78, 1.7, '#15121A') + SHINE(150, 72, 20, 4, -8, .18);
    return wrap(G('ee', a, b, .4, .3) + G('ep', dark(a, .9), b, .4, .3) + G('eg', '#FFB0C0', '#FF3A6A', .5, .5), s);
  },
  bat: o => { // 박쥐 (위에서 본 모습, 날개를 활짝 편 채 머리는 위)
    const a = o.a || '#6B5A4A', b = dark(a, .5), wing = o.wing || dark(a, .75), f = WAVE() * 10;
    const w = d => `M${100 + d * 14} 96 C${100 + d * 40} ${70 - f} ${100 + d * 70} ${60 - f} ${100 + d * 96} ${66 - f} C${100 + d * 92} ${86 - f * .5} ${100 + d * 84} ${100} ${100 + d * 82} ${118} C${100 + d * 70} ${108} ${100 + d * 62} ${120} ${100 + d * 56} ${138} C${100 + d * 48} ${124} ${100 + d * 38} ${130} ${100 + d * 30} ${146} C${100 + d * 24} ${130} ${100 + d * 18} ${124} ${100 + d * 12} ${126} Z`;
    let s = '';
    for (const d of [-1, 1]) { s += P(w(d), 'url(#bw)'); for (const k of [[40, 72], [62, 96], [48, 118]]) s += L(`M${100 + d * 14} 96 L${100 + d * k[0]} ${k[1] - f * .6}`, 1.6, b, 'opacity=".55"'); }
    s += E(100, 108, 16, 26, 'url(#bb)') + `<ellipse cx="100" cy="112" rx="14" ry="20" fill="url(#hr)"/>`;
    s += L('M96 134 C92 146 94 156 98 162 M104 134 C108 146 106 156 102 162', 2.2, b);
    s += P('M88 76 C84 60 86 48 92 46 C96 54 98 62 100 68 Z', dark(a, .9)) + P('M112 76 C116 60 114 48 108 46 C104 54 102 62 100 68 Z', dark(a, .9)) + P('M90 70 C88 62 90 56 93 54 C95 60 96 64 97 68 Z', '#E8A0A0', 'stroke-width="1"') + P('M110 70 C112 62 110 56 107 54 C105 60 104 64 103 68 Z', '#E8A0A0', 'stroke-width="1"');
    s += E(100, 80, 15, 14, 'url(#bb)') + ceye(93, 78, 3.5, 3.5, '#15121A') + ceye(107, 78, 3.5, 3.5, '#15121A') + C(94, 77, 1.2, '#fff') + C(108, 77, 1.2, '#fff') + E(100, 88, 4, 3, dark(a, .6), 'stroke-width="1"') + L('M96 92 L94 96 M104 92 L106 96', 1.6, '#F3E7C3');
    return wrap(G('bb', a, b, .4, .3) + G('bw', wing, dark(wing, .55), .5, .3), s);
  },
  fish: o => { // 눈먼 동굴물고기 (옆) — 하얗고 눈이 없다
    const a = o.a || '#F0D8D0', b = dark(a, .6), w = WAVE() * 6;
    let s = P(`M44 100 C30 ${80 + w} 22 ${74 + w} 14 ${72 + w} C22 ${86 + w * .5} 22 ${114 + w * .5} 14 ${128 + w} C22 ${126 + w} 30 ${120 + w} 44 100 Z`, 'url(#fs)');
    s += P('M60 92 C76 60 118 58 134 84 L108 96 Z', dark(a, .9)) + P('M72 112 C80 136 100 142 116 128 L108 108 Z', dark(a, .9)) + P('M140 110 C150 130 162 130 166 118 L150 108 Z', dark(a, .9), 'stroke-width="1.4"');
    s += P('M44 100 C60 80 100 72 140 78 C166 82 184 92 190 100 C184 108 166 118 140 122 C100 128 60 120 44 100 Z', 'url(#fs)');
    s += P('M150 86 C160 92 166 98 168 104 C160 108 152 110 146 108 C148 100 148 92 150 86 Z', dark(a, .92), 'stroke-width="1.2"');
    for (let i = 0; i < 7; i++) s += L(`M${66 + i * 12} ${86 + (i % 2) * 2} C${70 + i * 12} 100 ${70 + i * 12} 108 ${66 + i * 12} ${114 - (i % 2) * 2}`, 1, b, 'opacity=".35"');
    s += E(172, 92, 4, 3, dark(a, .8), 'opacity=".5" stroke-width="1"') + L('M186 104 C182 108 176 110 172 110', 2, b) + SHINE(110, 86, 30, 6, -4, .4);
    return wrap(G('fs', a, b, .4, .3), s);
  },
  olm: o => { // 올름 (옆) — 분홍빛 긴 몸, 작은 다리, 빨간 겉아가미
    const a = o.a || '#F2C4C0', b = dark(a, .6), w = WAVE() * 5;
    let s = L(`M60 118 C50 126 44 134 40 144 M72 120 C70 130 72 140 68 150 M128 116 C124 128 126 138 122 148 M140 114 C148 124 150 134 154 142`, 3.5, dark(a, .85));
    s += P(`M14 ${112 + w} C30 ${100 + w} 50 98 80 98 C110 98 140 92 160 90 C176 88 190 92 194 100 C196 106 190 112 176 116 C150 122 110 124 80 122 C50 120 30 ${124 + w} 14 ${112 + w} Z`, 'url(#ol)');
    for (let i = 0; i < 9; i++) s += L(`M${44 + i * 14} 101 l0 18`, 1, b, 'opacity=".3"');
    if (o.spots) for (let i = 0; i < 12; i++) s += C(40 + (i * 37) % 136, 100 + (i * 17) % 18, 2 + (i % 2), o.spots, 'opacity=".8"');
    if (o.gills !== false) for (const [x, y] of [[166, 86], [172, 84], [178, 86]]) s += L(`M${x} ${y + 6} C${x - 4} ${y - 4} ${x - 2} ${y - 10} ${x + 2} ${y - 12} M${x} ${y + 6} C${x + 2} ${y - 4} ${x + 6} ${y - 8} ${x + 8} ${y - 8}`, 2.4, '#E05060');
    s += (o.eye ? ceye(176, 99, 4, 4, '#15121A') + C(177, 98, 1.4, '#fff') : C(178, 100, 2, dark(a, .75), 'opacity=".6"')) + L('M184 108 C188 108 192 106 194 104', 1.6, b) + SHINE(120, 102, 40, 4, -2, .35);
    return wrap(G('ol', a, b, .4, .3), s);
  },
  lizard: o => { // 가시도마뱀 (옆) — 온몸의 가시, 머리의 뿔, 꼬리 흔들기
    const a = o.a || '#C8884A', b = dark(a, .55), col = dark(a, .8), w = WAVE() * 6;
    let s = L(`M58 114 C40 ${118 + w} 26 ${124 + w} 10 ${118 + w * 1.5}`, 11, OL) + L(`M58 114 C40 ${118 + w} 26 ${124 + w} 10 ${118 + w * 1.5}`, 8, col);
    s += leg([[80, 126], [66, 144], [52, 150]], col, 5) + leg([[140, 124], [156, 140], [170, 146]], col, 5);
    s += P('M58 100 C70 82 110 76 148 84 C170 88 182 98 184 108 C182 120 160 130 130 132 C100 134 70 128 58 118 Z', 'url(#lz)');
    for (let i = 0; i < 9; i++) { const x = 64 + i * 13, y = 92 - Math.sin(i / 8 * Math.PI) * 6; s += P(`M${x} ${y + 8} L${x + 4} ${y - 10} L${x + 9} ${y + 6} Z`, dark(a, 1.15), 'stroke-width="1.2"'); }
    for (let i = 0; i < 6; i++) { const x = 70 + i * 16; s += P(`M${x} 128 L${x + 3} 138 L${x + 7} 128 Z`, dark(a, .9), 'stroke-width="1"'); }
    for (let i = 0; i < 12; i++) s += C(72 + (i * 29) % 100, 100 + (i * 17) % 24, 2.2, dark(a, .7), 'opacity=".5"');
    s += leg([[92, 128], [84, 146], [72, 154]], col, 5) + leg([[148, 126], [160, 144], [176, 150]], col, 5);
    s += P('M150 86 C166 80 182 84 190 96 C192 104 188 112 178 114 C168 116 158 112 152 104 Z', 'url(#lz)');
    s += P('M162 88 L158 70 L170 84 Z', dark(a, 1.1), 'stroke-width="1.2"') + P('M176 90 L180 72 L186 90 Z', dark(a, 1.1), 'stroke-width="1.2"');
    s += ceye(176, 96, 4.5, 4.5, '#15121A') + C(177, 95, 1.6, '#fff') + L('M184 106 C186 108 189 108 191 106', 1.6, b) + SHINE(110, 96, 30, 5, -6, .3);
    return wrap(G('lz', a, b, .4, .3), s);
  },
  minnow: o => { // 민물고기 (옆) — 눈·비늘·지느러미, 꼬리 흔들기 (stripe 옆줄, long 길쭉, small 작게, barbels 수염)
    const a = o.a || '#C8D8E0', b = dark(a, .6), w = WAVE() * 6, ry = o.long ? 13 : o.small ? 17 : 22, fin = dark(a, .85);
    let s = P(`M40 100 C28 ${82 + w} 20 ${76 + w} 12 ${74 + w} C20 ${88 + w * .5} 20 ${112 + w * .5} 12 ${126 + w} C20 ${124 + w} 28 ${118 + w} 40 100 Z`, fin);
    s += o.long ? P(`M76 ${104 - ry} C96 ${90 - ry} 130 ${90 - ry} 150 ${102 - ry} L130 ${104 - ry} Z`, fin) : P(`M70 ${104 - ry} C84 ${70 - ry} 118 ${70 - ry} 132 ${100 - ry} L108 ${104 - ry} Z`, fin);
    s += P(`M80 ${96 + ry} C86 ${116 + ry} 104 ${120 + ry} 118 ${108 + ry} L110 ${94 + ry} Z`, fin);
    s += P(`M40 100 C60 ${100 - ry} 100 ${96 - ry} 140 ${100 - ry} C166 ${102 - ry * .6} 184 94 190 100 C184 106 166 ${98 + ry * .6} 140 ${100 + ry} C100 ${104 + ry} 60 ${100 + ry} 40 100 Z`, 'url(#mn)');
    if (o.stripe) s += L('M50 102 C90 98 140 98 176 102', o.long ? 3 : 4.5, o.stripe, 'opacity=".7"');
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { const y = 100 - ry * .6 + j * ry * .55; s += C(66 + i * 15 + (j % 2) * 7, y, ry * .18, 'none', `stroke="${b}" stroke-width=".8" opacity=".3"`); }
    s += P(`M136 ${104 + ry * .2} C146 ${108 + ry * .3} 154 ${118 + ry * .4} 160 ${114 + ry * .3} L156 ${104 + ry * .2} Z`, fin, 'stroke-width="1.2"');
    s += L(`M150 ${100 - ry * .4} C156 ${100 - ry * .1} 156 ${100 + ry * .3} 150 ${100 + ry * .6}`, 1.5, b, 'opacity=".5"');
    s += ceye(170, 95, 5, 5, '#15121A') + C(171.5, 93.5, 1.8, '#fff') + L('M186 104 C182 108 176 109 172 108', 1.8, b);
    if (o.barbels) s += L('M184 106 C190 112 194 118 196 124 M178 108 C180 116 182 122 180 128 M188 100 C194 102 198 106 199 110', 1.6, b);
    s += SHINE(110, 100 - ry * .6, 28, ry * .22, -4, .35);
    return wrap(G('mn', a, b, .4, .3), s);
  },
  crayfish: o => { // 가재 (위) — 큰 집게, 긴 더듬이, 마디 배와 부채 꼬리
    const a = o.a || '#8A5A3A', b = dark(a, .55), col = dark(a, .85), w = WAVE() * 3;
    let s = antenna(`M84 50 C70 30 50 ${16 + w} 30 ${8 + w}`, col, 1.6) + antenna(`M116 50 C130 30 150 ${16 - w} 170 ${8 - w}`, col, 1.6);
    s += antenna('M90 56 C80 46 72 44 64 40', col, 1.2) + antenna('M110 56 C120 46 128 44 136 40', col, 1.2);
    [[[74, 84], [40, 80], [26, 96]], [[72, 96], [36, 102], [20, 122]], [[72, 108], [40, 124], [30, 146]], [[76, 120], [48, 142], [44, 166]]].forEach(pts => { s += leg(pts, col, 4) + leg(pts.map(([x, y]) => [200 - x, y]), col, 4); });
    s += P(`M76 180 C62 ${190 + w} 70 200 86 194 L100 190 L114 194 C130 200 138 ${190 + w} 124 180 Z`, dark(a, .9));
    s += P('M78 136 C74 158 82 182 100 186 C118 182 126 158 122 136 Z', 'url(#cf)');
    for (let i = 0; i < 4; i++) { const y = 146 + i * 10; s += L(`M${78 + i} ${y} Q100 ${y + 7} ${122 - i} ${y}`, 1.6, b, 'opacity=".55"'); }
    s += P('M70 66 C70 40 130 40 130 66 L128 138 L72 138 Z', 'url(#cf)') + L('M72 100 L128 100', 1.6, b, 'opacity=".5"') + L('M100 48 L100 96', 1.4, b, 'opacity=".4"') + L('M100 48 L92 40 M100 48 L108 40', 2.2, b);
    const claw = f => { const X = x => 100 - x * f; return P(`M${X(26)} 74 C${X(40)} 66 ${X(52)} 56 ${X(58)} 46 L${X(46)} 40 C${X(44)} 50 ${X(36)} 60 ${X(24)} 64 Z`, dark(a, 1.05)) + P(`M${X(58)} 46 C${X(72)} 36 ${X(80)} 20 ${X(74)} 6 L${X(58)} 4 C${X(62)} 18 ${X(56)} 30 ${X(46)} 40 Z`, dark(a, 1.0)) + P(`M${X(74)} 6 C${X(86)} 0 ${X(96)} 12 ${X(90)} 26 L${X(82)} 24 C${X(84)} 16 ${X(80)} 10 ${X(68)} 12 Z`, dark(a, .95)); };
    s += claw(1) + claw(-1);
    s += ceye(88, 54, 4, 4.5, '#15121A') + ceye(112, 54, 4, 4.5, '#15121A') + SHINE(88, 72, 8, 16, -10, .25);
    return wrap(G('cf', a, b, .4, .3), s);
  },
  frog: o => { // 개구리 (위) — 튀어나온 눈, 접힌 뒷다리와 물갈퀴 발, 등 무늬 (stripe 등줄, spots 점, bumps 돌기)
    const a = o.a || '#7CB84A', b = dark(a, .5), col = dark(a, .85), w = WAVE() * 2;
    let s = '';
    const hind = f => { const X = x => 100 + x * f; return leg([[X(30), 128], [X(64), 148], [X(46), 176], [X(28), 184]], col, 9) + leg([[X(28), 184], [X(10), 196]], col, 3.5) + leg([[X(28), 184], [X(30), 198]], col, 3.5) + leg([[X(28), 184], [X(46), 196]], col, 3.5); };
    const front = f => { const X = x => 100 + x * f; return leg([[X(28), 86], [X(52), 94], [X(58), 118]], col, 6) + leg([[X(58), 118], [X(48), 130]], col, 3) + leg([[X(58), 118], [X(60), 132]], col, 3) + leg([[X(58), 118], [X(70), 128]], col, 3); };
    s += hind(1) + hind(-1) + front(1) + front(-1);
    s += P(`M100 48 C132 48 140 80 ${138 + w} 120 C136 150 120 168 100 168 C80 168 64 150 ${62 - w} 120 C60 80 68 48 100 48 Z`, 'url(#fr)');
    if (o.stripe) s += L('M100 60 L100 160', 5, o.stripe, 'opacity=".85"') + L('M78 70 C72 100 72 130 80 156 M122 70 C128 100 128 130 120 156', 3, o.stripe, 'opacity=".6"');
    if (o.spots) for (let i = 0; i < 10; i++) s += E(72 + (i * 37) % 56, 74 + (i * 23) % 84, 5 + (i % 3) * 2, 4 + (i % 2) * 2, o.spots, 'opacity=".75" stroke="none"');
    if (o.bumps) for (let i = 0; i < 16; i++) s += C(70 + (i * 41) % 60, 68 + (i * 29) % 92, 2.6, dark(a, 1.25), `stroke="${dark(a, .6)}" stroke-width=".8" opacity=".8"`);
    const eye = o.eye || '#C8A030';
    for (const x of [84, 116]) s += C(x, 58, 11, dark(a, .92), `stroke="${OL}" stroke-width="2"`) + C(x, 56, 7, eye, `stroke="${OL}" stroke-width="1.6"`) + E(x, 56, 2.4, 5.2, '#15121A', 'stroke="none"') + C(x - 2.5, 52.5, 1.8, '#fff', 'stroke="none"');
    s += L('M90 46 C96 43 104 43 110 46', 2, b) + E(93, 49, 1.6, 1.1, b, 'stroke="none"') + E(107, 49, 1.6, 1.1, b, 'stroke="none"') + SHINE(84, 100, 10, 24, 0, .2);
    return wrap(G('fr', a, b, .4, .3), s);
  },
});

// ======================= 곤충 100종 =======================
// [id, 이름, 종류, 장소[], 시간(day|night|both), 움직임(fly|crawl|hop|swim|glide), 희귀도(0~2), 템플릿, 옵션, 크기, 먹이, 사는 곳, 재미있는 사실, 추가플래그]
const RAW = [
// ---- 딱정벌레 ----
['ladybug', '칠성무당벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 0, 'beetle', { a: '#FF7A6B', b: '#C62828', shape: 'round', head: '#1E1A26', pron: '#1E1A26', cheeks: true, spots: [[72, 92, 9], [128, 92, 9], [64, 128, 8], [136, 128, 8], [100, 128, 10], [86, 155, 6], [114, 155, 6]] }, '0.7cm · 새끼손톱만 해요', '진딧물', '풀잎과 꽃 위', '빨간 등의 까만 점 7개는 "나는 맛없어!" 하고 새에게 알려 주는 표시예요. 겨울에는 친구들과 모여 함께 잠을 자요.'],
['ladybug2', '꼬마남생이무당벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#FFD54A', b: '#E09B00', shape: 'round', head: '#1E1A26', pron: '#1E1A26', cheeks: true, spots: [[76, 96, 7], [124, 96, 7], [66, 130, 6], [134, 130, 6], [100, 132, 7], [88, 156, 5], [112, 156, 5]] }, '0.4cm · 깨알 두 개 크기', '진딧물', '풀잎 위', '무당벌레 중에서 가장 작은 편이에요. 등 무늬가 거북이(남생이) 등딱지를 닮았어요.'],
['ladybug28', '이십팔점박이무당벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#E09B5A', b: '#9A5A1E', shape: 'round', head: '#6B3B1E', pron: '#6B3B1E', spots: [[70, 90, 5], [84, 84, 5], [100, 88, 5], [116, 84, 5], [130, 90, 5], [64, 112, 5], [82, 108, 5], [118, 108, 5], [136, 112, 5], [74, 134, 5], [100, 128, 5], [126, 134, 5], [86, 154, 5], [114, 154, 5]] }, '0.7cm · 새끼손톱만 해요', '감자 잎, 가지 잎', '밭의 채소 잎', '점이 28개나 있어요! 다른 무당벌레와 달리 채소 잎을 먹어서 농부 아저씨가 싫어해요.'],
['rhino', '장수풍뎅이', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'rhinoTop', { a: '#5A2E14', horn: 'big' }, '5cm · 어른 엄지손가락보다 커요', '나무 수액', '참나무 숲', '곤충 중에서 힘이 가장 세요. 자기 몸무게의 100배를 들 수 있어서 "곤충의 왕"이라고 불러요. 뿔은 수컷만 있어요.'],
['rhino_f', '장수풍뎅이 암컷', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'rhinoTop', { a: '#4A2612', horn: 'none' }, '4.5cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '암컷은 뿔이 없고 등에 짧은 털이 있어요. 썩은 나무나 낙엽 속에 알을 낳아요.'],
['stag', '넓적사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'stagTop', { a: '#2E1C12', jaw: 'dorcus', headW: 36 }, '5cm · 어른 엄지손가락보다 커요', '나무 수액', '참나무 숲', '큰 턱이 사슴의 뿔을 닮아서 사슴벌레예요. 수컷끼리 턱으로 씨름을 해서 나무에서 밀어내요.'],
['stag_saw', '톱사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'stagTop', { a: '#7A3A16', jaw: 'saw', headW: 30 }, '4cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '턱 안쪽이 톱니처럼 울퉁불퉁해요. 몸이 불그스름한 갈색이라 다른 사슴벌레와 구별하기 쉬워요.'],
['stag_king', '왕사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'stagTop', { a: '#1E1410', jaw: 'dorcus', headW: 38 }, '7cm · 어른 손가락 길이', '나무 수액', '참나무 숲', '우리나라 사슴벌레 중 가장 크고 오래 살아요. 어른 벌레로 3년이나 살 수 있어요.'],
['stag_f', '사슴벌레 암컷', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'stagTop', { a: '#2E1C12', jaw: 'female', headW: 26 }, '3.5cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '암컷은 턱이 작지만 힘은 아주 세요. 썩은 나무를 갉아서 알을 낳을 자리를 만들어요.'],
['longhorn', '알락하늘소', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#5B8DEF', b: '#1E3F9A', shape: 'long', antLong: true, head: '#1E1A26', pron: '#2A4AA8', spots: [[86, 110, 5, '#fff'], [114, 110, 5, '#fff'], [82, 136, 5, '#fff'], [118, 136, 5, '#fff'], [92, 160, 5, '#fff'], [108, 160, 5, '#fff'], [100, 100, 5, '#fff']] }, '3cm · 어른 엄지손가락만 해요', '나무, 꽃가루', '숲속 나무', '더듬이가 자기 몸보다 길어요. 잡으면 "끼익끼익" 소리를 내서 깜짝 놀라게 해요.'],
['longhorn2', '뽕나무하늘소', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#6B4E2E', shape: 'long', antLong: true, spots: [[84, 112, 4, '#F3E7C3'], [116, 112, 4, '#F3E7C3'], [86, 140, 4, '#F3E7C3'], [114, 140, 4, '#F3E7C3']] }, '4cm · 어른 엄지손가락만 해요', '뽕나무 잎', '뽕나무', '애벌레가 뽕나무 속을 파고 다녀요. 어른이 되면 뽕나무 잎과 껍질을 갉아 먹어요.'],
['scarab', '풍뎅이', '딱정벌레', ['forest'], 'day', 'crawl', 0, 'beetle', { a: '#3FAE5A', b: '#1F6B2E', shape: 'oval', head: '#1F6B2E', pron: '#2E8B57', antClub: true }, '2cm · 콩알 세 개 크기', '나뭇잎', '숲과 들판', '등이 보석처럼 초록빛으로 반짝여요. 햇빛을 받으면 금색으로도 보여요.'],
['scarab_gold', '왕풍뎅이', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'beetle', { a: '#B08A4A', b: '#6B4E1E', shape: 'oval', stripes: 3, antClub: true }, '3cm · 어른 엄지손가락만 해요', '나뭇잎', '숲', '밤에 불빛을 보고 날아와요. 풍뎅이 중에서 몸집이 큰 편이에요.'],
['flower_chafer', '흰점박이꽃무지', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#6B7A3A', b: '#3A4A1E', shape: 'oval', spots: [[80, 110, 4, '#fff'], [120, 110, 4, '#fff'], [74, 136, 4, '#fff'], [126, 136, 4, '#fff'], [88, 158, 4, '#fff'], [112, 158, 4, '#fff']], antClub: true }, '2.5cm · 콩알 네 개 크기', '꽃가루, 과일즙', '꽃과 과일나무', '애벌레는 "굼벵이"라고 불러요. 등으로 기어 다니는 재미있는 습관이 있어요.'],
['dung', '쇠똥구리', '딱정벌레', ['meadow'], 'day', 'crawl', 2, 'beetle', { a: '#3A3A44', b: '#1E1A26', shape: 'round', head: '#1E1A26', pron: '#2E2A33' }, '1.5cm · 콩알 두 개 크기', '동물의 똥', '소와 말이 사는 풀밭', '동물의 똥을 동그랗게 뭉쳐서 굴려 가요. 공처럼 만든 똥 속에 알을 낳아요.'],
['tiger_beetle', '길앞잡이', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#2EA86B', b: '#1C5E8B', shape: 'long', head: '#C0392B', pron: '#1C5E8B', spots: [[84, 120, 4, '#F3E7C3'], [116, 120, 4, '#F3E7C3'], [88, 150, 4, '#F3E7C3'], [112, 150, 4, '#F3E7C3']] }, '2cm · 콩알 세 개 크기', '작은 벌레', '산길과 흙길', '사람이 걸어가면 앞에서 조금씩 날아가며 길을 안내하는 것 같아서 길앞잡이예요.'],
['jewel', '비단벌레', '딱정벌레', ['forest'], 'day', 'crawl', 2, 'beetle', { a: '#2ECC71', b: '#117A65', shape: 'long', pron: '#C0392B', head: '#117A65', split: false, stripes: 2, stripeColor: '#C0392B' }, '3.5cm · 어른 엄지손가락만 해요', '팽나무 잎', '남쪽 지방의 숲', '날개가 무지갯빛 비단처럼 반짝여요. 옛날에는 이 날개로 왕의 장식품을 만들었어요.'],
['divingbeetle', '물방개', '딱정벌레', ['pond', 'river'], 'both', 'swim', 1, 'waterbeetle', { a: '#6FBF5A', edge: '#E0C050' }, '3.5cm · 어른 엄지손가락만 해요', '올챙이, 작은 물고기', '연못 속', '물속에서 살지만 숨을 쉬러 올라와요. 엉덩이에 공기 방울을 달고 잠수해요.'],
['water_scav', '물땡땡이', '딱정벌레', ['pond', 'wetland'], 'both', 'swim', 1, 'waterbeetle', { a: '#2E2A33' }, '4cm · 어른 엄지손가락만 해요', '물풀', '연못 속', '물방개와 닮았지만 등이 까맣고 매끈해요. 배에 공기를 저장해 은색으로 반짝여요.'],
['weevil', '바구미', '딱정벌레', ['yard', 'home'], 'day', 'crawl', 0, 'beetle', { a: '#8A6A4A', shape: 'oval', head: '#5A3E1E', horn: '#5A3E1E' }, '0.5cm · 쌀알만 해요', '곡식, 나뭇잎', '풀밭과 창고', '코끼리처럼 긴 주둥이가 있어요. 주둥이 끝에 입이 달려 있어 열매에 구멍을 뚫어요.'],
['click', '방아벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#7A5A3A', shape: 'long' }, '1.5cm · 콩알 두 개 크기', '나뭇잎', '풀밭과 숲', '뒤집어 놓으면 "딱!" 소리를 내며 공중으로 튀어 올라 몸을 바로 세워요.'],
['firefly', '반딧불이', '딱정벌레', ['pond', 'valley'], 'night', 'fly', 2, 'firefly', {}, '1cm · 콩알만 해요', '이슬, 달팽이(애벌레)', '깨끗한 냇가와 숲', '배 끝에서 노란 빛을 내요. 뜨겁지 않은 차가운 빛이에요. 깜빡이는 빛으로 친구에게 인사를 해요.'],
['firefly2', '늦반딧불이', '딱정벌레', ['forest'], 'night', 'fly', 2, 'firefly', { pron: '#F39C12' }, '1.5cm · 콩알 두 개 크기', '달팽이(애벌레)', '산골 마을의 풀밭', '가을이 되어야 나오는 반딧불이예요. 암컷은 날개가 없어서 풀 위에서 빛을 내며 수컷을 기다려요.'],
['darkling', '거저리', '딱정벌레', ['yard', 'home'], 'night', 'crawl', 0, 'beetle', { a: '#2E2A33', shape: 'long', split: false }, '1.5cm · 콩알 두 개 크기', '곡식 가루', '창고와 집 근처', '애벌레는 "밀웜"이라고 불러요. 새와 도마뱀이 아주 좋아하는 먹이예요.'],
// ---- 나비 ----
['butterfly', '배추흰나비', '나비', ['yard'], 'day', 'fly', 0, 'butterfly', { a: '#FFFFFF', spots: [[60, 82, 6]] }, '5cm · 날개를 펴면 어른 엄지 길이', '꽃의 꿀', '배추밭과 꽃밭', '애벌레일 때는 배추 잎을 갉아 먹어서 "배추벌레"라고 불러요. 번데기에서 나오면 하얀 나비가 돼요.'],
['yellow_bf', '노랑나비', '나비', ['meadow'], 'day', 'fly', 0, 'butterfly', { a: '#FFE566', spots: [[60, 82, 5, '#E67E22']] }, '5cm · 날개를 펴면 어른 엄지 길이', '꽃의 꿀', '들판과 논둑', '봄이 오면 가장 먼저 날아다니는 노란 나비예요. 날개 가장자리가 까맣게 둘러져 있어요.'],
['swallowtail', '호랑나비', '나비', ['meadow'], 'day', 'fly', 1, 'butterfly', { a: '#FFE566', b: '#F5B400', lo: '#FFD84D', tails: true, stripes: true, band: true, spots: [[56, 150, 7, '#4FA8FF'], [72, 162, 6, '#4FA8FF'], [64, 178, 6, '#FF5A4E']] }, '10cm · 어른 손바닥만 해요', '꽃의 꿀', '산과 들판', '노란 날개에 검은 줄무늬가 호랑이를 닮아서 호랑나비예요. 꼬리처럼 생긴 날개 끝으로 새를 속여요.'],
['swallowtail2', '산호랑나비', '나비', ['forest'], 'day', 'fly', 1, 'butterfly', { a: '#FFF2A8', b: '#F2C14E', lo: '#FFE066', tails: true, stripes: true, band: true, spots: [[56, 150, 7, '#4FA8FF'], [64, 178, 6, '#FF5A4E']] }, '9cm · 어른 손바닥만 해요', '꽃의 꿀', '높은 산과 들판', '호랑나비보다 노란색이 연하고 산에서 많이 보여요. 애벌레는 당근 잎을 좋아해요.'],
['black_sw', '제비나비', '나비', ['forest'], 'day', 'fly', 1, 'butterfly', { a: '#2B2340', b: '#0F0A1A', lo: '#1E3A8A', tails: true, tipStyle: 'none', body: '#1E1A26', spots: [[56, 150, 6, '#4FA8FF'], [72, 164, 5, '#FF5A4E']] }, '12cm · 어른 손바닥보다 커요', '꽃의 꿀', '숲과 산길', '까만 날개가 햇빛에 파랗게 반짝여요. 제비처럼 날개가 길고 날렵해서 제비나비예요.'],
['blue_bf', '남방부전나비', '나비', ['meadow'], 'day', 'fly', 0, 'butterfly', { a: '#7FB3FF', b: '#3B5BDB', lo: '#9FC4FF', tipStyle: 'none', spots: [[60, 86, 4], [74, 150, 4]] }, '2.5cm · 어른 엄지손톱 두 개 크기', '꽃의 꿀', '풀밭과 공원', '아주 작은 파란 나비예요. 날개를 접으면 회색이라 숨바꼭질을 잘해요.'],
['comma', '네발나비', '나비', ['meadow'], 'day', 'fly', 0, 'butterfly', { a: '#F39C3D', b: '#C45A12', lo: '#E67E22', spots: [[64, 70, 6], [76, 90, 5], [60, 150, 5]], veins: true }, '5cm · 날개를 펴면 어른 엄지 길이', '과일즙, 꽃의 꿀', '숲 가장자리', '다리가 네 개처럼 보여서 네발나비예요. 사실 앞다리 두 개가 아주 작아서 숨어 있어요.'],
['peacock', '공작나비', '나비', ['forest'], 'day', 'fly', 2, 'butterfly', { a: '#C0392B', b: '#7B1E1E', lo: '#A93226', tipStyle: 'none', eyes: [[52, 70, 13, '#F2C14E', '#3B5BDB'], [60, 150, 10, '#F2C14E', '#3B5BDB']] }, '6cm · 어른 손가락 길이', '꽃의 꿀', '높은 산', '날개에 공작새 깃털 같은 눈알 무늬가 있어요. 새가 오면 날개를 펴서 깜짝 놀라게 해요.'],
['monarch', '왕나비', '나비', ['forest'], 'day', 'fly', 2, 'butterfly', { a: '#F39C3D', b: '#C45A12', lo: '#E67E22', stripes: true, veins: true, spots: [[30, 62, 4, '#fff'], [44, 52, 4, '#fff']] }, '10cm · 어른 손바닥만 해요', '꽃의 꿀', '남쪽 섬과 산', '바다를 건너 아주 멀리까지 여행하는 나비예요. 제주도에서 일본까지 날아간 기록도 있어요.'],
['large_white', '큰줄흰나비', '나비', ['meadow'], 'day', 'fly', 0, 'butterfly', { a: '#F8F8FF', veins: true, spots: [[60, 82, 5]] }, '6cm · 어른 손가락 길이', '꽃의 꿀', '산과 들판', '배추흰나비와 닮았지만 날개에 까만 줄이 뚜렷해요. 산에서 더 많이 보여요.'],
['parnassius', '모시나비', '나비', ['meadow'], 'day', 'fly', 2, 'butterfly', { a: '#F8F8FF', b: '#E0E0EA', tipStyle: 'none', veins: true, body: '#5A5A6E' }, '6cm · 어른 손가락 길이', '꽃의 꿀', '산속 풀밭', '날개가 얇은 모시옷처럼 비쳐요. 봄에만 잠깐 나오는 귀한 나비예요.'],
['skipper', '팔랑나비', '나비', ['meadow'], 'day', 'fly', 0, 'butterfly', { a: '#A0522D', b: '#6B3A1E', lo: '#8B4A2B', tipStyle: 'none', spots: [[56, 76, 4, '#F3E7C3'], [70, 90, 4, '#F3E7C3']], body: '#5A3E1E' }, '3cm · 어른 엄지손가락만 해요', '꽃의 꿀', '풀밭', '날개를 팔랑팔랑 빠르게 흔들며 날아요. 몸이 통통하고 더듬이 끝이 갈고리처럼 휘었어요.'],
['satyr', '뱀눈나비', '나비', ['forest'], 'day', 'fly', 1, 'butterfly', { a: '#8B6B4A', b: '#5A3E1E', lo: '#7A5A3A', tipStyle: 'none', eyes: [[48, 66, 9, '#F2C14E', '#1E1A26'], [60, 150, 7, '#F2C14E', '#1E1A26']] }, '5cm · 날개를 펴면 어른 엄지 길이', '나무 수액, 과일즙', '그늘진 숲', '날개에 뱀 눈 같은 동그란 무늬가 있어요. 그늘에서 조용히 날아다니는 걸 좋아해요.'],
['fritillary', '표범나비', '나비', ['meadow'], 'day', 'fly', 1, 'butterfly', { a: '#F39C3D', b: '#C45A12', lo: '#E67E22', tipStyle: 'none', spots: [[40, 60, 4], [54, 52, 4], [68, 62, 4], [48, 80, 4], [66, 84, 4], [52, 148, 4], [68, 160, 4]] }, '6cm · 어른 손가락 길이', '꽃의 꿀', '꽃이 많은 풀밭', '주황 날개에 까만 점이 표범 무늬 같아요. 엉겅퀴 꽃을 아주 좋아해요.'],
// ---- 나방 ----
['moth', '누에나방', '나비', ['yard'], 'night', 'fly', 0, 'moth', { a: '#F6E7C8', eyespot: false }, '4cm · 어른 엄지손가락만 해요', '먹지 않아요', '뽕나무 근처', '애벌레인 누에가 만든 고치에서 비단실을 뽑아요. 어른이 되면 아무것도 먹지 않아요.'],
['hawkmoth', '박각시', '나비', ['yard'], 'night', 'fly', 1, 'moth', { a: '#8B7A5A', body: '#5A4A3A', eyespot: false, bands: true, feather: false }, '8cm · 어른 손가락 길이', '꽃의 꿀', '꽃밭', '벌새처럼 꽃 앞에서 멈춰 떠 있으면서 긴 빨대로 꿀을 빨아요. 날개를 1초에 70번이나 움직여요.'],
['luna', '산누에나방', '나비', ['forest'], 'night', 'fly', 2, 'moth', { a: '#B7E36B', lo: '#9BD24A', body: '#F3E7C3', spot: '#E67E22' }, '12cm · 어른 손바닥보다 커요', '먹지 않아요', '깊은 숲', '우리나라에서 가장 큰 나방 중 하나예요. 연두색 날개에 눈알 무늬가 있고 꼬리가 길어요.'],
['gypsy', '매미나방', '나비', ['yard'], 'night', 'fly', 0, 'moth', { a: '#E8E0D0', body: '#8E6B3C', eyespot: false, bands: true }, '5cm · 날개를 펴면 어른 엄지 길이', '먹지 않아요', '나무가 많은 곳', '애벌레가 나뭇잎을 아주 많이 먹어요. 암컷은 몸이 무거워서 거의 날지 못해요.'],
['tiger_moth', '불나방', '나비', ['meadow'], 'night', 'fly', 1, 'moth', { a: '#F5B400', lo: '#E53935', body: '#2B2340', spot: '#2B2340', bands: true }, '5cm · 날개를 펴면 어른 엄지 길이', '꽃의 꿀', '풀밭', '불을 보면 뛰어든다고 불나방이에요. 알록달록한 색은 "나는 맛없어!"라는 경고예요.'],
// ---- 벌 ----
['bee', '꿀벌', '벌', ['meadow'], 'day', 'fly', 0, 'bee', {}, '1.3cm · 콩알 두 개 크기', '꽃가루와 꿀', '벌집', '꿀벌 한 마리가 평생 만드는 꿀은 티스푼 하나 정도예요. 꽃을 찾으면 춤을 춰서 친구들에게 알려 줘요.'],
['bumblebee', '호박벌', '벌', ['meadow'], 'day', 'fly', 0, 'bee', { a: '#FFC53D', th: '#2B2340', stripe: '#2B2340', stripes: 2, headc: '#2B2340' }, '2cm · 콩알 세 개 크기', '꽃가루와 꿀', '땅속 둥지', '몸이 보송보송한 털로 덮여 있어요. 통통한 몸으로 "붕붕" 소리를 내며 천천히 날아요.'],
['hornet', '말벌', '벌', ['forest'], 'day', 'fly', 2, 'bee', { a: '#F39C12', th: '#5A3E1E', stripe: '#5A3E1E', slim: true, headc: '#F39C12', sting: true }, '3cm · 어른 엄지손가락만 해요', '다른 곤충, 과일즙', '나무 위 둥근 집', '벌 중에서 가장 커요. 종이처럼 얇은 집을 만들어요. 함부로 만지면 안 돼요!'],
['paper_wasp', '쌍살벌', '벌', ['yard'], 'day', 'fly', 1, 'bee', { a: '#E09B5A', th: '#8A5A2B', stripe: '#5A3E1E', slim: true, stripes: 2, headc: '#E09B5A', sting: true }, '2cm · 콩알 세 개 크기', '애벌레, 꽃의 꿀', '처마 밑 육각형 집', '날 때 뒷다리 두 개를 늘어뜨려서 쌍살벌이에요. 집이 육각형 방으로 되어 있어요.'],
['yellowjacket', '땅벌', '벌', ['meadow'], 'day', 'fly', 1, 'bee', { a: '#FFD54A', th: '#2B2340', stripe: '#2B2340', stripes: 3, headc: '#FFD54A', sting: true }, '1.5cm · 콩알 두 개 크기', '곤충, 단 것', '땅속 집', '땅속에 집을 지어요. 노란 줄무늬가 선명하고 단 음료를 좋아해 소풍 때 찾아와요.'],
['mud_dauber', '나나니벌', '벌', ['meadow'], 'day', 'fly', 1, 'bee', { a: '#2B2340', th: '#2B2340', stripe: '#E09B5A', slim: true, stripes: 1, headc: '#2B2340' }, '2.5cm · 콩알 네 개 크기', '애벌레', '진흙 집', '허리가 실처럼 가늘어요. 진흙으로 작은 항아리 모양 집을 짓고 애벌레를 넣어 두어요.'],
['carpenter_bee', '어리호박벌', '벌', ['yard'], 'day', 'fly', 1, 'bee', { a: '#2B2340', th: '#FFC53D', stripe: '#2B2340', stripes: 0, headc: '#2B2340' }, '2.5cm · 콩알 네 개 크기', '꽃가루와 꿀', '마른 나무 속 구멍', '가슴은 노랗고 배는 까매요. 턱으로 나무에 동그란 구멍을 파서 집을 만들어요.'],
// ---- 개미 ----
['ant', '곰개미', '벌', ['yard'], 'both', 'crawl', 0, 'ant', {}, '0.5cm · 쌀알만 해요', '단 것, 작은 벌레', '땅속 개미집', '개미는 자기 몸무게의 50배나 되는 물건을 들 수 있어요. 냄새로 길을 표시해서 친구들이 따라와요.'],
['ant_big', '일본왕개미', '벌', ['forest'], 'both', 'crawl', 0, 'ant', { a: '#2E2A33', big: true, jaws: true }, '1.2cm · 콩알 두 개 크기', '진딧물 단물, 벌레', '나무 밑 땅속', '우리나라에서 가장 큰 개미예요. 여왕개미는 10년 넘게 살 수 있어요.'],
['ant_red', '불개미', '벌', ['meadow'], 'day', 'crawl', 1, 'ant', { a: '#C0392B', head: '#A93226' }, '0.6cm · 쌀알만 해요', '작은 벌레', '풀밭 흙더미', '빨간 몸에 물리면 불에 덴 것처럼 따끔해요. 친구들과 힘을 합쳐 큰 벌레도 옮겨요.'],
['termite', '흰개미', '흰개미', ['yard', 'desert'], 'both', 'crawl', 1, 'ant', { a: '#F3E7C3', head: '#D9A066' }, '0.5cm · 쌀알만 해요', '나무', '썩은 나무 속', '개미와 닮았지만 사실 바퀴의 친척이에요. 나무를 먹어서 오래된 집을 갉아 먹기도 해요.'],
// ---- 메뚜기 무리 ----
['grasshopper', '메뚜기', '메뚜기', ['meadow'], 'day', 'hop', 0, 'hopper', {}, '3.5cm · 어른 엄지손가락만 해요', '풀잎, 벼', '풀밭과 논', '뒷다리가 아주 튼튼해서 자기 몸 길이의 20배나 멀리 뛸 수 있어요. 귀가 배에 달려 있답니다.'],
['rice_hopper', '벼메뚜기', '메뚜기', ['meadow'], 'day', 'hop', 0, 'hopper', { a: '#A8C84A', wing: '#8A6A3A', bands: true }, '3cm · 어른 엄지손가락만 해요', '벼 잎', '논', '가을 논에서 많이 보여요. 옛날에는 잡아서 구워 먹기도 했대요.'],
['locust', '풀무치', '메뚜기', ['meadow'], 'day', 'hop', 1, 'hopper', { a: '#8FBF5A', wing: '#B08A4A', long: true, bands: true }, '6cm · 어른 손가락 길이', '풀잎', '넓은 풀밭', '메뚜기 중에서 가장 커요. 친구들이 아주 많이 모이면 멀리까지 함께 날아가요.'],
['katydid', '방아깨비', '메뚜기', ['meadow'], 'day', 'hop', 1, 'hopper', { a: '#B7E36B', long: true }, '7cm · 어른 손가락 길이', '풀잎', '키 큰 풀밭', '뒷다리를 잡으면 방아를 찧듯 몸을 위아래로 끄덕끄덕 움직여서 방아깨비라고 불러요.'],
['bushcricket', '여치', '메뚜기', ['meadow'], 'day', 'hop', 1, 'hopper', { a: '#7CC24A', antLong: true, ovip: true }, '4cm · 어른 엄지손가락만 해요', '작은 벌레, 풀잎', '풀숲', '"찌르르" 하고 울어요. 더듬이가 몸보다 길고 암컷은 꼬리에 긴 칼 같은 알 낳는 관이 있어요.'],
['katydid2', '베짱이', '메뚜기', ['meadow'], 'night', 'hop', 1, 'hopper', { a: '#9BE05C', antLong: true, long: true, wing: '#B7E36B' }, '4cm · 어른 엄지손가락만 해요', '풀잎', '풀숲', '밤에 "쓰익쩍" 하고 노래해요. 개미와 베짱이 이야기의 주인공이에요.'],
['cricket', '귀뚜라미', '메뚜기', ['yard'], 'night', 'hop', 0, 'hopper', { a: '#8A5A2B', wing: '#A86E3A', antLong: true, cerci: true, head: '#6B4420' }, '2cm · 콩알 세 개 크기', '풀잎, 작은 벌레', '돌 밑과 풀숲', '귀뚤귀뚤 소리는 날개를 서로 비벼서 내요. 날씨가 따뜻할수록 더 빨리 울어요.'],
['molecricket', '땅강아지', '메뚜기', ['yard'], 'night', 'crawl', 1, 'hopper', { a: '#8A6A4A', wing: '#6B4E2E', hump: true, cerci: true }, '3cm · 어른 엄지손가락만 해요', '뿌리, 작은 벌레', '땅속 굴', '앞다리가 두더지 손처럼 생겨서 땅을 파요. 땅속에서 "비이이" 하고 울어요.'],
['camel_cricket', '꼽등이', '메뚜기', ['yard', 'home', 'cave'], 'night', 'hop', 1, 'hopper', { a: '#A08060', wing: '#8A6A4A', hump: true, antLong: true }, '2cm · 콩알 세 개 크기', '뭐든지 조금씩', '어둡고 축축한 곳', '등이 낙타처럼 굽어서 꼽등이예요. 날개가 없고 울지도 못하지만 아주 높이 뛰어요.'],
// ---- 사마귀 ----
['mantis', '사마귀', '사마귀', ['meadow'], 'day', 'crawl', 1, 'mantis', {}, '8cm · 어른 손가락 길이', '다른 곤충', '풀밭과 나무 위', '앞다리가 낫처럼 생겨서 먹이를 번개처럼 빠르게 낚아채요. 고개를 돌려 뒤를 볼 수 있는 유일한 곤충이에요.'],
['mantis_big', '왕사마귀', '사마귀', ['forest'], 'day', 'crawl', 2, 'mantis', { a: '#7CC24A' }, '9cm · 어른 손바닥 길이', '다른 곤충', '풀밭', '우리나라에서 가장 큰 사마귀예요. 가을에 거품 같은 알집을 만들어 겨울을 나요.'],
['mantis_brown', '갈색사마귀', '사마귀', ['meadow'], 'day', 'crawl', 1, 'mantis', { a: '#C8A46A' }, '7cm · 어른 손가락 길이', '다른 곤충', '마른 풀밭', '마른 풀 색깔이라 가을 풀밭에서 숨기 좋아요. 사마귀는 몸 색이 초록도 갈색도 있어요.'],
// ---- 잠자리 ----
['dragonfly', '된장잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#D9A066', eye: '#8B6B3C' }, '5cm · 날개를 펴면 어른 엄지 길이', '모기, 파리', '연못과 들판', '된장 색이라 된장잠자리예요. 바다를 건너 아주 먼 나라까지 날아가는 여행가예요.'],
['red_dragonfly', '고추잠자리', '잠자리', ['pond', 'wetland'], 'day', 'fly', 0, 'dragonfly', { a: '#E53935', eye: '#C0392B' }, '5cm · 날개를 펴면 어른 엄지 길이', '모기, 파리', '연못과 논', '가을 하늘을 빨갛게 수놓아요. 수컷만 고추처럼 빨갛고 암컷은 노란빛이에요.'],
['emperor', '왕잠자리', '잠자리', ['pond', 'river'], 'day', 'fly', 2, 'dragonfly', { a: '#3B82F6', eye: '#2ECC71' }, '8cm · 어른 손가락 길이', '나비, 파리', '큰 연못', '잠자리 중에서 가장 크고 빨라요. 눈이 아주 커서 거의 모든 방향을 한 번에 볼 수 있어요.'],
['skimmer', '밀잠자리', '잠자리', ['pond', 'river', 'stream'], 'day', 'fly', 0, 'dragonfly', { a: '#9FC4FF', eye: '#5A9A5A' }, '5cm · 날개를 펴면 어른 엄지 길이', '작은 벌레', '연못과 냇가', '수컷은 몸에 하얀 가루가 덮여 있어 밀가루 같아요. 물가 돌 위에 앉아 쉬는 걸 좋아해요.'],
['damselfly', '실잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#5B8DEF', eye: '#4FA8FF', folded: true, thin: true }, '3cm · 어른 엄지손가락만 해요', '작은 벌레', '연못가 풀잎', '잠자리보다 몸이 실처럼 가늘어요. 앉을 때 날개를 등 위로 모아서 접어요.'],
['jewelwing', '물잠자리', '잠자리', ['pond', 'valley', 'stream'], 'day', 'fly', 1, 'dragonfly', { a: '#1ABC9C', eye: '#117A65', folded: true, thin: true, wing: '#2B2340', wingOp: .85 }, '6cm · 어른 손가락 길이', '작은 벌레', '맑은 냇가', '날개가 까맣고 몸이 금속처럼 초록으로 반짝여요. 나비처럼 팔랑팔랑 날아요.'],
['lacewing', '풀잠자리', '풀잠자리', ['meadow'], 'night', 'fly', 1, 'lacewing', {}, '2cm · 콩알 세 개 크기', '진딧물', '풀밭과 정원', '날개가 레이스처럼 투명해요. 애벌레는 진딧물을 아주 많이 먹어서 농부의 친구예요.'],
['antlion', '명주잠자리', '풀잠자리', ['meadow', 'desert'], 'night', 'fly', 2, 'lacewing', { a: '#8B6B4A', eye: '#5A3E1E', wing: '#F0EAE0' }, '4cm · 어른 엄지손가락만 해요', '작은 벌레', '모래가 있는 풀밭', '애벌레는 "개미귀신"이에요. 모래에 깔때기 함정을 파고 개미가 빠지길 기다려요.'],
// ---- 노린재·물속 노린재 ----
['stinkbug', '풀색노린재', '노린재', ['meadow'], 'day', 'crawl', 0, 'shield', {}, '1.5cm · 콩알 두 개 크기', '식물의 즙', '풀잎과 열매', '위험하면 고약한 냄새를 뿜어서 적을 쫓아내요. 그래서 "방귀벌레"라는 별명도 있어요.'],
['brown_stink', '썩덩나무노린재', '노린재', ['yard'], 'day', 'crawl', 0, 'shield', { a: '#A08060', sc: '#8A6A4A' }, '1.7cm · 콩알 두 개 크기', '과일즙', '과일나무', '갈색 몸에 얼룩무늬가 있어요. 가을이 되면 집 안으로 들어와 겨울잠을 자려고 해요.'],
['jewel_bug', '광대노린재', '노린재', ['forest'], 'day', 'crawl', 2, 'shield', { a: '#1ABC9C', sc: '#E53935', spots: [[70, 100, 5, '#F2C14E'], [130, 100, 5, '#F2C14E'], [84, 146, 5, '#2B2340'], [116, 146, 5, '#2B2340']] }, '2cm · 콩알 세 개 크기', '나무 열매 즙', '남쪽 숲', '광대 옷처럼 알록달록 금속빛으로 반짝여요. 우리나라에서 가장 예쁜 노린재예요.'],
['strider', '소금쟁이', '노린재', ['pond', 'river', 'valley', 'wetland', 'stream'], 'day', 'swim', 0, 'strider', {}, '1.5cm · 콩알 두 개 크기', '물에 떨어진 벌레', '잔잔한 물 위', '다리에 아주 가는 털이 많아서 물에 빠지지 않고 물 위를 미끄러지듯 걸어요.'],
['waterbug', '물장군', '노린재', ['pond', 'river', 'wetland'], 'both', 'swim', 2, 'waterbug', {}, '6cm · 어른 손가락 길이', '물고기, 개구리', '연못 속', '물속의 장군이에요. 아빠 물장군이 알을 등에 지고 다니며 부화할 때까지 지켜요.'],
['waterbug2', '물자라', '노린재', ['pond', 'wetland'], 'both', 'swim', 1, 'waterbug', { a: '#8A6A4A', small: true, eggs: true }, '2cm · 콩알 세 개 크기', '올챙이, 작은 벌레', '연못 속', '아빠가 등에 알을 업고 다녀요. 알이 숨을 쉬도록 물 위로 등을 내밀어 줘요.'],
['waterscorpion', '게아재비', '노린재', ['pond'], 'day', 'swim', 1, 'waterscorpion', {}, '4cm · 어른 엄지손가락만 해요', '올챙이, 작은 벌레', '연못 속 물풀', '꼬리처럼 긴 관을 물 밖으로 내밀어 숨을 쉬어요. 가늘어서 물속 나뭇가지처럼 보여요.'],
['waterscorpion2', '장구애비', '노린재', ['pond'], 'day', 'swim', 1, 'waterscorpion', { a: '#6B4E2E', wide: true }, '3.5cm · 어른 엄지손가락만 해요', '작은 물고기', '연못 바닥', '몸이 납작하고 넓적해요. 낙엽처럼 바닥에 숨어 있다가 앞다리로 먹이를 잡아요.'],
['aphid', '진딧물', '노린재', ['meadow'], 'day', 'crawl', 0, 'shield', { a: '#B7E36B', sc: '#9BD24A', spots: [] }, '0.2cm · 깨알보다 작아요', '식물의 즙', '새싹과 꽃봉오리', '개미에게 달콤한 단물을 주고 대신 보호를 받아요. 무당벌레가 가장 좋아하는 먹이예요.'],
// ---- 매미 ----
['cicada', '참매미', '매미', ['forest'], 'day', 'glide', 0, 'cicada', {}, '4cm · 어른 엄지손가락만 해요', '나무 수액', '나무 줄기', '땅속에서 7년이나 애벌레로 살다가 나와서 딱 한 달만 노래해요. 맴맴 소리는 수컷이 배를 떨어서 내는 거예요.'],
['cicada_black', '말매미', '매미', ['yard'], 'day', 'glide', 0, 'cicada', { a: '#2E2A33', h: '#1E1A26' }, '6cm · 어른 손가락 길이', '나무 수액', '도시의 가로수', '우리나라에서 가장 큰 매미예요. "차르르르" 하고 아주 크게 울어서 여름 도시를 시끄럽게 해요.'],
['cicada_brown', '유지매미', '매미', ['forest'], 'day', 'glide', 1, 'cicada', { a: '#8B6B4A', h: '#5A3E1E', wing: '#8B6B4A', wingOp: .8 }, '5cm · 날개를 펴면 어른 엄지 길이', '나무 수액', '숲속 나무', '날개가 기름종이처럼 갈색이라 유지매미예요. "지글지글" 기름 끓는 소리처럼 울어요.'],
// ---- 파리·모기 ----
['housefly', '집파리', '파리', ['yard', 'home'], 'day', 'fly', 0, 'fly', {}, '0.7cm · 새끼손톱만 해요', '음식 찌꺼기', '집 근처', '발로 맛을 봐요! 발에 맛을 느끼는 털이 있어서 음식 위를 걸으며 맛을 확인해요.'],
['hoverfly', '꽃등에', '파리', ['yard'], 'day', 'fly', 0, 'fly', { a: '#F2C14E', stripes: '#2B2340', th: '#8A5A2B', eye: '#8B2B1E' }, '1.2cm · 콩알 두 개 크기', '꽃가루와 꿀', '꽃밭', '벌처럼 생겼지만 침이 없는 파리예요. 헬리콥터처럼 공중에 가만히 떠 있을 수 있어요.'],
['mosquito', '모기', '파리', ['pond', 'home', 'wetland'], 'night', 'fly', 0, 'fly', { a: '#6B6B7A', slim: true, eye: '#1E1A26' }, '0.5cm · 쌀알만 해요', '꽃의 꿀, 피(암컷)', '물가와 집 근처', '피를 빠는 건 알을 낳으려는 엄마 모기뿐이에요. 아빠 모기는 꽃의 꿀만 먹어요.'],
['horsefly', '등에', '파리', ['meadow'], 'day', 'fly', 1, 'fly', { a: '#6B5A3A', eye: '#2ECC71' }, '2cm · 콩알 세 개 크기', '꽃의 꿀, 피(암컷)', '소와 말이 있는 풀밭', '눈이 초록·무지개빛으로 반짝여요. 소와 말을 따라다니며 괴롭히는 큰 파리예요.'],
['fruitfly', '초파리', '파리', ['yard', 'home'], 'both', 'fly', 0, 'fly', { a: '#D9A066', eye: '#E53935' }, '0.3cm · 깨알만 해요', '익은 과일', '과일 바구니 근처', '아주 작지만 과학자들이 가장 많이 연구하는 곤충이에요. 빨간 눈이 특징이에요.'],
// ---- 그 밖의 곤충 ----
['stick', '대벌레', '대벌레', ['forest'], 'day', 'crawl', 1, 'stick', {}, '10cm · 어른 손바닥 길이', '나뭇잎', '나뭇가지 사이', '나뭇가지랑 똑같이 생겨서 숨바꼭질 달인이에요. 가만히 있으면 새도 못 찾아요.'],
['mayfly', '하루살이', '하루살이', ['pond', 'river', 'stream'], 'both', 'fly', 0, 'mayfly', {}, '1.5cm · 콩알 두 개 크기', '먹지 않아요', '냇가와 연못 위', '어른이 되면 하루나 이틀밖에 못 살아서 하루살이예요. 입이 없어서 아무것도 먹지 않아요.'],
['earwig', '집게벌레', '집게벌레', ['yard'], 'night', 'crawl', 0, 'earwig', {}, '2cm · 콩알 세 개 크기', '작은 벌레, 썩은 잎', '돌 밑과 화분 밑', '꼬리에 집게가 달려 있어요. 엄마 집게벌레는 알과 아기를 정성껏 돌봐 주는 좋은 엄마예요.'],
['roach', '바퀴벌레', '바퀴', ['yard', 'home'], 'night', 'crawl', 0, 'roach', {}, '3cm · 어른 엄지손가락만 해요', '뭐든지', '어둡고 따뜻한 곳', '공룡보다 먼저 지구에 살았어요. 머리가 없어도 일주일이나 살 수 있는 튼튼한 곤충이에요.'],
['caddisfly', '날도래', '날도래', ['pond', 'valley', 'stream'], 'night', 'fly', 1, 'moth', { a: '#A08060', body: '#6B4E2E', eyespot: false, feather: false, lo: '#8A6A4A' }, '2cm · 콩알 세 개 크기', '먹지 않아요', '맑은 냇가', '애벌레가 모래알과 나뭇조각으로 자기 집을 만들어 등에 지고 다녀요.'],
['stonefly', '강도래', '강도래', ['pond', 'valley', 'stream'], 'day', 'crawl', 1, 'lacewing', { a: '#6B5A3A', eye: '#2B2340', wing: '#E8E0D0' }, '2.5cm · 콩알 네 개 크기', '작은 벌레', '맑은 냇가 돌 밑', '깨끗한 물에서만 살아요. 강도래가 있으면 그 냇물이 아주 깨끗하다는 뜻이에요.'],
// ---- 애벌레 ----
['cabbage_cat', '배추벌레', '나비 애벌레', ['yard'], 'day', 'crawl', 0, 'caterpillar', { a: '#9BE05C', dots: '#F2C14E' }, '3cm · 어른 엄지손가락만 해요', '배추 잎', '배추밭', '배추흰나비의 애벌레예요. 배추 잎을 먹고 자라서 번데기가 되고 하얀 나비가 돼요.'],
['swallow_cat', '호랑나비 애벌레', '나비 애벌레', ['forest'], 'day', 'crawl', 1, 'caterpillar', { a: '#7CC24A', eyespot: true, bands: '#2B2340' }, '5cm · 날개를 펴면 어른 엄지 길이', '귤나무 잎, 산초나무 잎', '귤나무', '머리에 뱀 눈 같은 무늬가 있어요. 건드리면 주황색 뿔을 쑥 내밀고 냄새를 뿜어요.'],
['silkworm', '누에', '나비 애벌레', ['yard'], 'day', 'crawl', 1, 'caterpillar', { a: '#F3E7C3', head: '#D9C58F', horn: '#8A6A4A' }, '6cm · 어른 손가락 길이', '뽕나무 잎', '누에 상자', '뽕잎을 먹고 자라 하얀 실로 고치를 만들어요. 고치 하나에서 1,500m나 되는 실이 나와요.'],
// ---- 곤충이 아닌 친구들 ----
['spider', '무당거미', '곤충 아님!', ['forest'], 'both', 'crawl', 1, 'spider', { a: '#F2C14E', bands: '#2B2340', mark: '#E53935' }, '2.5cm · 콩알 네 개 크기', '거미줄에 걸린 벌레', '나뭇가지 사이 큰 거미줄', '거미는 곤충이 아니에요! 곤충은 다리가 6개인데 거미는 8개예요. 날개도 더듬이도 없답니다.', 'not'],
['jumping_spider', '깡충거미', '곤충 아님!', ['yard'], 'day', 'hop', 0, 'spider', { a: '#5A4A6E', bigEyes: true, fat: true }, '0.8cm · 새끼손톱만 해요', '작은 벌레', '벽과 나뭇잎', '거미줄 대신 폴짝 뛰어서 먹이를 잡아요. 큰 눈 두 개로 사람을 빤히 쳐다보기도 해요.', 'not'],
['snail', '달팽이', '곤충 아님!', ['yard'], 'both', 'crawl', 0, 'snail', {}, '3cm · 어른 엄지손가락만 해요', '잎, 이끼', '축축한 풀숲', '달팽이는 곤충이 아니라 조개의 친척이에요. 등에 진 집은 몸이 자라면 같이 커져요.', 'not'],
['centipede', '지네', '곤충 아님!', ['forest', 'cave'], 'night', 'crawl', 1, 'centipede', {}, '8cm · 어른 손가락 길이', '작은 벌레', '돌 밑과 낙엽 속', '다리가 아주 많아요! 곤충은 다리가 6개지만 지네는 40개가 넘어요. 물 수 있으니 만지면 안 돼요.', 'not'],
['pillbug', '공벌레', '곤충 아님!', ['yard'], 'both', 'crawl', 0, 'pillbug', {}, '1cm · 콩알만 해요', '썩은 잎', '화분 밑과 돌 밑', '건드리면 공처럼 동그랗게 말려요. 곤충이 아니라 새우와 게의 친척이에요.', 'not'],
['earthworm', '지렁이', '곤충 아님!', ['yard'], 'both', 'crawl', 0, 'worm', {}, '10cm · 어른 손바닥 길이', '흙 속 썩은 잎', '축축한 흙 속', '다리도 눈도 없어요. 흙을 먹고 똥으로 내보내서 땅을 기름지게 만드는 고마운 친구예요.', 'not'],
// ---- 추가: 사슴벌레 무리 ----
['stag_true', '사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'stagTop', { a: '#4A2A16', jaw: 'lucanus', headW: 32 }, '4.5cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '큰턱이 길고 가늘며 안쪽에 작은 이빨이 있어요. 사슴뿔을 가장 닮아서 이름이 "사슴벌레"가 되었어요.'],
['stag_small', '애사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'stagTop', { a: '#2A1C14', jaw: 'lucanus', headW: 28 }, '2.5cm · 콩알 네 개 크기', '나무 수액', '참나무 숲', '우리나라에서 가장 흔한 사슴벌레예요. 몸은 작지만 큰턱은 길쭉하고, 낮에도 가끔 돌아다녀요.'],
['stag_redleg', '홍다리사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'stagTop', { a: '#221C22', leg: '#B5332A', jaw: 'lucanus', headW: 30 }, '3.5cm · 어른 엄지손가락만 해요', '버드나무 수액', '물가의 버드나무 숲', '다리가 붉은색이라 홍다리사슴벌레예요. 다른 사슴벌레와 달리 버드나무를 좋아해요.'],
['stag_twospot', '두점박이사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'stagTop', { a: '#B8902E', jaw: 'lucanus', headW: 30, spots: [[84, 88, 4], [116, 88, 4]] }, '4cm · 어른 엄지손가락만 해요', '나무 수액', '제주도의 숲', '등에 까만 점이 두 개 있어요. 제주도에서만 사는 아주 귀한 사슴벌레라 보호하고 있어요.'],
['stag_mini', '꼬마넓적사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'stagTop', { a: '#221812', jaw: 'dorcus', headW: 30 }, '2cm · 콩알 세 개 크기', '나무 수액', '썩은 나무 속', '넓적사슴벌레를 작게 줄여 놓은 모습이에요. 썩은 나무 속에서 여러 마리가 함께 살아요.'],
// ---- 추가: 연못 ----
['whirligig', '물매암이', '딱정벌레', ['pond', 'river'], 'day', 'swim', 0, 'waterbeetle', { a: '#2E2A33', edge: '#5A5A6A' }, '0.7cm · 새끼손톱만 해요', '물에 떨어진 벌레', '잔잔한 물 위', '물 위를 빙글빙글 맴돌아요. 눈이 위아래 둘로 나뉘어 있어 물 위와 물속을 동시에 볼 수 있어요.'],
['backswimmer', '송장헤엄치개', '노린재', ['pond'], 'both', 'swim', 1, 'waterbug', { a: '#8A8A6A', small: true }, '1.2cm · 콩알 두 개 크기', '작은 벌레, 올챙이', '연못 속', '배를 위로 하고 거꾸로 헤엄쳐요. 노처럼 긴 뒷다리로 물을 저어 빠르게 움직여요.'],
// ---- 바다 (해변·갯벌) ----
['sea_skater', '바다소금쟁이', '노린재', ['sea'], 'day', 'swim', 1, 'strider', { a: '#4A4A5A' }, '0.5cm · 쌀알만 해요', '물에 떨어진 벌레', '바다 위', '곤충 중에서 거의 유일하게 바다에서 살아요. 파도 위를 미끄러지듯 달리며 육지에는 오지 않아요.'],
['kelp_fly', '갯파리', '파리', ['sea'], 'day', 'fly', 0, 'fly', { a: '#5A5A66', eye: '#8B4A2B' }, '0.6cm · 쌀알만 해요', '썩은 해초', '해변에 밀려온 해초 더미', '바닷가에 밀려온 미역이나 다시마 더미에 모여 살아요. 해초를 먹어 치워 해변을 청소해요.'],
['sand_darkling', '모래거저리', '딱정벌레', ['sea', 'desert'], 'night', 'crawl', 0, 'beetle', { a: '#2E2A33', shape: 'oval', split: false }, '1cm · 콩알만 해요', '마른 해초, 작은 벌레', '모래 언덕', '낮에는 모래 속에 숨어 있다가 밤에 나와요. 모래 위에 남긴 작은 발자국으로 찾을 수 있어요.'],
['coast_tiger', '흰띠길앞잡이', '딱정벌레', ['sea'], 'day', 'crawl', 1, 'beetle', { a: '#3A4A5A', shape: 'long', head: '#2E3A4A', stripes: 2, stripeColor: '#F3EFE4' }, '1.5cm · 콩알 두 개 크기', '작은 벌레', '모래 해변', '등에 하얀 띠무늬가 있어요. 모래 위를 아주 빨리 달리며 작은 벌레를 사냥해요.'],
['sea_slater', '갯강구', '곤충 아님!', ['sea'], 'both', 'crawl', 0, 'pillbug', { a: '#5A5A66' }, '4cm · 어른 엄지손가락만 해요', '썩은 해초, 물고기', '바닷가 바위', '곤충이 아니라 공벌레의 친척이에요. 바위 위를 아주 빠르게 달리고 더듬이가 길어요.', 'not'],
['beach_flea', '갯벼룩', '곤충 아님!', ['sea'], 'day', 'hop', 0, 'pillbug', { a: '#9AA088' }, '1cm · 콩알만 해요', '썩은 해초', '해초 더미 아래 모래', '벼룩처럼 폴짝폴짝 뛰어서 갯벼룩이에요. 사실은 새우의 친척이라 물지 않아요.', 'not'],
['mud_crab', '칠게', '곤충 아님!', ['sea'], 'day', 'crawl', 0, 'crab', { a: '#7A6A4A' }, '3cm · 어른 엄지손가락만 해요', '갯벌의 영양분', '갯벌 구멍', '게는 곤충이 아니라 다리가 10개인 새우의 친척이에요. 갯벌에 구멍을 파고 옆으로 재빨리 걸어요.', 'not'],
['fiddler_crab', '농게', '곤충 아님!', ['sea'], 'day', 'crawl', 1, 'crab', { a: '#4A6A8A', bigClaw: true }, '2.5cm · 콩알 네 개 크기', '갯벌의 영양분', '갯벌', '수컷은 한쪽 집게가 아주 커요. 그 집게를 흔들어 암컷에게 춤추듯 인사를 해요.', 'not'],
['hermit_crab', '소라게', '곤충 아님!', ['sea'], 'both', 'crawl', 1, 'crab', { a: '#C8703A', shell: true }, '2cm · 콩알 세 개 크기', '작은 생물, 해초', '빈 소라 껍데기 속', '남이 버린 소라 껍데기를 집으로 써요. 몸이 자라면 더 큰 껍데기로 이사를 가요.', 'not'],
['lugworm', '갯지렁이', '곤충 아님!', ['sea'], 'both', 'crawl', 0, 'worm', { a: '#C25A5A' }, '10cm · 어른 손바닥 길이', '모래 속 영양분', '갯벌 모래 속', '모래를 먹고 똥으로 내보내 갯벌을 깨끗하게 만들어요. 낚시 미끼로도 쓰여요.', 'not'],
['barnacle', '따개비', '곤충 아님!', ['sea'], 'both', 'still', 0, 'barnacle', {}, '1cm · 콩알만 해요', '바닷물 속 플랑크톤', '바위와 배 바닥', '바위에 딱 붙어서 평생 움직이지 않아요. 조개처럼 보이지만 사실은 새우의 친척이에요.', 'not'],
['starfish', '불가사리', '곤충 아님!', ['sea'], 'both', 'crawl', 1, 'starfish', {}, '10cm · 어른 손바닥만 해요', '조개', '바닷가 바위 아래', '팔이 다섯 개예요. 팔 하나가 떨어져도 다시 자라나요. 배 쪽에 작은 빨판 발이 수백 개 있어요.', 'not'],
// ---- 산 ----
['mt_swallow', '산제비나비', '나비', ['mountain', 'valley'], 'day', 'fly', 1, 'butterfly', { a: '#1E2A3A', b: '#0F1520', lo: '#1A7A6A', tails: true, tipStyle: 'none', body: '#1E1A26', spots: [[56, 150, 5, '#FF5A4E'], [70, 164, 4, '#FF5A4E']] }, '12cm · 어른 손바닥보다 커요', '꽃의 꿀', '높은 산의 계곡', '까만 날개가 햇빛에 초록·파랑으로 반짝여요. 산속 계곡에서 물을 마시러 모여요.'],
['blue_band', '청띠제비나비', '나비', ['mountain'], 'day', 'fly', 2, 'butterfly', { a: '#1E1A26', b: '#0F0A1A', lo: '#1E1A26', tails: true, tipStyle: 'none', body: '#1E1A26', band: true, tip: '#3FC6D6' }, '8cm · 어른 손가락 길이', '꽃의 꿀', '남쪽 산의 녹나무 숲', '까만 날개 가운데 하늘색 띠가 선명해요. 아주 빠르게 날아서 잡기 어려운 나비예요.'],
['red_admiral', '큰멋쟁이나비', '나비', ['mountain'], 'day', 'fly', 0, 'butterfly', { a: '#2B2340', b: '#1A1426', lo: '#4A3A2A', tipStyle: 'none', band: true, tip: '#E8632B', spots: [[36, 56, 4, '#fff'], [48, 50, 4, '#fff']] }, '6cm · 어른 손가락 길이', '나무 수액, 과일즙', '산길과 산 정상', '까만 날개에 주황 띠가 멋져요. 산꼭대기 바위에 앉아 날개를 펴고 햇볕을 쬐어요.'],
['silver_frit', '은점표범나비', '나비', ['mountain'], 'day', 'fly', 1, 'butterfly', { a: '#F0A040', b: '#C47A20', lo: '#D9924A', tipStyle: 'none', spots: [[40, 60, 4], [54, 52, 4], [68, 62, 4], [48, 80, 4], [66, 84, 4], [54, 148, 5, '#F3EFE4'], [68, 162, 4, '#F3EFE4']] }, '7cm · 어른 손가락 길이', '꽃의 꿀', '산속 풀밭', '날개 뒷면에 은색 점이 반짝여요. 여름 산 엉겅퀴 꽃밭에서 자주 만나요.'],
['red_ring', '홍점알락나비', '나비', ['mountain'], 'day', 'fly', 1, 'butterfly', { a: '#2B2340', b: '#1A1426', lo: '#2B2340', tipStyle: 'none', spots: [[40, 58, 4, '#fff'], [56, 50, 4, '#fff'], [48, 76, 4, '#fff'], [66, 86, 4, '#fff'], [52, 150, 5, '#E53935'], [66, 164, 4, '#E53935']] }, '7cm · 어른 손가락 길이', '나무 수액', '팽나무가 있는 산', '까만 날개에 흰 점이 많고 아래쪽에 빨간 점이 줄지어 있어요. 팽나무 잎에서 애벌레가 자라요.'],
['great_purple', '왕오색나비', '나비', ['mountain'], 'day', 'fly', 2, 'butterfly', { a: '#4A3A8A', b: '#2A1E5A', lo: '#5A4A3A', tipStyle: 'none', spots: [[40, 58, 4, '#fff'], [56, 52, 4, '#fff'], [62, 150, 5, '#F2C14E']] }, '10cm · 어른 손바닥만 해요', '나무 수액', '깊은 산의 팽나무 숲', '수컷 날개가 보라색으로 반짝여요. 힘이 세서 새를 쫓아낼 만큼 용감한 나비예요.'],
['mt_satyr', '산굴뚝나비', '나비', ['mountain'], 'day', 'fly', 2, 'butterfly', { a: '#4A3A30', b: '#2E2420', lo: '#3A2E26', tipStyle: 'none', eyes: [[48, 66, 8, '#F2C14E', '#1E1A26'], [60, 150, 6, '#F2C14E', '#1E1A26']] }, '5cm · 날개를 펴면 어른 엄지 길이', '꽃의 꿀', '한라산·설악산 꼭대기', '아주 높은 산꼭대기에서만 살아요. 우리나라에서 보호하는 귀한 나비예요.'],
['golden_ring', '장수잠자리', '잠자리', ['mountain', 'valley'], 'day', 'fly', 2, 'dragonfly', { a: '#F2C14E', eye: '#2E8B57', wing: '#EAF4FF' }, '10cm · 어른 손바닥만 해요', '나비, 벌', '산속 계곡', '우리나라에서 가장 큰 잠자리예요. 까만 몸에 노란 고리무늬가 있고 계곡 위를 순찰하듯 날아요.'],
['carabus_red', '홍단딱정벌레', '딱정벌레', ['mountain'], 'night', 'crawl', 1, 'beetle', { a: '#B5462B', b: '#5A1E10', shape: 'long', pron: '#2E8B57', head: '#1E1A26', antLong: true }, '3cm · 어른 엄지손가락만 해요', '달팽이, 애벌레', '산속 낙엽 아래', '등이 붉은 금속빛으로 반짝여요. 날개가 붙어 있어 날지 못하지만 아주 빨리 달려요.'],
['carabus_green', '멋쟁이딱정벌레', '딱정벌레', ['mountain'], 'night', 'crawl', 1, 'beetle', { a: '#2E8B57', b: '#143D28', shape: 'long', pron: '#B5462B', head: '#1E1A26', antLong: true }, '3cm · 어른 엄지손가락만 해요', '지렁이, 달팽이', '산속 돌 밑', '초록과 빨강이 섞인 화려한 색이라 멋쟁이예요. 밤에 낙엽 사이를 돌아다니며 사냥해요.'],
['luna_long', '옥색긴꼬리산누에나방', '나비', ['mountain'], 'night', 'fly', 2, 'moth', { a: '#B8EBC8', lo: '#9BDCB0', body: '#F3E7C3', spot: '#D9A066' }, '10cm · 어른 손바닥만 해요', '먹지 않아요', '깊은 산', '연한 옥색 날개에 긴 꼬리가 달린 아름다운 나방이에요. 달빛 아래 조용히 날아다녀요.'],
['mt_cicada', '쓰름매미', '매미', ['mountain'], 'day', 'glide', 0, 'cicada', { a: '#6B7A3A', h: '#4A5A2A' }, '3.5cm · 어른 엄지손가락만 해요', '나무 수액', '산속 나무', '"쓰름쓰름" 하고 울어서 쓰름매미예요. 여름이 끝날 무렵 산에서 많이 울어요.'],
['hairy_cicada', '털매미', '매미', ['mountain'], 'day', 'glide', 1, 'cicada', { a: '#5A4A3A', h: '#3A2E26', wing: '#C8B898', wingOp: .8 }, '2.5cm · 콩알 네 개 크기', '나무 수액', '산속 숲', '몸에 짧은 털이 나 있어요. 매미 중에서 가장 먼저 여름을 알리며 "찌이이" 하고 울어요.'],
['mt_grasshopper', '팥중이', '메뚜기', ['mountain'], 'day', 'hop', 0, 'hopper', { a: '#9A8A6A', wing: '#7A6A4A', bands: true }, '4cm · 어른 엄지손가락만 해요', '풀잎', '산길의 마른 땅', '팥 색깔 몸이라 팥중이예요. 날 때 뒷날개가 노랗게 펼쳐져 깜짝 놀라게 해요.'],
['striped_hopper', '삽사리', '메뚜기', ['mountain'], 'day', 'hop', 0, 'hopper', { a: '#7CB84A', wing: '#5A4A3A', bands: true, antLong: false }, '2.5cm · 콩알 네 개 크기', '풀잎', '산속 풀밭', '날개를 비벼 "찌르르" 노래하는 작은 메뚜기예요. 등에 갈색 줄무늬가 있어요.'],
['mt_ant', '홍가슴개미', '벌', ['mountain'], 'both', 'crawl', 0, 'ant', { a: '#2E2A33', big: true, head: '#2E2A33' }, '1cm · 콩알만 해요', '진딧물 단물, 벌레', '산속 썩은 나무', '가슴 부분이 붉은 큰 개미예요. 썩은 나무 속에 집을 짓고 산에서 가장 흔하게 보여요.'],
['giant_hornet', '장수말벌', '벌', ['mountain'], 'day', 'fly', 2, 'bee', { a: '#E8902A', th: '#3A2E26', stripe: '#3A2E26', slim: true, headc: '#F2A030', sting: true, pollen: false }, '4.5cm · 어른 엄지손가락보다 커요', '다른 곤충, 나무 수액', '산속 땅속 집', '세계에서 가장 큰 말벌이에요. 머리가 주황색이고 아주 위험하니 보이면 조용히 피해요.'],
['striped_bug', '홍줄노린재', '노린재', ['mountain'], 'day', 'crawl', 1, 'shield', { a: '#E53935', sc: '#E53935', spots: [[70, 100, 3, '#1E1A26'], [86, 96, 3, '#1E1A26'], [114, 96, 3, '#1E1A26'], [130, 100, 3, '#1E1A26'], [76, 140, 3, '#1E1A26'], [124, 140, 3, '#1E1A26']] }, '1cm · 콩알만 해요', '당근·미나리 꽃의 즙', '산속 꽃밭', '빨간 몸에 까만 줄무늬가 있어요. 눈에 잘 띄는 색으로 "나는 맛없어!"라고 알려요.'],
['orb_spider', '왕거미', '곤충 아님!', ['mountain'], 'night', 'crawl', 0, 'spider', { a: '#6B5A3A', fat: true, bands: '#3A2E26' }, '2.5cm · 콩알 네 개 크기', '거미줄에 걸린 벌레', '나뭇가지 사이 둥근 거미줄', '밤마다 둥근 거미줄을 새로 짜요. 아침이 되면 거미줄을 먹어 치우고 다시 만들어요.', 'not'],
['millipede', '노래기', '곤충 아님!', ['mountain', 'cave'], 'night', 'crawl', 0, 'centipede', { a: '#3A2E3A', leg: '#8A7A6A' }, '4cm · 어른 엄지손가락만 해요', '썩은 잎', '산속 낙엽 아래', '지네와 닮았지만 한 마디에 다리가 두 쌍씩 있어요. 건드리면 돌돌 말리고 고약한 냄새를 내요.', 'not'],
// ---- 심해 ----
['giant_isopod', '대왕등각류', '곤충 아님!', ['deepsea'], 'both', 'crawl', 1, 'pillbug', { a: '#B8A8B0' }, '30cm · 어른 발만큼 커요', '바다 밑에 가라앉은 먹이', '깊은 바다 바닥', '공벌레를 아주 크게 키운 모습이에요. 깊고 차가운 바다에서 몇 년 동안 안 먹고도 살 수 있어요.', 'not'],
['sea_spider', '바다거미', '곤충 아님!', ['deepsea'], 'both', 'crawl', 1, 'spider', { a: '#C8A070' }, '20cm · 다리를 펴면 어른 손 두 개 크기', '말미잘, 산호', '깊은 바다 바닥', '다리는 거미처럼 8개지만 거미와는 다른 동물이에요. 몸이 너무 작아서 다리 속에 내장이 들어 있어요.', 'not'],
['deep_shrimp', '심해새우', '곤충 아님!', ['deepsea'], 'both', 'swim', 0, 'shrimp', { a: '#E05050' }, '5cm · 어른 엄지손가락보다 커요', '바다 눈(가라앉는 먹이 조각)', '깊은 바다 속', '깊은 바다에서는 빨간색이 검게 보여서 숨기 좋아요. 뜨거운 물이 솟는 곳 주변에 떼 지어 살아요.', 'not'],
['tube_worm', '관벌레', '곤충 아님!', ['deepsea'], 'both', 'still', 2, 'worm', { a: '#E85050' }, '2m · 어른 키보다 커요', '먹지 않아요 (몸속 세균이 영양을 만들어요)', '뜨거운 물이 솟는 바다 밑', '입도 위장도 없어요. 몸속에 사는 세균이 대신 영양분을 만들어 줘요. 하얀 관 속에 몸을 넣고 살아요.', 'not'],
['jellyfish', '해파리', '곤충 아님!', ['deepsea'], 'both', 'fly', 0, 'jellyfish', {}, '30cm · 우산 크기', '작은 물고기, 플랑크톤', '바다 속 어디든', '몸의 95%가 물이에요. 뇌도 심장도 없지만 수억 년 동안 바다에서 살아왔어요. 촉수에 쏘이면 아파요.', 'not'],
['anglerfish', '초롱아귀', '곤충 아님!', ['deepsea'], 'both', 'swim', 2, 'anglerfish', {}, '20cm · 어른 손 두 개 크기', '작은 물고기', '빛이 없는 깊은 바다', '머리 위 낚싯대 끝이 초롱처럼 빛나요. 그 빛을 보고 다가온 물고기를 큰 입으로 꿀꺽 삼켜요.', 'not'],
['giant_squid', '대왕오징어', '곤충 아님!', ['deepsea'], 'both', 'swim', 2, 'squid', { a: '#D06A5A' }, '13m · 버스보다 길어요', '물고기, 작은 오징어', '아주 깊은 바다', '눈이 농구공만큼 커서 세상에서 가장 큰 눈을 가졌어요. 향유고래와 싸운 흔적이 발견되기도 해요.', 'not'],
['crinoid', '바다나리', '곤충 아님!', ['deepsea'], 'both', 'still', 1, 'starfish', { a: '#C96A9A' }, '20cm · 어른 손 두 개 크기', '물에 떠다니는 먹이', '깊은 바다 바위', '꽃처럼 생겼지만 동물이에요. 불가사리의 친척으로 깃털 같은 팔을 펼쳐 먹이를 걸러 먹어요.', 'not'],
['sea_pig', '바다돼지', '곤충 아님!', ['deepsea'], 'both', 'crawl', 1, 'caterpillar', { a: '#F0B8C8', head: '#F0B8C8' }, '10cm · 어른 손바닥 길이', '바다 밑 진흙 속 먹이', '깊은 바다 진흙 바닥', '분홍빛 통통한 몸에 다리가 달린 해삼이에요. 진흙 바닥을 떼 지어 걸어 다니며 먹이를 찾아요.', 'not'],
// ---- 땅속 ----
['grub', '굼벵이', '딱정벌레 애벌레', ['underground'], 'both', 'crawl', 0, 'grub', {}, '7cm · 어른 손가락 길이', '썩은 나무, 뿌리', '땅속과 썩은 나무 속', '장수풍뎅이나 풍뎅이의 애벌레예요. C자로 몸을 구부리고 살며, 3년이나 땅속에서 자란 뒤 어른이 돼요.'],
['cicada_nymph', '매미 애벌레', '매미', ['underground'], 'both', 'crawl', 1, 'nymph', {}, '3cm · 어른 엄지손가락만 해요', '나무뿌리의 즙', '나무뿌리 옆 땅속', '앞다리가 삽처럼 생겨서 땅을 파요. 땅속에서 5~7년을 살다가 여름밤에 나무로 올라가 허물을 벗어요.'],
['antlion_larva', '개미귀신', '풀잠자리 애벌레', ['underground', 'desert'], 'both', 'still', 1, 'antlion_larva', {}, '1cm · 콩알만 해요', '개미', '모래 속 깔때기 함정', '모래에 깔때기 모양 함정을 파고 바닥에 숨어 있어요. 개미가 미끄러져 떨어지면 큰 턱으로 잡아요. 자라면 명주잠자리가 돼요.'],
['wireworm', '철사벌레', '딱정벌레 애벌레', ['underground'], 'both', 'crawl', 0, 'caterpillar', { a: '#E0B850', head: '#A87830' }, '2cm · 콩알 세 개 크기', '식물 뿌리, 씨앗', '밭 땅속', '방아벌레의 애벌레예요. 몸이 철사처럼 딱딱하고 길어서 철사벌레라고 불러요.'],
['springtail', '톡토기', '톡토기', ['underground'], 'both', 'hop', 0, 'springtail', {}, '0.2cm · 깨알보다 작아요', '썩은 잎, 곰팡이', '축축한 흙 속', '배 밑에 접어 둔 꼬리를 튕겨서 톡 하고 뛰어요. 한 줌 흙 속에 수백 마리가 살아요.'],
['queen_ant', '여왕개미', '벌', ['underground'], 'both', 'crawl', 2, 'ant', { a: '#5A3A2A', big: true }, '1.5cm · 콩알 두 개 크기', '일개미가 가져온 먹이', '땅속 개미집 가장 깊은 방', '개미집에서 알을 낳는 단 하나의 개미예요. 결혼 비행 뒤 날개를 떼고 땅속으로 들어가 집을 시작해요.'],
['purse_spider', '땅거미', '곤충 아님!', ['underground'], 'both', 'still', 1, 'spider', { a: '#3A2E3A', fat: true }, '1.5cm · 콩알 두 개 크기', '지나가는 벌레', '땅속 거미줄 주머니', '땅속에 거미줄로 긴 주머니를 만들고 숨어요. 벌레가 주머니 위를 지나가면 안에서 콱 물어요.', 'not'],
['mole', '두더지', '곤충 아님!', ['underground'], 'both', 'crawl', 2, 'mole', {}, '15cm · 어른 손 두 개 크기', '지렁이, 굼벵이', '땅속 굴', '곤충이 아니라 포유류예요. 삽 같은 앞발로 하루에 20m나 굴을 파요. 눈은 거의 보이지 않지만 코가 아주 예민해요.', 'not'],
['burrow_bug', '땅노린재', '노린재', ['underground'], 'night', 'crawl', 1, 'shield', { a: '#3A2E2A', sc: '#4A3A32', spots: [] }, '1cm · 콩알만 해요', '식물 뿌리의 즙', '풀뿌리 옆 땅속', '까맣고 반질반질한 몸으로 땅속에서 뿌리의 즙을 빨아요. 다리에 가시가 있어 땅을 잘 파요.'],
['red_worm', '줄지렁이', '곤충 아님!', ['underground'], 'both', 'crawl', 0, 'worm', { a: '#C86060' }, '8cm · 어른 손가락 길이', '썩은 잎, 음식 찌꺼기', '낙엽 아래 흙 속', '몸에 줄무늬가 있는 붉은 지렁이예요. 음식 찌꺼기를 먹어 좋은 흙을 만들어서 사람이 일부러 키우기도 해요.', 'not'],
// ---- 바위틈 ----
['house_centipede', '그리마', '곤충 아님!', ['rocks', 'home'], 'night', 'crawl', 1, 'centipede', { a: '#9A8A6A', leg: '#C8B890' }, '3cm · 어른 엄지손가락만 해요', '바퀴벌레, 좀', '축축한 바위 틈과 집 안', '다리가 15쌍이고 아주 길어서 번개처럼 빨라요. 바퀴벌레를 잡아먹는 고마운 친구예요.', 'not'],
['woodlouse', '쥐며느리', '곤충 아님!', ['rocks'], 'both', 'crawl', 0, 'pillbug', { a: '#6E6A62' }, '1cm · 콩알만 해요', '썩은 잎', '돌 밑', '공벌레와 닮았지만 몸이 납작하고 건드려도 공처럼 말리지 못해요. 새우의 친척이에요.', 'not'],
['silverfish', '좀', '좀', ['rocks', 'home'], 'night', 'crawl', 0, 'silverfish', {}, '1cm · 콩알만 해요', '종이, 풀', '어둡고 축축한 틈', '은빛 비늘이 물고기 같아서 영어로는 "은물고기"예요. 공룡 시대보다 더 오래전부터 살아온 곤충이에요.'],
['ground_beetle', '먼지벌레', '딱정벌레', ['rocks'], 'night', 'crawl', 0, 'beetle', { a: '#2E2A33', shape: 'long', antLong: true }, '1.5cm · 콩알 두 개 크기', '작은 벌레', '돌 밑과 낙엽', '돌을 들추면 재빨리 도망가요. 위험하면 꽁무니에서 고약한 냄새를 뿜어요.'],
['scorpion', '극동전갈', '곤충 아님!', ['rocks', 'desert'], 'night', 'crawl', 2, 'scorpion', {}, '5cm · 어른 엄지손가락보다 커요', '곤충, 거미', '마른 바위 틈', '우리나라에 사는 유일한 전갈이에요. 꼬리 끝에 독침이 있으니 보이면 만지지 말고 멀리서 봐요.', 'not'],
['slug', '민달팽이', '곤충 아님!', ['rocks'], 'both', 'crawl', 0, 'slug', {}, '5cm · 어른 엄지손가락보다 커요', '잎, 버섯', '축축한 바위 밑', '집이 없는 달팽이예요. 몸에서 끈끈한 점액을 내서 미끄러지듯 움직이고 날카로운 돌 위도 다치지 않아요.', 'not'],
['funnel_spider', '깔때기거미', '곤충 아님!', ['rocks'], 'both', 'still', 1, 'spider', { a: '#5A4A3A', bands: '#3A2E26' }, '1.5cm · 콩알 두 개 크기', '거미줄에 걸린 벌레', '바위 틈 깔때기 모양 거미줄', '바위 틈에 깔때기처럼 생긴 거미줄을 치고 안쪽에 숨어 있어요. 벌레가 줄을 건드리면 번개처럼 튀어나와요.', 'not'],
['rock_cricket', '모대가리귀뚜라미', '메뚜기', ['rocks'], 'night', 'hop', 1, 'hopper', { a: '#5A3E2A', wing: '#7A5A3A', antLong: true, cerci: true, head: '#3A2A1E' }, '1.5cm · 콩알 두 개 크기', '풀잎, 작은 벌레', '돌 밑', '수컷 머리가 모난 네모 모양이라 모대가리예요. 돌 밑에서 "찌르르" 하고 울어요.'],
['stone_centipede', '돌지네', '곤충 아님!', ['rocks'], 'both', 'crawl', 0, 'centipede', { a: '#8A5A3A', leg: '#C8A070' }, '2cm · 콩알 세 개 크기', '작은 벌레', '돌 밑', '지네 중에서 작은 편이에요. 다리가 15쌍이고 돌을 들추면 재빨리 틈으로 숨어요.', 'not'],
['pavement_ant', '주름개미', '벌', ['rocks', 'home'], 'both', 'crawl', 0, 'ant', { a: '#4A3A2A' }, '0.3cm · 깨알만 해요', '단 것, 씨앗', '돌 밑과 보도블록 틈', '돌 밑이나 보도블록 틈에 집을 짓는 작은 개미예요. 머리에 주름 무늬가 있어서 주름개미라고 불러요.'],
// ---- 추가: 풀밭 ----
['bronze_chafer', '청동풍뎅이', '딱정벌레', ['meadow'], 'day', 'crawl', 0, 'beetle', { a: '#5E8E3E', b: '#2E5E2E', shape: 'oval', head: '#2E5E2E', pron: '#3E7E3E', antClub: true }, '2cm · 콩알 세 개 크기', '잎, 꽃', '풀밭과 과수원', '햇빛을 받으면 청동처럼 반짝여요. 여름 저녁에 불빛으로 날아오기도 해요.'],
['purple_dor', '보라금풍뎅이', '딱정벌레', ['meadow'], 'night', 'crawl', 2, 'beetle', { a: '#6A3FA0', b: '#3A1E60', shape: 'round', head: '#2A1A40', pron: '#4A2A80', striae: true }, '2cm · 콩알 세 개 크기', '동물 똥', '풀밭 땅속 굴', '보랏빛으로 반짝이는 똥 청소부예요. 똥 밑에 굴을 파고 똥을 끌어다 알을 낳아요.'],
['pointy_hopper', '섬서구메뚜기', '메뚜기', ['meadow'], 'day', 'hop', 0, 'hopper', { a: '#9BC45A', long: true, head: '#7CA840' }, '3cm · 어른 엄지손가락만 해요', '풀잎', '풀밭', '머리가 뾰족한 원뿔 모양이에요. 암컷이 수컷보다 두 배나 커서 수컷을 업고 다니는 것처럼 보여요.'],
['painted_lady', '작은멋쟁이나비', '나비', ['meadow', 'desert'], 'day', 'fly', 1, 'butterfly', { a: '#F39C3D', b: '#C45A12', lo: '#E67E22', tipStyle: 'none', spots: [[40, 56, 4, '#fff'], [54, 50, 4, '#fff'], [60, 150, 4], [72, 160, 4]], veins: true }, '5cm · 날개를 펴면 어른 엄지 길이', '꽃꿀', '풀밭과 꽃밭', '세계에서 가장 멀리 여행하는 나비 중 하나예요. 아프리카에서 유럽까지 수천 킬로미터를 날아가요.'],
['leafhopper', '끝동매미충', '노린재', ['meadow'], 'day', 'hop', 0, 'shield', { a: '#7CC24A', sc: '#5A9A2A', spots: [[80, 92, 3, '#1E1A26'], [120, 92, 3, '#1E1A26']] }, '0.5cm · 쌀알만 해요', '풀즙', '논과 풀밭', '매미를 아주 작게 줄인 모습이에요. 건드리면 옆으로 쓱 걸어가 잎 뒤로 숨어요.'],
['leaf_beetle', '청줄보라잎벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#4A3FA8', b: '#2A1E70', shape: 'round', head: '#2A1E70', pron: '#3A2E90', stripes: 2, stripeColor: '#2ECC71' }, '1.2cm · 콩알만 해요', '잎', '풀밭', '보라색 몸에 초록 줄무늬가 보석처럼 빛나요. 위험하면 다리를 오므리고 땅으로 툭 떨어져요.'],
['cranefly', '각다귀', '파리', ['meadow', 'cave'], 'both', 'fly', 0, 'fly', { a: '#9A8A6A', slim: true, eye: '#3A2E26' }, '2.5cm · 다리를 펴면 어른 엄지 길이', '꽃꿀, 물', '풀밭과 물가', '모기를 크게 키운 것처럼 생겼지만 물지 않아요. 긴 다리는 잡히면 쉽게 떨어져서 도망칠 수 있어요.'],
// ---- 추가: 숲 ----
['oak_longhorn', '하늘소', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'beetle', { a: '#6B4E2E', b: '#4A2E14', shape: 'long', antLong: true, head: '#3A2A1E', pron: '#5A3E1E' }, '5cm · 어른 엄지손가락보다 커요', '나무 수액', '참나무 숲', '우리나라에서 가장 큰 하늘소예요. 더듬이가 몸보다 길고, 잡으면 "끼익끼익" 소리를 내요.'],
['antler_chafer', '사슴풍뎅이', '딱정벌레', ['forest'], 'day', 'crawl', 2, 'beetle', { a: '#8A6A3A', b: '#5A3E1E', shape: 'oval', head: '#3A2A1E', pron: '#6B4E2E', horn: '#3A2A1E', antClub: true }, '3cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '수컷 머리에 사슴뿔처럼 갈라진 뿔이 있어요. 몸에 회색 가루가 덮여 있어 벨벳 같아요.'],
['ink_butterfly', '먹그림나비', '나비', ['forest'], 'day', 'fly', 2, 'butterfly', { a: '#2B2A40', b: '#1A1A2A', lo: '#2E3A5E', tipStyle: 'none', body: '#1E1A26', spots: [[40, 60, 4, '#fff'], [54, 52, 4, '#fff'], [60, 150, 3, '#fff'], [72, 162, 3, '#fff']] }, '6cm · 날개를 펴면 어른 손가락 길이', '나무 수액, 과일', '숲속 계곡', '검은 날개에 흰 점이 먹물 그림처럼 흩어져 있어요. 꽃보다 나무 수액과 썩은 과일을 좋아해요.'],
['small_mantis', '좀사마귀', '사마귀', ['forest'], 'day', 'crawl', 1, 'mantis', { a: '#9A8A6A' }, '5cm · 어른 엄지손가락보다 커요', '작은 곤충', '숲 가장자리 풀숲', '갈색 몸으로 낙엽 사이에 숨어요. 앞다리 안쪽에 검은 무늬가 있어서 위협할 때 펼쳐 보여요.'],
['small_cicada', '애매미', '매미', ['forest'], 'day', 'glide', 0, 'cicada', { a: '#5A6A3A', h: '#3A4A2A', wing: '#EAF4FF' }, '3cm · 어른 엄지손가락만 해요', '나무 수액', '숲', '"쓰름쓰름 치이" 하고 노래가 중간에 바뀌어요. 다른 매미보다 작고 날씬해요.'],
['ailanthus_moth', '가중나무고치나방', '나방', ['forest'], 'night', 'fly', 2, 'moth', { a: '#8A7A5A', lo: '#6B5A3A', body: '#8A7A5A', spot: '#F3E7C3', bands: true }, '13cm · 날개를 펴면 어른 손바닥보다 커요', '잎 (애벌레)', '가중나무 숲', '우리나라에서 가장 큰 나방 중 하나예요. 날개에 초승달 무늬가 네 개 있어요. 어른 나방은 입이 없어 아무것도 안 먹어요.'],
['treehopper', '뿔매미', '노린재', ['forest'], 'day', 'hop', 1, 'shield', { a: '#5A9A4A', sc: '#3A7A2A', spots: [] }, '0.8cm · 콩알만 해요', '나뭇잎 즙', '숲의 나뭇가지', '등에 뿔이 솟아 있어서 나뭇가지의 가시처럼 보여요. 개미에게 단물을 주고 대신 보호를 받아요.'],
['leaf_roller', '거위벌레', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#C0392B', b: '#8A1E1E', shape: 'oval', head: '#2E2A33', pron: '#C0392B', horn: '#2E2A33' }, '1cm · 콩알만 해요', '잎', '숲', '목이 거위처럼 길어요. 나뭇잎을 돌돌 말아 작은 요람을 만들고 그 안에 알을 낳아요.'],
// ---- 추가: 연못 ----
['asian_damsel', '아시아실잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#2ECC71', eye: '#1ABC9C', folded: true, thin: true }, '3cm · 어른 엄지손가락만 해요', '작은 날벌레', '연못가 풀숲', '초록색 몸에 꼬리 끝만 파란색이에요. 쉴 때 날개를 등 위로 가지런히 접어요.'],
['butterfly_dragon', '나비잠자리', '잠자리', ['pond'], 'day', 'fly', 2, 'dragonfly', { a: '#2B2340', eye: '#1E1A26', wing: '#3A2A6E', wingOp: 0.85 }, '4cm · 어른 엄지손가락만 해요', '작은 날벌레', '연못 위', '넓고 검푸른 날개가 햇빛에 보라색으로 반짝여요. 팔랑팔랑 나는 모습이 나비 같아요.'],
['water_boatman', '물벌레', '노린재', ['pond'], 'both', 'swim', 0, 'waterbug', { a: '#8A7A5A', small: true }, '1cm · 콩알만 해요', '물속 찌꺼기', '연못 바닥', '노처럼 생긴 뒷다리로 물속을 저어요. 배에 공기 방울을 붙이고 잠수해요.'],
['small_firefly', '애반딧불이', '딱정벌레', ['pond', 'river'], 'night', 'fly', 2, 'firefly', { pron: '#E53935' }, '0.8cm · 콩알만 해요', '다슬기 (애벌레)', '논과 연못', '반딧불이 중 가장 작아요. 애벌레는 물속에서 다슬기를 잡아먹으며 자라요. 6월 밤에 빛을 깜빡여요.'],
['midge', '깔따구', '파리', ['pond', 'river', 'wetland', 'stream'], 'both', 'fly', 0, 'fly', { a: '#7A8A5A', slim: true, eye: '#3A2E26' }, '0.6cm · 쌀알만 해요', '아무것도 안 먹어요', '연못 위', '모기처럼 생겼지만 물지 않아요. 저녁에 수백 마리가 뭉쳐서 기둥처럼 날아요.'],
['pond_snail', '물달팽이', '곤충 아님!', ['pond', 'wetland'], 'both', 'crawl', 0, 'snail', { a: '#B08A4A', body: '#9A8A6A' }, '2cm · 콩알 세 개 크기', '이끼, 물풀', '연못 물속', '물속에서 사는 달팽이예요. 숨을 쉬러 가끔 물 위로 올라와요. 껍데기가 아주 얇아요.', 'not'],
['leech', '거머리', '곤충 아님!', ['pond', 'wetland'], 'both', 'swim', 1, 'worm', { a: '#3A4A2A' }, '5cm · 어른 엄지손가락보다 커요', '피, 작은 벌레', '연못과 논', '몸 앞뒤에 빨판이 있어서 자벌레처럼 움직여요. 옛날에는 병을 고치는 데 쓰기도 했어요.', 'not'],
['dragon_nymph', '잠자리 애벌레', '잠자리', ['pond', 'valley'], 'both', 'crawl', 1, 'nymph', { a: '#5A6A4A' }, '3cm · 어른 엄지손가락만 해요', '올챙이, 작은 물고기', '연못 바닥', '"수채"라고도 불러요. 아래턱이 튀어나와 먹이를 낚아채요. 1~3년을 물속에서 살다가 잠자리가 돼요.'],
// ---- 추가: 마당 ----
['marmalade_fly', '호리꽃등에', '파리', ['yard'], 'day', 'fly', 0, 'fly', { a: '#F39C12', stripes: '#2B2340', th: '#5A4A3A', eye: '#8B2B1E', slim: true }, '1cm · 콩알만 해요', '꽃꿀, 꽃가루', '마당 꽃밭', '벌처럼 줄무늬가 있지만 침이 없는 파리예요. 공중에 가만히 멈춰서 날 수 있어요.'],
['inchworm', '자벌레', '나방', ['yard'], 'day', 'crawl', 0, 'caterpillar', { a: '#8A9A5A', head: '#6B7A3A', dots: '#6B7A3A' }, '3cm · 어른 엄지손가락만 해요', '잎', '마당 나무', '한 뼘씩 재듯이 몸을 접었다 폈다 하며 걸어요. 가만히 있으면 나뭇가지랑 똑같아 보여요.'],
['webworm_moth', '흰불나방', '나방', ['yard'], 'night', 'fly', 0, 'moth', { a: '#FFFFFF', lo: '#F0F0F0', body: '#F6F6F6', eyespot: false, bands: false, feather: true }, '3cm · 어른 엄지손가락만 해요', '잎 (애벌레)', '마당 가로수', '온몸이 눈처럼 하얘요. 애벌레들이 나무에 거미줄 같은 천막을 치고 모여 살아요.'],
['cucumber_beetle', '오이잎벌레', '딱정벌레', ['yard'], 'day', 'crawl', 0, 'beetle', { a: '#F39C12', b: '#C0730A', shape: 'oval', head: '#F39C12', pron: '#F39C12' }, '0.8cm · 콩알만 해요', '오이, 호박 잎', '텃밭', '주황색 몸이 눈에 확 띄어요. 오이 잎에 동그란 구멍을 뚫어가며 먹어요.'],
['cellar_spider', '유령거미', '곤충 아님!', ['yard', 'home'], 'both', 'still', 0, 'spider', { a: '#C8B898', bands: '#A89878' }, '1cm · 몸은 콩알, 다리는 아주 길어요', '작은 벌레', '집 구석 천장', '다리가 실처럼 가늘고 길어요. 위험하면 거미줄을 잡고 몸을 빙글빙글 흔들어 흐릿하게 보이게 해요.', 'not'],
['brown_wing_bug', '갈색날개노린재', '노린재', ['yard'], 'day', 'crawl', 0, 'shield', { a: '#7CC24A', sc: '#8A6A4A', spots: [] }, '1.2cm · 콩알만 해요', '과일, 잎', '마당 과일나무', '초록 몸에 날개만 갈색이에요. 감이나 배 같은 과일 즙을 빨아 먹어요.'],
['german_roach', '독일바퀴', '바퀴', ['yard', 'home'], 'night', 'crawl', 0, 'roach', { a: '#B08A4A' }, '1.3cm · 콩알만 해요', '아무거나', '부엌 구석', '등에 검은 줄 두 개가 있는 작은 바퀴예요. 세계 어디서나 사람 집에 살아요.'],
['bagworm', '주머니나방 애벌레', '나방', ['yard'], 'day', 'crawl', 1, 'caterpillar', { a: '#8A6A4A', head: '#5A3E1E', bands: '#6B4E2E' }, '3cm · 어른 엄지손가락만 해요', '잎', '마당 나무', '나뭇잎과 가지 조각으로 주머니 집을 만들어 몸에 달고 다녀요. 머리만 내밀고 걸어요.'],
// ---- 추가: 바다 ----
['ghost_crab', '달랑게', '곤충 아님!', ['sea'], 'both', 'crawl', 1, 'crab', { a: '#D9C8A0' }, '3cm · 어른 엄지손가락만 해요', '죽은 물고기, 조개', '모래 해변 굴', '모래색이라 잘 안 보여요. 게 중에서 가장 빨라서 달랑달랑 뛰듯이 달려요.', 'not'],
['shore_crab', '방게', '곤충 아님!', ['sea'], 'day', 'crawl', 0, 'crab', { a: '#4A6A4A' }, '3cm · 어른 엄지손가락만 해요', '갯벌 찌꺼기', '갯벌 구멍', '네모난 등딱지에 짙은 초록빛이에요. 갯벌에 구멍을 파고 살며 사람이 오면 쏙 들어가요.', 'not'],
['amur_star', '아무르불가사리', '곤충 아님!', ['sea'], 'both', 'crawl', 1, 'starfish', { a: '#7A5AA0' }, '20cm · 어른 손 두 개 크기', '조개, 굴', '바닷속 바위', '보라색과 노란색이 섞인 불가사리예요. 조개를 팔로 벌려서 먹어요. 팔이 잘려도 다시 자라요.', 'not'],
['periwinkle', '총알고둥', '곤충 아님!', ['sea'], 'both', 'crawl', 0, 'snail', { a: '#5A5A66', body: '#8A8A7A' }, '1cm · 콩알만 해요', '바위 이끼', '바닷가 바위', '총알처럼 작고 동그란 고둥이에요. 바위에 수백 마리가 다닥다닥 붙어 있어요.', 'not'],
['moon_jelly', '보름달물해파리', '곤충 아님!', ['sea'], 'both', 'fly', 1, 'jellyfish', { a: '#D8E8FF' }, '25cm · 접시만 해요', '플랑크톤', '얕은 바다', '우산 위에 네잎클로버 같은 무늬가 있어요. 몸의 95%가 물이에요. 살짝 쏘지만 많이 아프진 않아요.', 'not'],
['kuruma_prawn', '보리새우', '곤충 아님!', ['sea'], 'night', 'swim', 1, 'shrimp', { a: '#D9A066' }, '15cm · 어른 손 길이', '작은 벌레, 조개', '모래 바다 바닥', '몸에 갈색 줄무늬가 있어요. 낮에는 모래 속에 숨고 밤에 나와서 먹이를 찾아요.', 'not'],
['turban_shell', '소라', '곤충 아님!', ['sea'], 'both', 'crawl', 1, 'snail', { a: '#8A6A3A', body: '#5A6A5A' }, '8cm · 어른 주먹만 해요', '미역, 다시마', '바닷속 바위', '뾰족한 가시가 돋은 껍데기를 가졌어요. 입구를 막는 단단한 뚜껑이 있어서 문어가 와도 안전해요.', 'not'],
['mantis_shrimp', '갯가재', '곤충 아님!', ['sea'], 'both', 'swim', 2, 'shrimp', { a: '#7A9A5A' }, '15cm · 어른 손 길이', '조개, 게', '바다 바닥 굴', '사마귀 같은 앞다리로 총알처럼 빠르게 펀치를 날려요. 눈은 사람보다 훨씬 많은 색을 봐요.', 'not'],
// ---- 추가: 산 ----
['longtail_sw', '긴꼬리제비나비', '나비', ['mountain'], 'day', 'fly', 2, 'butterfly', { a: '#2B2340', b: '#0F0A1A', lo: '#1E1A2E', tails: true, tipStyle: 'none', body: '#1E1A26', spots: [[56, 150, 5, '#FF5A4E'], [70, 164, 5, '#FF5A4E']] }, '10cm · 날개를 펴면 어른 손바닥 길이', '꽃꿀', '산속 계곡', '꼬리가 다른 제비나비보다 훨씬 길어요. 수컷은 계곡 물가에 내려앉아 물을 마셔요.'],
['large_copper', '큰주홍부전나비', '나비', ['mountain'], 'day', 'fly', 2, 'butterfly', { a: '#F0702A', b: '#C04A10', lo: '#E06020', tipStyle: 'none', spots: [[50, 60, 3], [62, 70, 3], [58, 150, 3]] }, '3.5cm · 어른 엄지손가락만 해요', '꽃꿀', '산기슭 풀밭', '주홍빛 날개가 불꽃처럼 빛나요. 한때 사라졌다가 요즘 다시 늘어나고 있어요.'],
['bombardier', '폭탄먼지벌레', '딱정벌레', ['mountain'], 'night', 'crawl', 2, 'beetle', { a: '#2E2A33', b: '#1E1A26', shape: 'long', head: '#E09B2A', pron: '#E09B2A', spots: [[82, 110, 6, '#F2C14E'], [118, 110, 6, '#F2C14E'], [84, 150, 6, '#F2C14E'], [116, 150, 6, '#F2C14E']] }, '1.5cm · 콩알 두 개 크기', '작은 곤충', '산 돌 밑', '위험하면 꽁무니에서 "펑!" 소리와 함께 뜨거운 가스를 쏴요. 100도나 되는 화학 폭탄이에요.'],
['blue_longhorn', '남색초원하늘소', '딱정벌레', ['mountain'], 'day', 'crawl', 1, 'beetle', { a: '#3A5AB0', b: '#1E3080', shape: 'long', antLong: true, head: '#1E2A60', pron: '#2E4A90' }, '1.5cm · 콩알 두 개 크기', '풀 줄기', '산 풀밭', '남색 몸에 긴 더듬이가 마디마다 털이 뭉쳐 있어요. 엉겅퀴 줄기 속에 알을 낳아요.'],
['meadow_katydid', '쌕쌔기', '메뚜기', ['mountain'], 'day', 'hop', 0, 'hopper', { a: '#8FD04A', antLong: true, long: true, wing: '#B08A4A', ovip: true }, '2.5cm · 콩알 네 개 크기', '풀씨, 작은 벌레', '산 풀숲', '"쌕쌕쌕" 하고 울어서 쌕쌔기예요. 머리가 뾰족하고 더듬이가 몸의 세 배나 돼요.'],
['owl_moth', '왕물결나방', '나방', ['mountain'], 'night', 'fly', 2, 'moth', { a: '#6B5A4A', lo: '#4A3A2A', body: '#5A4A3A', eyespot: true, bands: true }, '12cm · 날개를 펴면 어른 손바닥보다 커요', '잎 (애벌레)', '산속 숲', '날개에 물결무늬가 가득해서 왕물결나방이에요. 날개를 펴면 어른 손바닥보다 커요.'],
['giant_horsefly', '왕소등에', '파리', ['mountain'], 'day', 'fly', 1, 'fly', { a: '#8A6A2A', eye: '#2ECC71', th: '#5A4A2A', stripes: '#3A2E26' }, '2.5cm · 콩알 네 개 크기', '소 피 (암컷)', '산 목장', '우리나라에서 가장 큰 등에예요. 눈이 무지개처럼 반짝여요. 암컷만 소를 물어요.'],
['wasp_spider', '긴호랑거미', '곤충 아님!', ['mountain'], 'day', 'still', 1, 'spider', { a: '#F2C14E', bands: '#1E1A26', mark: '#F3E7C3' }, '2.5cm · 콩알 네 개 크기', '메뚜기', '산 풀밭 거미줄', '노랑 검정 줄무늬가 말벌 같아요. 거미줄 가운데에 지그재그 흰 띠를 짜 넣어요.', 'not'],
// ---- 추가: 심해 ----
['vampire_squid', '흡혈오징어', '곤충 아님!', ['deepsea'], 'both', 'swim', 2, 'squid', { a: '#5A1E3A' }, '30cm · 어른 팔 길이', '바다 눈 (떠다니는 찌꺼기)', '깊은 바다', '이름은 무섭지만 피를 안 빨아요. 위험하면 몸을 뒤집어 가시 돋은 우산처럼 변해요.', 'not'],
['firefly_squid', '반딧불오징어', '곤충 아님!', ['deepsea'], 'night', 'swim', 1, 'squid', { a: '#2A4AA0' }, '7cm · 어른 손가락 길이', '작은 물고기', '깊은 바다', '몸에 파란 불빛을 내는 점이 수백 개 있어요. 봄이면 바닷가로 몰려와 파란 빛으로 바다를 물들여요.', 'not'],
['atolla', '아톨라해파리', '곤충 아님!', ['deepsea'], 'both', 'fly', 1, 'jellyfish', { a: '#C0302A' }, '15cm · 어른 손 길이', '작은 새우', '깊은 바다', '진한 빨간색이라 깊은 바다에서는 안 보여요. 잡히면 파란 빛을 빙글빙글 돌려 더 큰 물고기를 불러요.', 'not'],
['krill', '크릴', '곤충 아님!', ['deepsea'], 'both', 'swim', 0, 'shrimp', { a: '#F0A0B0' }, '5cm · 어른 엄지손가락보다 커요', '플랑크톤', '차가운 바다', '고래가 가장 좋아하는 먹이예요. 수십억 마리가 떼를 지어 바다를 붉게 물들여요.', 'not'],
['giant_amphipod', '거대단각류', '곤충 아님!', ['deepsea'], 'both', 'swim', 2, 'pillbug', { a: '#E8D8C0' }, '30cm · 어른 팔 길이', '죽은 물고기', '아주 깊은 바다', '갯벼룩을 거인처럼 키운 모습이에요. 바다에서 가장 깊은 곳에서도 살아요.', 'not'],
['brittle_star', '거미불가사리', '곤충 아님!', ['deepsea'], 'both', 'crawl', 1, 'starfish', { a: '#5A6A7A' }, '15cm · 어른 손 길이', '바다 찌꺼기', '깊은 바다 바닥', '가늘고 긴 팔이 거미 다리 같아요. 팔을 뱀처럼 꿈틀거려서 불가사리보다 훨씬 빨라요.', 'not'],
['bone_worm', '오세닥스', '곤충 아님!', ['deepsea'], 'both', 'still', 2, 'worm', { a: '#F0A0A0' }, '3cm · 어른 엄지손가락만 해요', '고래 뼈', '바다 밑 고래 뼈', '"뼈 먹는 벌레"예요. 입도 위도 없지만 뿌리로 고래 뼈 속 영양분을 빨아들여요.', 'not'],
['pelican_eel', '펠리컨장어', '곤충 아님!', ['deepsea'], 'both', 'swim', 2, 'eel', {}, '75cm · 어른 팔보다 길어요', '작은 새우, 물고기', '아주 깊은 바다', '입이 펠리컨 부리처럼 커다란 주머니라서 펠리컨장어예요. 자기 몸보다 큰 먹이도 꿀꺽 삼켜요. 꼬리 끝에서 분홍빛을 내 먹이를 불러요. "풍선장어"라고도 불러요.', 'not'],
// ---- 추가: 땅속 ----
['pot_worm', '흰지렁이', '곤충 아님!', ['underground'], 'both', 'crawl', 0, 'worm', { a: '#F0E8E0' }, '1.5cm · 콩알 두 개 크기', '썩은 잎', '축축한 흙속', '하얗고 작은 지렁이예요. 몸이 반투명해서 먹은 것이 보여요.', 'not'],
['cutworm', '거세미', '나방', ['underground'], 'night', 'crawl', 0, 'caterpillar', { a: '#6B6A5A', head: '#4A3E2A', bands: '#4A4A3A' }, '4cm · 어른 엄지손가락만 해요', '어린 식물 뿌리', '밭 흙속', '밤에만 나와서 어린 싹을 똑 잘라 먹어요. 건드리면 둥글게 몸을 말아요.'],
['horned_dung', '뿔소똥구리', '딱정벌레', ['underground'], 'night', 'crawl', 2, 'beetle', { a: '#1E1A26', b: '#0F0A1A', shape: 'round', head: '#1E1A26', pron: '#2E2A33', horn: '#1E1A26' }, '2.5cm · 콩알 네 개 크기', '소똥', '소똥 밑 땅속 굴', '수컷 머리에 코뿔소 같은 뿔이 있어요. 땅속에 굴을 파고 소똥 경단을 만들어 아기를 키워요.'],
['velvet_mite', '털진드기', '곤충 아님!', ['underground'], 'day', 'crawl', 1, 'spider', { a: '#E53935', fat: true }, '0.4cm · 깨알 두 개 크기', '곤충 알', '흙속', '빨간 벨벳 옷을 입은 것 같아요. 비 온 뒤 땅 위로 올라와 돌아다녀요.', 'not'],
['pseudoscorpion', '앉은뱅이', '곤충 아님!', ['underground'], 'both', 'crawl', 2, 'scorpion', { a: '#7A5A3A' }, '0.3cm · 깨알만 해요', '톡토기', '낙엽 밑 흙속', '꼬리 없는 꼬마 전갈이에요. 집게에 독이 있지만 너무 작아서 사람은 못 해쳐요. 파리 다리를 잡고 날아가요.', 'not'],
['soil_centipede', '땅지네', '곤충 아님!', ['underground'], 'both', 'crawl', 0, 'centipede', { a: '#D9B860', leg: '#E8D080' }, '4cm · 어른 엄지손가락만 해요', '지렁이, 작은 벌레', '흙속', '노란 실처럼 가늘고 다리가 100개 넘게 있어요. 눈이 없어서 더듬이로 길을 찾아요.', 'not'],
// ---- 추가: 바위 틈 ----
['harvestman', '장님거미', '곤충 아님!', ['rocks', 'cave'], 'both', 'crawl', 0, 'spider', { a: '#8A6A4A', fat: true }, '0.7cm · 몸은 콩알, 다리는 아주 길어요', '작은 벌레, 썩은 것', '바위 틈', '거미처럼 생겼지만 거미가 아니에요. 몸이 한 덩어리이고 거미줄도 못 쳐요. 다리가 떨어져도 한참 꿈틀거려요.', 'not'],
['rove_beetle', '반날개', '딱정벌레', ['rocks'], 'both', 'crawl', 0, 'beetle', { a: '#2E2A33', b: '#1E1A26', shape: 'long', split: false, head: '#1E1A26', pron: '#2E2A33' }, '1.5cm · 콩알 두 개 크기', '작은 벌레', '돌 밑', '딱지날개가 반밖에 없어서 반날개예요. 위험하면 전갈처럼 꼬리를 치켜들어요.'],
['bristletail', '돌좀', '좀', ['rocks'], 'night', 'hop', 1, 'silverfish', { a: '#8A7A5A' }, '1.2cm · 콩알만 해요', '이끼, 조류', '바위 표면', '좀의 친척인데 바위에서 살아요. 배를 바닥에 쳐서 몇 센티미터나 튀어 올라요.'],
['huntsman', '농발거미', '곤충 아님!', ['rocks'], 'night', 'crawl', 2, 'spider', { a: '#8A7A5A', bands: '#5A4A3A', fat: true }, '3cm · 다리를 펴면 어른 손바닥만 해요', '바퀴, 곤충', '바위 틈과 벽', '우리나라에서 가장 큰 거미예요. 거미줄을 안 치고 직접 뛰어다니며 사냥해요.', 'not'],
['pygmy_hopper', '모메뚜기', '메뚜기', ['rocks'], 'day', 'hop', 0, 'hopper', { a: '#7A6A5A', wing: '#5A4A3A', head: '#5A4A3A' }, '1cm · 콩알만 해요', '이끼', '축축한 바위', '아주 작고 등이 뒤로 길게 뾰족해요. 물에 빠져도 헤엄쳐서 나와요.'],
['field_roach', '산바퀴', '바퀴', ['rocks'], 'both', 'crawl', 0, 'roach', { a: '#6B4E2E' }, '1.2cm · 콩알만 해요', '낙엽', '돌 밑 낙엽', '집에 사는 바퀴와 달리 산에 사는 바퀴예요. 낙엽을 먹어 숲을 청소해요.'],
['potter_wasp', '호리병벌', '벌', ['rocks'], 'day', 'fly', 1, 'bee', { a: '#2B2340', th: '#2B2340', stripe: '#F2C14E', slim: true, stripes: 2, headc: '#2B2340', sting: true, pollen: false }, '1.5cm · 콩알 두 개 크기', '애벌레 (아기 먹이)', '바위에 지은 진흙 집', '진흙으로 호리병 모양 집을 바위에 지어요. 그 안에 애벌레를 넣어 아기 먹이로 줘요.'],
// ---- 집안 ----
['bedbug', '빈대', '노린재', ['home'], 'night', 'crawl', 1, 'shield', { a: '#B5623A', sc: '#9A4A28', spots: [] }, '0.5cm · 쌀알만 해요', '피', '침대 틈과 벽 틈', '납작한 몸으로 침대 틈에 숨어 있다가 밤에 나와요. 피를 먹으면 몸이 두 배로 부풀어요. 옛날 집에 아주 많았어요.'],
['clothes_moth', '옷좀나방', '나방', ['home'], 'night', 'fly', 1, 'moth', { a: '#D9C28A', eyespot: false }, '0.7cm · 새끼손톱만 해요', '털옷, 양말(애벌레)', '옷장 속', '애벌레가 털옷과 양말을 갉아 먹어 구멍을 내요. 어른 나방은 빛을 싫어해서 어두운 옷장 구석을 좋아해요.'],
['booklouse', '책벌레', '다듬이벌레', ['home'], 'both', 'crawl', 0, 'springtail', { a: '#D8C8A8' }, '0.1cm · 깨알보다 작아요', '곰팡이, 종이 풀', '오래된 책과 종이 사이', '진짜 이름은 "먼지다듬이"예요. 책 속 곰팡이와 풀을 먹어서 책벌레라고 불러요. 날개가 없고 아주 작아요.'],
['rice_weevil', '쌀바구미', '딱정벌레', ['home'], 'both', 'crawl', 0, 'beetle', { a: '#5A3A22', shape: 'oval', head: '#3A2412', horn: '#3A2412', spots: [[84, 110, 4, '#C8884A'], [116, 110, 4, '#C8884A'], [84, 150, 4, '#C8884A'], [116, 150, 4, '#C8884A']] }, '0.3cm · 깨알만 해요', '쌀, 보리', '쌀통 속', '긴 주둥이로 쌀알에 구멍을 뚫고 그 안에 알을 낳아요. 쌀통에서 나오면 날개를 펴고 날 수도 있어요.'],
['cat_flea', '고양이벼룩', '벼룩', ['home'], 'both', 'hop', 1, 'springtail', { a: '#6B3A1E' }, '0.2cm · 깨알보다 작아요', '피', '강아지·고양이 털 속, 카펫', '자기 키의 100배나 높이 뛰어요! 사람이라면 아파트 50층을 한 번에 뛰어오르는 거예요.'],
['meal_moth', '화랑곡나방', '나방', ['home'], 'night', 'fly', 0, 'moth', { a: '#C8A878', lo: '#7A5A3A', eyespot: false }, '1cm · 콩알만 해요', '쌀, 과자, 견과류(애벌레)', '부엌 찬장', '날개 끝이 구릿빛인 작은 나방이에요. 애벌레가 과자 봉지 속에서 실을 뽑으며 먹이를 먹어요.'],
['dust_mite', '집먼지진드기', '곤충 아님!', ['home'], 'both', 'crawl', 0, 'spider', { a: '#E8E0D0', fat: true }, '0.03cm · 눈에 안 보여요', '사람 피부 조각', '이불과 베개 속', '너무 작아서 돋보기로도 보기 힘들어요. 이불 하나에 수십만 마리가 살며 우리가 떨어뜨린 살갗 조각을 먹어요.', 'not'],
// ---- 동굴 ----
['horseshoe_bat', '관박쥐', '곤충 아님!', ['cave'], 'both', 'fly', 1, 'bat', { a: '#6B5A4A' }, '7cm · 어른 손바닥만 해요, 날개를 펴면 자 하나 길이', '나방, 딱정벌레', '동굴 천장', '코가 말발굽 모양이라 관박쥐예요. 입 대신 코로 초음파를 쏘아서 깜깜한 곳에서도 부딪히지 않고 날아요.', 'not'],
['orange_bat', '붉은박쥐', '곤충 아님!', ['cave'], 'both', 'fly', 2, 'bat', { a: '#E8702A', wing: '#2A1E26' }, '5cm · 어른 손가락 길이', '작은 곤충', '따뜻하고 축축한 동굴', '황금빛 털에 까만 날개를 가진 아주 예쁜 박쥐예요. 우리나라 천연기념물이라 "황금박쥐"라고도 불러요.', 'not'],
['cave_spider', '동굴왕거미', '곤충 아님!', ['cave'], 'both', 'crawl', 1, 'spider', { a: '#5A3A3A', bands: '#3A2424' }, '1.5cm · 콩알 두 개 크기', '동굴 벌레', '동굴 입구 벽', '동굴 벽에 커다란 그물을 치고 기다려요. 알주머니를 눈물방울처럼 천장에 매달아 놓아요.', 'not'],
['cave_beetle', '동굴딱정벌레', '딱정벌레', ['cave'], 'both', 'crawl', 2, 'beetle', { a: '#C8A070', b: '#8A6A40', shape: 'long', antLong: true, head: '#A08050', pron: '#B09060' }, '1cm · 콩알만 해요', '동굴 속 작은 찌꺼기', '깊은 동굴 바위 틈', '평생 깜깜한 곳에 살아서 눈이 없어요. 대신 더듬이가 아주 길어서 더듬이로 길을 찾아요.'],
['cave_shrimp', '동굴새우', '곤충 아님!', ['cave'], 'both', 'swim', 1, 'shrimp', { a: '#EAE2EC' }, '2cm · 콩알 세 개 크기', '물속 찌꺼기', '동굴 속 물웅덩이', '몸이 유리처럼 투명해서 속이 다 보여요. 눈이 거의 없고, 동굴 물속에서만 살아요.', 'not'],
['cave_fish', '눈먼동굴물고기', '곤충 아님!', ['cave'], 'both', 'swim', 2, 'fish', {}, '8cm · 어른 손가락 길이', '물속 작은 생물', '동굴 속 냇물', '눈이 없어도 잘 살아요. 옆줄로 물의 흔들림을 느껴서 벽에 부딪히지 않고 헤엄쳐요. 몸이 하얀 분홍색이에요.', 'not'],
['firefly_cave', '동굴반딧불이 애벌레', '파리 애벌레', ['cave'], 'both', 'still', 2, 'grub', { a: '#B8D8E8' }, '3cm · 어른 엄지손가락만 해요', '작은 날벌레', '동굴 천장', '천장에 끈끈한 실을 늘어뜨리고 파란 빛을 내요. 빛을 보고 날아온 벌레가 실에 붙으면 끌어올려 먹어요. 밤하늘 별처럼 보여요.'],
['cave_millipede', '동굴노래기', '곤충 아님!', ['cave'], 'both', 'crawl', 1, 'centipede', { a: '#E8E0D8', leg: '#C8B8A8' }, '2cm · 콩알 세 개 크기', '박쥐 똥, 곰팡이', '동굴 바닥', '동굴에서만 살아 몸이 하얘요. 박쥐 똥을 먹고 살아서 박쥐가 사는 동굴에 많아요.', 'not'],
['cave_springtail', '동굴톡토기', '톡토기', ['cave'], 'both', 'hop', 0, 'springtail', { a: '#EDEDF2' }, '0.2cm · 깨알보다 작아요', '곰팡이', '축축한 동굴 바닥', '동굴 바닥 물웅덩이 위를 통통 뛰어다녀요. 눈이 없고 몸이 눈처럼 하얘요.'],
['cave_amphipod', '동굴옆새우', '곤충 아님!', ['cave'], 'both', 'crawl', 1, 'pillbug', { a: '#E4E0EC' }, '1cm · 콩알만 해요', '물속 찌꺼기', '동굴 물웅덩이 바닥', '옆으로 누워서 헤엄치는 작은 새우예요. 동굴 물속에서 평생 빛을 한 번도 못 봐요.', 'not'],
['herald_moth', '동굴나방', '나방', ['cave'], 'both', 'fly', 1, 'moth', { a: '#C09060', lo: '#8A5A3A', eyespot: false }, '2cm · 콩알 세 개 크기', '꽃꿀', '동굴 입구 천장', '추운 겨울을 동굴 천장에 매달려 보내요. 날개 끝이 톱니처럼 울퉁불퉁하고 주황 무늬가 있어요.'],
['cave_snail', '동굴달팽이', '곤충 아님!', ['cave'], 'both', 'crawl', 1, 'snail', { a: '#EDE6DC', body: '#E8DCD0' }, '0.2cm · 깨알만 해요', '곰팡이', '동굴 바위 틈', '쌀알보다 작고 껍데기가 유리처럼 투명해요. 세상에서 가장 작은 달팽이 친척이에요.', 'not'],
['olm', '동굴영원', '곤충 아님!', ['cave'], 'both', 'swim', 2, 'olm', {}, '25cm · 어른 팔 길이', '작은 새우, 달팽이', '동굴 속 지하 냇물', '"올름"이라고도 불리는, 동굴에 사는 분홍빛 도롱뇽이에요. 눈이 없고 목에 빨간 겉아가미가 있어요. 10년 동안 안 먹고도 살 수 있고 100살까지 살아요. 옛날 사람들은 "아기 용"이라고 생각했어요.', 'not'],
// ---- 사막 ----
['deathstalker', '데스스토커전갈', '곤충 아님!', ['desert'], 'night', 'crawl', 2, 'scorpion', { a: '#E8C860' }, '7cm · 어른 손가락 길이', '귀뚜라미, 거미', '사막 모래와 바위 밑', '세상에서 가장 독이 센 전갈 중 하나예요. 노란 몸이 모래색과 똑같아서 찾기 어려워요. 자외선 불빛을 비추면 파랗게 빛나요.', 'not'],
['fog_beetle', '안개딱정벌레', '딱정벌레', ['desert'], 'day', 'crawl', 2, 'beetle', { a: '#2E2A33', b: '#15121A', shape: 'round', split: false, head: '#1E1A26', pron: '#2E2A33' }, '2cm · 콩알 세 개 크기', '마른 풀, 바람에 날려온 찌꺼기', '안개가 끼는 모래 언덕', '비가 거의 안 오는 사막에서 물을 구하는 천재예요. 아침 안개 속에서 물구나무를 서면 등에 맺힌 물방울이 입으로 흘러 들어와요.'],
['sacred_scarab', '왕쇠똥구리', '딱정벌레', ['desert'], 'day', 'crawl', 1, 'beetle', { a: '#2E2A33', b: '#15121A', shape: 'round', head: '#1E1A26', pron: '#2E2A33', striae: true }, '3cm · 어른 엄지손가락만 해요', '낙타와 소의 똥', '사막 가장자리', '옛날 이집트 사람들이 신처럼 여긴 벌레예요. 똥을 동그랗게 굴리는 모습이 해를 굴리는 것 같다고 생각했어요.'],
['camel_spider', '낙타거미', '곤충 아님!', ['desert'], 'night', 'crawl', 2, 'spider', { a: '#D9B070', fat: true, bands: '#B08A4A' }, '7cm · 다리를 펴면 어른 손 크기', '곤충, 도마뱀', '사막 모래 위', '거미도 전갈도 아닌 특별한 동물이에요. 커다란 턱으로 먹이를 잘게 썰어 먹고, 사람 그림자를 따라 달려와 그늘에 숨어요.', 'not'],
['tarantula', '타란툴라', '곤충 아님!', ['desert'], 'night', 'crawl', 2, 'spider', { a: '#5A3A2A', fat: true, bands: '#C8742A' }, '10cm · 어른 손바닥 크기', '곤충, 작은 도마뱀', '사막 땅굴', '털북숭이 큰 거미예요. 위험하면 배의 따가운 털을 뒷다리로 긁어 날려요. 무섭게 생겼지만 사람에게는 온순해요.', 'not'],
['silver_ant', '사하라은개미', '벌', ['desert'], 'day', 'crawl', 1, 'ant', { a: '#D8DCE0', head: '#C0C4C8' }, '1cm · 콩알만 해요', '더위에 쓰러진 곤충', '사하라 사막 모래 속', '세상에서 가장 빨리 달리는 개미예요. 1초에 자기 몸길이의 100배를 달려요. 은빛 털이 햇빛을 튕겨 내서 뜨거운 모래 위를 달릴 수 있어요.'],
['honeypot_ant', '꿀단지개미', '벌', ['desert'], 'both', 'crawl', 2, 'ant', { a: '#D9A066', big: true }, '1.5cm · 콩알 두 개 크기', '꽃꿀, 진딧물 단물', '사막 땅속 개미집', '배가 포도알처럼 부풀 때까지 꿀을 저장해요. 먹이가 없는 때가 오면 친구들에게 꿀을 나눠 줘요. 살아 있는 꿀단지예요.'],
['desert_centipede', '거대사막지네', '곤충 아님!', ['desert'], 'night', 'crawl', 2, 'centipede', { a: '#C8602A', leg: '#F0C050' }, '20cm · 어른 손 두 개 길이', '곤충, 작은 쥐', '사막 바위 밑', '세상에서 가장 큰 지네 친척이에요. 빨간 머리에 노란 다리가 "나는 위험해!" 하고 알려 줘요.', 'not'],
['thorny_devil', '가시도마뱀', '곤충 아님!', ['desert'], 'day', 'crawl', 2, 'lizard', {}, '20cm · 어른 손 두 개 길이', '개미', '오스트레일리아 사막', '온몸이 가시로 덮여 있어요. 몸에 닿은 이슬이 피부의 작은 홈을 따라 입으로 흘러가요. 하루에 개미를 수천 마리나 먹어요.', 'not'],
['desert_locust', '사막메뚜기', '메뚜기', ['desert'], 'day', 'hop', 1, 'hopper', { a: '#D9B060', wing: '#B08A4A', long: true, bands: true }, '6cm · 어른 손가락 길이', '풀, 농작물', '사막 가장자리 풀밭', '친구들이 수억 마리나 모이면 하늘을 까맣게 덮고 날아가요. 하루에 자기 몸무게만큼 먹어요.'],
['wheel_spider', '황금바퀴거미', '곤충 아님!', ['desert'], 'night', 'crawl', 1, 'spider', { a: '#E8D8B0', fat: true }, '2cm · 콩알 세 개 크기', '작은 곤충', '모래 언덕 속 굴', '위험하면 몸을 동그랗게 말고 모래 언덕을 바퀴처럼 데굴데굴 굴러 내려가요. 1초에 44바퀴나 돌아요!', 'not'],
['tarantula_hawk', '타란툴라대모벌', '벌', ['desert'], 'day', 'fly', 2, 'bee', { a: '#2A2A5A', th: '#2A2A5A', stripe: '#2A2A5A', slim: true, stripes: 0, headc: '#2A2A5A', sting: true, pollen: false }, '5cm · 어른 엄지손가락보다 커요', '꽃꿀 (애벌레는 타란툴라)', '사막 꽃 근처', '파란 몸에 주황 날개를 가진 큰 벌이에요. 타란툴라를 침으로 잠재워 애벌레의 먹이로 삼아요. 곤충 중에서 가장 아픈 침을 가졌어요.'],
// ---- 강 ----
['mitten_crab', '참게', '곤충 아님!', ['river'], 'both', 'crawl', 1, 'crab', { a: '#6B7A4A' }, '7cm · 어른 손바닥만 해요', '물풀, 작은 물고기', '강가 돌 밑', '집게에 털이 복슬복슬 나 있어서 영어로는 "벙어리장갑 게"예요. 강에서 살다가 알을 낳을 때는 바다까지 내려가요.', 'not'],
['minnow', '피라미', '곤충 아님!', ['river', 'stream'], 'day', 'swim', 0, 'minnow', { a: '#B4CCE0', stripe: '#3A5A8A' }, '12cm · 어른 손 길이', '물벌레, 물풀', '맑은 강 여울', '우리나라 강에서 가장 흔한 물고기예요. 봄이 되면 아빠 피라미는 몸이 무지개색으로 변해요.', 'not'],
['loach', '미꾸라지', '곤충 아님!', ['river', 'stream'], 'both', 'swim', 1, 'minnow', { a: '#9A8A4A', long: true, barbels: true }, '15cm · 어른 손 길이', '진흙 속 작은 벌레', '강바닥 진흙', '입가에 수염이 열 개나 있어요. 미끌미끌해서 손으로 잡기 어려워요. 물속 산소가 부족하면 공기를 꿀꺽 마셔 장으로 숨을 쉬어요.', 'not'],
['medaka', '송사리', '곤충 아님!', ['river'], 'day', 'swim', 0, 'minnow', { a: '#E0D0A0', small: true, stripe: '#A09060' }, '3cm · 어른 엄지손가락만 해요', '물벼룩, 장구벌레', '강가 얕은 물', '우리나라에서 가장 작은 민물고기예요. 눈이 위쪽에 붙어 있어 물 위에 떨어진 벌레를 잘 찾아요. 우주선을 타고 우주에도 다녀온 물고기예요.', 'not'],
['water_spider', '물거미', '곤충 아님!', ['river'], 'both', 'swim', 2, 'spider', { a: '#5A4A3A', bigEyes: true }, '1.5cm · 콩알 두 개 크기', '물벌레, 올챙이', '물풀 사이', '세상에서 유일하게 물속에서 사는 거미예요. 배에 공기 방울을 붙이고 물풀 사이에 거미줄로 공기 집을 지어요.', 'not'],
['mayfly_nymph', '하루살이 애벌레', '하루살이', ['river'], 'both', 'crawl', 0, 'nymph', { a: '#9A8A5A' }, '1.5cm · 콩알 두 개 크기', '물속 이끼, 찌꺼기', '강바닥 돌 틈', '꼬리가 세 가닥이고 배 옆에 아가미가 깃털처럼 달려 있어요. 물속에서 1년을 살다가 어른이 되면 하루만 살아요.'],
['black_jewelwing', '검은물잠자리', '잠자리', ['river'], 'day', 'fly', 1, 'dragonfly', { a: '#1E2E2A', eye: '#1A1A2A', folded: true, thin: true, wing: '#15121A', wingOp: .9 }, '6cm · 어른 손가락 길이', '작은 날벌레', '강가 풀잎', '날개가 온통 까매서 나비처럼 팔랑팔랑 날아요. 물잠자리와 닮았지만 날개에 하얀 점이 없어요.'],
['river_clubtail', '어리장수잠자리', '잠자리', ['river'], 'day', 'fly', 2, 'dragonfly', { a: '#F2C14E', eye: '#3A5A3A', wing: '#EAF4FF' }, '8cm · 어른 손가락 길이', '나비, 잠자리', '큰 강 위', '장수잠자리와 닮았지만 눈이 서로 떨어져 있어요. 애벌레는 강바닥 모래 속에 3년이나 숨어 살아요.'],
['melania', '다슬기', '곤충 아님!', ['river', 'valley', 'stream'], 'both', 'crawl', 0, 'snail', { a: '#4A3A2A', body: '#5A5A4A' }, '2.5cm · 콩알 네 개 크기', '돌에 붙은 이끼', '맑은 물속 돌', '껍데기가 길쭉한 물달팽이예요. 반딧불이 애벌레의 먹이라서 다슬기가 많으면 반딧불이도 많아요.', 'not'],
['korean_frog', '참개구리', '곤충 아님!', ['river'], 'both', 'hop', 1, 'frog', { a: '#7CB84A', stripe: '#D8E890', spots: '#2E4A2A' }, '7cm · 어른 손바닥만 해요', '곤충, 거미', '강가 풀숲', '등에 연두색 줄이 세 개 있어요. "개굴개굴" 우는 바로 그 개구리예요. 혀를 뒤집어 날아가는 벌레를 낚아채요.', 'not'],
['freshwater_shrimp', '새뱅이', '곤충 아님!', ['river'], 'both', 'swim', 0, 'shrimp', { a: '#9AB09A' }, '2.5cm · 콩알 네 개 크기', '물풀, 찌꺼기', '물풀 사이', '투명한 작은 민물새우예요. 몸이 비쳐서 속이 다 보여요. 물풀 사이에 숨어 작은 찌꺼기를 주워 먹어요.', 'not'],
// ---- 계곡 ----
['crayfish', '가재', '곤충 아님!', ['valley'], 'both', 'crawl', 2, 'crayfish', { a: '#8A5A3A' }, '6cm · 어른 손가락 길이', '물벌레, 죽은 물고기', '맑은 계곡 돌 밑', '집게로 먹이를 잡는 민물 가재예요. 깨끗한 1급수에서만 살아요. 놀라면 꼬리를 튕겨 뒤로 재빨리 헤엄쳐요.', 'not'],
['salamander', '도롱뇽', '곤충 아님!', ['valley'], 'night', 'crawl', 2, 'olm', { a: '#6B5A3A', gills: false, spots: '#2E2A1A', eye: true }, '10cm · 어른 손가락 길이', '지렁이, 곤충', '계곡 돌 밑', '도마뱀처럼 생겼지만 개구리 친척이에요. 봄이 되면 계곡에 바나나처럼 생긴 알주머니를 낳아요. 피부가 늘 축축해야 해요.', 'not'],
['firebelly_toad', '무당개구리', '곤충 아님!', ['valley'], 'day', 'hop', 1, 'frog', { a: '#4E9A2E', spots: '#15121A', bumps: true, eye: '#C87A30' }, '5cm · 어른 엄지손가락보다 커요', '곤충, 거미', '계곡 물웅덩이', '배가 빨강과 검정 무늬로 알록달록해요. 위험하면 몸을 뒤집어 빨간 배를 보여 주며 "나는 독이 있어!" 하고 알려요.', 'not'],
['dace', '버들치', '곤충 아님!', ['valley'], 'day', 'swim', 0, 'minnow', { a: '#9AA878', stripe: '#5A6A4A' }, '12cm · 어른 손 길이', '물벌레, 떨어진 벌레', '차가운 계곡물', '차갑고 맑은 계곡에서만 사는 물고기예요. 사람이 다가가면 돌 밑으로 쏙 숨었다가 금방 다시 나와요.', 'not'],
['amphipod', '옆새우', '곤충 아님!', ['valley'], 'both', 'swim', 0, 'shrimp', { a: '#B0A878' }, '1cm · 콩알만 해요', '떨어진 나뭇잎', '계곡 낙엽 밑', '몸이 옆으로 납작해서 옆으로 누워 헤엄쳐요. 계곡에 떨어진 나뭇잎을 잘게 먹어 치우는 청소부예요.', 'not'],
['planarian', '플라나리아', '곤충 아님!', ['valley'], 'both', 'crawl', 1, 'worm', { a: '#5A4A3A' }, '1.5cm · 콩알 두 개 크기', '작은 물벌레', '계곡 돌 밑', '머리가 세모나고 눈이 사팔뜨기처럼 보여요. 몸을 반으로 잘라도 두 마리로 다시 자라나는 신기한 동물이에요.', 'not'],
['caddis_larva', '날도래 애벌레', '날도래', ['valley'], 'both', 'crawl', 1, 'grub', { a: '#B0A080' }, '2cm · 콩알 세 개 크기', '물속 이끼, 작은 벌레', '계곡 돌 밑', '모래알과 나뭇조각으로 자기만의 집을 만들어 등에 지고 다녀요. 집 속에 숨어 머리와 다리만 내밀어요.'],
['stonefly_nymph', '강도래 애벌레', '강도래', ['valley'], 'both', 'crawl', 1, 'nymph', { a: '#6B5A3A' }, '2.5cm · 콩알 네 개 크기', '하루살이 애벌레', '계곡 돌 밑', '꼬리가 두 가닥이에요. 물살이 센 계곡 돌 밑에 납작 붙어 살아요. 깨끗한 물에서만 살아서 물이 맑은지 알려 줘요.'],
['valley_frog', '계곡산개구리', '곤충 아님!', ['valley'], 'both', 'hop', 1, 'frog', { a: '#A8703A', spots: '#5A3A1A', eye: '#C8A030' }, '5cm · 어른 엄지손가락보다 커요', '곤충, 거미', '계곡 바위 위', '갈색 몸이 낙엽과 똑같아서 찾기 어려워요. 이른 봄 계곡 얼음이 녹자마자 제일 먼저 알을 낳아요.', 'not'],
// ---- 습지 ----
['gold_frog', '금개구리', '곤충 아님!', ['wetland'], 'both', 'hop', 2, 'frog', { a: '#5A9A3A', stripe: '#F0D040', eye: '#C8A030' }, '5cm · 어른 엄지손가락보다 커요', '곤충, 거미', '습지 물풀 사이', '등에 금빛 줄이 두 개 있어요. 우리나라에만 사는 귀한 개구리라서 보호하고 있어요. 울음소리가 "쪽쪽" 하고 작아요.', 'not'],
['tree_frog', '청개구리', '곤충 아님!', ['wetland'], 'both', 'hop', 0, 'frog', { a: '#4FD04A', eye: '#C8A030' }, '3cm · 어른 엄지손가락만 해요', '작은 곤충', '습지 풀잎 위', '발가락 끝에 빨판이 있어서 풀잎이나 나무에 척척 붙어요. 주변에 따라 몸 색을 초록이나 갈색으로 바꿔요. 비 오기 전에 크게 울어요.', 'not'],
['narrow_frog', '맹꽁이', '곤충 아님!', ['wetland'], 'night', 'hop', 2, 'frog', { a: '#8A7A4A', spots: '#4A3A2A', eye: '#3A2A1A' }, '4.5cm · 어른 엄지손가락만 해요', '개미, 작은 곤충', '습지 땅속', '몸이 공처럼 둥글고 입이 아주 작아요. 평소에는 땅속에 숨어 살다가 장맛비가 오면 나와서 "맹꽁맹꽁" 울어요.', 'not'],
['toad', '두꺼비', '곤충 아님!', ['wetland'], 'night', 'hop', 1, 'frog', { a: '#9A7A4A', bumps: true, eye: '#C87A30' }, '10cm · 어른 손바닥만 해요', '지렁이, 곤충', '습지 가장자리 풀숲', '등이 울퉁불퉁하고 느릿느릿 걸어요. 위험하면 귀 뒤에서 하얀 독물이 나와요. 봄이면 태어난 못으로 꼭 돌아와 알을 낳아요.', 'not'],
['fishing_spider', '황닷거미', '곤충 아님!', ['wetland'], 'both', 'swim', 2, 'spider', { a: '#8A6A3A', fat: true, bands: '#D9B070' }, '3cm · 다리를 펴면 어른 손바닥만 해요', '물벌레, 작은 물고기', '물 위와 물가 풀', '거미줄을 치지 않고 물 위를 걸어 다니며 사냥해요. 물속으로 잠수해서 작은 물고기도 잡아요. 알주머니를 입에 물고 다녀요.', 'not'],
['tiny_dragonfly', '꼬마잠자리', '잠자리', ['wetland'], 'day', 'fly', 2, 'dragonfly', { a: '#E53935', eye: '#C0392B' }, '1.5cm · 콩알 두 개 크기', '작은 날벌레', '얕은 습지 위', '세상에서 가장 작은 잠자리예요. 손톱만 해요. 수컷은 빨갛고 암컷은 노란 줄무늬가 있어요. 햇빛 드는 얕은 습지에서만 살아요.'],
['apple_snail', '논우렁이', '곤충 아님!', ['wetland'], 'both', 'crawl', 0, 'snail', { a: '#5A6A3A', body: '#6A6A5A' }, '4cm · 어른 엄지손가락만 해요', '물풀, 이끼', '습지와 논 바닥', '껍데기 입구를 뚜껑으로 꼭 닫을 수 있어요. 알을 낳지 않고 몸속에서 새끼를 키워 작은 우렁이로 낳아요.', 'not'],
['wriggler', '장구벌레', '파리', ['wetland'], 'both', 'swim', 0, 'worm', { a: '#7A7A6A' }, '0.7cm · 쌀알보다 조금 커요', '물속 찌꺼기', '고인 물속', '모기의 애벌레예요. 몸을 꿈틀꿈틀 접었다 펴며 헤엄쳐요. 꼬리 끝 숨관을 물 밖으로 내밀어 숨을 쉬어요.'],
['black_damsel', '등검은실잠자리', '잠자리', ['wetland'], 'day', 'fly', 0, 'dragonfly', { a: '#2E3A2A', eye: '#3A6A3A', folded: true, thin: true }, '3cm · 어른 엄지손가락만 해요', '작은 날벌레', '습지 풀잎', '등이 검고 옆은 연두색이에요. 짝을 지으면 하트 모양이 돼요. 암컷은 물풀 줄기 속에 알을 낳아요.'],
// ---- 하천 ----
['kkeokji', '꺽지', '곤충 아님!', ['stream'], 'day', 'swim', 1, 'minnow', { a: '#6A7A5A', stripe: '#3A4A3A' }, '15cm · 어른 손 길이', '작은 물고기, 물벌레', '하천 바위 틈', '몸에 호랑이 같은 세로 줄무늬가 있어요. 아빠 꺽지는 바위 밑에 낳은 알을 부화할 때까지 지켜요. 기분에 따라 몸 색이 변해요.', 'not'],
['dolgogi', '돌고기', '곤충 아님!', ['stream'], 'day', 'swim', 0, 'minnow', { a: '#B0A070', stripe: '#2A2A2A', small: true }, '8cm · 어른 손가락 길이', '물벌레, 돌에 붙은 이끼', '하천 자갈 바닥', '머리부터 꼬리까지 까만 줄이 쭉 그어져 있어요. 입이 돼지코처럼 작고 둥글어요. 꺽지 둥지에 몰래 알을 낳기도 해요.', 'not'],
['galgyeoni', '갈겨니', '곤충 아님!', ['stream'], 'day', 'swim', 0, 'minnow', { a: '#B8C8B0', stripe: '#6A7A8A' }, '12cm · 어른 손 길이', '물에 떨어진 벌레', '하천 여울', '피라미와 닮았지만 눈 위에 빨간 점이 있어요. 물 위로 떨어진 벌레를 먹으려고 펄쩍 뛰어오르기도 해요.', 'not'],
['dongsari', '동사리', '곤충 아님!', ['stream'], 'night', 'swim', 1, 'minnow', { a: '#6A5A3A', long: true }, '13cm · 어른 손 길이', '작은 물고기, 새우', '하천 돌 밑', '입이 아주 커서 "뚝지"라고도 불러요. 돌 밑에 가만히 숨어 있다가 지나가는 먹이를 꿀꺽 삼켜요. 아빠가 알을 지키며 "구구" 소리를 내요.', 'not'],
['dobsonfly', '뱀잠자리', '뱀잠자리', ['stream'], 'night', 'fly', 2, 'lacewing', { a: '#6B5A3A', eye: '#2A2A2A', wing: '#D8D0C0' }, '6cm · 어른 손가락 길이', '거의 먹지 않아요', '하천가 나무와 불빛 근처', '잠자리가 아니라 풀잠자리 친척이에요. 수컷은 큰 턱이 뱀 이빨처럼 길어요. 밤에 불빛에 날아와요.'],
['hellgrammite', '뱀잠자리 애벌레', '뱀잠자리', ['stream'], 'both', 'crawl', 1, 'nymph', { a: '#4A3A2A' }, '5cm · 어른 엄지손가락보다 커요', '하루살이 애벌레, 작은 물고기', '하천 돌 밑', '물속의 작은 괴물이에요. 배 옆에 가는 아가미가 줄줄이 달려 있어요. 큰 턱으로 꽉 물어서 조심해야 해요. 3년이나 물속에서 살아요.'],
['striped_shrimp', '줄새우', '곤충 아님!', ['stream'], 'both', 'swim', 0, 'shrimp', { a: '#A0B0B0' }, '4cm · 어른 엄지손가락만 해요', '물풀, 죽은 벌레', '하천 물풀 사이', '몸에 가는 줄무늬가 있는 민물새우예요. 긴 집게다리로 먹이를 집어 먹어요. 밤에 더 활발히 돌아다녀요.', 'not'],
['clubtail', '쇠측범잠자리', '잠자리', ['stream'], 'day', 'fly', 1, 'dragonfly', { a: '#2E2A2A', eye: '#2E8B57', wing: '#EAF4FF' }, '5cm · 날개를 펴면 어른 엄지 길이', '작은 날벌레', '하천 자갈밭', '까만 몸에 노란 줄무늬가 호랑이 같아요. 눈이 서로 떨어져 있는 게 특징이에요. 하천가 자갈 위에 앉아 쉬기를 좋아해요.'],
];
const BUGS = RAW.map(r => ({ id: r[0], name: r[1], grp: r[2], place: r[3], time: r[4], move: r[5], rare: r[6], tpl: r[7], opt: r[8], size: r[9], food: r[10], home: r[11], fact: r[12], notInsect: r[13] === 'not' }));
const SIDE = new Set(['hopper', 'mantis', 'rhino', 'stick', 'mayfly', 'caterpillar', 'earwig', 'snail', 'worm', 'anglerfish', 'shrimp', 'grub', 'springtail', 'mole', 'silverfish', 'slug', 'eel', 'fish', 'olm', 'lizard', 'minnow']); // 옆모습 템플릿
