import * as T from '../vendor/three.module.js';
import {buildShell} from '../shell-model.js';
import {buildBodyEmblems} from '../brand-emblems.js';
import {buildExteriorDetails} from '../exterior-details.js';
import {buildRoofRack} from '../roof-rack.js';
import {buildInteractiveModel} from '../interactive-model.js';
import assert from 'node:assert/strict';
const shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true});
const emblems=buildBodyEmblems(shell.group),exterior=buildExteriorDetails(shell.group),rack=buildRoofRack();
console.time('rig');const rig=buildInteractiveModel({shell,emblems,exterior,rack});console.timeEnd('rig');
const ids=['driver-door','passenger-door','sliding-door','rear-doors','driver-slider','flare-window','headlights','foglights','taillights','lightbar','porchlight','wheels'];
const closed=Object.fromEntries(ids.map(id=>[id,0]));rig.apply(closed);
const meshes=[];shell.group.traverse(o=>{if(o.isMesh)meshes.push(o)});
for(const o of meshes){for(const attr of ['position','normal'])assert([...o.geometry.attributes[attr].array].every(Number.isFinite),o.name+attr);}
const closedPositions=new Map(meshes.map(o=>[o,o.matrixWorld.clone()]));
for(const id of ids){rig.apply({...closed,[id]:id==='headlights'?2:1},.72);rig.apply(closed,0);for(const [o,matrix] of closedPositions)assert(o.matrixWorld.elements.every((v,i)=>Math.abs(v-matrix.elements[i])<1e-6),id+' resets '+o.name);}
for(const [id,g] of Object.entries(rig.parts))console.log(id,g.children.length,new T.Box3().setFromObject(g).getSize(new T.Vector3()).toArray().map(v=>+v.toFixed(2)));
console.log('PASS geometry finite and all actions reset to closed pose.');
// Non-convex masks must preserve the whole intended panel and total area.
const {splitGeometry}=await import('../interactive-model.js');
const plane=new T.PlaneGeometry(6,6,4,4),polygon=[[-2,-2],[2,-2],[2,0],[0,0],[0,2],[-2,2]];
const split=splitGeometry(plane,polygon,[0,1]);
function area(g){let sum=0;for(let i=0;i<(g.index?.count||g.attributes.position.count);i+=3){const p=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(g.attributes.position,g.index?g.index.getX(i+j):i+j));sum+=p[1].sub(p[0]).cross(p[2].sub(p[0])).length()/2;}return sum;}
assert(Math.abs(area(split.inside)-12)<1e-5);assert(Math.abs(area(split.inside)+area(split.outside)-36)<1e-5);
// Rear free edges must swing behind the van, while the spare follows its leaf.
rig.apply({...closed,'rear-doors':1});
const left=rig.parts['rear-driver-door'];const p=new T.Vector3(30,155,-45).sub(left.position);left.localToWorld(p);assert(p.y>180);
assert.equal(exterior.spare.parent,left);assert.equal(emblems.group.children.some(o=>o.name==='rear-launch'),false);
// Layer hiding must win over animated stays and light-bar illumination.
rig.apply({...closed,'flare-window':1,lightbar:1,layers:{flares:false,rack:false}});
assert.equal(rig.parts['flare-window'].visible,false);
const visibleStays=rig.extras.children.filter(o=>o.material?.name==='Window support stay'&&o.visible);assert.equal(visibleStays.length,0);
rig.apply(closed);assert.equal(rig.parts['flare-window'].visible,true);
// Headlamp settings change only their cloned lens materials.
rig.apply({...closed,headlights:2});assert(rig.lamps.headlights.every(m=>m.emissiveIntensity===3.4));assert(rig.lamps.foglights.every(m=>m.emissiveIntensity===0));
rig.apply({...closed,wheels:1},.72);assert(rig.parts['wheel-driver-front'].position.z>-92.5);assert.equal(rig.parts['wheel-driver-front-caliper'].rotation.x,0);assert(rig.parts['wheel-driver-front'].rotation.x>0);
rig.apply(closed);console.log('PASS concave clipping area, rearward opening, spare attachment, layer gates, independent lamps, wheel/caliper rig.');
