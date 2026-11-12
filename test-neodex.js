// lancé par le test « local » de NeoDex : passe par le garage (change de voiture et revient), part, accélère quelques secondes
// et vérifie que la voiture avance et que l'essence baisse (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const ev = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const key = async k => { await ev('keydown', k); await ev('keyup', k); };
  const label = () => pj(`document.getElementById('grCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('grCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'grimpette-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500);
  if (!/garage : terrain Prairie, voiture Jeep/.test(await label())) throw new Error('le garage devait s’ouvrir d’abord : « ' + (await label()) + ' »');
  await shot('0-garage');
  await key('ArrowUp'); await key('ArrowUp'); await key('ArrowUp'); await key('ArrowUp'); await key('ArrowRight'); await sleep(400); await shot('1-monster');
  if (!/voiture Monster, .*à débloquer/.test(await label())) throw new Error('le Monster devait être à débloquer : « ' + (await label()) + ' »');
  if (process.env.NEO_SHOTS) {  // chaque monde puis chaque véhicule, au garage
    await key('ArrowLeft'); await key('ArrowUp'); for (let i = 1; i <= 13; i++) { await key('ArrowRight'); await sleep(120); await shot('m' + i); }
    await key('ArrowDown'); for (let i = 1; i <= 12; i++) { await key('ArrowRight'); await sleep(120); await shot('v' + i); }
    if (!/terrain Prairie, voiture Jeep/.test(await label())) throw new Error('13 mondes et 12 véhicules attendus : « ' + (await label()) + ' »');
    await key('ArrowRight');  // revient sur le Monster, comme sans images
  }
  await key('ArrowLeft'); for (let i = 0; i < 4; i++) await key('ArrowDown'); await key('Enter'); await sleep(300);
  await ev('keydown', 'ArrowRight'); await sleep(3000); await shot('2-route');
  await sleep(4000); await shot('3-plus-loin');
  await ev('keyup', 'ArrowRight');
  const l = await label(), m = /(\d+) mètres, (\d+) pièces, essence (\d+) %/.exec(l);
  if (!m || +m[1] < 40 || +m[3] >= 100) throw new Error('la voiture devait avancer et consommer : « ' + l + ' »');
  return l;
};
