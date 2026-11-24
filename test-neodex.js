// lancé par le test « local » de NeoDex : la vérification interne (terrains × voitures, tremplin, nitro), le garage, une course au clavier
// avec un tremplin (vol, nitro, son du moteur), la scène qui s'élargit sur grand écran, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('grCanvas').__gr, gr = T.st(); ${code} })()`);
  const key = (k, type = 'keydown') => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('grCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'grimpette-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('grNew').click(), 0`); await sleep(200); await shot('0-garage');
  const W = await pj(`document.getElementById('grCanvas').width`), ww = await pj('innerWidth');
  if (ww > 1600 && !(W > 300)) throw new Error('la scène devait s\'élargir sur grand écran : ' + W + ' px');
  await C(`gr.row = 5; return 0;`); await key('Enter'); await sleep(100); if (await C('return gr.mode;') !== 'ready') throw new Error('PARTIR devait lancer la course');
  // juste avant un tremplin, lancé : le véhicule décolle ; on garde le nitro
  await C(`let rx = 0; for (let x = 1100; x < 8000 && !rx; x++) if (T.ramp(x) > 18) rx = x; const sx = rx - 300; for (const w of [gr.a, gr.b]) { w.x = sx + (w === gr.b ? gr.C.L : 0); w.y = T.ground(w.x) - gr.C.R; w.px = w.x - 3.4; w.py = w.y; } gr.cam.x = sx - 80; gr.fuel = 100; gr.nitro = 100; return rx;`);
  await key('ArrowRight'); await sleep(500); await key(' '); await sleep(250); await shot('1-nitro');
  const eng = await C('return T.eng();'); if (!eng || !(eng.fq > 0) || eng.car !== 'jeep') throw new Error('le moteur devait tourner : ' + JSON.stringify(eng));
  let air = 0, shotAir = false; for (let i = 0; i < 40; i++) { await sleep(50); const a = await C('return gr.air;'); air = Math.max(air, a); if (a > 14 && !shotAir) { shotAir = true; await shot('2-vol'); } }
  await key(' ', 'keyup'); await key('ArrowRight', 'keyup');
  if (air < 20) throw new Error('le tremplin devait faire voler la voiture : ' + air + ' images');
  // les figures (1.3.0) : deux figures à la suite font un combo ×2, affiché sous la barre du haut
  const cb = await C("gr.comboT = 0; T.score(31, 'DOUBLE SALTO AVANT + VOL 0,8 s'); T.score(10, 'SALTO ARRIÈRE'); return gr.combo;"); await sleep(150); await shot('2b-combo');
  if (cb !== 2) throw new Error('le combo devait passer à ×2 : ' + cb);
  await key('p'); await sleep(300); const off = await C('return T.eng();'); if (off && off.fq) throw new Error('le moteur devait se taire en pause');
  await key('p');
  await C(`gr.mode = 'play'; gr.fuel = 0; gr.keys.clear(); return 0;`); await sleep(2500); await shot('3-fin');
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('grFs').click(), 0`); await sleep(800);
  const fs = await pj(`(() => { const c = document.getElementById('grCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(400);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('grCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('grCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 260) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  await pj(`document.getElementById('grNew').click(), 0`); await sleep(200);
  return 'vérification ok · garage · tremplin : ' + (air / 60).toFixed(1) + ' s en l\'air · combo ×2 · nitro · moteur ' + Math.round(eng.fq) + ' Hz, muet en pause · scène ' + W + ' px · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
