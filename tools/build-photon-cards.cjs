// Regenerate the self-contained printable HTML from the game's exact card art.
// Usage: node tools/build-photon-cards.cjs [game.html] [output.html]
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const input = process.argv[2] || path.join(__dirname,'../games/catch-the-photon.html');
const output = process.argv[3] || path.join(__dirname,'../games/CatchThePhoton_Wave_Cards.html');
const source = fs.readFileSync(input,'utf8'), context = {window:{}};
for(const id of ['logic','card-art']) vm.runInNewContext(source.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`))[1], context);
const {CP}=context.window, cards=[];
// Interleave the four directions so a sheet can also serve as a color/phase key.
for(let i=0;i<10;i++) for(const direction of ['U','D','R','L']) cards.push({direction,strength:i<7?1:2});
const sheets=[];
for(let i=0;i<cards.length;i+=6) sheets.push(`<section class="sheet" aria-label="Sheet ${i/6+1}">${cards.slice(i,i+6).map((card,j)=>`<div class="card" role="img" aria-label="Strength ${card.strength}, move ${card.strength} ${CP.WAVES[card.direction].dir}">${CP.cardSVG(card,`print-${i+j}`)}</div>`).join('')}</section>`);
fs.writeFileSync(output, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Catch the Photon wave cards</title><style>
*{box-sizing:border-box}body{margin:0;background:#faf7f1;color:#242622;font:16px Arial,sans-serif}header{max-width:850px;margin:30px auto;padding:0 20px}h1{color:#b41524}button{padding:10px 18px;background:#b41524;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer}.sheet{display:grid;grid-template-columns:repeat(3,2.25in);grid-template-rows:repeat(2,3.375in);gap:.15in;justify-content:center;margin:30px auto}.card,.card svg{width:2.25in;height:3.375in;display:block}@page{size:letter;margin:.5in}@media print{body{background:white}header{display:none}.sheet{break-after:page;margin:.25in 0 0;gap:.15in}.sheet:last-child{break-after:auto}*{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style></head><body><header><h1>Catch the Photon wave cards</h1><p>40 cards: seven 1s and three 2s per direction. Blue ↑, red ↓, purple →, gold ←. Print all seven sheets at 100%, cut around each border, and use identical opaque backs or sleeves.</p><p>Every plot uses the same amplitude scale and frequency. Opposite phases cancel completely only at equal strength. Arrows describe board moves, not the photon’s travel.</p><button onclick="window.print()">Print cards</button></header>${sheets.join('')}</body></html>`);
console.log(`Generated ${cards.length} cards on ${sheets.length} sheets: ${output}`);
