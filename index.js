// Grimpette : une petite voiture sur des collines sans fin : va le plus loin possible.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Grimpette</span><span class="hint">Garage : ↑ ↓ choisir, ← → changer, Entrée · Course : → accélérer, ← freiner, Espace : nitro · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="grCanvas" width="240" height="150" role="img" aria-label="Grimpette"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="grStats"></div></div>
      <div class="row"><button class="btn main" id="grNew">NOUVELLE PARTIE</button><button class="btn" id="grFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Au garage, choisis le terrain et la voiture, et améliore-la avec tes pièces avant de partir : moteur, pneus, réservoir. Les autres terrains (désert, neige, lune) et voitures (Monster, Bolide) se débloquent avec les pièces. En course : → accélère, ← freine, Espace (ou Maj) lance le nitro ; en l'air, → lève le nez et ← le baisse. Les tremplins font décoller : le temps passé en l'air, les saltos et les atterrissages sur les deux roues rapportent des pièces et remplissent le nitro. Si le toit touche le sol, c'est fini. Attrape les bidons rouges pour refaire le plein. Un salto rapporte 10 pièces.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:max(260px,min(calc(100vh - 190px),calc((100vw - 140px) / var(--ar,1.6)),900px));width:auto;aspect-ratio:var(--ar,1.6);image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{height:min(100vh,calc(100vw / var(--ar,1.6)))}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "GRIMPETTE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#d83a3a", "accL": "#ffc0b0", "accS": "#a82a2a", "accD": "#3a0e0e", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#3a0e0e", "spark2": "#d83a3a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "....kkkk....", "...kwwwwk...", "..kwbbkbwk..", "kkkkkkkkkkkk", "krrrrrrrrrrk", "krrrrrrrryyk", "kkkkkkkkkkkk", ".kkk....kkk.", "kmmmk..kmmmk", ".kkk....kkk.", "nnnnnnnnnnnn"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; st.onStop?.(); return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Grimpette : une petite voiture sur des collines sans fin. Avant de partir, au garage : le terrain, la voiture et ses améliorations.
   → accélère, ← freine et recule ; en l'air, → lève le nez et ← le baisse. Si le toit touche le sol ou s'il n'y a plus d'essence, c'est fini ---------- */
const GR = {W: 240, H: 150, HUD: 12, PXM: 10};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
// les terrains : forme des collines (f : étirement, amp : hauteur max), gravité g, roulement roll (sable et boue freinent, bitume et glace roulent), air (1 : pas d'air), adhérence ; les trois premiers se débloquent avec les pièces
const GR_TERR = [
  {id: 'prairie', name: 'Prairie', price: 0, f: 1, amp: 38, g: .12, roll: .995, air: .999, grip: 1, sky: ['#5a8ad8', '#7aa8e8', '#9ac0f0'], hill: '#5a9a6a', grass: '#5ac03a', grass2: '#3a8a2a', dirt: '#8a5a32', dirt2: '#7a4a28', deco: 'tree'},
  {id: 'desert', name: 'Désert', price: 150, f: 1.8, amp: 52, g: .12, roll: .986, air: .999, grip: .9, sky: ['#d88a4a', '#e8a85a', '#f0c88a'], hill: '#c88a5a', grass: '#e8c86a', grass2: '#c8a84a', dirt: '#c89a5a', dirt2: '#b88a4a', deco: 'cactus'},
  {id: 'neige', name: 'Neige', price: 400, f: .8, amp: 46, g: .12, roll: .997, air: .999, grip: .6, sky: ['#4a5a8a', '#6a7aa8', '#8a9ac8'], hill: '#9aaac8', grass: '#f0f4ff', grass2: '#c8d4f0', dirt: '#6a6a7a', dirt2: '#5a5a6a', deco: 'pine', dp: {g: '#3a6a5a', G: '#f0f4ff', n: '#2a4a44'}},
  {id: 'lune', name: 'Lune', price: 800, f: .7, amp: 44, g: .05, roll: .996, air: 1, grip: .8, sky: ['#05030c', '#0a0618', '#120c24'], hill: '#2a2a3a', grass: '#c8c8d0', grass2: '#8a8a9a', dirt: '#6a6a78', dirt2: '#4a4a58', stars: true, deco: 'rock', dp: {R: '#9a9aa8', r: '#6a6a78', d: '#4a4a58'}},
  {id: 'foret', name: 'Forêt', price: 250, f: 1.1, amp: 42, g: .12, roll: .993, air: .999, grip: .95, sky: ['#4a7a9a', '#6a9aaa', '#9ac0b8'], hill: '#2a5a3a', grass: '#4a9a32', grass2: '#2a6a22', dirt: '#5a3a22', dirt2: '#4a2e1a', deco: 'pine'},
  {id: 'plage', name: 'Plage', price: 300, f: 1.4, amp: 30, g: .12, roll: .98, air: .999, grip: .85, sky: ['#3a9ae8', '#6ab8f0', '#a8dcf8'], hill: '#2a8ac8', grass: '#f8e0a0', grass2: '#e8c878', dirt: '#e0c080', dirt2: '#c8a868', deco: 'palm', sea: true},
  {id: 'jungle', name: 'Jungle', price: 500, f: .75, amp: 48, g: .12, roll: .988, air: .998, grip: .9, sky: ['#2a6a4a', '#3a8a5a', '#6aaa6a'], hill: '#1e4a2a', grass: '#3ab82a', grass2: '#1e7a1a', dirt: '#4a3018', dirt2: '#3a2410', deco: 'tree', dp: {g: '#2a8a2a', G: '#5ad03a', n: '#1a5a1a'}},
  {id: 'marais', name: 'Marais', price: 600, f: .9, amp: 34, g: .12, roll: .976, air: .998, grip: .7, sky: ['#4a5a4a', '#6a7a5a', '#8a9a6a'], hill: '#3a4a32', grass: '#6a7a3a', grass2: '#4a5a2a', dirt: '#3a3a2a', dirt2: '#2a2a1e', deco: 'reed'},
  {id: 'canyon', name: 'Canyon', price: 700, f: 2.2, amp: 60, g: .13, roll: .995, air: .999, grip: .95, sky: ['#e86a3a', '#f08a4a', '#f8b878'], hill: '#a84a2a', grass: '#d8743a', grass2: '#b85a2a', dirt: '#a84a2a', dirt2: '#8a3a20', deco: 'rock', dp: {R: '#d8743a', r: '#a84a2a', d: '#7a3018'}},
  {id: 'volcan', name: 'Volcan', price: 1000, f: .9, amp: 54, g: .135, roll: .994, air: .998, grip: .95, sky: ['#1a0a10', '#3a1018', '#6a1a1a'], hill: '#2a1a1e', grass: '#ff6a1a', grass2: '#c83a10', dirt: '#2a2228', dirt2: '#3a2a30', deco: 'rock', dp: {R: '#5a4a50', r: '#3a2e34', d: '#ff6a1a'}, embers: true},
  {id: 'mars', name: 'Mars', price: 1200, f: .8, amp: 50, g: .07, roll: .995, air: 1, grip: .85, sky: ['#3a1a1a', '#6a2a1e', '#a8502a'], hill: '#7a3420', grass: '#c86a3a', grass2: '#a8502a', dirt: '#8a3a22', dirt2: '#6a2a18', stars: true, deco: 'rock', dp: {R: '#c86a3a', r: '#8a3a22', d: '#5a2412'}},
  {id: 'cristaux', name: 'Cristaux', price: 1500, f: .6, amp: 50, g: .1, roll: .997, air: 1, grip: .75, sky: ['#1a1038', '#2a1a58', '#4a2a7a'], hill: '#2a1a4a', grass: '#b48cff', grass2: '#8a5ad8', dirt: '#3a2a5a', dirt2: '#2a1e44', stars: true, deco: 'crystal'},
  {id: 'ville', name: 'Ville la nuit', price: 1800, f: 1.5, amp: 36, g: .12, roll: .998, air: .999, grip: 1.1, sky: ['#0a0a1e', '#14143a', '#2a1e4a'], hill: '#14142a', grass: '#5a5a6a', grass2: '#ffd84a', dirt: '#2a2a34', dirt2: '#22222a', stars: true, deco: 'lamp', city: true},
];
// le décor posé sur le sol de chaque monde, dessiné à la main (k : contour ; les autres lettres viennent de dp, ou des couleurs par défaut)
const GR_DECO = {
  tree: ['...kkkkk...', '..kGGGggk..', '.kGGgggggk.', 'kGGgggggggk', 'kGggggggnnk', 'kgggggggnnk', '.kgggggnnk.', '..kkgnnkk..', '....kbk....', '....kbk....', '....kbk....', '...kbbbk...'],
  pine: ['....k....', '...kGk...', '...kgk...', '..kGggk..', '..kgggk..', '.kGgggnk.', '..kgggk..', '.kGgggnk.', 'kGgggggnk', 'kkkkbkkkk', '....b....', '....b....'],
  cactus: ['....kk....', '...kgGk...', '.k.kgGk...', 'kGkkgGk...', 'kGgkgGk.k.', '.kggggkkGk', '..kkgGggk.', '...kgGkk..', '...kgGk...', '...kgGk...', '...kgGk...'],
  palm: ['..kk...kk..', '.kGGk.kGGk.', 'kGg.kkk.gGk', 'k...kgk...k', '...kGgGk...', '..kg.b.gk..', '.....bk....', '.....bk....', '....kbk....', '....kbk....', '....kbk....', '...kbk.....', '...kbk.....'],
  rock: ['...kkkk...', '..kRRrrk..', '.kRRrrrdk.', 'kRrrrrrddk', 'krrrrrdddk', 'kkkkkkkkkk'],
  crystal: ['....k......', '...kWk.....', '...kWck....', '..kWWcck...', '..kWccck.k.', '..kWccckkWk', '.kWWccckWck', '.kWcccckWck', 'kkkkkkkkkkk'],
  reed: ['.k....k.', 'kbk..kbk', 'kbk..kbk', 'kbk..kbk', '.g....g.', '.g..k.g.', '.g.kbkg.', '.g.kbkg.', '.g..g.g.', '.gg.g.g.', '..g.gg..'],
  lamp: ['kkkkk.', 'kyyyyk', '.kkkk.', '..k...', '..k...', '..k...', '..k...', '..k...', '..k...', '..k...', '..k...', '.kkk..'],
};
const GR_DPAL = {k: '#1a1018', g: '#3a8a2a', G: '#6ac04a', n: '#2a6a22', b: '#6a4a2a', R: '#a89a88', r: '#7a6e60', d: '#4a4038', W: '#e8d8ff', c: '#a87ae8', y: '#fff0a0'};
const grDecoImg = {};
const grDecoArt = T => grDecoImg[T.id] ??= PXK.art(GR_DECO[T.deco], {...GR_DPAL, ...(T.deco === 'reed' ? {g: '#5a7a3a', b: '#6a4a2a'} : {}), ...(T.dp || {})});
const grHash = n => { const x = Math.sin(n * 91.7 + 13.1) * 43758.5453; return x - Math.floor(x); };
// les voitures : empattement L, rayon des roues R, vitesse, reprise, consommation, poids m (lourd : tombe plus vite, rebondit moins, tourne moins en l'air),
// part du poids sur l'arrière bal, cabrage à l'accélération lift, rwd : seule la roue arrière pousse ; couleurs
const GR_CARS = [
  {id: 'jeep', name: 'Jeep', price: 0, L: 22, R: 5, speed: 2.6, acc: .05, burn: 1, m: 1, bal: .5, lift: .0012, eng: [70, 'sawtooth'], body: ['#d83a3a', '#ff6a5a'], desc: 'équilibrée'},
  {id: 'monster', name: 'Monster', price: 250, L: 24, R: 7, speed: 2.3, acc: .066, burn: 1.15, m: 1.3, bal: .5, lift: .0016, eng: [48, 'sawtooth'], body: ['#3a8a3a', '#6ac05a'], desc: 'grosses roues, grimpe tout'},
  {id: 'bolide', name: 'Bolide', price: 600, L: 24, R: 4, speed: 3.5, acc: .056, burn: 1.35, m: .9, bal: .56, lift: .0012, rwd: 1, eng: [110, 'sawtooth'], body: ['#3a5ad8', '#6a8aff'], desc: 'très rapide, boit beaucoup'},
  {id: 'quad', name: 'Quad', price: 150, L: 18, R: 5, speed: 2.4, acc: .058, burn: .8, m: .7, bal: .5, lift: .0016, eng: [95, 'square'], body: ['#e8a01a', '#ffd04a'], desc: 'petit, agile et sobre'},
  {id: 'moto', name: 'Moto', price: 350, L: 18, R: 6, spoke: 1, rider: 1, speed: 3, acc: .06, burn: .75, m: .5, bal: .62, lift: .0034, rwd: 1, eng: [130, 'square'], body: ['#d83a8a', '#ff7ac0'], desc: 'légère, se cabre au démarrage'},
  {id: 'buggy', name: 'Buggy', price: 450, L: 22, R: 6, speed: 2.9, acc: .062, burn: 1.05, m: .85, bal: .56, lift: .0016, rwd: 1, eng: [85, 'sawtooth'], body: ['#e86a1a', '#ffa04a'], desc: 'arceau et grosses suspensions'},
  {id: 'tracteur', name: 'Tracteur', price: 500, L: 20, R: 7, speed: 1.8, acc: .08, burn: .9, m: 1.6, bal: .66, lift: .002, rwd: 1, eng: [38, 'square'], body: ['#2a8a3a', '#5ac05a'], desc: 'lent mais grimpe tout'},
  {id: 'van', name: 'Van', price: 550, L: 26, R: 5, speed: 2.5, acc: .05, burn: 1.1, m: 1.3, bal: .48, lift: .0006, eng: [62, 'triangle'], body: ['#e8e4ec', '#ffffff'], desc: 'long et stable'},
  {id: 'camion', name: 'Camion', price: 700, L: 30, R: 6, speed: 2.1, acc: .055, burn: 1.5, m: 2, bal: .42, lift: .0004, eng: [34, 'sawtooth'], body: ['#c83a2a', '#e86a4a'], desc: 'très long, ne se retourne pas'},
  {id: 'rallye', name: 'Rallye', price: 900, L: 24, R: 5, speed: 3.3, acc: .07, burn: 1.25, m: .95, bal: .5, lift: .0012, eng: [105, 'sawtooth'], body: ['#3ab8d8', '#7ae0f8'], desc: 'vive, rapide, avec un aileron'},
  {id: 'rover', name: 'Rover', price: 1200, L: 26, R: 6, speed: 2.2, acc: .06, burn: .55, m: 1.1, bal: .5, lift: .0008, eng: [180, 'sine'], body: ['#a8a8b8', '#d8d8e8'], desc: 'presque sans essence'},
  {id: 'hotrod', name: 'Hot-rod', price: 1500, L: 24, R: 5, speed: 3.8, acc: .062, burn: 1.5, m: 1.1, bal: .62, lift: .0028, rwd: 1, eng: [55, 'sawtooth'], body: ['#1a1a28', '#3a3a50'], desc: 'la plus rapide de toutes'},
];
const GR_UP = [['moteur', 'Moteur'], ['pneus', 'Pneus'], ['reservoir', 'Réservoir']];
const GR_COST = [20, 50, 110, 220, 400];
const grs = gstore('grimpette', {games: 0, coins: 0, total: 0, terr: 0, car: 0, owned: {terr: [0], car: [0]}, up: {}});
grs.owned ??= {terr: [0], car: [0]}; grs.up ??= {};
const grUp = car => (grs.up[GR_CARS[car].id] ??= {moteur: 0, pneus: 0, reservoir: 0});
let gr = null, grac = null, grMute = false;
function grBeep(f, d, type = 'square', slide = 0, vol = .04) { if (grMute) return; try { grac ??= new AudioContext(); const o = grac.createOscillator(), g = grac.createGain(), t = grac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(grac.destination); o.start(t); o.stop(t + d); } catch {} }
// le sol : plat au départ, puis des collines de plus en plus hautes (trois sinus mêlés, décalés au hasard à chaque partie)
const grBase = (x, ph, T) => { const t = Math.max(0, Math.min(1, (x - 150) / 150)), amp = Math.min(T.amp, 8 + x / 160) * t, f = T.f; return 100 + amp * (.55 * Math.sin(x / 97 / f + ph[0]) + .25 * Math.sin(x / 41 / f + ph[1]) + .2 * Math.sin(x / 23 / f + ph[2])) - t * 6 * Math.sin(x / 400 + ph[3]); };  // les bosses courtes (x / 23) font décoller dans les descentes rapides
const GR_RAMP = 440;
function grRamp(x, ph, T) {  // la hauteur du tremplin sous x (0 hors tremplin) ; ph[0] change leurs places d'une partie à l'autre
  const k = Math.floor(x / GR_RAMP); if (k < 2) return 0; const hs = grHash(k * 7.3 + ph[0]); if (hs < .25) return 0;
  const len = 40 + hs * 26, h = Math.min(len * .5, (20 + grHash(k * 3.1 + ph[1]) * 18) * Math.min(1.6, .9 + x / 9000)), u = x - k * GR_RAMP - 100 - grHash(k + ph[2]) * 160;  // pente finale 2h/len : jusqu'à 1
  if (u < 0 || u > len + 30) return 0;
  const st = x - u; if (grBase(st + len, ph, T) - grBase(st, ph, T) < -len * .2) return 0;  // pas de tremplin dans une montée raide : il deviendrait un mur
  return u <= len ? h * (u / len) ** 2 : h * (1 - (u - len) / 30);
}
const grGround = (x, ph, T) => grBase(x, ph, T) - grRamp(x, ph, T);
const grSlope = (x, ph, T) => (grGround(x + .5, ph, T) - grGround(x - .5, ph, T));
// le garage (mode 'garage') puis la course ; terr et car : les numéros choisis
function grNew(mode = 'garage') {
  const g = gr?.g, r = seeded(Date.now() % 1e9), ph = [r() * 6, r() * 6, r() * 6, r() * 6], T = GR_TERR[grs.terr], C = GR_CARS[grs.car], U = grUp(grs.car);
  const y0 = grGround(40, ph, T) - C.R;
  gr = renew(gr, {g, mode, tick: 0, seen: 0, ph, T, C, U, a: {x: 40, y: y0, px: 40, py: y0, rot: 0}, b: {x: 40 + C.L, y: y0, px: 40 + C.L, py: y0, rot: 0}, fuel: 100, coins: 0, best: 0, cam: {x: 0, y: 40}, keys: new Set(), cans: [{x: 900, got: 0}], coinRows: [], nextCoin: 260, dead: 0, why: '', still: 0, record: false, pops: [], air: 0, flips: 0, spin: 0, row: 5, hover: null, nitro: 50, boost: 0, touch: [0, 0], landings: 0, airBest: 0, flame: [], combo: 0, comboT: 0, comboMax: 0, wheelie: 0, wheelieBest: 0, fwd: 0});
  gr.onStop = grEngineOff;
  grInfo();
}
function grWheel(w, drive) {
  // la roue touche le sol : on la remet dessus, et le moteur (ou le frein) agit le long de la pente
  const {T, C, U, ph} = gr, gy = grGround(w.x, ph, T), s = grSlope(w.x, ph, T), len = Math.hypot(1, s), nx = s / len, ny = -1 / len;
  const depth = (w.y + C.R - gy) / len;
  if (depth <= 0) return false;
  w.x += nx * depth; w.y += ny * depth;
  let vx = w.x - w.px, vy = w.y - w.py; const tx = 1 / len, ty = s / len, vt = vx * tx + vy * ty, vn = vx * nx + vy * ny;
  let nvt = vt * T.roll;
  if (drive && (!C.rwd || w === gr.a)) { const nb = drive > 0 && gr.boost, target = drive > 0 ? (C.speed + U.moteur * .35) * 1.5 + (nb ? 2 : 0) : -1.6, acc = (C.acc + U.pneus * .012) * 1.4 * T.grip * (drive > 0 ? 1 : 1.4) * (C.rwd ? 1.5 : 1) * (nb ? 2.2 : 1) / C.m ** .25; nvt = vt + Math.max(-acc, Math.min(acc, target - vt)); }
  const nvn = vn < 0 ? -vn * Math.min(.38, .24 / C.m) : vn;  // un rebond : moins il est lourd, plus il rebondit
  vx = tx * nvt + nx * nvn; vy = ty * nvt + ny * nvn; w.px = w.x - vx; w.py = w.y - vy;
  return true;
}
function grStep(drive) {
  const {a, b, C, T} = gr;
  const g = T.g * (.8 + .2 * C.m) * (gr.touch[0] || gr.touch[1] ? 1 : .72);  // le poids : un véhicule lourd retombe plus vite ; en l'air, il plane un peu
  for (const w of [a, b]) { const vx = (w.x - w.px) * T.air, vy = (w.y - w.py) * T.air; w.px = w.x; w.py = w.y; w.x += vx; w.y += vy + g; }
  // l'empattement reste fixe (deux passes) ; le côté le plus lourd bouge le moins
  for (let i = 0; i < 2; i++) { const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, k = (d - C.L) / d; a.x += dx * k * (1 - C.bal); a.y += dy * k * (1 - C.bal); b.x -= dx * k * C.bal; b.y -= dy * k * C.bal; }
  const ga = grWheel(a, drive), gb = grWheel(b, drive);
  for (const w of [a, b]) w.rot += (w.x - w.px) / C.R;
  // au sol, le moteur cabre le véhicule autour de sa roue arrière (la moto se lève, le camion à peine) ; en l'air, accélérer lève le nez, freiner le baisse
  const ground = ga || gb;
  if (ground && drive > 0 && ga) { const ang = -C.lift * T.g / .12, dx = b.x - a.x, dy = b.y - a.y; b.x = a.x + dx * Math.cos(ang) - dy * Math.sin(ang); b.y = a.y + dx * Math.sin(ang) + dy * Math.cos(ang); }
  if (!ground && drive) { const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, ang = -drive * .0095 / Math.sqrt(C.m); for (const w of [a, b]) { const dx = w.x - cx, dy = w.y - cy; w.x = cx + dx * Math.cos(ang) - dy * Math.sin(ang); w.y = cy + dx * Math.sin(ang) + dy * Math.cos(ang); } }
  if (gr.boost && !ground) { const dx = (b.x - a.x) / C.L, dy = (b.y - a.y) / C.L; for (const w of [a, b]) { w.x += dx * .05; w.y += dy * .05; } }  // le nitro pousse aussi en l'air
  gr.touch = [ga ? gr.touch[0] + 1 : 0, gb ? gr.touch[1] + 1 : 0];
  return ground;
}
// le moteur : un ronronnement continu (forme et note du véhicule) qui monte avec la vitesse, l'accélération et le nitro
let grEng = null;
function grEngine(speed, drive) {
  if (grMute) return;
  try { grac ??= new AudioContext();
    if (!grEng) { const o = grac.createOscillator(), o2 = grac.createOscillator(), g = grac.createGain(), f = grac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; g.gain.value = 0; o.connect(f); o2.connect(f); f.connect(g).connect(grac.destination); o.start(); o2.start(); grEng = {o, o2, g, car: null}; }
    const C = gr.C, [base, type] = C.eng, t = grac.currentTime; if (grEng.car !== C.id) { grEng.o.type = type; grEng.o2.type = 'square'; grEng.car = C.id; }
    const fq = base * (1 + speed * .32 + (drive > 0 ? .3 : 0) + (gr.boost ? .45 : 0)); grEng.o.frequency.setTargetAtTime(fq, t, .05); grEng.o2.frequency.setTargetAtTime(fq / 2, t, .05);
    grEng.g.gain.setTargetAtTime(.022 + (drive > 0 ? .012 : 0), t, .08); grEng.fq = fq;
  } catch {}
}
function grEngineOff() { if (grEng) try { grEng.g.gain.setTargetAtTime(0, grac.currentTime, .05); grEng.fq = 0; } catch {} }
// le toit : au-dessus du milieu des roues, perpendiculaire à l'axe de la voiture
const grHead = () => { const {a, b, C} = gr, dx = (b.x - a.x) / C.L, dy = (b.y - a.y) / C.L, h = 8 + C.R; return {x: (a.x + b.x) / 2 + dy * h, y: (a.y + b.y) / 2 - dx * h, ang: Math.atan2(dy, dx)}; };
function grEnd(why) { grEngineOff(); gr.mode = 'over'; gr.dead = 0; gr.why = why; grs.games++; grs.flipsAll = (grs.flipsAll || 0) + gr.flips; grs.bestCombo = Math.max(grs.bestCombo || 0, gr.comboMax); grs.coins += gr.coins; grs.total += gr.coins; best('grimpette', Math.floor(gr.best)); gr.record = best('grimpette-' + gr.T.id, Math.floor(gr.best)); saveGames(); grInfo(); grBeep(why === 'crash' ? 120 : 300, .5, 'sawtooth', 50, .07); }
const GR_COMBO = 240;  // images au sol pour enchaîner la figure suivante (4 secondes)
function grTricks(spin, air) {  // les figures d'un saut : saltos (avant : le nez plonge, plus dur), vol ; points avant le combo
  const out = []; let pts = 0;
  if (Math.abs(spin) > Math.PI * 1.8) { const n = Math.round(Math.abs(spin) / (Math.PI * 2)), fwd = spin > 0;
    out.push((n === 2 ? 'DOUBLE ' : n === 3 ? 'TRIPLE ' : n > 3 ? n + ' × ' : '') + (fwd ? 'SALTO AVANT' : 'SALTO ARRIÈRE')); pts += (fwd ? 15 : 10) * n; }
  if (air > 30) { out.push('VOL ' + (air / 60).toFixed(1).replace('.', ',') + ' s'); pts += Math.floor(air / 30); }
  return {out, pts};
}
function grScore(pts, label, x, y) {  // une figure : le combo monte si elle suit la précédente de près, les pièces sont multipliées
  if (!pts) return 0;
  gr.combo = gr.comboT > 0 ? Math.min(5, gr.combo + 1) : 1; gr.comboT = GR_COMBO; gr.comboMax = Math.max(gr.comboMax, gr.combo);
  const tot = pts * gr.combo; gr.coins += tot; for (const p of gr.pops) p.y -= 20;  // les messages précédents montent : rien ne se chevauche
  gr.pops.push({text: label, x, y: y - 22, t: 70}, {text: '+' + tot + (gr.combo > 1 ? '  COMBO ×' + gr.combo : ''), x, y: y - 12, t: 70, c: gr.combo > 1 ? '#ff8aff' : '#ffd84a'});
  return tot;
}
function grUpdate() {
  const drive = (gr.keys.has('R') ? 1 : 0) - (gr.keys.has('L') ? 1 : 0), d = gr.fuel > 0 ? drive : 0, {T, C, U} = gr;
  gr.boost = gr.keys.has('N') && gr.nitro > 0 && gr.fuel > 0; if (gr.boost) gr.nitro = Math.max(0, gr.nitro - .7);
  const ground = grStep(gr.boost ? 1 : d);
  gr.fuel = Math.max(0, gr.fuel - (.02 + (d ? .035 : 0)) * C.burn / (1 + U.reservoir * .25));
  const cx = (gr.a.x + gr.b.x) / 2, cy = (gr.a.y + gr.b.y) / 2, m = cx / GR.PXM; gr.best = Math.max(gr.best, m);
  // un tour complet en l'air rapporte des pièces
  const h = grHead();
  if (!ground) { gr.air++; if (gr.lastAng != null) { let da = h.ang - gr.lastAng; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; gr.spin += da; } }
  if (!ground) { gr.nitro = Math.min(100, gr.nitro + .3); gr.airBest = Math.max(gr.airBest, gr.air); }  // voler remplit le nitro
  if (ground && gr.air) {  // l'atterrissage : salto, vol, et deux roues posées ensemble dans le sens de la pente
    const tk = grTricks(gr.spin, gr.air);
    if (Math.abs(gr.spin) > Math.PI * 1.8) { const n = Math.round(Math.abs(gr.spin) / (Math.PI * 2)); gr.flips += n; if (gr.spin > 0) gr.fwd += n; gr.nitro = Math.min(100, gr.nitro + 35 * n); grBeep(784, .2, 'square', 1175); }
    if (tk.pts) { grScore(tk.pts, tk.out.join(' + '), cx, h.y); if (gr.combo > 1) setTimeout(() => grBeep(988 + gr.combo * 80, .12, 'square', 1480), 120); }
    gr.landWait = gr.air > 20 ? 6 : 0; gr.air = 0; gr.spin = 0;
  }
  if (gr.landWait && --gr.landWait >= 0 && gr.touch[0] && gr.touch[1]) { gr.landWait = 0; const sl = Math.atan(grSlope(cx, gr.ph, T));
    if (Math.abs(h.ang - sl) < .3) { gr.landings++; gr.coins += 2 * Math.max(1, gr.combo); if (gr.comboT) gr.comboT = GR_COMBO; gr.nitro = Math.min(100, gr.nitro + 15); gr.pops.push({text: 'ATTERRISSAGE PARFAIT +' + 2 * Math.max(1, gr.combo), x: cx, y: h.y - 32, t: 50}); grBeep(660, .08, 'triangle', 990);
      const ux = (gr.b.x - gr.a.x) / C.L, uy = (gr.b.y - gr.a.y) / C.L; for (const w of [gr.a, gr.b]) { w.px -= ux * .5; w.py -= uy * .5; } } }  // un petit élan en prime
  gr.lastAng = h.ang;
  if (ground && gr.touch[0] && !gr.touch[1]) gr.wheelie++;  // le cabré : seule la roue arrière touche le sol
  else if (gr.wheelie) { if (gr.wheelie >= 60) { gr.wheelieBest = Math.max(gr.wheelieBest, gr.wheelie); grScore(2 * Math.floor(gr.wheelie / 60), 'CABRÉ ' + (gr.wheelie / 60).toFixed(1).replace('.', ',') + ' s', cx, h.y); grBeep(700, .1, 'triangle', 1050); } gr.wheelie = 0; }
  if (ground && !gr.wheelie && gr.comboT > 0 && --gr.comboT === 0) gr.combo = 0;
  if (h.y > grGround(h.x, gr.ph, T) - 2) return grEnd('crash');
  // essence et pièces à ramasser
  for (const c of gr.cans) if (!c.got && Math.abs(c.x - cx) < 14 && Math.abs(grGround(c.x, gr.ph, T) - 8 - cy) < 22) { c.got = 1; gr.fuel = 100; gr.pops.push({text: 'PLEIN !', x: c.x, y: grGround(c.x, gr.ph, T) - 20, t: 40}); grBeep(523, .08); setTimeout(() => grBeep(784, .12), 70); }
  const last = gr.cans[gr.cans.length - 1]; if (last.x - cx < 800) gr.cans.push({x: last.x + 1100 + gr.cans.length * 160, got: 0});
  while (gr.nextCoin < cx + 400) { for (let i = 0; i < 5; i++) gr.coinRows.push({x: gr.nextCoin + i * 9, got: 0, v: gr.nextCoin > 10000 ? 5 : gr.nextCoin > 5000 ? 2 : 1}); gr.nextCoin += 240 + Math.floor(Math.random() * 200); }
  for (const c of gr.coinRows) if (!c.got && Math.abs(c.x - cx) < 12 && Math.abs(grGround(c.x, gr.ph, T) - 9 - cy) < 16 + C.R) { c.got = 1; gr.coins += c.v; grBeep(1047 + c.v * 100, .04, 'square', 0, .025); }
  gr.coinRows = gr.coinRows.filter(c => c.x > cx - 200);
  for (const p of gr.pops) { p.t--; p.y -= .3; } gr.pops = gr.pops.filter(p => p.t > 0);
  const speed = Math.hypot(gr.a.x - gr.a.px, gr.a.y - gr.a.py);
  gr.still = gr.fuel <= 0 && speed < .05 ? gr.still + 1 : 0; if (gr.still > 60) return grEnd('essence');
  grEngine(speed, d);
  if (gr.boost && gr.tick % 2 === 0) gr.flame.push({x: gr.a.x - (gr.b.x - gr.a.x) / C.L * 8, y: gr.a.y - 6, t: 14});
  for (const f of gr.flame) { f.t--; f.x -= .6; f.y -= .2; } gr.flame = gr.flame.filter(f => f.t > 0);
  gr.cam.x += (cx - GR.W * .33 - gr.cam.x) * .2; gr.cam.y += (cy - 85 + (ground ? 0 : 10) - gr.cam.y) * .1;
}
// la carrosserie de chaque voiture (k : contour, w : vitre, r/R : couleur, y : phare, d : bas de caisse)
const GR_BODY = {
  jeep: ['....kkkkkk..............', '...kwwwwwwk.............', '..kwbbkbbbwk............', '..kwbbkbbbbwk...........', 'kkkkkkkkkkkkkkkkkkkkk...', 'krrrrrrrrrrrrrrrrrrrrrk.', 'krRRRRRRRRRRRRRRRRRRyyk.', 'krrrrrrrrrrrrrrrrrrrrrk.', '.kddkkkkkkkkkkkkkkddk...', '..kk..............kk....'],
  monster: ['.....kkkkkkk..............', '....kwwwwwwwk.............', '...kwbbbkbbbwk............', '..kwbbbbkbbbbwk...........', 'kkkkkkkkkkkkkkkkkkkkkkk...', 'krrrrrrrrrrrrrrrrrrrrrrk..', 'krRRRRRRRRRRRRRRRRRRRyyk..', 'krrrrrrrrrrrrrrrrrrrrrrk..', 'kkkkkkkkkkkkkkkkkkkkkkkk..', '..kdk.............kdk.....', '..kdk.............kdk.....'],
  bolide: ['........kkkkkk............', '......kkwwwwbbk...........', 'kkkkkkkkkkkkkkkkkkkkkkk...', 'krrrrrrrrrrrrrrrrrrrrrrkk.', 'kRRRRRRRRRRRRRRRRRRRRRRyyk', 'krrrrrrrrrrrrrrrrrrrrrrrrk', '.kkkkkkkkkkkkkkkkkkkkkkkk.'],
  quad: ['..............kk....', '.............kck....', 'kkkkkkkkkkkkkkkkkkk.', 'krRRRRRRRRRRRRRRRRyk', 'krrrrrrrrrrrrrrrrrrk', '.kkddkkkkkkkkkddkk..'],
  moto: ['...........khhhhk...........', '..........khhhhwwk..........', '..........khhhhbbsck........', '........kkbRRbbkkkyyk.......', '...kkkkkbbbbbbRRrkyyk.......', '.kkdddddddbbrrrrrkkckkkk....', 'krrrrrrRRRRrbbrrrkkrrrrrk...', 'rkkcccccccRkkbkkk..kckkkrk..', 'k........kckbkk.....c...k...', '........kggkkkgk.....c......', '......kkkgGGGGgk.....c......', '....kkdddggggggk.....c......', '...kdddddkkkkkk.......c.....', '...kddkkk.............c.....'],  // enduro et pilote penché (roues en colonnes 4 et 22)
  buggy: ['....kkkkkkkkkk..........', '....kc.......ck.........', '...kc.........ck........', 'kkkkkkkkkkkkkkkkkkkkkkk.', 'krRRRRRRRRRRRRRRRRRRRryk', '.krrrrrrrrrrrrrrrrrrrrk.', '..kkdkkkkkkkkkkkkkdkk...'],
  tracteur: ['......kkkkkk........', '......kwwwwk...kk...', '......kwbbwk...kk...', 'kkkkkkkkkkkkkkkkkk..', 'krRRRRRRRRRRRRRRRyk.', 'krrrrrrrrrrrrrrrrrk.', '.kkkkkkkkkkkkkkkkk..'],
  van: ['..kkkkkkkkkkkkkkkkkkkk.....', '.kwwwwkwwwwkwwwwkwwwwbk....', 'kwwwwwkwwwwkwwwwkwwwbbk....', 'krrrrrrrrrrrrrrrrrrrrrrkk..', 'kRRRRRRRRRRRRRRRRRRRRRRRyk.', 'krrrrrrrrrrrrrrrrrrrrrrrrk.', '.kkdkkkkkkkkkkkkkkkkkkdkk..'],
  camion: ['....................kkkkkkk..', '....................kwwwwbk..', '....................kwwwbbk..', 'kkkkkkkkkkkkkkkkkkkkkkkkkkkk.', 'kggggggggggggggggggkrrrrrrrk.', 'kgGgGgGgGgGgGgGgGgkrRRRRRRyk', 'kggggggggggggggggggkrrrrrrrrk', 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkk', '..kdk..................kdk...'],
  rallye: ['k...........kkkkkk.......', 'kk........kkwwwwbbk......', 'kkkkkkkkkkkkkkkkkkkkkkk..', 'krrrrrrrrrrrrrrrrrrrrrrkk', 'kRRwwRRRRRRRRRRRRRRRRRRyk', 'krrrrrrrrrrrrrrrrrrrrrrrk', '.kkkkkkkkkkkkkkkkkkkkkkk.'],
  rover: ['........k...........', '........k..kkkkk....', '.......kyk.kcccck...', 'kkkkkkkkkkkkkkkkkkk.', 'kgRRRRRRRRRRRRRRRRgk', 'kggggggggggggggggggk', '.kkdkkkkkkkkkkkkdkk.'],
  hotrod: ['.......kkkkk.............', '......kwwwwbk.............', 'kkkkkkkkkkkkkkkkkkkkkkk...', 'krrrrrrrrrrrrrrooyrrrrrk..', 'kRRRRRRRRRRRRooyyRRRRRRyk.', 'krrrrrrrrrrrrrrrrrrrrrrrrk', '.kkkkkkkkkkkkkkkkkkkkkkkk.'],
};
const grCarImg = {};
const grCarArt = C => grCarImg[C.id] ??= PXK.art(GR_BODY[C.id], {k: '#1a1018', w: '#c8e0f0', b: C.rider ? '#2a3a6a' : '#6a9ac8', h: '#f0f0f8', s: '#e8b08a', r: C.body[0], R: C.body[1], y: '#ffd84a', d: '#3a3a4a', c: '#c8c8d8', g: '#7a7a8a', G: '#a8a8b8', o: '#ff8a2a'});
function grDrawWheel(g, x, y, R, rot, spoke) {
  x = Math.round(x); y = Math.round(y);
  if (spoke) {  // pneu fin de moto, jante et rayons qui tournent
    for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) { const d = Math.hypot(i, j); if (d <= R + .3 && d > R - 1.6) px(g, d > R - .6 ? '#1a1a22' : '#3a3a48', x + i, y + j, 1, 1); else if (d <= R - 1.6 && d > R - 2.4) px(g, '#a8a8b8', x + i, y + j, 1, 1); }
    for (let k = 0; k < 4; k++) { const an = rot + k * Math.PI / 4; for (let r = -(R - 2); r <= R - 2; r++) px(g, '#8a8a9a', x + Math.round(Math.cos(an) * r), y + Math.round(Math.sin(an) * r), 1, 1); }
    px(g, '#e8e8f0', x, y, 1, 1); return;
  }
  for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) { const d = Math.hypot(i, j); if (d <= R + .3) px(g, d > R - 1.3 ? '#1a1a22' : d > R - 2.3 ? '#4a4a5a' : '#2a2a34', x + i, y + j, 1, 1); }
  const s = R - 2.5; px(g, '#c8c8d8', x + Math.round(Math.cos(rot) * s), y + Math.round(Math.sin(rot) * s), 1, 1); px(g, '#c8c8d8', x - Math.round(Math.cos(rot) * s), y - Math.round(Math.sin(rot) * s), 1, 1); px(g, '#e8e8f0', x, y, 1, 1);
}
// une voiture entière : carrosserie tournée avec l'axe des roues, pilote, roues
function grDrawCar(g, C, a, b, ox, oy) {
  const mx = (a.x + b.x) / 2 - ox, my = (a.y + b.y) / 2 - oy, ang = Math.atan2(b.y - a.y, b.x - a.x), art = grCarArt(C);
  g.save(); g.translate(Math.round(mx), Math.round(my)); g.rotate(ang); g.drawImage(art, -Math.round(art.width / 2) + 1, -art.height - C.R + 7);
  if (!C.rider) sprite(g, ['.kkk.', 'khhhk', 'kssek', 'kssk.', '.kk..'], -6, -art.height - C.R + 6, {k: '#1a1018', h: '#5a3a1a', s: '#e8b08a', e: '#1a1018'});
  g.restore();
  grDrawWheel(g, a.x - ox, a.y - oy, C.R, a.rot, C.spoke); grDrawWheel(g, b.x - ox, b.y - oy, C.R, b.rot, C.spoke);
}
function grScenery(g, T, cx, cy, ph) {
  const {W, H, HUD} = GR;
  T.sky.forEach((c, i) => px(g, c, 0, HUD + i * 22, W, i === 2 ? H : 22));
  if (T.stars) for (let i = 0; i < 40; i++) px(g, i % 7 ? '#8a8aa8' : '#ffffff', (i * 53 + 7 - Math.floor(cx * .05)) % W + (((i * 53 + 7 - Math.floor(cx * .05)) % W) < 0 ? W : 0), HUD + (i * 37) % 70, 1, 1);
  if (T.stars) { px(g, '#3a6ae8', 190, 24, 14, 14); px(g, '#5ac05a', 194, 27, 6, 5); px(g, '#ffffff', 192, 26, 3, 2); }
  if (T.city) for (let x = 0; x < W; x++) { const wx = Math.floor(x + cx * .3), b = Math.floor(wx / 18), hy = 46 + Math.floor(grHash(b) * 40); px(g, T.hill, x, hy, 1, H - hy); if (wx % 18 > 2 && wx % 18 < 16 && wx % 4 === 0) for (let y = hy + 4; y < 120; y += 6) if (grHash(b * 31 + y) > .55) px(g, '#ffd84a', x, y, 2, 2); }
  else for (let x = 0; x < W; x++) { const hy = 70 + Math.round(14 * Math.sin((x + cx * .3) / 37) + 8 * Math.sin((x + cx * .3) / 13)); px(g, T.hill, x, hy, 1, H - hy); }
  if (T.sea) { px(g, '#1a6ab8', 0, 96, W, H - 96); for (let x = 0; x < W; x += 6) px(g, '#a8dcf8', (x + Math.floor(gr.tick / 6 + cx * .4)) % W, 96 + ((x * 7) % 9), 3, 1); }
  if (T.embers) for (let i = 0; i < 24; i++) { const ex = ((i * 67 + Math.floor(cx * .5)) % W + W) % W, ey = H - ((gr.tick * (.4 + (i % 3) * .2) + i * 41) % (H - HUD)); px(g, i % 2 ? '#ff8a2a' : '#ffd84a', ex, ey, 1, 1); }
  for (let x = 0; x < W; x++) {
    const wx = x + cx, gy = Math.round(grGround(wx, ph, T) - cy);
    if (gy >= H) continue;
    px(g, T.dirt, x, gy, 1, H - gy);
    for (let y = gy + 6 + ((wx * 7) & 7); y < H; y += 9) if ((((wx >> 2) + (y >> 3)) % 3 + 3) % 3 === 0) px(g, T.dirt2, x, y, 1, 2);
    const rh = grRamp(wx, ph, T); if (rh > 1) { px(g, '#8a5a2a', x, gy, 1, Math.min(H - gy, Math.round(rh) + 2)); if ((wx & 7) === 0) px(g, '#5a3a1a', x, gy, 1, Math.min(H - gy, Math.round(rh) + 2)); px(g, '#c89a5a', x, gy, 1, 2); if ((wx & 15) === 8) px(g, '#ffd84a', x, gy + 3, 1, 2); continue; }  // le tremplin : planches de bois, bord jaune
    px(g, T.grass, x, gy, 1, 3); if ((wx & 3) === 0) px(g, T.grass2, x, gy + 2, 1, 2);
    if (wx > 0 && wx % (GR.PXM * 100) === 0) { px(g, '#f0f0f8', x, gy - 16, 1, 16); pxFont(g, wx / GR.PXM + ' m', x + 2, gy - 9, '#ffffff', 8); }
  }
  if (T.deco) { const art = grDecoArt(T); for (let wx = Math.floor(cx / 70) * 70; wx < cx + W + 70; wx += 70) { if (wx < 120 || grHash(wx) < .35) continue;
    const dx = wx + Math.floor(grHash(wx + 1) * 40), gy = Math.round(grGround(dx, ph, T) - cy); if (gy - art.height > H) continue;
    if (T.deco === 'lamp') { g.fillStyle = 'rgba(255,224,120,.14)'; g.fillRect(dx - cx - 6, gy - art.height - 4, 18, art.height + 4); }
    g.drawImage(art, Math.round(dx - cx - art.width / 2), gy - art.height + 2); } }
}
// le garage : 5 lignes (terrain, voiture, 3 améliorations) et le bouton PARTIR ; row : la ligne choisie au clavier
const GR_ROWS = [26, 54, 80, 92, 104, 128];
function grGarageAct(row, dir) {
  if (row === 0 || row === 1) {
    if (dir) { const key = row ? 'car' : 'terr', n = (row ? GR_CARS : GR_TERR).length; grs[key] = (grs[key] + dir + n) % n; saveGames(); grNew('garage'); gr.row = row; grBeep(400, .04); return; }
  }
  if (row >= 2 && row <= 4) { const [k] = GR_UP[row - 2], U = grUp(grs.car), cost = GR_COST[U[k]]; if (!grOwned()) return; if (cost && grs.coins >= cost) { grs.coins -= cost; U[k]++; saveGames(); grInfo(); grBeep(660, .1); setTimeout(() => grBeep(880, .1), 80); } else grBeep(150, .1, 'square', 0, .03); return; }
  if (row === 5 || row === 0 || row === 1) {
    // PARTIR, ou d'abord débloquer le terrain / la voiture choisis
    for (const [key, list] of [['terr', GR_TERR], ['car', GR_CARS]]) if (!grs.owned[key].includes(grs[key])) { const p = list[grs[key]].price; if (grs.coins >= p) { grs.coins -= p; grs.owned[key].push(grs[key]); saveGames(); grInfo(); grBeep(880, .15, 'square', 1320); } else grBeep(150, .1, 'square', 0, .03); return; }
    if (row === 5) { grNew('ready'); grBeep(330, .08, 'triangle', 660); }
  }
}
const grOwned = () => grs.owned.terr.includes(grs.terr) && grs.owned.car.includes(grs.car);
function grDrawGarage(g) {
  const {W, H, HUD} = GR, T = gr.T, C = gr.C, U = gr.U;
  grScenery(g, T, -40, 30, gr.ph); g.fillStyle = 'rgba(10,6,20,.55)'; g.fillRect(0, HUD, W, H - HUD);
  px(g, '#0e0a14', 0, 0, W, HUD); pxFont(g, 'GARAGE', 4, 9, '#ffd84a', 8); pxFont(g, grs.coins + ' ●', W - 4, 9, '#ffd84a', 8, 'right');
  g.save(); g.translate(Math.floor((W - 240) / 2), 0); grDrawGarageIn(g, 240, H, HUD, T, C, U); g.restore();
}
function grDrawGarageIn(g, W, H, HUD, T, C, U) {
  const line = (i, label, val, extra, lock) => { const y = GR_ROWS[i], on = gr.row === i, hov = gr.hover === i; if (on || hov) px(g, on ? '#3a3046' : '#2a2236', 4, y - 10, W - 8, 13); pxFont(g, label, 8, y, '#a898b8', 8); if (val != null) { pxFont(g, '◀', 74, y, on ? '#ffd84a' : '#62566e', 8); pxFont(g, val, 120, y, lock ? '#8a7e98' : '#ffffff', 8, 'center'); pxFont(g, '▶', 162, y, on ? '#ffd84a' : '#62566e', 8); } if (extra) pxFont(g, extra, W - 8, y, lock ? '#ffd84a' : '#7ee07a', 8, 'right'); };
  const tLock = !grs.owned.terr.includes(grs.terr), cLock = !grs.owned.car.includes(grs.car);
  line(0, 'Terrain', T.name, tLock ? 'prix ' + T.price + ' ●' : 'record ' + (games.best['grimpette-' + T.id] || 0) + ' m', tLock);
  line(1, 'Voiture', C.name, cLock ? 'prix ' + C.price + ' ●' : '', cLock);
  g.save(); g.translate(198, 102); g.scale(2, 2); grDrawCar(g, C, {x: -C.L / 2, y: 0, rot: gr.tick / 20}, {x: C.L / 2, y: 0, rot: gr.tick / 20}, 0, 0); g.restore();  // la voiture choisie, en grand
  pxFont(g, C.desc, 120, 66, '#8a7e98', 8, 'center');
  GR_UP.forEach(([k, name], i) => { const lv = U[k], cost = GR_COST[lv], y = GR_ROWS[2 + i]; line(2 + i, name); pxFont(g, cost ? cost + ' ●' : 'max', 138, y, cost && grs.coins < cost ? '#8a7e98' : '#ffd84a', 8); for (let s = 0; s < 5; s++) px(g, s < lv ? '#7ee07a' : '#3a3046', 74 + s * 12, y - 7, 10, 6); });
  const by = GR_ROWS[5], lock = tLock || cLock, price = (tLock ? T.price : 0) + (!tLock && cLock ? C.price : 0), on = gr.row === 5 || gr.hover === 5;
  px(g, '#05010b', 59, by - 11, 122, 17); px(g, on ? '#ffd84a' : lock ? '#5a4a2a' : '#7ee07a', 60, by - 10, 120, 15);
  PXK.fill(g, lock ? 'DÉBLOQUER · ' + price + ' ●' : 'PARTIR !', 120, by + 1, '#1a1018', 1, 'center');
  pxFont(g, '↑ ↓ choisir · ← → changer · Entrée', W / 2, H - 4, '#62566e', 8, 'center');
}
function grDraw() {
  const g = gr.g, {W, H, HUD} = GR;
  for (; gr.seen < gr.tick; gr.seen++) if (gr.mode === 'over') gr.dead++;
  g.imageSmoothingEnabled = false;
  if (gr.mode === 'garage') { grDrawGarage(g); if (gr.tick % 20 === 0) g.canvas.setAttribute('aria-label', 'Grimpette, garage : terrain ' + gr.T.name + ', voiture ' + gr.C.name + ', ' + grs.coins + ' pièces' + (grOwned() ? '' : ', à débloquer') + '.'); return; }
  const cx = Math.round(gr.cam.x), cy = Math.round(gr.cam.y), T = gr.T;
  grScenery(g, T, cx, cy, gr.ph);
  // essence (bidon rouge) et pièces
  for (const c of gr.cans) if (!c.got) { const x = Math.round(c.x - cx), y = Math.round(grGround(c.x, gr.ph, T) - cy) - 10; if (x > -10 && x < W + 10) sprite(g, ['.kkk...', 'krrrkkk', 'krwrrrk', 'krrwrrk', 'krrrwrk', 'krrrrrk', 'kkkkkkk'], x - 3, y - 1 + Math.round(Math.sin(gr.tick / 15)), {k: '#1a1018', r: '#e0402a', w: '#ffd0c0'}); }
  for (const c of gr.coinRows) if (!c.got) { const x = Math.round(c.x - cx), y = Math.round(grGround(c.x, gr.ph, T) - cy) - 10; if (x > -6 && x < W + 6) { const f = (gr.tick >> 3) % 4, w = [5, 3, 1, 3][f]; px(g, '#8a6a10', x - (w >> 1) - 1, y - 3, w + 2, 7); px(g, c.v > 1 ? (c.v > 2 ? '#7ae0ff' : '#c8c8d8') : '#ffd84a', x - (w >> 1), y - 2, w, 5); } }
  for (const f of gr.flame) px(g, f.t > 9 ? '#ffffff' : f.t > 5 ? '#ffd84a' : '#ff6a1a', f.x - cx - 1, f.y - cy - 1, f.t > 9 ? 3 : 2, 2);
  grDrawCar(g, gr.C, gr.a, gr.b, cx, cy);
  for (const p of gr.pops) { const hw = PXK.layout(p.text).w / 2 + 2; pxFont(g, p.text, Math.max(hw, Math.min(W - hw, p.x - cx)), p.y - cy, p.c || '#ffd84a', 8, 'center'); }  // toujours en entier dans l'écran
  if (gr.wheelie > 30 && gr.mode === 'play') pxFont(g, 'CABRÉ ' + (gr.wheelie / 60).toFixed(1).replace('.', ','), (gr.a.x + gr.b.x) / 2 - cx, Math.min(gr.a.y, gr.b.y) - cy - 26, '#7ee07a', 8, 'center');
  if (gr.combo > 0 && gr.comboT > 0 && gr.mode === 'play') { pxFont(g, 'COMBO ×' + gr.combo, 4, HUD + 10, '#ff8aff', 8); px(g, '#2a2236', 4, HUD + 13, 44, 2); px(g, '#ff8aff', 4, HUD + 13, Math.round(44 * gr.comboT / GR_COMBO), 2); }
  // le haut : distance, pièces, jauge d'essence (rouge quand elle est presque vide)
  px(g, '#0e0a14', 0, 0, W, HUD);
  pxFont(g, Math.floor(gr.best) + ' m', 4, 9, '#ffffff', 8);
  pxFont(g, '● ' + gr.coins, 70, 9, '#ffd84a', 8);
  const fw = 50, low = gr.fuel < 25; pxFont(g, 'ESSENCE', W - fw - 50, 9, low && (gr.tick >> 4) % 2 ? '#ff4a3a' : '#a898b8', 8); px(g, '#2a2236', W - fw - 4, 3, fw, 6); px(g, low ? '#ff4a3a' : '#7ee07a', W - fw - 4, 3, Math.round(fw * gr.fuel / 100), 6);
  if (W >= 280) { const nx = W - 2 * fw - 108; pxFont(g, 'NITRO', nx - 38, 9, gr.boost ? '#ffd84a' : '#a898b8', 8); px(g, '#2a2236', nx, 3, fw, 6); px(g, gr.nitro >= 100 && (gr.tick >> 3) % 2 ? '#ffffff' : '#5ac8ff', nx, 3, Math.round(fw * gr.nitro / 100), 6); }
  else { px(g, '#2a2236', 112, 3, 20, 6); px(g, '#5ac8ff', 112, 3, Math.round(20 * gr.nitro / 100), 6); }
  if (gr.mode === 'ready') gameText(g, W, [[T.name + ' · ' + gr.C.name, '#ffd84a', 12], ['→ : accélérer   ← : freiner', '#ffffff'], ['Espace : nitro · en l’air, → ← font pencher', '#b8b0c8'], ['Tremplins : vole, fais des saltos, atterris à plat', '#8ad8ff'], ['Enchaîne saltos et cabrés : combo ×5', '#ff8aff']], 42);
  if (gr.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 60);
  if (gr.mode === 'over' && gr.dead > 40) { grEngineOff(); gameText(g, W, [[gr.why === 'crash' ? 'SUR LE TOIT !' : 'PLUS D’ESSENCE !', '#ff6a3a', 12], [Math.floor(gr.best) + ' m, ' + gr.coins + ' pièces', '#ffffff'], [gr.flips + ' salto' + (gr.flips > 1 ? 's' : '') + ' · ' + gr.landings + ' atterrissage' + (gr.landings > 1 ? 's' : '') + ' parfait' + (gr.landings > 1 ? 's' : '') + ' · vol ' + (gr.airBest / 60).toFixed(1).replace('.', ',') + ' s', '#8ad8ff'], ...(gr.comboMax > 1 || gr.wheelieBest ? [['combo max ×' + gr.comboMax + (gr.wheelieBest ? ' · cabré ' + (gr.wheelieBest / 60).toFixed(1).replace('.', ',') + ' s' : ''), '#ff8aff']] : []), [gr.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best['grimpette-' + T.id] || 0) + ' m', '#7ee07a'], [gr.dead > 70 ? 'Espace : garage' : '', '#b8b0c8']], 44); }
  if (gr.mode !== 'play' && gr.mode !== 'over') grEngineOff();
  if (gr.tick % 20 === 0) g.canvas.setAttribute('aria-label', 'Grimpette : ' + Math.floor(gr.best) + ' mètres, ' + gr.coins + ' pièces, essence ' + Math.round(gr.fuel) + ' %' + (gr.mode === 'over' ? ', fini : ' + (gr.why === 'crash' ? 'sur le toit' : 'plus d’essence') : '') + '.');
}
function grInfo() {
  $('grStats').replaceChildren(...[['Record', (games.best.grimpette || 0) + ' m'], ['Pièces', grs.coins], ['Saltos', grs.flipsAll || 0], ['Meilleur combo', '×' + (grs.bestCombo || 0)], ['Parties', grs.games]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !gr || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (gr.mode === 'garage') {
    if (k === 'ArrowUp') { e.preventDefault(); gr.row = (gr.row + 5) % 6; } else if (k === 'ArrowDown') { e.preventDefault(); gr.row = (gr.row + 1) % 6; }
    else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); if (gr.row < 2) grGarageAct(gr.row, k === 'ArrowLeft' ? -1 : 1); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); grGarageAct(gr.row, 0); }
    return;
  }
  if (gr.mode === 'over') { if ((k === ' ' || k === 'Enter') && gr.dead > 70) { e.preventDefault(); grNew('garage'); } return; }
  if (k === 'p' || k === 'P' || k === 'Escape') { if (gr.mode === 'play') gr.mode = 'pause'; else if (gr.mode === 'pause') gr.mode = 'play'; return; }
  if (['ArrowRight', 'd', 'ArrowUp', 'z'].includes(k)) { e.preventDefault(); gr.keys.add('R'); gr.mode = 'play'; }
  else if (['ArrowLeft', 'q', 'a', 'ArrowDown', 's'].includes(k)) { e.preventDefault(); gr.keys.add('L'); gr.mode = 'play'; }
  else if ((k === ' ' || k === 'Shift') && gr.mode === 'play') { e.preventDefault(); gr.keys.add('N'); }
  else if ((k === ' ' || k === 'Enter') && gr.mode !== 'play') { e.preventDefault(); gr.mode = 'play'; }
});
document.addEventListener('keyup', e => { if (!gr) return; if (e.key === ' ' || e.key === 'Shift') gr.keys.delete('N'); if (['ArrowRight', 'd', 'ArrowUp', 'z'].includes(e.key)) gr.keys.delete('R'); if (['ArrowLeft', 'q', 'a', 'ArrowDown', 's'].includes(e.key)) gr.keys.delete('L'); });
{ const cv = $('grCanvas'), at = e => { const r = cv.getBoundingClientRect(); return {x: (e.clientX - r.left) / r.width * GR.W, y: (e.clientY - r.top) / r.height * GR.H}; };
  const rowAt = p => GR_ROWS.findIndex(y => p.y >= y - 10 && p.y < y + 4), gx = () => Math.floor((GR.W - 240) / 2);
  cv.onpointermove = e => { if (gr?.mode === 'garage') gr.hover = rowAt(at(e)); };
  // au garage : clic sur ◀ ▶ ou sur une ligne ; en course : appuyer sur la moitié droite accélère, sur la gauche freine
  cv.onpointerdown = e => { e.preventDefault(); if (!gr) return; const p = at(e);
    if (gr.mode === 'garage') { const row = rowAt(p); if (row < 0) return; gr.row = row; if (row < 2 && p.x - gx() < 100) grGarageAct(row, -1); else if (row < 2 && p.x - gx() < 180) grGarageAct(row, 1); else grGarageAct(row, 0); return; }
    if (gr.mode === 'over') { if (gr.dead > 70) grNew('garage'); return; }
    gr.keys.clear(); gr.keys.add(p.x > GR.W / 2 ? 'R' : 'L'); gr.mode = 'play'; cv.setPointerCapture?.(e.pointerId); };
  cv.onpointerup = () => gr?.keys.clear(); cv.onpointercancel = () => gr?.keys.clear(); }
$('grNew').onclick = () => { grNew('garage'); $('grNew').blur(); };
$('grFs').onclick = () => { $('grFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else $('grCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
function grFit() {
  const cv = $('grCanvas'), fs = document.fullscreenElement === cv.parentElement, w = fs ? innerWidth : innerWidth - 140, h = fs ? innerHeight : Math.max(260, innerHeight - 190);
  const W = Math.max(240, Math.min(400, Math.round(GR.H * w / h / 2) * 2)); if (W === GR.W && cv.width === W) return;
  GR.W = W; cv.width = W; cv.style.setProperty('--ar', String(W / GR.H)); if (gr?.g) gr.g.imageSmoothingEnabled = false;
}
addEventListener('resize', grFit); document.addEventListener('fullscreenchange', () => setTimeout(grFit, 50)); grFit();
function grCheck() {  // vérification : sur chaque terrain avec chaque voiture, en accélérant tout le temps (et en relevant le nez si besoin), on passe 100 m ;
   // sur le toit, la partie s'arrête ; l'essence vide arrête la voiture ; le garage débloque et améliore contre des pièces ; un tremplin fait voler ; le nitro accélère
  const bad = [], keep = gr, keepS = JSON.stringify(grs), keepB = Object.fromEntries(Object.entries(games.best).filter(([k]) => k.startsWith('grimpette'))); grMute = true;
  for (let t = 0; t < GR_TERR.length; t++) for (let c = 0; c < GR_CARS.length; c++) {
    grs.terr = t; grs.car = c; gr = null; grNew('play'); gr.ph = [t * 1.7, c * 2.3, .9, 3.1]; for (const w of [gr.a, gr.b]) { w.y = w.py = grGround(w.x, gr.ph, gr.T) - gr.C.R; }
    for (let i = 0; i < 4000 && gr.mode === 'play' && gr.best < 100; i++) { gr.keys.clear(); const h = grHead(); gr.keys.add(Math.abs(h.ang) > .5 && h.ang < 0 ? 'L' : 'R'); grUpdate(); }
    if (gr.best < 100) bad.push(GR_TERR[t].id + ' ' + GR_CARS[c].id + ' : ' + Math.floor(gr.best) + ' m (' + gr.why + ')');
  }
  grs.terr = 0; grs.car = 0; gr = null; grNew('play'); const c = 60, y = grGround(60, gr.ph, gr.T); gr.a = {x: c + 11, y: y - 30, px: c + 11, py: y - 30, rot: 0}; gr.b = {x: c - 11, y: y - 30, px: c - 11, py: y - 30, rot: 0};
  for (let t = 0; t < 200 && gr.mode === 'play'; t++) grUpdate(); if (gr.why !== 'crash') bad.push('toit : ' + gr.mode);
  gr = null; grNew('play'); gr.fuel = 0; gr.keys.add('R'); for (let t = 0; t < 400 && gr.mode === 'play'; t++) grUpdate(); if (gr.why !== 'essence') bad.push('essence : ' + gr.mode);
  grs.coins = 1000; grs.owned = {terr: [0], car: [0]}; grs.terr = 1; gr = null; grNew('garage'); grGarageAct(5, 0); if (!grs.owned.terr.includes(1) || grs.coins !== 850) bad.push('débloquer : ' + grs.coins);
  grGarageAct(2, 0); if (grUp(0).moteur !== 1 || grs.coins !== 830) bad.push('améliorer : ' + grs.coins);
  grGarageAct(5, 0); if (gr.mode !== 'ready') bad.push('partir : ' + gr.mode);
  // un tremplin fait décoller (plus d'une demi-seconde en l'air) ; le nitro pousse plus vite ; chaque véhicule a son moteur
  grs.terr = 0; grs.car = 0; gr = null; grNew('play'); gr.ph = [.4, 1.3, .9, 3.1]; let rx = 0; for (let x = 1100; x < 6000 && !rx; x++) if (grRamp(x, gr.ph, gr.T) > 20) rx = x;
  if (!rx) bad.push('pas de tremplin'); else { const sx = rx - 260; for (const w of [gr.a, gr.b]) { w.x = sx + (w === gr.b ? gr.C.L : 0); w.y = grGround(w.x, gr.ph, gr.T) - gr.C.R; w.px = w.x - 3; w.py = w.y; }
    let air = 0, mx = 0; for (let t = 0; t < 300 && gr.mode === 'play'; t++) { gr.keys.clear(); gr.keys.add('R'); grUpdate(); if (gr.air > mx) mx = gr.air; } air = mx; gr.flightTest = air; if (air < 30) bad.push('tremplin : ' + air + ' images en l’air'); }
  { const run = n => { grs.car = 0; gr = null; grNew('play'); gr.ph = [5, 5, 5, 5]; if (n) gr.nitro = 100; for (let t = 0; t < 240; t++) { gr.keys.clear(); gr.keys.add('R'); if (n) gr.keys.add('N'); grUpdate(); } return gr.best; }; const a = run(0), b = run(1); if (!(b > a + 8)) bad.push('nitro : ' + Math.round(a) + ' → ' + Math.round(b) + ' m'); }
  if (new Set(GR_CARS.map(c => c.eng.join())).size !== GR_CARS.length) bad.push('moteurs pareils');
  // les figures : double salto avant + vol, salto arrière ; deux figures à la suite font un combo ×2 ; au sol, le combo s'éteint
  { const t1 = grTricks(Math.PI * 4.1, 45), t2 = grTricks(-Math.PI * 2.05, 10);
    if (t1.out.join() !== 'DOUBLE SALTO AVANT,VOL 0,8 s' || t1.pts !== 31) bad.push('figures : ' + t1.out + ' ' + t1.pts);
    if (t2.out.join() !== 'SALTO ARRIÈRE' || t2.pts !== 10) bad.push('salto arrière : ' + t2.out + ' ' + t2.pts);
    gr = null; grNew('play'); grScore(10, 'a', 0, 0); grScore(10, 'b', 0, 0); if (gr.combo !== 2 || gr.coins !== 30) bad.push('combo : ×' + gr.combo + ', ' + gr.coins + ' pièces');
    for (let i = 0; i < 6; i++) grScore(1, 'c', 0, 0); if (gr.combo !== 5) bad.push('combo plafond : ×' + gr.combo); }
  grs.terr = 0; grs.car = 0;
  Object.assign(grs, JSON.parse(keepS)); for (const k of Object.keys(games.best)) if (k.startsWith('grimpette') && !(k in keepB)) delete games.best[k]; Object.assign(games.best, keepB); gr = keep; grMute = false;
  return bad.join(' | ') || 'ok';
}
{ const c = grCheck(); console.assert(c === 'ok', 'grimpette', c); }
$('grCanvas').__gr = {st: () => gr, check: grCheck, score: (p, l) => grScore(p, l, (gr.a.x + gr.b.x) / 2, gr.a.y), ramp: x => grRamp(x, gr.ph, gr.T), ground: x => grGround(x, gr.ph, gr.T), eng: () => grEng && {fq: grEng.fq, car: grEng.car}};
ctx.onOpen(() => {
  if (!gr || !gr.g) { grNew('garage'); gr.g = $('grCanvas').getContext('2d'); }
  gameLoop(gr, 'grimpette', grUpdate, grDraw); grInfo();
});
}
