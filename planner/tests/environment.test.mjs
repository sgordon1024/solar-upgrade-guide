import assert from 'node:assert/strict';
import {buildEnvironment,ENVIRONMENTS} from '../environment.js';
const scene=buildEnvironment();
assert.equal(Object.keys(ENVIRONMENTS).length,8);
for(const id of Object.keys(ENVIRONMENTS)){
 const oldMap=scene.ground.material.map;let disposed=false;oldMap.addEventListener('dispose',()=>disposed=true);
 scene.setPreset(id);assert(disposed,'old ground map disposed');
 assert.equal(scene.selected,id);
 assert(scene.diagnostics.drawObjects<=6,'bounded draw objects');
 assert(scene.diagnostics.instances<=50,'bounded terrain instances');
 assert(scene.diagnostics.particles<=180,'bounded weather particles');
 scene.group.traverse(o=>{const a=o.geometry?.attributes.position;if(a)assert([...a.array].every(Number.isFinite),id+' finite geometry');});
 scene.update({phase:0,wheels:1});const start=scene.distance;scene.update({phase:1,wheels:1});
 assert(Math.abs(scene.distance-start-2.1*15.25)<1e-6,'ground follows tire surface speed');
 const distance=scene.distance;scene.update({phase:0,wheels:0});scene.update({phase:12,wheels:0});assert.equal(scene.distance,distance,'stationary scenery');
 scene.update({phase:0,wheels:1});assert.equal(scene.distance,distance,'restart does not jump');scene.update({phase:1,wheels:1,reducedMotion:true});assert.equal(scene.distance,distance,'reduced motion static');
 scene.update({phase:1,wheels:0,night:true});assert.equal(scene.palette().background.getHexString(),'15212b');
}
scene.setPreset('invalid');assert.equal(scene.selected,'white');
console.log('PASS all eight scenes, finite geometry, bounded draws/particles, disposed maps, wheel speed, stop/resume, reduced motion and night palette.');
