import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {buildRoofRack,RACK_SPEC} from '../roof-rack.js';
import {buildShell} from '../shell-model.js';
import {buildInstalledRoof} from '../roof-equipment.js';
import {buildSolarUpgrade} from '../solar-upgrade.js';
import {buildRoofExtras} from '../roof-extras.js';
import '../snowboard-data.js';
import '../roof-edit-data.js';
const S=RooflabSolar,E=RooflabRoofExtras,B=RooflabSnowboard,R=RooflabRoofEdit,i=RACK_SPEC.installation;
const rack=buildRoofRack(),shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true});
assert.deepEqual(i.planningOrigin,[0,26,0]);assert.deepEqual(i.lightBarCenter,[30,23,4.9]);assert.equal(i.frontFairingTipY,19);
assert.equal(RACK_SPEC.ownerReported.frontRearCrossbarCenters,130);assert.equal(i.lastCrossbarY-i.firstCrossbarY,121);assert(RACK_SPEC.unresolved.some(s=>s.includes('130')&&s.includes('121')));
const centers=rack.group.userData.crossbarCenters.map(p=>p[1]);for(const [a,b] of centers.map((v,n)=>[v,[26,55.9,113.1,147][n]]))assert(Math.abs(a-b)<1e-9,'Only rear main beam station changes');
assert.equal(i.sideRailRearY-i.planningOrigin[1],E.rack.visualRailRearY);assert.equal(E.rack.visualRailRearY,123);assert.equal(E.rack.crossbarCenterSpan,130);
assert(i.lastCrossbarY+1.75<i.sideRailRearY,'Rear beam plates remain on rails');assert(rack.group.userData.bounds.max.y<=150.0001,'All rear rack hardware ends over the roof');
shell.group.updateMatrixWorld(true);for(const x of i.railCenterXs){const ray=new T.Raycaster(new T.Vector3(x,i.rearFairingLowerTipY,12),new T.Vector3(0,0,-1)),hit=ray.intersectObject(shell.group,true).find(h=>h.point.z<0);assert(hit&&hit.point.z>-2,'Final shell roof lies directly below rear fairing tip');}
let triangles=0,batches=0;rack.group.traverse(m=>{if(!m.isMesh)return;batches++;for(const a of ['position','normal'])for(const v of m.geometry.attributes[a].array)assert(Number.isFinite(v));triangles+=m.geometry.index.count/3;});assert(triangles<10000);assert(batches<=7);
const state={roof:{width:60,length:122},installedRoof:B.defaults(),upgrades:{solar:E.rearPreset(),roofExtras:E.defaults()},items:[{id:'legacy',x:9}],notes:'Preserve every saved coordinate'};state.installedRoof.offsets.starlink.y=-23.25;state.upgrades.solar.panels[0].x+=.17;state.upgrades.roofExtras.chassis.enabled=true;
const before=structuredClone(state);R.flags(state);const models=[buildInstalledRoof(),buildSolarUpgrade(),buildRoofExtras()];models[0].setSnowboardPosition(state.installedRoof);models[1].update(state.upgrades.solar);models[2].update(state.upgrades.roofExtras);for(const model of models)assert.deepEqual(model.group.position.toArray(),i.planningOrigin);assert.deepEqual(state,before,'Geometry and screening never mutate saved layouts');
const flags=E.flags(state);assert(flags.some(f=>f.startsWith('Panel 3: extends 5.26 in behind')));assert(!flags.some(f=>f.startsWith('Riser ')&&f.includes('No rail attachment')),'Default rear support feet stay within visual rails');
// A support center can be inside while its full contact foot extends beyond.
const edge=structuredClone(state);edge.upgrades.solar.panels[2].y=122.5-S.panel.length+8;const support=S.supports(edge.upgrades.solar).find(a=>a.kind==='riser'&&a.y<123&&a.y+a.length>123);assert(support);assert(E.flags(edge).some(f=>f.startsWith(support.name+': beyond')));
const far=structuredClone(state);far.upgrades.roofExtras.chassis.y=122;assert(E.flags(far).some(f=>f.startsWith('Chassis panel mount')&&f.includes('No rail attachment')));
const hidden=structuredClone(state);hidden.installedRoof.bagHidden=hidden.installedRoof.starlinkHidden=true;assert.deepEqual(E.flags(hidden),flags,'Hiding retains physical support warnings');
console.log('PASS rear rail/fairing over final roof, rear beam plates within rails, unchanged front/intermediate stations and planning origin, distinct measured130/visual121 spans, full-foot screening, preserved state/transforms, finite geometry and rack budget.');
