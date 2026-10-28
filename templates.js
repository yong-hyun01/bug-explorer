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
