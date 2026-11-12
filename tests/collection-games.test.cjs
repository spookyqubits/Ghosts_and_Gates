const {test} = require('node:test');
const assert = require('node:assert/strict');
const {loadGame} = require('./game-harness.cjs');

test('Coin solo starts at a meaningful choice, completes the trick and preserves replay settings', () => {
  const a = loadGame('ghost-coin.html','?solo=1');
  assert.equal(a.run('S.level'),2); assert.equal(a.run('S.phase'),'pick');
  for (let round = 0; round < 5; round++) {
    a.run("pick('ghost')"); assert.equal(a.timers.size,1); a.tick();
    assert.equal(a.run('S.slot'),2); a.run("pick('ghost')");
    assert.equal(a.run('S.phase'),'done'); assert.equal(a.run('S.result'),'H');
    assert.equal(a.run('S.odds'),1); assert.match(a.node('#odds').textContent,/Challenge met/);
    a.node('#next-round').click(); assert(a.node('#cpu-b').checked); assert(a.node('#quick-play').checked);
  }
  assert.equal(a.run('S.score[2].a'),5);
});
test('Coin stale computer and toss callbacks cannot act on a restarted round', () => {
  const a = loadGame('ghost-coin.html','?solo=1');
  a.run("pick('leave')"); const cpu = [...a.timers.values()][0]; a.run('newRound()');
  assert.equal(a.timers.size,0); cpu(); assert.equal(a.run('S.slot'),0);
  a.run("pick('ghost')"); a.tick(); a.run("pick('leave')");
  assert.equal(a.run('S.phase'),'toss'); assert.equal(a.run('S.odds'),.5);
  const toss = [...a.timers.values()][0]; a.run('newRound()'); toss();
  assert.equal(a.node('#toss').disabled,false); assert.equal(a.run('S.phase'),'pick');
  assert.equal(a.run('S.score[2].r'),0);
});
test('Coin retains the shared-screen step-by-step path', () => {
  const a = loadGame('ghost-coin.html'); a.run("S.level=2;pick('ghost');pick('flip');pick('ghost')");
  assert.equal(a.run('S.phase'),'ready'); a.run('reveal()');
  for(let i=0;i<30 && a.run('S.phase')==='playing';i++) a.run('step()');
  assert.equal(a.run('S.phase'),'open'); a.run('openBox()'); assert.equal(a.run('S.result'),'H');
});
test('Guard Sign + Check example explains an unrepairable error and leaves scores unchanged', () => {
  const a = loadGame('ghost-guard.html'); a.run('level=2;newGame()');
  assert.equal(a.node('#diagnosis').hidden,false); a.node('#sign-example').click();
  assert.equal(a.run('S.syn'),'00'); assert.equal(a.run('judge(S).why'),'soured');
  assert.equal(a.run('score.g+score.r'),0); assert.equal(a.node('#diagnosis-questions').hidden,false);
  assert(!a.node('#result').innerHTML.includes('Gremlin wins'));
  a.node('#check-diagnosis').click(); assert.match(a.node('#diagnosis-feedback').textContent,/Choose/);
  a.node('#diagnosis-why').value='speed'; a.node('#diagnosis-need').value='phase';
  a.node('#check-diagnosis').click(); assert.match(a.node('#diagnosis-feedback').textContent,/Try again/);
  a.node('#diagnosis-why').value='coins'; a.node('#check-diagnosis').click();
  assert.match(a.node('#diagnosis-feedback').textContent,/Challenge complete/);
  a.run('level=1;newGame()'); assert.equal(a.node('#diagnosis').hidden,true);
});
test('Guard delayed computer turns are cancelled across restarts and role changes', () => {
  const a = loadGame('ghost-guard.html'); a.node('#mode').value='cpuG';
  a.run("newGame();gremlinPlays({type:'calm'})"); assert.equal(a.timers.size,1);
  const old = [...a.timers.values()][0]; a.run('newGame()'); old();
  assert.equal(a.run('S.t'),0); assert.equal(a.run('phase'),'r');
  a.run("gremlinPlays({type:'calm'})"); a.tick(); assert.equal(a.run('S.t'),1);
});
test('Guard Level 1 remains winnable and normal duels count once', () => {
  const a = loadGame('ghost-guard.html');
  a.run("S=makeState(1,0,0);flipAll(S.rows,0);flipAll(S.rows,FIX[checkRows(S.rows)]);finish();finish()");
  assert.equal(a.run('judge(S).win'),true); assert.equal(a.run('score.g'),1);
});
test('Hunt solo finishes six nights, retains full math practice, and replays', () => {
  const a = loadGame('ghost-hunt.html','?solo=1');
  assert.equal(a.run('D.phase'),'rounds');
  for (let n=1;n<=6;n++) {
    assert.equal(a.run('D.night'),n);
    if(a.run('D.phase')==='rounds') a.run('chooseRounds(1)');
    else a.run('toggleRoom(0);lockGhosts()');
    assert.equal(a.run('D.phase'),'look'); assert.equal(a.run('D.step===D.k'),true);
    assert(a.run('D.rows.every(r=>Math.abs(D.M*r.G*r.G+(8-D.M)*r.E*r.E-128)<1e-8)'));
    a.run('flipCoins()'); assert.equal(a.run('D.phase'),'result');
    assert.match(a.node('#duel-bars').innerHTML,/Before LOOK/); a.run('nextNight()');
  }
  assert.equal(a.run('D.phase'),'over'); assert.equal(a.run('D.log.length'),6);
  a.run('newDuel()'); assert.equal(a.run('D.phase'),'rounds');
  a.node('#practice-on').checked=true; a.run('chooseRounds(2)'); assert.equal(a.run('D.phase'),'rounds');
  a.run('lockRounds();startCompute()'); assert.equal(a.run('D.phase'),'compute'); assert.equal(a.run('D.step'),0);
});
test('Hunt measurement labels preserve and identify the pre-measurement amplitudes', () => {
  const a = loadGame('ghost-hunt.html'); a.run("setTab('lab');labFlip();labReflect();saved=L.vals.slice();labLook()");
  assert.equal(a.run('JSON.stringify(saved)===JSON.stringify(L.vals)'),true);
  assert.match(a.node('#lab-bars').innerHTML,/Before LOOK/);
  assert.equal(a.node('#lab-chance-label').textContent,'chance before LOOK');
  assert.match(a.node('#lab-event').textContent,/do not show the collapsed state/);
  assert(a.node('#lab-look').disabled);
});
test('Hunt pending reflect cannot alter a reset hotel or finish a later round', () => {
  const a=loadGame('ghost-hunt.html'); a.run("setTab('lab');labRound()");
  const stale=[...a.timers.values()][0]; a.run('labReset();labFlip()'); stale();
  assert.equal(a.run('L.k'),0); assert.equal(a.run('L.flipped'),true);
  a.run('labReset();labRound();labReflect();labFlip()'); assert.equal(a.timers.size,0);
  assert.equal(a.run('L.k'),1); assert.equal(a.run('L.flipped'),true);
  a.run('labNew()'); assert.equal(a.run('L.k'),0);
});
test('Hunt room-count examples match the computed first probability peaks', () => {
  const a=loadGame('ghost-hunt.html'); assert.equal(a.run('GH.best(1000000,1).k'),785);
  assert.equal(a.run('GH.best(1048576,1).k'),804);
});
test('Photon direct solo link skips the hidden-hand setup', () => {
  const a=loadGame('catch-the-photon.html','?solo=1');
  assert.equal(a.run('G.phase'),'choose'); assert(a.node('#cpu-b').checked); assert(a.run('quickMode'));
});
