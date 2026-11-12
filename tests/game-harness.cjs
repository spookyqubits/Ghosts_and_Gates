// Run the shipped scripts with deterministic timers. Browser layout is checked separately.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function loadGame(file, search = '') {
  const html = fs.readFileSync(path.join(__dirname, '../games', file), 'utf8');
  const nodes = new Map(), timers = new Map(); let nextTimer = 0;
  const defaults = {'#mode':'cpuR', '#lab-secret':'0', '#p':'10', '#q':'0', '#nights-n':'1000', 'input[name=n]:checked':'3', '#lab-n':'8', '#lab-m':'1', '#big-n':'1,048,576', '#big-m':'1'};
  class Element {
    constructor(selector = '') {
      this.dataset = {}; this.style = {setProperty(){}}; this.children = []; this.listeners = {};
      this.classList = {add(){}, remove(){}, toggle(){}};
      this.value = defaults[selector] || ''; this.checked = false; this.disabled = false; this.hidden = false;
      this.innerHTML = ''; this.textContent = ''; this.width = 760; this.height = 330;
    }
    querySelector(s) { return node(s); } querySelectorAll() { return []; }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    click() { if (this.disabled) return; this.onclick?.(); for (const fn of this.listeners.click || []) fn({target:this}); }
    setAttribute() {} getAttribute(name) { return name === 'viewBox' ? '0 0 760 320' : ''; }
    appendChild(el) { this.children.push(el); } append(el) { this.appendChild(el); }
    getContext() { return new Proxy({}, {get: () => () => {}}); }
    focus() {} getBoundingClientRect() { return {width:200}; }
    get parentElement() { return this; }
  }
  function node(selector) { if (!nodes.has(selector)) nodes.set(selector, new Element(selector)); return nodes.get(selector); }
  const document = {body:{dataset:{tab: html.match(/<body[^>]*data-tab="([^"]+)"/)?.[1] || 'play'}},
    querySelector:node, querySelectorAll:()=>[], getElementById:id=>node('#'+id),
    createElement:()=>new Element(), createElementNS:()=>new Element(), addEventListener(){}};
  const ctx = vm.createContext({window:{}, document, location:{search,hash:''}, URLSearchParams,
    crypto:require('node:crypto').webcrypto, Uint32Array, Float32Array, console,
    setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer;}, clearTimeout(id){timers.delete(id);},
    setInterval(fn){timers.set(++nextTimer,fn);return nextTimer;}, clearInterval(id){timers.delete(id);}});
  for (const [,script] of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
    vm.runInContext(script,ctx);
    Object.assign(ctx,ctx.window);
  }
  return {html, ctx, nodes, timers, node, run:code=>vm.runInContext(code,ctx),
    tick(){const [id,fn] = timers.entries().next().value || []; if(fn){timers.delete(id);fn();}}};
}
module.exports = {loadGame};
