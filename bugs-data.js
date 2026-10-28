// ======================= 곤충 삽화 템플릿 (도감 삽화풍 SVG) =======================
// 겹눈, 마디 다리, 체절, 날개맥을 갖춘 사실적 구조. 옵션(o)으로 색·무늬를 바꾼다. 옆모습은 오른쪽을 본다.
const OL = '#241C2A';
const dark = (hex, k) => { if (hex[0] !== '#') return hex; const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
const G = (id, a, b, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .38 : cx}" cy="${cy == null ? .32 : cy}" r="${r || .8}"><stop offset="0" stop-color="${dark(a, 1.12)}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${b || dark(a, .5)}"/></radialGradient>`;
const LG = (id, a, b, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const FACET = `<pattern id="fc" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".75" fill="#000" opacity=".35"/></pattern>`;
const HAIR = `<pattern id="hr" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M1 3 L2 0" stroke="#000" stroke-width=".7" opacity=".28"/></pattern>`;
const SW = extra => /stroke-width/.test(extra || '') ? '' : 'stroke-width="2"';
const E = (cx, cy, rx, ry, fill, extra) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${OL}" ${SW(extra)} ${extra || ''}/>`;
const C = (cx, cy, r, fill, extra) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra || ''}/>`;
const P = (d, fill, extra) => `<path d="${d}" fill="${fill}" stroke="${OL}" ${SW(extra)} stroke-linejoin="round" ${extra || ''}/>`;
const L = (d, w, col, extra) => `<path d="${d}" fill="none" stroke="${col || OL}" stroke-width="${w || 3}" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}/>`;
const SHINE = (cx, cy, rx, ry, rot, op) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op == null ? .32 : op}" transform="rotate(${rot == null ? -30 : rot} ${cx} ${cy})"/>`;
const mirror = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${(200 - x).toFixed(1)} ${y}`);
const both = (d, fn) => fn(d) + fn(mirror(d));
const wrap = (defs, body, shift) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>${FACET}${HAIR}${defs}<filter id="sh" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000" flood-opacity=".28"/></filter></defs><g filter="url(#sh)"${shift ? ` transform="translate(0 ${shift})"` : ''}>${body}</g></svg>`;
// 겹눈: 그라데이션 + 낱눈 패턴 + 하이라이트
function ceye(cx, cy, rx, ry, col, rot) {
  const tr = rot ? `transform="rotate(${rot} ${cx} ${cy})"` : '';
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}" stroke="${OL}" stroke-width="1.6" ${tr}/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#fc)" ${tr}/><ellipse cx="${cx - rx * .3}" cy="${cy - ry * .35}" rx="${rx * .3}" ry="${ry * .2}" fill="#fff" opacity=".55" ${tr}/>`;
}
// 마디 다리: 점 배열을 따라 굵기가 줄어드는 마디 + 관절 + 발톱
function leg(pts, col, w0) {
  const w = w0 || 5; let s = '', inner = '';
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
    xs.forEach((x, i) => { const y = 120 - Math.sin(i / 5 * Math.PI) * 14; if (i >= 2 && i <= 4) s += P(`M${x - 7} ${y + 14} C${x - 9} ${y + 26} ${x + 9} ${y + 26} ${x + 7} ${y + 14} Z`, dark(a, .85), 'stroke-width="1.6"'); });
    s += leg([[150, 130], [146, 142], [150, 150]], col, 2.5) + leg([[162, 128], [162, 142], [168, 150]], col, 2.5) + leg([[172, 126], [176, 140], [182, 146]], col, 2.5);
    xs.forEach((x, i) => { const y = 120 - Math.sin(i / 5 * Math.PI) * 14; s += C(x, y, 20, 'url(#cp)', `stroke="${OL}" stroke-width="2"`); s += L(`M${x - 18} ${y - 6} Q${x} ${y - 14} ${x + 18} ${y - 6}`, 1, dark(a, .5), 'opacity=".5"'); s += C(x, y + 8, 1.8, dark(a, .45)); if (o.dots) s += C(x, y - 6, 3.5, o.dots); if (o.bands) s += L(`M${x} ${y - 20} L${x} ${y + 20}`, 3, o.bands); for (let k = 0; k < 3; k++) s += L(`M${x - 10 + k * 10} ${y - 18} l${k - 1} -5`, 1, col, 'opacity=".7"'); });
    s += C(170, 118, 20, o.head || dark(a, .9), `stroke="${OL}" stroke-width="2"`) + L('M170 100 L170 136', 1.2, dark(a, .5), 'opacity=".6"') + SHINE(60, 104, 8, 4);
    if (o.eyespot) s += C(150, 98, 8, '#FFD54A') + C(150, 98, 4, OL) + C(130, 96, 6, '#FFD54A') + C(130, 96, 3, OL);
    if (o.horn) s += L('M40 100 L30 80', 5, o.horn);
    s += [0, 1, 2].map(k => C(178 + k * 2, 112 + k * 4, 1.4, OL)).join('') + L('M176 124 Q182 130 188 126', 2, OL) + antenna('M180 102 L188 92', col, 1.4) + P('M186 124 C190 128 190 132 186 134 L184 126 Z', dark(a, .5));
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
    let s = P('M20 140 C40 100 70 100 90 130 C110 160 140 160 160 120 C170 104 182 100 190 108 L184 118 C176 114 170 120 164 130 C140 170 100 170 80 136 C66 114 50 114 32 146 Z', 'url(#wm)');
    for (let i = 0; i < 26; i++) { const k = i / 26, x = 24 + 160 * k; const y = x < 90 ? 128 - Math.sin((x - 20) / 70 * Math.PI) * 24 : 142 + Math.sin((x - 90) / 80 * Math.PI) * 18; s += L(`M${x} ${y - 6} l0 12`, 1, b, 'opacity=".55"'); }
    s += P('M128 150 C134 140 146 140 152 150 C146 162 134 162 128 150 Z', dark(a, .85), 'stroke-width="1.4"') + SHINE(60, 112, 10, 4, -40, .3);
    return wrap(G('wm', a, b), s);
  },
};

// ======================= 곤충 100종 =======================
// [id, 이름, 종류, 장소[], 시간(day|night|both), 움직임(fly|crawl|hop|swim|glide), 희귀도(0~2), 템플릿, 옵션, 크기, 먹이, 사는 곳, 재미있는 사실, 추가플래그]
const RAW = [
// ---- 딱정벌레 ----
['ladybug', '칠성무당벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 0, 'beetle', { a: '#FF7A6B', b: '#C62828', shape: 'round', head: '#1E1A26', pron: '#1E1A26', cheeks: true, spots: [[72, 92, 9], [128, 92, 9], [64, 128, 8], [136, 128, 8], [100, 128, 10], [86, 155, 6], [114, 155, 6]] }, '0.7cm · 새끼손톱만 해요', '진딧물', '풀잎과 꽃 위', '빨간 등의 까만 점 7개는 "나는 맛없어!" 하고 새에게 알려 주는 표시예요. 겨울에는 친구들과 모여 함께 잠을 자요.'],
['ladybug2', '꼬마남생이무당벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#FFD54A', b: '#E09B00', shape: 'round', head: '#1E1A26', pron: '#1E1A26', cheeks: true, spots: [[76, 96, 7], [124, 96, 7], [66, 130, 6], [134, 130, 6], [100, 132, 7], [88, 156, 5], [112, 156, 5]] }, '0.4cm · 깨알 두 개 크기', '진딧물', '풀잎 위', '무당벌레 중에서 가장 작은 편이에요. 등 무늬가 거북이(남생이) 등딱지를 닮았어요.'],
['ladybug28', '이십팔점박이무당벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#E09B5A', b: '#9A5A1E', shape: 'round', head: '#6B3B1E', pron: '#6B3B1E', spots: [[70, 90, 5], [84, 84, 5], [100, 88, 5], [116, 84, 5], [130, 90, 5], [64, 112, 5], [82, 108, 5], [118, 108, 5], [136, 112, 5], [74, 134, 5], [100, 128, 5], [126, 134, 5], [86, 154, 5], [114, 154, 5]] }, '0.7cm · 새끼손톱만 해요', '감자 잎, 가지 잎', '밭의 채소 잎', '점이 28개나 있어요! 다른 무당벌레와 달리 채소 잎을 먹어서 농부 아저씨가 싫어해요.'],
['rhino', '장수풍뎅이', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'rhino', { a: '#8B5A2B', horn: 'big' }, '5cm · 어른 엄지손가락보다 커요', '나무 수액', '참나무 숲', '곤충 중에서 힘이 가장 세요. 자기 몸무게의 100배를 들 수 있어서 "곤충의 왕"이라고 불러요. 뿔은 수컷만 있어요.'],
['rhino_f', '장수풍뎅이 암컷', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'rhino', { a: '#6B4420', horn: 'none' }, '4.5cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '암컷은 뿔이 없고 등에 짧은 털이 있어요. 썩은 나무나 낙엽 속에 알을 낳아요.'],
['stag', '넓적사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'beetle', { a: '#6B3B1E', shape: 'oval', jaws: true }, '5cm · 어른 엄지손가락보다 커요', '나무 수액', '참나무 숲', '큰 턱이 사슴의 뿔을 닮아서 사슴벌레예요. 수컷끼리 턱으로 씨름을 해서 나무에서 밀어내요.'],
['stag_saw', '톱사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'beetle', { a: '#9A4A1E', shape: 'oval', jaws: true }, '4cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '턱 안쪽이 톱니처럼 울퉁불퉁해요. 몸이 불그스름한 갈색이라 다른 사슴벌레와 구별하기 쉬워요.'],
['stag_king', '왕사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'beetle', { a: '#2B1A14', shape: 'oval', jaws: true, head: '#1E1A26', pron: '#1E1A26' }, '7cm · 어른 손가락 길이', '나무 수액', '참나무 숲', '우리나라 사슴벌레 중 가장 크고 오래 살아요. 어른 벌레로 3년이나 살 수 있어요.'],
['stag_f', '사슴벌레 암컷', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'beetle', { a: '#4A2A14', shape: 'oval' }, '3.5cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '암컷은 턱이 작지만 힘은 아주 세요. 썩은 나무를 갉아서 알을 낳을 자리를 만들어요.'],
['longhorn', '알락하늘소', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#5B8DEF', b: '#1E3F9A', shape: 'long', antLong: true, head: '#1E1A26', pron: '#2A4AA8', spots: [[86, 110, 5, '#fff'], [114, 110, 5, '#fff'], [82, 136, 5, '#fff'], [118, 136, 5, '#fff'], [92, 160, 5, '#fff'], [108, 160, 5, '#fff'], [100, 100, 5, '#fff']] }, '3cm · 어른 엄지손가락만 해요', '나무, 꽃가루', '숲속 나무', '더듬이가 자기 몸보다 길어요. 잡으면 "끼익끼익" 소리를 내서 깜짝 놀라게 해요.'],
['longhorn2', '뽕나무하늘소', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#6B4E2E', shape: 'long', antLong: true, spots: [[84, 112, 4, '#F3E7C3'], [116, 112, 4, '#F3E7C3'], [86, 140, 4, '#F3E7C3'], [114, 140, 4, '#F3E7C3']] }, '4cm · 어른 엄지손가락만 해요', '뽕나무 잎', '뽕나무', '애벌레가 뽕나무 속을 파고 다녀요. 어른이 되면 뽕나무 잎과 껍질을 갉아 먹어요.'],
['scarab', '풍뎅이', '딱정벌레', ['forest'], 'day', 'crawl', 0, 'beetle', { a: '#3FAE5A', b: '#1F6B2E', shape: 'oval', head: '#1F6B2E', pron: '#2E8B57', antClub: true }, '2cm · 콩알 세 개 크기', '나뭇잎', '숲과 들판', '등이 보석처럼 초록빛으로 반짝여요. 햇빛을 받으면 금색으로도 보여요.'],
['scarab_gold', '왕풍뎅이', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'beetle', { a: '#B08A4A', b: '#6B4E1E', shape: 'oval', stripes: 3, antClub: true }, '3cm · 어른 엄지손가락만 해요', '나뭇잎', '숲', '밤에 불빛을 보고 날아와요. 풍뎅이 중에서 몸집이 큰 편이에요.'],
['flower_chafer', '흰점박이꽃무지', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#6B7A3A', b: '#3A4A1E', shape: 'oval', spots: [[80, 110, 4, '#fff'], [120, 110, 4, '#fff'], [74, 136, 4, '#fff'], [126, 136, 4, '#fff'], [88, 158, 4, '#fff'], [112, 158, 4, '#fff']], antClub: true }, '2.5cm · 콩알 네 개 크기', '꽃가루, 과일즙', '꽃과 과일나무', '애벌레는 "굼벵이"라고 불러요. 등으로 기어 다니는 재미있는 습관이 있어요.'],
['dung', '쇠똥구리', '딱정벌레', ['meadow'], 'day', 'crawl', 2, 'beetle', { a: '#3A3A44', b: '#1E1A26', shape: 'round', head: '#1E1A26', pron: '#2E2A33' }, '1.5cm · 콩알 두 개 크기', '동물의 똥', '소와 말이 사는 풀밭', '동물의 똥을 동그랗게 뭉쳐서 굴려 가요. 공처럼 만든 똥 속에 알을 낳아요.'],
['tiger_beetle', '길앞잡이', '딱정벌레', ['forest'], 'day', 'crawl', 1, 'beetle', { a: '#2EA86B', b: '#1C5E8B', shape: 'long', head: '#C0392B', pron: '#1C5E8B', spots: [[84, 120, 4, '#F3E7C3'], [116, 120, 4, '#F3E7C3'], [88, 150, 4, '#F3E7C3'], [112, 150, 4, '#F3E7C3']] }, '2cm · 콩알 세 개 크기', '작은 벌레', '산길과 흙길', '사람이 걸어가면 앞에서 조금씩 날아가며 길을 안내하는 것 같아서 길앞잡이예요.'],
['jewel', '비단벌레', '딱정벌레', ['forest'], 'day', 'crawl', 2, 'beetle', { a: '#2ECC71', b: '#117A65', shape: 'long', pron: '#C0392B', head: '#117A65', split: false, stripes: 2, stripeColor: '#C0392B' }, '3.5cm · 어른 엄지손가락만 해요', '팽나무 잎', '남쪽 지방의 숲', '날개가 무지갯빛 비단처럼 반짝여요. 옛날에는 이 날개로 왕의 장식품을 만들었어요.'],
['divingbeetle', '물방개', '딱정벌레', ['pond'], 'both', 'swim', 1, 'waterbeetle', { a: '#6FBF5A', edge: '#E0C050' }, '3.5cm · 어른 엄지손가락만 해요', '올챙이, 작은 물고기', '연못 속', '물속에서 살지만 숨을 쉬러 올라와요. 엉덩이에 공기 방울을 달고 잠수해요.'],
['water_scav', '물땡땡이', '딱정벌레', ['pond'], 'both', 'swim', 1, 'waterbeetle', { a: '#2E2A33' }, '4cm · 어른 엄지손가락만 해요', '물풀', '연못 속', '물방개와 닮았지만 등이 까맣고 매끈해요. 배에 공기를 저장해 은색으로 반짝여요.'],
['weevil', '바구미', '딱정벌레', ['yard'], 'day', 'crawl', 0, 'beetle', { a: '#8A6A4A', shape: 'oval', head: '#5A3E1E', horn: '#5A3E1E' }, '0.5cm · 쌀알만 해요', '곡식, 나뭇잎', '풀밭과 창고', '코끼리처럼 긴 주둥이가 있어요. 주둥이 끝에 입이 달려 있어 열매에 구멍을 뚫어요.'],
['click', '방아벌레', '딱정벌레', ['meadow'], 'day', 'crawl', 1, 'beetle', { a: '#7A5A3A', shape: 'long' }, '1.5cm · 콩알 두 개 크기', '나뭇잎', '풀밭과 숲', '뒤집어 놓으면 "딱!" 소리를 내며 공중으로 튀어 올라 몸을 바로 세워요.'],
['firefly', '반딧불이', '딱정벌레', ['pond'], 'night', 'fly', 2, 'firefly', {}, '1cm · 콩알만 해요', '이슬, 달팽이(애벌레)', '깨끗한 냇가와 숲', '배 끝에서 노란 빛을 내요. 뜨겁지 않은 차가운 빛이에요. 깜빡이는 빛으로 친구에게 인사를 해요.'],
['firefly2', '늦반딧불이', '딱정벌레', ['forest'], 'night', 'fly', 2, 'firefly', { pron: '#F39C12' }, '1.5cm · 콩알 두 개 크기', '달팽이(애벌레)', '산골 마을의 풀밭', '가을이 되어야 나오는 반딧불이예요. 암컷은 날개가 없어서 풀 위에서 빛을 내며 수컷을 기다려요.'],
['darkling', '거저리', '딱정벌레', ['yard'], 'night', 'crawl', 0, 'beetle', { a: '#2E2A33', shape: 'long', split: false }, '1.5cm · 콩알 두 개 크기', '곡식 가루', '창고와 집 근처', '애벌레는 "밀웜"이라고 불러요. 새와 도마뱀이 아주 좋아하는 먹이예요.'],
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
['termite', '흰개미', '흰개미', ['yard'], 'both', 'crawl', 1, 'ant', { a: '#F3E7C3', head: '#D9A066' }, '0.5cm · 쌀알만 해요', '나무', '썩은 나무 속', '개미와 닮았지만 사실 바퀴의 친척이에요. 나무를 먹어서 오래된 집을 갉아 먹기도 해요.'],
// ---- 메뚜기 무리 ----
['grasshopper', '메뚜기', '메뚜기', ['meadow'], 'day', 'hop', 0, 'hopper', {}, '3.5cm · 어른 엄지손가락만 해요', '풀잎, 벼', '풀밭과 논', '뒷다리가 아주 튼튼해서 자기 몸 길이의 20배나 멀리 뛸 수 있어요. 귀가 배에 달려 있답니다.'],
['rice_hopper', '벼메뚜기', '메뚜기', ['meadow'], 'day', 'hop', 0, 'hopper', { a: '#A8C84A', wing: '#8A6A3A', bands: true }, '3cm · 어른 엄지손가락만 해요', '벼 잎', '논', '가을 논에서 많이 보여요. 옛날에는 잡아서 구워 먹기도 했대요.'],
['locust', '풀무치', '메뚜기', ['meadow'], 'day', 'hop', 1, 'hopper', { a: '#8FBF5A', wing: '#B08A4A', long: true, bands: true }, '6cm · 어른 손가락 길이', '풀잎', '넓은 풀밭', '메뚜기 중에서 가장 커요. 친구들이 아주 많이 모이면 멀리까지 함께 날아가요.'],
['katydid', '방아깨비', '메뚜기', ['meadow'], 'day', 'hop', 1, 'hopper', { a: '#B7E36B', long: true }, '7cm · 어른 손가락 길이', '풀잎', '키 큰 풀밭', '뒷다리를 잡으면 방아를 찧듯 몸을 위아래로 끄덕끄덕 움직여서 방아깨비라고 불러요.'],
['bushcricket', '여치', '메뚜기', ['meadow'], 'day', 'hop', 1, 'hopper', { a: '#7CC24A', antLong: true, ovip: true }, '4cm · 어른 엄지손가락만 해요', '작은 벌레, 풀잎', '풀숲', '"찌르르" 하고 울어요. 더듬이가 몸보다 길고 암컷은 꼬리에 긴 칼 같은 알 낳는 관이 있어요.'],
['katydid2', '베짱이', '메뚜기', ['meadow'], 'night', 'hop', 1, 'hopper', { a: '#9BE05C', antLong: true, long: true, wing: '#B7E36B' }, '4cm · 어른 엄지손가락만 해요', '풀잎', '풀숲', '밤에 "쓰익쩍" 하고 노래해요. 개미와 베짱이 이야기의 주인공이에요.'],
['cricket', '귀뚜라미', '메뚜기', ['yard'], 'night', 'hop', 0, 'hopper', { a: '#8A5A2B', wing: '#A86E3A', antLong: true, cerci: true, head: '#6B4420' }, '2cm · 콩알 세 개 크기', '풀잎, 작은 벌레', '돌 밑과 풀숲', '귀뚤귀뚤 소리는 날개를 서로 비벼서 내요. 날씨가 따뜻할수록 더 빨리 울어요.'],
['molecricket', '땅강아지', '메뚜기', ['yard'], 'night', 'crawl', 1, 'hopper', { a: '#8A6A4A', wing: '#6B4E2E', hump: true, cerci: true }, '3cm · 어른 엄지손가락만 해요', '뿌리, 작은 벌레', '땅속 굴', '앞다리가 두더지 손처럼 생겨서 땅을 파요. 땅속에서 "비이이" 하고 울어요.'],
['camel_cricket', '꼽등이', '메뚜기', ['yard'], 'night', 'hop', 1, 'hopper', { a: '#A08060', wing: '#8A6A4A', hump: true, antLong: true }, '2cm · 콩알 세 개 크기', '뭐든지 조금씩', '어둡고 축축한 곳', '등이 낙타처럼 굽어서 꼽등이예요. 날개가 없고 울지도 못하지만 아주 높이 뛰어요.'],
// ---- 사마귀 ----
['mantis', '사마귀', '사마귀', ['meadow'], 'day', 'crawl', 1, 'mantis', {}, '8cm · 어른 손가락 길이', '다른 곤충', '풀밭과 나무 위', '앞다리가 낫처럼 생겨서 먹이를 번개처럼 빠르게 낚아채요. 고개를 돌려 뒤를 볼 수 있는 유일한 곤충이에요.'],
['mantis_big', '왕사마귀', '사마귀', ['forest'], 'day', 'crawl', 2, 'mantis', { a: '#7CC24A' }, '9cm · 어른 손바닥 길이', '다른 곤충', '풀밭', '우리나라에서 가장 큰 사마귀예요. 가을에 거품 같은 알집을 만들어 겨울을 나요.'],
['mantis_brown', '갈색사마귀', '사마귀', ['meadow'], 'day', 'crawl', 1, 'mantis', { a: '#C8A46A' }, '7cm · 어른 손가락 길이', '다른 곤충', '마른 풀밭', '마른 풀 색깔이라 가을 풀밭에서 숨기 좋아요. 사마귀는 몸 색이 초록도 갈색도 있어요.'],
// ---- 잠자리 ----
['dragonfly', '된장잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#D9A066', eye: '#8B6B3C' }, '5cm · 날개를 펴면 어른 엄지 길이', '모기, 파리', '연못과 들판', '된장 색이라 된장잠자리예요. 바다를 건너 아주 먼 나라까지 날아가는 여행가예요.'],
['red_dragonfly', '고추잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#E53935', eye: '#C0392B' }, '5cm · 날개를 펴면 어른 엄지 길이', '모기, 파리', '연못과 논', '가을 하늘을 빨갛게 수놓아요. 수컷만 고추처럼 빨갛고 암컷은 노란빛이에요.'],
['emperor', '왕잠자리', '잠자리', ['pond'], 'day', 'fly', 2, 'dragonfly', { a: '#3B82F6', eye: '#2ECC71' }, '8cm · 어른 손가락 길이', '나비, 파리', '큰 연못', '잠자리 중에서 가장 크고 빨라요. 눈이 아주 커서 거의 모든 방향을 한 번에 볼 수 있어요.'],
['skimmer', '밀잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#9FC4FF', eye: '#5A9A5A' }, '5cm · 날개를 펴면 어른 엄지 길이', '작은 벌레', '연못과 냇가', '수컷은 몸에 하얀 가루가 덮여 있어 밀가루 같아요. 물가 돌 위에 앉아 쉬는 걸 좋아해요.'],
['damselfly', '실잠자리', '잠자리', ['pond'], 'day', 'fly', 0, 'dragonfly', { a: '#5B8DEF', eye: '#4FA8FF', folded: true, thin: true }, '3cm · 어른 엄지손가락만 해요', '작은 벌레', '연못가 풀잎', '잠자리보다 몸이 실처럼 가늘어요. 앉을 때 날개를 등 위로 모아서 접어요.'],
['jewelwing', '물잠자리', '잠자리', ['pond'], 'day', 'fly', 1, 'dragonfly', { a: '#1ABC9C', eye: '#117A65', folded: true, thin: true, wing: '#2B2340', wingOp: .85 }, '6cm · 어른 손가락 길이', '작은 벌레', '맑은 냇가', '날개가 까맣고 몸이 금속처럼 초록으로 반짝여요. 나비처럼 팔랑팔랑 날아요.'],
['lacewing', '풀잠자리', '풀잠자리', ['meadow'], 'night', 'fly', 1, 'lacewing', {}, '2cm · 콩알 세 개 크기', '진딧물', '풀밭과 정원', '날개가 레이스처럼 투명해요. 애벌레는 진딧물을 아주 많이 먹어서 농부의 친구예요.'],
['antlion', '명주잠자리', '풀잠자리', ['meadow'], 'night', 'fly', 2, 'lacewing', { a: '#8B6B4A', eye: '#5A3E1E', wing: '#F0EAE0' }, '4cm · 어른 엄지손가락만 해요', '작은 벌레', '모래가 있는 풀밭', '애벌레는 "개미귀신"이에요. 모래에 깔때기 함정을 파고 개미가 빠지길 기다려요.'],
// ---- 노린재·물속 노린재 ----
['stinkbug', '풀색노린재', '노린재', ['meadow'], 'day', 'crawl', 0, 'shield', {}, '1.5cm · 콩알 두 개 크기', '식물의 즙', '풀잎과 열매', '위험하면 고약한 냄새를 뿜어서 적을 쫓아내요. 그래서 "방귀벌레"라는 별명도 있어요.'],
['brown_stink', '썩덩나무노린재', '노린재', ['yard'], 'day', 'crawl', 0, 'shield', { a: '#A08060', sc: '#8A6A4A' }, '1.7cm · 콩알 두 개 크기', '과일즙', '과일나무', '갈색 몸에 얼룩무늬가 있어요. 가을이 되면 집 안으로 들어와 겨울잠을 자려고 해요.'],
['jewel_bug', '광대노린재', '노린재', ['forest'], 'day', 'crawl', 2, 'shield', { a: '#1ABC9C', sc: '#E53935', spots: [[70, 100, 5, '#F2C14E'], [130, 100, 5, '#F2C14E'], [84, 146, 5, '#2B2340'], [116, 146, 5, '#2B2340']] }, '2cm · 콩알 세 개 크기', '나무 열매 즙', '남쪽 숲', '광대 옷처럼 알록달록 금속빛으로 반짝여요. 우리나라에서 가장 예쁜 노린재예요.'],
['strider', '소금쟁이', '노린재', ['pond'], 'day', 'swim', 0, 'strider', {}, '1.5cm · 콩알 두 개 크기', '물에 떨어진 벌레', '잔잔한 물 위', '다리에 아주 가는 털이 많아서 물에 빠지지 않고 물 위를 미끄러지듯 걸어요.'],
['waterbug', '물장군', '노린재', ['pond'], 'both', 'swim', 2, 'waterbug', {}, '6cm · 어른 손가락 길이', '물고기, 개구리', '연못 속', '물속의 장군이에요. 아빠 물장군이 알을 등에 지고 다니며 부화할 때까지 지켜요.'],
['waterbug2', '물자라', '노린재', ['pond'], 'both', 'swim', 1, 'waterbug', { a: '#8A6A4A', small: true, eggs: true }, '2cm · 콩알 세 개 크기', '올챙이, 작은 벌레', '연못 속', '아빠가 등에 알을 업고 다녀요. 알이 숨을 쉬도록 물 위로 등을 내밀어 줘요.'],
['waterscorpion', '게아재비', '노린재', ['pond'], 'day', 'swim', 1, 'waterscorpion', {}, '4cm · 어른 엄지손가락만 해요', '올챙이, 작은 벌레', '연못 속 물풀', '꼬리처럼 긴 관을 물 밖으로 내밀어 숨을 쉬어요. 가늘어서 물속 나뭇가지처럼 보여요.'],
['waterscorpion2', '장구애비', '노린재', ['pond'], 'day', 'swim', 1, 'waterscorpion', { a: '#6B4E2E', wide: true }, '3.5cm · 어른 엄지손가락만 해요', '작은 물고기', '연못 바닥', '몸이 납작하고 넓적해요. 낙엽처럼 바닥에 숨어 있다가 앞다리로 먹이를 잡아요.'],
['aphid', '진딧물', '노린재', ['meadow'], 'day', 'crawl', 0, 'shield', { a: '#B7E36B', sc: '#9BD24A', spots: [] }, '0.2cm · 깨알보다 작아요', '식물의 즙', '새싹과 꽃봉오리', '개미에게 달콤한 단물을 주고 대신 보호를 받아요. 무당벌레가 가장 좋아하는 먹이예요.'],
// ---- 매미 ----
['cicada', '참매미', '매미', ['forest'], 'day', 'glide', 0, 'cicada', {}, '4cm · 어른 엄지손가락만 해요', '나무 수액', '나무 줄기', '땅속에서 7년이나 애벌레로 살다가 나와서 딱 한 달만 노래해요. 맴맴 소리는 수컷이 배를 떨어서 내는 거예요.'],
['cicada_black', '말매미', '매미', ['yard'], 'day', 'glide', 0, 'cicada', { a: '#2E2A33', h: '#1E1A26' }, '6cm · 어른 손가락 길이', '나무 수액', '도시의 가로수', '우리나라에서 가장 큰 매미예요. "차르르르" 하고 아주 크게 울어서 여름 도시를 시끄럽게 해요.'],
['cicada_brown', '유지매미', '매미', ['forest'], 'day', 'glide', 1, 'cicada', { a: '#8B6B4A', h: '#5A3E1E', wing: '#8B6B4A', wingOp: .8 }, '5cm · 날개를 펴면 어른 엄지 길이', '나무 수액', '숲속 나무', '날개가 기름종이처럼 갈색이라 유지매미예요. "지글지글" 기름 끓는 소리처럼 울어요.'],
// ---- 파리·모기 ----
['housefly', '집파리', '파리', ['yard'], 'day', 'fly', 0, 'fly', {}, '0.7cm · 새끼손톱만 해요', '음식 찌꺼기', '집 근처', '발로 맛을 봐요! 발에 맛을 느끼는 털이 있어서 음식 위를 걸으며 맛을 확인해요.'],
['hoverfly', '꽃등에', '파리', ['yard'], 'day', 'fly', 0, 'fly', { a: '#F2C14E', stripes: '#2B2340', th: '#8A5A2B', eye: '#8B2B1E' }, '1.2cm · 콩알 두 개 크기', '꽃가루와 꿀', '꽃밭', '벌처럼 생겼지만 침이 없는 파리예요. 헬리콥터처럼 공중에 가만히 떠 있을 수 있어요.'],
['mosquito', '모기', '파리', ['pond'], 'night', 'fly', 0, 'fly', { a: '#6B6B7A', slim: true, eye: '#1E1A26' }, '0.5cm · 쌀알만 해요', '꽃의 꿀, 피(암컷)', '물가와 집 근처', '피를 빠는 건 알을 낳으려는 엄마 모기뿐이에요. 아빠 모기는 꽃의 꿀만 먹어요.'],
['horsefly', '등에', '파리', ['meadow'], 'day', 'fly', 1, 'fly', { a: '#6B5A3A', eye: '#2ECC71' }, '2cm · 콩알 세 개 크기', '꽃의 꿀, 피(암컷)', '소와 말이 있는 풀밭', '눈이 초록·무지개빛으로 반짝여요. 소와 말을 따라다니며 괴롭히는 큰 파리예요.'],
['fruitfly', '초파리', '파리', ['yard'], 'both', 'fly', 0, 'fly', { a: '#D9A066', eye: '#E53935' }, '0.3cm · 깨알만 해요', '익은 과일', '과일 바구니 근처', '아주 작지만 과학자들이 가장 많이 연구하는 곤충이에요. 빨간 눈이 특징이에요.'],
// ---- 그 밖의 곤충 ----
['stick', '대벌레', '대벌레', ['forest'], 'day', 'crawl', 1, 'stick', {}, '10cm · 어른 손바닥 길이', '나뭇잎', '나뭇가지 사이', '나뭇가지랑 똑같이 생겨서 숨바꼭질 달인이에요. 가만히 있으면 새도 못 찾아요.'],
['mayfly', '하루살이', '하루살이', ['pond'], 'both', 'fly', 0, 'mayfly', {}, '1.5cm · 콩알 두 개 크기', '먹지 않아요', '냇가와 연못 위', '어른이 되면 하루나 이틀밖에 못 살아서 하루살이예요. 입이 없어서 아무것도 먹지 않아요.'],
['earwig', '집게벌레', '집게벌레', ['yard'], 'night', 'crawl', 0, 'earwig', {}, '2cm · 콩알 세 개 크기', '작은 벌레, 썩은 잎', '돌 밑과 화분 밑', '꼬리에 집게가 달려 있어요. 엄마 집게벌레는 알과 아기를 정성껏 돌봐 주는 좋은 엄마예요.'],
['roach', '바퀴', '바퀴', ['yard'], 'night', 'crawl', 0, 'roach', {}, '3cm · 어른 엄지손가락만 해요', '뭐든지', '어둡고 따뜻한 곳', '공룡보다 먼저 지구에 살았어요. 머리가 없어도 일주일이나 살 수 있는 튼튼한 곤충이에요.'],
['caddisfly', '날도래', '날도래', ['pond'], 'night', 'fly', 1, 'moth', { a: '#A08060', body: '#6B4E2E', eyespot: false, feather: false, lo: '#8A6A4A' }, '2cm · 콩알 세 개 크기', '먹지 않아요', '맑은 냇가', '애벌레가 모래알과 나뭇조각으로 자기 집을 만들어 등에 지고 다녀요.'],
['stonefly', '강도래', '강도래', ['pond'], 'day', 'crawl', 1, 'lacewing', { a: '#6B5A3A', eye: '#2B2340', wing: '#E8E0D0' }, '2.5cm · 콩알 네 개 크기', '작은 벌레', '맑은 냇가 돌 밑', '깨끗한 물에서만 살아요. 강도래가 있으면 그 냇물이 아주 깨끗하다는 뜻이에요.'],
// ---- 애벌레 ----
['cabbage_cat', '배추벌레', '나비 애벌레', ['yard'], 'day', 'crawl', 0, 'caterpillar', { a: '#9BE05C', dots: '#F2C14E' }, '3cm · 어른 엄지손가락만 해요', '배추 잎', '배추밭', '배추흰나비의 애벌레예요. 배추 잎을 먹고 자라서 번데기가 되고 하얀 나비가 돼요.'],
['swallow_cat', '호랑나비 애벌레', '나비 애벌레', ['forest'], 'day', 'crawl', 1, 'caterpillar', { a: '#7CC24A', eyespot: true, bands: '#2B2340' }, '5cm · 날개를 펴면 어른 엄지 길이', '귤나무 잎, 산초나무 잎', '귤나무', '머리에 뱀 눈 같은 무늬가 있어요. 건드리면 주황색 뿔을 쑥 내밀고 냄새를 뿜어요.'],
['silkworm', '누에', '나비 애벌레', ['yard'], 'day', 'crawl', 1, 'caterpillar', { a: '#F3E7C3', head: '#D9C58F', horn: '#8A6A4A' }, '6cm · 어른 손가락 길이', '뽕나무 잎', '누에 상자', '뽕잎을 먹고 자라 하얀 실로 고치를 만들어요. 고치 하나에서 1,500m나 되는 실이 나와요.'],
// ---- 곤충이 아닌 친구들 ----
['spider', '무당거미', '곤충 아님!', ['forest'], 'both', 'crawl', 1, 'spider', { a: '#F2C14E', bands: '#2B2340', mark: '#E53935' }, '2.5cm · 콩알 네 개 크기', '거미줄에 걸린 벌레', '나뭇가지 사이 큰 거미줄', '거미는 곤충이 아니에요! 곤충은 다리가 6개인데 거미는 8개예요. 날개도 더듬이도 없답니다.', 'not'],
['jumping_spider', '깡충거미', '곤충 아님!', ['yard'], 'day', 'hop', 0, 'spider', { a: '#5A4A6E', bigEyes: true, fat: true }, '0.8cm · 새끼손톱만 해요', '작은 벌레', '벽과 나뭇잎', '거미줄 대신 폴짝 뛰어서 먹이를 잡아요. 큰 눈 두 개로 사람을 빤히 쳐다보기도 해요.', 'not'],
['snail', '달팽이', '곤충 아님!', ['yard'], 'both', 'crawl', 0, 'snail', {}, '3cm · 어른 엄지손가락만 해요', '잎, 이끼', '축축한 풀숲', '달팽이는 곤충이 아니라 조개의 친척이에요. 등에 진 집은 몸이 자라면 같이 커져요.', 'not'],
['centipede', '지네', '곤충 아님!', ['forest'], 'night', 'crawl', 1, 'centipede', {}, '8cm · 어른 손가락 길이', '작은 벌레', '돌 밑과 낙엽 속', '다리가 아주 많아요! 곤충은 다리가 6개지만 지네는 40개가 넘어요. 물 수 있으니 만지면 안 돼요.', 'not'],
['pillbug', '공벌레', '곤충 아님!', ['yard'], 'both', 'crawl', 0, 'pillbug', {}, '1cm · 콩알만 해요', '썩은 잎', '화분 밑과 돌 밑', '건드리면 공처럼 동그랗게 말려요. 곤충이 아니라 새우와 게의 친척이에요.', 'not'],
['earthworm', '지렁이', '곤충 아님!', ['yard'], 'both', 'crawl', 0, 'worm', {}, '10cm · 어른 손바닥 길이', '흙 속 썩은 잎', '축축한 흙 속', '다리도 눈도 없어요. 흙을 먹고 똥으로 내보내서 땅을 기름지게 만드는 고마운 친구예요.', 'not'],
// ---- 추가: 사슴벌레 무리 ----
['stag_true', '사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'beetle', { a: '#5A3A1E', shape: 'oval', jaws: 'long' }, '4.5cm · 어른 엄지손가락만 해요', '나무 수액', '참나무 숲', '큰턱이 길고 가늘며 안쪽에 작은 이빨이 있어요. 사슴뿔을 가장 닮아서 이름이 "사슴벌레"가 되었어요.'],
['stag_small', '애사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'beetle', { a: '#3A2A1E', shape: 'oval', jaws: 'long' }, '2.5cm · 콩알 네 개 크기', '나무 수액', '참나무 숲', '우리나라에서 가장 흔한 사슴벌레예요. 몸은 작지만 큰턱은 길쭉하고, 낮에도 가끔 돌아다녀요.'],
['stag_redleg', '홍다리사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'beetle', { a: '#2E2A33', leg: '#C0392B', shape: 'oval', jaws: 'long' }, '3.5cm · 어른 엄지손가락만 해요', '버드나무 수액', '물가의 버드나무 숲', '다리가 붉은색이라 홍다리사슴벌레예요. 다른 사슴벌레와 달리 버드나무를 좋아해요.'],
['stag_twospot', '두점박이사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 2, 'beetle', { a: '#C9A227', shape: 'oval', jaws: 'long', head: '#8A6A1E', spots: [[82, 96, 4], [118, 96, 4]] }, '4cm · 어른 엄지손가락만 해요', '나무 수액', '제주도의 숲', '등에 까만 점이 두 개 있어요. 제주도에서만 사는 아주 귀한 사슴벌레라 보호하고 있어요.'],
['stag_mini', '꼬마넓적사슴벌레', '딱정벌레', ['forest'], 'night', 'crawl', 1, 'beetle', { a: '#2B1A14', shape: 'oval', jaws: 'wide' }, '2cm · 콩알 세 개 크기', '나무 수액', '썩은 나무 속', '넓적사슴벌레를 작게 줄여 놓은 모습이에요. 썩은 나무 속에서 여러 마리가 함께 살아요.'],
// ---- 추가: 연못 ----
['whirligig', '물매암이', '딱정벌레', ['pond'], 'day', 'swim', 0, 'waterbeetle', { a: '#2E2A33', edge: '#5A5A6A' }, '0.7cm · 새끼손톱만 해요', '물에 떨어진 벌레', '잔잔한 물 위', '물 위를 빙글빙글 맴돌아요. 눈이 위아래 둘로 나뉘어 있어 물 위와 물속을 동시에 볼 수 있어요.'],
['backswimmer', '송장헤엄치개', '노린재', ['pond'], 'both', 'swim', 1, 'waterbug', { a: '#8A8A6A', small: true }, '1.2cm · 콩알 두 개 크기', '작은 벌레, 올챙이', '연못 속', '배를 위로 하고 거꾸로 헤엄쳐요. 노처럼 긴 뒷다리로 물을 저어 빠르게 움직여요.'],
];
const BUGS = RAW.map(r => ({ id: r[0], name: r[1], grp: r[2], place: r[3], time: r[4], move: r[5], rare: r[6], tpl: r[7], opt: r[8], size: r[9], food: r[10], home: r[11], fact: r[12], notInsect: r[13] === 'not' }));
const SIDE = new Set(['hopper', 'mantis', 'rhino', 'stick', 'mayfly', 'caterpillar', 'earwig', 'snail', 'worm']); // 옆모습 템플릿
