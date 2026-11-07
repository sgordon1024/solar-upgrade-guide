import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';import {gzipSync} from 'node:zlib';
const nodes={},storage={},listeners={};
const node=id=>nodes[id]??={id,style:{},classList:{add(){},remove(){}},hidden:false,open:false,value:'',checked:false,textContent:'',setAttribute(){},addEventListener(k,f){this[k]=f;},showModal(){this.open=true;},close(){this.open=false;this.close?.event;},focus(){},select(){}};
const window={addEventListener(k,f){listeners[k]=f;}},document={querySelector:node,querySelectorAll:()=>[],getElementById:()=>null};
const c={structuredClone,crypto,console,localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document,window,setTimeout:()=>0,clearTimeout,Blob,TextEncoder,TextDecoder,CompressionStream,DecompressionStream,btoa,atob,URL,navigator:{clipboard:{writeText:async()=>{throw Error('denied');}}},location:{hash:'',href:'https://example.test/planner/?x=1',pathname:'/planner/',search:'?x=1'},history:{replaceState(){}},Event};
vm.createContext(c);
for(const f of ['snowboard-data.js','solar-data.js','roof-edit-data.js','retractable-data.js','snapshot-data.js','upgrade-data.js','app.js','share-data.js'])vm.runInContext(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'),c);
vm.runInContext('globalThis.api={valid,save,get:()=>state}',c);
const plain=x=>JSON.parse(JSON.stringify(x)),S=c.RooflabShare,layout=plain(c.api.get());
layout.notes='Synthetic QA notes: 日本語, emoji ☀️ and <script> are text.';layout.items[0].evidence='Keep this source exactly.';layout.upgrades.solar.panels[0].x=13.125;layout.upgrades.solar.panels[0].model='bifacial';layout.upgrades.retractable.enabled=true;layout.upgrades.retractable.extensions=[0,.25,1,.75];layout.installedRoof.starlinkHidden=false;
const data=S.create(layout,'QA setup',{layers:{'show-rack':false,'show-installed-roof':true},environment:'desert'},c.api.valid);
const hash=await S.encode(data,c.api.valid);assert(hash.startsWith('#setup=v1z.'));assert(hash.length<5000);assert.deepEqual(plain(await S.decode(hash,c.api.valid)),plain(data));assert.equal(await S.decode('#other',c.api.valid),null);
const raw='#setup=v1j.'+Buffer.from(JSON.stringify(data)).toString('base64url');assert.deepEqual(plain(await S.decode(raw,c.api.valid)),plain(data));
for(const h of ['#setup=',hash+'!',hash.slice(0,-9),'#setup=v2z.a','#setup=v1j.%%%%','#setup=v1j.'+'a'.repeat(S.MAX_FRAGMENT)])await assert.rejects(()=>S.decode(h,c.api.valid));
const bomb='#setup=v1z.'+gzipSync(Buffer.from('x'.repeat(260000))).toString('base64url');await assert.rejects(()=>S.decode(bomb,c.api.valid),/250 KB/);
await assert.rejects(()=>S.decode('#setup=v1j.'+Buffer.from([255,254]).toString('base64url'),c.api.valid));
assert.throws(()=>S.validate({...data,version:9},c.api.valid));assert.throws(()=>S.validate({...data,view:{layers:{'bad':true}}},c.api.valid));assert.throws(()=>S.validate({...data,view:{environment:'javascript:x'}},c.api.valid));assert.throws(()=>S.validate({...data,layout:{...layout,clearance:Infinity}},c.api.valid));
const unavailable=c.DecompressionStream;c.DecompressionStream=undefined;await assert.rejects(()=>S.decode(hash,c.api.valid),/current browser/);c.DecompressionStream=unavailable;
const compression=c.CompressionStream;c.CompressionStream=undefined;assert((await S.encode(data,c.api.valid)).startsWith('#setup=v1j.'));c.CompressionStream=compression;
const bulky=structuredClone(layout);bulky.items=Array.from({length:60},(_,i)=>({...layout.items[0],id:'bulk-'+i,evidence:'☀'.repeat(1900)}));await assert.rejects(()=>S.encode(S.create(bulky,'Bulk',{},c.api.valid),c.api.valid),/250 KB/);
const untouched=JSON.stringify(layout);storage['rooflab.v1']=untouched;storage['rooflab.snapshots.v1']=JSON.stringify({version:1,entries:[]});const original=plain(c.api.get());
vm.runInContext(fs.readFileSync(new URL('../share-ui.js',import.meta.url),'utf8'),c);await window.rooflabShareReady;const savedBefore=structuredClone(storage);
window.rooflabPreviewSharedSetup(data);assert.equal(window.rooflabSharedPreview,true);assert.deepEqual(plain(c.api.get()),plain(data.layout));assert.deepEqual(storage,savedBefore);vm.runInContext("state.notes+=' edited'; save();",c);assert.deepEqual(storage,savedBefore,'Preview edits never replace local saves');
node('#shared-setup-save').onclick();const favorites=JSON.parse(storage['rooflab.snapshots.v1']);assert.equal(favorites.entries.length,1);assert(favorites.entries[0].layout.notes.endsWith(' edited'));assert.equal(storage['rooflab.v1'],untouched);
node('#shared-setup-return').onclick();assert.equal(window.rooflabSharedPreview,false);assert.deepEqual(plain(c.api.get()),original,'Return restores prior working state');
c.location.hash=hash;await listeners.hashchange();assert(window.rooflabSharedPreview);c.location.hash='';await listeners.hashchange();assert(!window.rooflabSharedPreview);assert.deepEqual(plain(c.api.get()),original,'Back/forward hash navigation restores local work');
node('#open-share').onclick();await node('#share-copy').onclick();assert(!node('#share-link-row').hidden);assert(node('#share-link').value.startsWith('https://example.test/planner/#setup='));assert(node('#share-status').textContent.includes('Select and copy'));
console.log('PASS gzip/raw Unicode exact roundtrip; full geometry/type/pose/notes preservation; bounded decode/zip-bomb/malformed/version/view validation; unsupported-browser fallback; isolated preview edits; append-only favorite; return/back/hash navigation; clipboard-denied copy fallback.');

// A slow older URL decode must not override a newer file import.
const decode=S.decode;let resolveOld;S.decode=()=>new Promise(resolve=>{resolveOld=resolve;});c.location.hash=hash;const pending=listeners.hashchange();
const newer=S.create({...layout,notes:'Newer file wins'},'New file',{},c.api.valid);window.rooflabPreviewSharedSetup(newer);resolveOld(data);await pending;assert.equal(c.api.get().notes,'Newer file wins');S.decode=decode;
// Invalid imports preserve the current state, and repeated same-file selections reset input.
const importNode=node('#import'),fileEvent={target:{files:[{size:500,text:async()=>JSON.stringify(newer)}],value:'chosen'}};await importNode.onchange(fileEvent);assert.equal(fileEvent.target.value,'');assert.equal(c.api.get().notes,'Newer file wins');
const badEvent={target:{files:[{size:500,text:async()=>JSON.stringify({...newer,version:9})}],value:'chosen'}};await importNode.onchange(badEvent);assert.equal(badEvent.target.value,'');assert.equal(c.api.get().notes,'Newer file wins');
node('#open-share').onclick();vm.runInContext("state.items=Array.from({length:60},(_,i)=>({...state.items[0],id:'bulk-'+i,evidence:'☀'.repeat(1900)}));",c);node('#open-share').onclick();node('#share-download').onclick();assert(node('#share-status').textContent.includes('250 KB file limit'));
console.log('PASS newer file wins over stale link; invalid/repeated import isolation; oversized backup rejected before download.');
