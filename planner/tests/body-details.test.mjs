import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {buildShell} from '../shell-model.js';
import {buildExteriorDetails} from '../exterior-details.js';
import {buildBodyEmblems,lightEmblems} from '../brand-emblems.js';
import {buildRoofRack} from '../roof-rack.js';
import {buildInteractiveModel} from '../interactive-model.js';
import {BODY_DETAILS_SPEC} from '../body-details.js';
import {buildRearContainer} from '../rear-container.js';
import {buildRearCarrier} from '../rear-carrier.js';
const shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true}),exterior=buildExteriorDetails(shell.group),emblems=buildBodyEmblems(shell.group);
let triangles=0,batches=0;for(const root of [exterior.closeup.group,buildRearContainer().group,buildRearCarrier({loaded:true}).group])root.traverse(m=>{if(!m.isMesh)return;batches++;const p=m.geometry.attributes.position,n=m.geometry.attributes.normal;for(const a of [p,n])for(const v of a.array)assert(Number.isFinite(v));for(const i of m.geometry.index.array)assert(i>=0&&i<p.count);triangles+=m.geometry.index.count/3;});
assert(triangles<70000);assert(batches<30);const b=exterior.traction.userData.bounds;assert(b.min.x>30&&b.max.x<65);assert(b.min.y>150);assert(b.max.z<0&&b.min.z>-90);assert.equal(BODY_DETAILS_SPEC.traction.installedModel,null);assert(BODY_DETAILS_SPEC.traction.mounting.includes('not identified/rated'));
assert.equal(emblems.materials.silver.metalness,1);assert(emblems.materials.silver.roughness<.1);assert(emblems.materials.silver.isMeshPhysicalMaterial);
const portBox=new T.Box3().setFromObject(exterior.closeup.ports);assert(portBox.min.x<0&&portBox.max.x>60);assert(portBox.min.y>123&&portBox.max.y<150);
// Raycast the actual built contact faces from each final shell surface, rather
// than merely trusting recorded dimensions. Pads must start at the body.
exterior.group.updateMatrixWorld(true);shell.group.updateMatrixWorld(true);
for(const c of exterior.closeup.group.userData.attachmentContacts){
 const ray=new T.Raycaster(new T.Vector3(c.x,190,c.z),new T.Vector3(0,-1,0));
 const host=ray.intersectObject(shell.group,true)[0];assert(host);
 ray.set(new T.Vector3(c.x,host.point.y+.001,c.z),new T.Vector3(0,1,0));
 const contact=ray.intersectObject(c.type==='magnetic-pad'?exterior.traction:exterior.closeup.group,true)[0];
 assert(contact&&contact.distance<.04,'Actual contact mesh is on final shell');
}
const closedState=Object.fromEntries(['cassette-door','driver-seat','passenger-seat','driver-door','passenger-door','sliding-door','rear-doors','driver-slider','flare-window','headlights','foglights','taillights','lightbar','porchlight','wheels'].map(k=>[k,0]));const rig=buildInteractiveModel({shell,exterior,emblems,rack:buildRoofRack()});assert.equal(exterior.traction.parent,rig.parts['rear-passenger-door']);rig.apply(closedState);const closed=new T.Box3().setFromObject(exterior.traction);rig.apply({...closedState,'rear-doors':1});const open=new T.Box3().setFromObject(exterior.traction);assert(open.max.y>closed.max.y+4);rig.apply(closedState);assert(new T.Box3().setFromObject(exterior.traction).min.distanceTo(closed.min)<1e-6);exterior.traction.visible=false;rig.apply({...closedState,'rear-doors':1});assert.equal(exterior.traction.visible,false);
console.log('PASS utility sides/bounds, reflective emblems, finite bounded rear detail geometry, traction door attachment/reset and independent hidden state.',{triangles,batches});

for(const c of exterior.closeup.group.userData.attachmentContacts){assert(c.backY-c.hostY>0&&c.backY-c.hostY<.04,'Attachment touches the final warped host');}
const env=new T.Texture();lightEmblems(emblems,env);assert.equal(emblems.materials.silver.envMap,env);const day=emblems.materials.silver.envMapIntensity;lightEmblems(emblems,env,true);assert(emblems.materials.silver.envMapIntensity<day/5);
console.log('PASS final-host attachment offsets and day/night chrome reflections.');
