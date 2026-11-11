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
  const ctx = vm.createContext({window:{},document,crypto:require('node:crypto').webcrypto,Float32Array,Uint32Array,
    setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout(id){timers.delete(id);}});
  vm.runInContext(scripts[0],ctx); ctx.CP = ctx.window.CP; vm.runInContext(scripts[1],ctx);
  if (full) vm.runInContext(scripts[2],ctx);
  return {ctx, CP:ctx.CP, nodes, timers, run:code=>vm.runInContext(code,ctx)};
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
  for(let i=0;i<4;i++) {
    app.run("G.pos=[[0,2],[1,0]];G.phase='photon';fire()"); assert.equal(app.nodes.get('#fire').disabled,true); assert.equal(app.timers.size,1);
    const stale=[...app.timers.values()][0]; app.run('newGame()'); assert.equal(app.timers.size,0); assert.equal(app.nodes.get('#fire').disabled,false);
    stale(); assert.equal(app.run('G.result'),null); assert.equal(app.run('score[0]+score[1]'),0);
  }
  app.run("G.pos=[[0,2],[1,0]];G.phase='photon';fire()");
  const finish=[...app.timers.values()][0]; app.timers.clear(); finish(); assert.equal(app.run('G.phase'),'done'); assert.equal(app.nodes.get('#fire').disabled,false);
  assert(app.nodes.get('#event').textContent.includes('A 80%, B 20%'));
  app.run('newGame()'); assert.equal(app.nodes.get('#fire').disabled,false);
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
