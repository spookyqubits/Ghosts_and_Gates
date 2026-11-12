const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {loadGame} = require('./game-harness.cjs');

test('all 793,800 Level 2 schedules with table-based fixes fail to preserve the secret', () => {
  const a = loadGame('ghost-guard.html');
  const result = a.run(`(() => {
    let cases=0, wins=0;
    const checks=[];
    for(let a=0;a<7;a++) for(let b=a+1;b<7;b++) for(let c=b+1;c<7;c++) checks.push([a,b,c]);
    for(const nights of checks) for(let f1=0;f1<7;f1++) for(let f2=f1+1;f2<7;f2++)
    for(let z=0;z<7;z++) { if(z===f1 || z===f2) continue;
      for(let c1=0;c1<3;c1++) for(let c2=0;c2<3;c2++) for(let cz=0;cz<3;cz++) for(let secret=0;secret<8;secret++) {
        const state=makeState(2,secret,0);
        for(let t=0;t<7;t++) {
          applyNoise(state,t===f1?{type:'flip',k:c1}:t===f2?{type:'flip',k:c2}:t===z?{type:'sign',k:cz}:{type:'calm'});
          const syn=guardianAct(state,nights.includes(t)?'check':'rest');
          if(syn && FIX[syn]!==null) flipAll(state.rows,FIX[syn]);
          state.t++;
        }
        const fix=FIX[checkRows(state.rows)]; if(fix!==null) flipAll(state.rows,fix);
        cases++; if(judge(state).win) wins++;
      }
    }
    return {cases,wins};
  })()`);
  assert.equal(result.cases,793800); assert.equal(result.wins,0);
});

function engine(file, name, marker) {
  const html=fs.readFileSync(path.join(__dirname,'../games',file),'utf8');
  const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0][1];
  return vm.runInNewContext(script.slice(0,script.indexOf(marker))+`;${name};`);
}
function random(seed) { let s=seed; return n=>{s=(s*1664525+1013904223)>>>0;return s%n;}; }
for(const [file,steps] of [['ghost-grid-intro.html',false],['ghost-grid-step-by-step.html',true]]) {
  test(`complete placement, own-pair measurement, collapse, undo and replay in ${file}`,()=>{
    const Engine=engine(file,'GhostGame','const game = new GhostGame();');
    let measurements=0, chains=0;
    for(let seed=1;seed<=120;seed++) {
      const g=new Engine(), pick=random(seed);
      let actions=0;
      while(g.phase!=='over' && actions++<250) {
        if(g.phase==='play') {
          if(g.mode==='quantum' && g.roomSquares().length>=2) {
            const rooms=Array.from(g.roomSquares()); const first=rooms.splice(pick(rooms.length),1)[0];
            g.choose(first); g.choose(rooms[pick(rooms.length)]);
          } else { g.setMode('classical'); const rooms=g.emptySquares(); assert(rooms.length); g.choose(rooms[pick(rooms.length)]); }
        } else if(g.phase==='measure') {
          const pair=g.pairs.find(p=>p.player===g.turn); assert(pair,'current player has a measurable pair');
          g.selectedPair=pair.id; const before=g.snapshot();
          g.measure(1+pick(6)); measurements++;
          assert.notEqual(g.snapshot(),before,'a legal roll must resolve the selected pair');
        } else if(g.phase==='chain') { assert(steps); g.advanceChain(); chains++; }
        else assert.fail('Unexpected phase '+g.phase);
        // Every real square contains one move; uncollapsed marks only share during an animated chain.
        if(g.phase!=='chain') for(let sq=1;sq<=9;sq++) assert(!g.solid[sq] || !g.halvesAt(sq).length);
      }
      assert.equal(g.phase,'over',`seed ${seed} finishes`); assert(g.result);
      g.undo(); assert.notEqual(g.phase,'over'); g.reset(); assert.equal(g.phase,'play'); assert.equal(g.pairs.length,0);
    }
    assert(measurements>0); if(steps) assert(chains>0);
  });
}
test('full Goff games finish through loops and forced chains, then support undo and replay',()=>{
  const Engine=engine('ghost-grid-full.html','QuantumGame','const PALETTE =');
  let loops=0,chains=0;
  for(let seed=1;seed<=120;seed++) {
    const g=new Engine(),pick=random(seed);let actions=0;
    while(g.phase!=='over' && actions++<80) {
      if(g.phase==='play') {
        const rooms=Array.from(g.openSquares()); assert(rooms.length);
        const first=rooms.splice(pick(rooms.length),1)[0];g.choose(first);
        if(rooms.length && g.phase==='play')g.choose(rooms[pick(rooms.length)]);
      } else if(g.phase==='collapse') {loops++;g.chooseCollapse(g.cycle.options[pick(g.cycle.options.length)]);}
      else if(g.phase==='chain') {chains++;g.advanceChain();}
      else assert.fail('Unexpected phase '+g.phase);
    }
    assert.equal(g.phase,'over',`seed ${seed} finishes`);assert(g.result);
    g.undo();assert.notEqual(g.phase,'over');g.reset();assert.equal(g.phase,'play');assert.equal(g.move,1);
  }
  assert(loops>0);assert(chains>0);
});
