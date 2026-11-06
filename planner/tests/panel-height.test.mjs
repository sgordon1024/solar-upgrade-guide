import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as T from '../vendor/three.module.js';
import '../snowboard-data.js';
import '../solar-data.js';
import '../roof-edit-data.js';
import {buildSolarUpgrade} from '../solar-upgrade.js';
const S=RooflabSolar,R=RooflabRoofEdit,E=RooflabRoofExtras,B=RooflabSnowboard;
const state={roof:{width:60,length:122},installedRoof:B.defaults(),upgrades:{solar:E.rearPreset(),roofExtras:E.defaults()},items:[{id:'unchanged',x:7}],notes:'Keep my actual layout'};
state.upgrades.solar.panels[0].z=6.5;
state.installedRoof.offsets.starlink.y=-27.1;state.installedRoof.snowboard.x=2.1;
state.upgrades.roofExtras.chassis.enabled=true;state.upgrades.roofExtras.chassis.x=39.1;
const before=structuredClone(state),lift=R.supportLift(state,'proposal-0');
assert.equal(lift.fromZ,6.5);assert.equal(lift.targetZ,18);assert(lift.canRaise);assert(lift.otherPanels.includes('Panel 2'));
assert(R.flags(state).some(s=>s.startsWith('Panel 1: below or intersecting raised support')));
assert.equal(R.supportLift(state,'roof-chassis'),null);assert.equal(R.raiseToSupports(state,'starlink'),null);
const undo=R.raiseToSupports(state,'proposal-0'),expected=structuredClone(before);expected.upgrades.solar.panels[0].z=18;assert.deepEqual(state,expected,'Only selected panel Z changes');
assert(!R.supportLift(state,'proposal-0').canRaise);assert(!R.flags(state).some(s=>s.startsWith('Panel 1: below or intersecting raised support')));assert(R.flags(state).some(s=>s.includes('unverified')));
assert.equal(S.supports(state.upgrades.solar).filter(s=>s.kind==='span').length,4,'Co-planar panels share their existing stations');
const mesh=buildSolarUpgrade();mesh.update(state.upgrades.solar);const selected=new T.Box3();for(const m of mesh.group.children.filter(m=>m.userData.selectable==='proposal-0')){m.geometry.computeBoundingBox();selected.union(m.geometry.boundingBox);}assert(Math.abs(selected.min.z-18)<1e-5,'Actual panel underside reaches support top');
const h=S.supports(state.upgrades.solar).filter(s=>s.kind==='span'&&s.panelIndices.includes(0));assert.equal(h.length,2);assert(h.every(s=>Math.abs(s.z+s.height-selected.min.z)<1e-5));
for(const m of mesh.group.children){for(const a of ['position','normal'])for(const n of m.geometry.attributes[a].array)assert(Number.isFinite(n));}
assert(R.undoSupportRaise(state,undo));assert.deepEqual(state,before);assert.equal(R.raiseToSupports(state,'proposal-0').afterZ,18);state.upgrades.solar.panels[0].x+=2;assert(R.undoSupportRaise(state,undo));assert.equal(state.upgrades.solar.panels[0].x,before.upgrades.solar.panels[0].x+2,'Undo preserves later horizontal edits');
R.raiseToSupports(state,'proposal-0');state.upgrades.solar.panels[0].z=19;assert(!R.undoSupportRaise(state,undo),'Undo cannot erase a later manual height edit');
const different=structuredClone(before);different.upgrades.solar.panels[0].y+=1.3;different.upgrades.solar.panels[1].z=18.003;const differentBefore=structuredClone(different);assert.equal(R.supportLift(different,'proposal-0').targetZ,18.01);R.raiseToSupports(different,'proposal-0');differentBefore.upgrades.solar.panels[0].z=18.01;assert.deepEqual(different,differentBefore,'Differing stations and fractional height preserve all other geometry');
const remote=structuredClone(before);remote.upgrades.solar.panels[1].y=150;remote.upgrades.solar.panels[2].y=150;remote.upgrades.solar.panels[3].y=150;assert(!R.supportLift(remote,'proposal-0').canRaise,'A distant high support does not lift this panel');remote.upgrades.solar.enabled=false;assert(!R.supportLift(remote,'proposal-0').canRaise);
assert(S.supports(before.upgrades.solar).every(s=>Array.isArray(s.panelIndices)&&s.panelIndices.length));
function boot(saved){const nodes={},storage=saved?{'rooflab.v1':JSON.stringify(saved)}:{},ctx={structuredClone,crypto,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{querySelector:s=>nodes[s]??=({style:{},classList:{add(){},remove(){}},setAttribute(){}})},window:{},setTimeout:()=>0,clearTimeout};vm.createContext(ctx);for(const f of ['snowboard-data.js','solar-data.js','roof-edit-data.js','upgrade-data.js','app.js'])vm.runInContext(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'),ctx);vm.runInContext('globalThis.api={valid,save,get:()=>state};',ctx);return {ctx,storage};}
const plain=x=>JSON.parse(JSON.stringify(x)),fresh=boot(),saved=plain(fresh.ctx.api.get());Object.assign(saved.installedRoof,before.installedRoof);saved.upgrades.solar=before.upgrades.solar;saved.upgrades.roofExtras=before.upgrades.roofExtras;saved.notes=before.notes;
const existing=boot(saved);assert.deepEqual(plain(existing.ctx.api.get()),saved,'Startup never auto-levels an existing save');const imported=plain(existing.ctx.api.valid(JSON.parse(JSON.stringify(saved))));assert.deepEqual(imported,saved,'Import does not move the low panel either');
existing.ctx.RooflabRoofEdit.raiseToSupports(existing.ctx.api.get(),'proposal-0');existing.ctx.api.save();const exported=JSON.parse(existing.storage['rooflab.v1']),savedExpected=structuredClone(saved);savedExpected.upgrades.solar.panels[0].z=18;assert.deepEqual(exported,savedExpected);assert.deepEqual(plain(boot(exported).ctx.api.get()),exported);assert.deepEqual(plain(existing.ctx.api.valid(exported)),exported);
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);assert(html.includes('id="roof-raise-supports"'));assert(html.includes('id="roof-undo-height"'));
// Run actual editor handlers: undoing a preset must invalidate raises within it.
const nodes={},uiState=structuredClone(expected),ui={state:uiState,RooflabRoofEdit:R,RooflabRoofExtras:E,RooflabSolar:S,esc:String,storageOK:true,$:id=>nodes[id]??=({setAttribute(){},addEventListener(){}}),window:{addEventListener(){}},save(){},renderBagControls(){},renderSolarControls(){},draw(){}};
vm.createContext(ui);vm.runInContext(fs.readFileSync(new URL('../roof-editor.js',import.meta.url),'utf8'),ui);
const custom=structuredClone(uiState);nodes['#roof-edit-rear-preset'].onclick();R.move(uiState,'proposal-0',{z:6.5});nodes['#roof-raise-supports'].onclick();assert.equal(nodes['#roof-undo-height'].hidden,false);
nodes['#roof-edit-undo'].onclick();assert.deepEqual(uiState,custom);assert.equal(nodes['#roof-undo-height'].hidden,true,'Preset undo clears its nested height undo');nodes['#roof-undo-height'].onclick();assert.deepEqual(uiState,custom,'A stale height action cannot mutate the restored layout');
console.log('PASS crossing-support detection; selected-Z-only raise/undo; nonaligned/fractional and distant supports; actual panel/contact geometry; unchanged startup/import; full persistence/export/reload; unique accessible controls; actual preset/raise undo sequence.');
