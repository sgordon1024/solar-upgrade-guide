import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {buildShell} from '../shell-model.js';
import {buildBodyEmblems} from '../brand-emblems.js';
import {buildExteriorDetails} from '../exterior-details.js';
import {buildSolarUpgrade} from '../solar-upgrade.js';
import {buildInstalledRoof} from '../roof-equipment.js';
import {buildRoofRack} from '../roof-rack.js';
import {installInteractions} from '../interactions.js';
class Emitter {listeners={};addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}fire(k,e={}){for(const fn of this.listeners[k]||[])fn(e)}}
const motion=new Emitter();motion.matches=false;globalThis.matchMedia=()=>motion;
const doc=new Emitter(),note={textContent:''},ropeControls=Object.fromEntries(['rope-preset','rope-pattern','rope-speed','rope-pause'].map(id=>[id,Object.assign(new Emitter(),{value:id==='rope-preset'?'off':id==='rope-pattern'?'steady':'.7',setAttribute(k,v){this[k]=v}})]));doc.hidden=false;doc.querySelector=id=>ropeControls[id.slice(1)]||note;doc.querySelectorAll=()=>[];globalThis.document=doc;
let token=0;const pending=new Map();globalThis.requestAnimationFrame=fn=>{pending.set(++token,fn);return token};globalThis.cancelAnimationFrame=id=>pending.delete(id);
function advance(ms){const callbacks=[...pending.values()];pending.clear();for(const fn of callbacks)fn(ms);}
const shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true}),emblems=buildBodyEmblems(shell.group),exterior=buildExteriorDetails(shell.group),rack=buildRoofRack(),installed=buildInstalledRoof(),body=new T.Group();body.add(shell.group,emblems.group,exterior.group,rack.group,installed.group);
const canvas=new Emitter();canvas.getBoundingClientRect=()=>({left:0,top:0,width:800,height:600});
const camera=new T.OrthographicCamera(-130,130,98,-98,.1,1000);camera.up.set(0,0,1);camera.position.set(-400,40,-40);camera.lookAt(30,40,-40);camera.updateMatrixWorld();
let night=false,bagSelections=0,panelSelections=[];const control=installInteractions({shell,emblems,exterior,rack,body,canvas,camera,requestRender(){},onState(){},onNight:n=>night=n,onSelectSnowboard:()=>bagSelections++,onSelectPanel:id=>panelSelections.push(id)});
control.activate('headlights');advance(performance.now()+20);assert.equal(control.state.headlights,1);control.activate('headlights');advance(performance.now()+40);assert.equal(control.state.headlights,2);control.activate('headlights');advance(performance.now()+60);assert.equal(control.state.headlights,0);
control.activate('night');assert.equal(night,true);const floor=control.rig.extras.children.find(o=>o.material?.name==='Night preview ground');assert.equal(floor.visible,true);
control.activate('wheels');advance(performance.now()+21000);assert.equal(control.target.wheels,0);assert.equal(pending.size,0);
control.activate('wheels');advance(performance.now()+30);doc.hidden=true;doc.fire('visibilitychange');assert.equal(control.target.wheels,0);assert.equal(pending.size,0);doc.hidden=false;
motion.matches=true;motion.fire('change');control.activate('driver-door');assert.equal(control.state['driver-door'],1);assert.equal(pending.size,0);control.activate('wheels');assert.equal(control.state.wheels,1);assert.equal(pending.size,0);control.reset();assert(idsZero(control.state));assert.equal(night,false);assert.equal(floor.visible,false);
function idsZero(s){return Object.values(s).every(v=>v===0)}
// Full lamp housings respond, including gaps between LED optics; body occlusion wins.
function tapWorld(p){const pt=new T.Vector3(...p).project(camera),e={pointerId:8,button:0,clientX:(pt.x+1)*400,clientY:(1-pt.y)*300};canvas.fire('pointerdown',e);canvas.fire('pointerup',e);}
camera.position.set(30,-400,-35);camera.lookAt(30,0,-35);camera.updateMatrixWorld();
tapWorld([-.7,-78,-80]);assert.equal(control.target.foglights,1,'fog bezel target');control.reset();
tapWorld([20,20,5.7]);assert.equal(control.target.lightbar,1,'LED housing target');control.reset();
rack.group.visible=false;control.rig.hitTargets.find(o=>o.userData.action==='lightbar').visible=false;tapWorld([20,20,5.7]);assert.equal(control.target.lightbar,0,'hidden rack does not receive taps');rack.group.visible=true;
camera.position.set(30,400,-35);camera.lookAt(30,0,-35);camera.updateMatrixWorld();tapWorld([-.7,-78,-80]);assert.equal(control.target.foglights,0,'no through-body fog tap');
control.activate('cassette-door');assert.equal(control.state['cassette-door'],1);assert(control.rig.parts['cassette-door'].rotation.z>1.7);control.reset();
control.activate('driver-seat');assert.equal(control.state['driver-seat'],1);assert.equal(control.rig.cabin.seats['driver-seat'].rotation.z,-Math.PI);control.reset();
camera.position.set(-400,40,-40);camera.lookAt(30,40,-40);camera.updateMatrixWorld();
// Direct picking at a projected painted door point, with orbit-drag suppression.
const pt=new T.Vector3(-9,3,-62).project(camera);const event={pointerId:1,button:0,clientX:(pt.x+1)*400,clientY:(1-pt.y)*300};
canvas.fire('pointerdown',event);canvas.fire('pointerup',event);assert.equal(control.target['driver-door'],1);control.reset();
canvas.fire('pointerdown',event);canvas.fire('pointermove',{...event,clientX:event.clientX+15});canvas.fire('pointerup',{...event,clientX:event.clientX+15});assert(idsZero(control.target));
canvas.fire('pointerdown',event);canvas.fire('pointerdown',{...event,pointerId:2});canvas.fire('pointerup',{...event,pointerId:2});canvas.fire('pointerup',event);assert(idsZero(control.target));
control.setEnabled(false);control.activate('driver-door');assert.equal(control.target['driver-door'],0);control.setEnabled(true);
console.log('PASS headlight cycle, immediate night floor, 20-second stop, hidden-tab stop, reduced motion, reset, model picking, orbit drag and multitouch suppression, planning mode disable.');

// The illustrative seat pose waits for its cab door before moving the upper seat.
motion.matches=false;motion.fire('change');control.reset();control.activate('driver-seat');
const seatStart=performance.now();
for(let i=1;i<=6;i++)advance(seatStart+i*50);
assert.equal(control.state['driver-seat'],0,'seat waits for door');assert(control.state['driver-door']>0);
control.activate('driver-door');assert.equal(control.target['driver-door'],1,'door stays open during seat movement');
for(let i=7;i<=40;i++)advance(seatStart+i*50);
assert.equal(control.state['driver-door'],1);assert.equal(control.state['driver-seat'],1);control.reset();
console.log('PASS door-first swivel sequencing and premature door-close suppression.');
control.activate('passenger-seat');control.activate('driver-seat');const queueStart=performance.now();
for(let i=1;i<=75;i++){const before={...control.state};advance(queueStart+i*50);assert(!(before['driver-seat']!==control.state['driver-seat']&&before['passenger-seat']!==control.state['passenger-seat']),'only one seat moves in a frame');}
assert.equal(control.state['driver-seat'],1);assert.equal(control.state['passenger-seat'],1);control.reset();
console.log('PASS two-seat requests finish sequentially.');

// Animated lighting has a bounded, accessible lifecycle independent of wheel motion.
motion.matches=false;motion.fire('change');ropeControls['rope-preset'].value='aurora';ropeControls['rope-pattern'].value='flow';ropeControls['rope-preset'].fire('input');advance(performance.now()+20);assert(pending.size>0);control.setEnabled(false);advance(performance.now()+40);assert.equal(pending.size,0);assert.equal(ropeControls['rope-pause']['aria-pressed'],'true');control.setEnabled(true);ropeControls['rope-pause'].fire('click');advance(performance.now()+60);assert(pending.size>0);advance(performance.now()+61000);assert.equal(pending.size,0);assert.equal(ropeControls['rope-pause']['aria-pressed'],'true');motion.matches=true;motion.fire('change');assert.equal(ropeControls['rope-pause'].disabled,true);control.reset();assert.equal(control.rope.preset,'off');assert.equal(pending.size,0);console.log('PASS fixture targets/occlusion, cassette and seat actions, rope60-second stop, planning pause and reduced-motion control state.');

// The real canvas bag and its clamps pick together, with visibility and occlusion respected.
camera.position.set(8.5,120,400);camera.lookAt(8.5,120,0);camera.updateMatrixWorld();
tapWorld([8.5,120,19]);assert.equal(bagSelections,1,'visible bag selects');
installed.setSnowboardPosition({version:1,snowboard:{x:35,y:-30,z:4}});tapWorld([43.5,90,23]);assert.equal(bagSelections,2,'moved bag selects');
const blocker=new T.Mesh(new T.BoxGeometry(24,70,4),new T.MeshBasicMaterial());blocker.position.set(43.5,106,40);body.add(blocker);tapWorld([43.5,90,23]);assert.equal(bagSelections,2,'occluded bag cannot select through another object');body.remove(blocker);
installed.group.visible=false;tapWorld([43.5,90,23]);assert.equal(bagSelections,2,'hidden bag cannot select');installed.group.visible=true;
control.setEnabled(false);control.activate('snowboard');assert.equal(bagSelections,2,'roof box mode stays distinct');control.setEnabled(true);
console.log('PASS detailed bag picking, translated picking, hidden/occluded selection and planning-mode separation.');

const proposal=buildSolarUpgrade();const layout=RooflabSolar.planningPreset();proposal.update(layout);body.add(proposal.group);installed.setSnowboardPosition({...RooflabSnowboard.defaults(),bagHidden:true,starlinkHidden:true});camera.position.set(30,80,400);camera.lookAt(30,80,0);camera.updateMatrixWorld();for(let i=0;i<4;i++){const p=RooflabSolar.envelopes(layout)[i],origin=proposal.group.position;tapWorld([origin.x+p.x+p.width/2,origin.y+p.y+p.length/2,origin.z+p.z+1]);assert.equal(panelSelections.at(-1),'proposal-'+i);}const count=panelSelections.length;proposal.group.visible=false;tapWorld([30,80,16.5]);assert.equal(panelSelections.length,count);console.log('PASS all four actual proposed panels raycast-select independently; hidden panels cannot select.');
