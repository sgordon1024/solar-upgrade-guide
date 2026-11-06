import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {buildShell,SHELL_SPEC} from '../shell-model.js';
import {buildRoofRack,RACK_SPEC} from '../roof-rack.js';
import {buildBodyEmblems} from '../brand-emblems.js';
import {buildExteriorDetails} from '../exterior-details.js';
import {buildInteractiveModel} from '../interactive-model.js';
const shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true});
const bounds=new T.Box3().setFromObject(shell.group);
assert.equal(bounds.min.y,-76.5);assert.equal(bounds.max.y,157.5);assert.equal(SHELL_SPEC.wheelbase,144);
assert(shell.group.userData.shoulderNormalMaxError<1e-6,'Shared shoulder normal continuity');
assert(shell.group.userData.rearBoundaryMaxDistance<.12,'Existing rear closure still joins its loft');
assert.deepEqual(RACK_SPEC.installation.planningOrigin,[0,26,0]);
const ray=new T.Raycaster(),samples=[];
// Neither side can fold back inward at the refined shoulder.
for(const y of [35,60,100,130])for(const sign of [-1,1]){
 let previous=36;
 for(let z=-9.2;z>=-15.5;z-=.15){ray.set(new T.Vector3(30+sign*60,y,z),new T.Vector3(-sign,0,0));const hit=ray.intersectObject(shell.group,true).find(h=>h.object.material.name.startsWith('Blue-gray paint'));assert(hit);const w=sign*(hit.point.x-30);assert(w>35.8&&w<38,'Bounded upper side');if(z>-10.7)assert(w>=previous-.015,'No artificial inward notch before stamped relief');previous=w;}
}
// The dark return is now visible outside the body, and stays fixed as doors open.
for(const sign of [-1,1]){ray.set(new T.Vector3(30+sign*70,152,-88.7),new T.Vector3(-sign,0,0));const hit=ray.intersectObject(shell.group,true)[0];assert(hit&&hit.object.material.name==='Textured bumper','Actual corner return covers rear quarter');samples.push(hit.point.clone());}
const rack=buildRoofRack({shellGroup:shell.group}),rig=buildInteractiveModel({shell,emblems:buildBodyEmblems(shell.group),exterior:buildExteriorDetails(shell.group),rack});
const closed=Object.fromEntries(['cassette-door','driver-seat','passenger-seat','driver-door','passenger-door','sliding-door','rear-doors','driver-slider','flare-window','headlights','foglights','taillights','lightbar','porchlight','wheels'].map(id=>[id,0]));
for(const pose of [closed,{...closed,'rear-doors':1},closed]){rig.apply(pose,0);for(const [i,sign] of [-1,1].entries()){ray.set(new T.Vector3(30+sign*70,152,-88.7),new T.Vector3(-sign,0,0));const hit=ray.intersectObject(shell.group,true).find(h=>h.object.material.name==='Textured bumper');assert(hit&&hit.point.distanceTo(samples[i])<1e-5,'Returns remain on stationary body');}}
let triangles=0; shell.group.traverse(o=>{if(!o.isMesh)return;for(const k of ['position','normal'])for(const v of o.geometry.attributes[k]?.array||[])assert(Number.isFinite(v));triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;});
console.log('PASS bounded smooth shoulders, unchanged length/wheelbase/datum, closed rear seam, visible stationary bumper returns and finite interactive geometry.',{triangles});
