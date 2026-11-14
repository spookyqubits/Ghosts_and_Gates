const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../games/catch-the-photon.html'), 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
function load(full = false) {
  class Element {
    constructor() { this.dataset = {}; this.style = {setProperty(){}}; this.classList = {add(){},remove(){}}; this.children = new Map(); this.disabled = false; this.checked = false; this.innerHTML = ''; this.textContent = ''; }
    querySelector(s) { if (!this.children.has(s)) this.children.set(s, new Element()); return this.children.get(s); }
    querySelectorAll() { return []; }
    appendChild() {} setAttribute() {} addEventListener() {}
    getBoundingClientRect() { return {width:200}; }
    get parentElement() { return this; }
  }
  const nodes = new Map(), timers = new Map(); let timerId = 0;
  const document = {body:{dataset:{tab:'play'}}, querySelector(s){if(!nodes.has(s)) nodes.set(s,new Element()); return nodes.get(s);},querySelectorAll(){return [];},createElementNS(){return new Element();},addEventListener(){}};
  const ctx = vm.createContext({window:{},document,location:{search:''},URLSearchParams,crypto:require('node:crypto').webcrypto,Float32Array,Uint32Array,
    setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout(id){timers.delete(id);}});
  vm.runInContext(scripts[0],ctx); ctx.CP = ctx.window.CP; vm.runInContext(scripts[1],ctx);
  if (full) vm.runInContext(scripts[2],ctx);
  return {ctx, CP:ctx.CP, nodes, timers, run:code=>vm.runInContext(code,ctx), tick(){const [id,fn]=timers.entries().next().value||[];if(fn){timers.delete(id);fn();}}, random(u){ctx.crypto={getRandomValues(a){a[0]=Math.floor(u*4294967296);return a;}};}};
}
const arr = x => Array.from(x);
test('40-card deck has seven 1s and three 2s per direction',()=>{
  const {CP} = load(), deck = CP.newDeck(()=>.37);
  assert.equal(deck.length,40);
  for(const direction of ['U','D','R','L']) for(const [strength,count] of [[1,7],[2,3]]) assert.equal(deck.filter(c=>c.direction===direction&&c.strength===strength).length,count);
});
test('strength affects movement, exact and partial cancellation, reversal and brightness',()=>{
  const {CP} = load(), U={direction:'U',strength:2},D={direction:'D',strength:1};
  assert.deepEqual(arr(CP.step([0,0],U)),[0,2]); assert.equal(CP.bright(CP.step([0,0],U)),4);
  assert.deepEqual(arr(CP.step(CP.step([0,0],U),D)),[0,1]);
  assert.deepEqual(arr(CP.step([0,2],{...D,strength:2})),[0,0]);
  assert.deepEqual(arr(CP.step([0,1],{...D,strength:2})),[0,-1]);
  assert.equal(CP.onBoard(CP.step([0,3],U)),false);
  assert.equal(CP.winp(25,9),25/34);
});
test('card artwork has opposite crest/trough starts, common amplitude scale, and approved colors',()=>{
  const {CP}=load(); assert.equal(CP.WAVES.U.color,'#154c9c'); assert.equal(CP.WAVES.D.color,'#c0182a');
  for(const direction of ['U','D','R','L']) for(const strength of [1,2]) {
    const card={direction,strength},svg=CP.cardSVG(card,'test');
    assert(svg.includes(`Move ${strength} ${CP.WAVES[direction].dir}`));
    assert(svg.includes('>+2<')); assert(svg.includes('>−2<')); assert(!/[♠♣♥♦]/.test(svg));
    assert.equal(CP.waveY(...CP.vector(card),0),CP.vector(card)[1]);
  }
});
test('computer can prefer a 1-step cancellation over an available 2',()=>{
  const {CP}=load(); const hand=[{direction:'D',strength:2},{direction:'D',strength:1}];
  const pick=CP.careful(0,[[1,0],[0,1]],hand); assert.equal(pick.idx,1); assert.equal(pick.target,1);
  const blocked=CP.careful(0,[[4,0],[4,1]],[{direction:'R',strength:2}]); assert.equal(blocked.target,-1);
});
test('reset during firing cancels the old result and restores Fire for later games',()=>{
  const app=load(true);
  app.random(0);
  for(let i=0;i<4;i++) {
    app.run("G.pos=[[0,2],[1,0]];G.phase='photon';fire()"); assert.equal(app.nodes.get('#fire').disabled,true); assert.equal(app.timers.size,1);
    const stale=[...app.timers.values()][0]; app.run('newGame()'); assert.equal(app.timers.size,0); assert.equal(app.nodes.get('#fire').disabled,false);
    stale(); assert.equal(app.run('G.result'),null); assert.equal(app.run('score[0]+score[1]'),0);
  }
  app.run("G.pos=[[0,2],[1,0]];G.phase='photon';fire()");
  const finish=[...app.timers.values()][0]; app.timers.clear(); finish(); finish(); assert.equal(app.run('G.phase'),'done'); assert.equal(app.nodes.get('#fire').disabled,false);
  assert(app.nodes.get('#event').textContent.includes('A 80%, B 20%'));
  assert.equal(app.run('score[0]+score[1]'),1);
  app.run('newGame()'); assert.equal(app.nodes.get('#fire').disabled,false);
});
test('the 64 replacement slips reproduce exact A, B and missed probabilities at every board pair',()=>{
  const {CP}=load();
  const weights=[...new Set(Array.from({length:9},(_,i)=>i-4).flatMap(x=>Array.from({length:9},(_,i)=>x*x+(i-4)**2)))];
  for(const a of weights)for(const b of weights){
    const counts=[0,0,0];for(let slip=0;slip<64;slip++)counts[CP.photon(a,b,(slip+.5)/64)]++;
    assert.deepEqual(counts,[a,b,64-a-b]);
  }
  assert.equal(CP.photon(25,9,25/64),1);assert.equal(CP.photon(25,9,34/64),2);
  assert.equal(CP.retryRun(0,0,.5,.5),null);
  assert.equal(CP.retryRun(32,32,.999,.25).misses,0);
});
test('automatic retries use geometric replacement trials and preserve conditional winner odds',()=>{
  const {CP}=load();
  for(const [a,b]of [[1,0],[0,1],[25,9],[32,32]]){
    const p=(a+b)/64;
    for(const k of [0,1,2,10,100]){
      if(p===1 && k)continue;
      const lo=1-(1-p)**k, hi=1-(1-p)**(k+1), u=(lo+hi)/2;
      if(u===1 || hi===lo)continue;
      assert.equal(CP.retryRun(a,b,u,0).misses,k);
    }
    let winsA=0;for(let i=0;i<a+b;i++)winsA+=CP.retryRun(a,b,.5,(i+.5)/(a+b)).winner===0;
    assert.equal(winsA,a);
  }
});
test('a visible miss advances automatically, counts compressed retries, and awards one win',()=>{
  const app=load(true);app.random(.75);
  app.run("G.pos=[[1,0],[0,0]];G.phase='photon';fire()");app.tick();
  assert.equal(app.run('G.missed'),1);assert.equal(app.run('G.phase'),'photon');
  assert(app.nodes.get('#result').textContent.includes('Missed'));assert.equal(app.run('score[0]+score[1]'),0);
  assert.equal(app.timers.size,1);app.tick();
  assert(app.run('G.missed')>1);assert.equal(app.run('G.attempts'),app.run('G.missed+1'));
  app.tick();assert.equal(app.run('G.phase'),'done');assert.equal(app.run('G.result'),0);assert.equal(app.run('score[0]'),1);
  assert.equal(app.timers.size,0);
});
test('B can detect immediately or after misses, and a full cup has no missed outcome',()=>{
  for(const [positions,u,expectedMisses] of [[[[4,4],[4,4]],.75,false],[[[0,0],[4,4]],.25,false],[[[0,0],[1,0]],.9,true]]){
    const app=load(true);app.random(u);
    app.run(`G.pos=${JSON.stringify(positions)};G.phase='photon';fire()`);
    let ticks=0;while(app.timers.size && ticks++<4)app.tick();
    assert.equal(app.run('G.phase'),'done');assert.equal(app.run('G.result'),1);assert.equal(app.run('score[1]'),1);
    assert.equal(app.run('G.missed>0'),expectedMisses);assert.equal(app.run('G.attempts'),app.run('G.missed+1'));
  }
});
test('reset cancels retries both after a miss and during the final detected-photon animation',()=>{
  for(const ticks of [1,2]){
    const app=load(true);app.random(.9);
    app.run("G.pos=[[1,0],[0,0]];G.phase='photon';fire()");for(let i=0;i<ticks;i++)app.tick();
    const stale=[...app.timers.values()][0];app.run('newGame()');assert.equal(app.timers.size,0);stale();
    assert.equal(app.run('G.result'),null);assert.equal(app.run('score[0]+score[1]'),0);assert.equal(app.run('G.attempts'),0);
    assert.equal(app.nodes.get('#fire').disabled,false);
  }
});
test('both-dark never starts a retry loop and the readout does not invent 50/50 odds',()=>{
  const app=load(true);app.run("G.phase='photon';fire();render()");
  assert.equal(app.timers.size,0);assert.equal(app.nodes.get('#pm').style.width,'100%');
  assert(app.nodes.get('#eventual-odds').textContent.includes('Both dark'));
  app.run("G.pos=[[0,2],[1,0]];render()");
  assert.equal(app.nodes.get('#pa').style.width,'6.25%');assert.equal(app.nodes.get('#pb').style.width,'1.5625%');
  assert(app.nodes.get('#eventual-odds').textContent.includes('A 80%'));
});
test('solo quick play completes eight rounds and replays without reveal/transition clicks',()=>{
  const app=load(true); app.nodes.get('#solo').onclick(); assert.equal(app.run('G.phase'),'choose');
  let safety=0;
  while(app.run('G.phase')==='choose' && safety++<30) {
    app.run('constPick=careful(0,G.pos,G.hands[0]);G.sel=constPick.idx;chooseTarget(constPick.target)');
  }
  assert.equal(app.run('G.phase'),'photon'); assert(safety>=8); assert(safety<30);
  app.run('newGame()'); assert.equal(app.run('G.phase'),'choose'); assert.equal(app.nodes.get('#cpu-b').checked,true);
});
test('lab strength-2 presets preserve amplitude and cancellation',()=>{
  const app=load(true); app.run("LAB=[wave('U',2),wave('D')];renderLab()"); assert.equal(app.run('bright(labPos())'),1);
  app.run("LAB=[wave('U',2),wave('D',2)];renderLab()"); assert.equal(app.run('bright(labPos())'),0);
  app.run('LAB=PRESETS[3].w.slice();renderLab()'); assert.equal(app.run('bright(labPos())'),25);
});
test('simultaneous edge collision loses the second whole card without moving off-board',()=>{
  const app=load(true);
  app.run("G.pos=[[0,3],[0,0]];G.picks=[{card:wave('U'),target:0},{card:wave('U'),target:0}];first=applyPick(0);second=applyPick(1)");
  assert.equal(app.run('first.lost'),false);assert.equal(app.run('second.lost'),true);assert.deepEqual(arr(app.run('G.pos[0]')),[0,4]);
  assert.equal(app.run('G.discard.length'),2);
  app.run("G.pos=[[0,3],[0,0]];G.picks=[{card:wave('U',2),target:0},null];whole=applyPick(0)");
  assert.equal(app.run('whole.lost'),true);assert.deepEqual(arr(app.run('G.pos[0]')),[0,3]);
});
