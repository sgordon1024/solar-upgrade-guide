import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {buildShell} from '../shell-model.js';
import {buildRoofRack,RACK_SPEC} from '../roof-rack.js';
import {buildSideLadder,LADDER_SPEC} from '../side-ladder.js';
import {ROOF_MOUNT_SPEC} from '../roof-mounts.js';
const shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true});
const rack=buildRoofRack({shellGroup:shell.group}),ladder=buildSideLadder({mounts:rack.mounts});
shell.group.updateMatrixWorld(true);
assert.deepEqual(ROOF_MOUNT_SPEC.centerXs,RACK_SPEC.installation.railCenterXs);
assert.deepEqual(RACK_SPEC.installation.planningOrigin,[0,26,0]);
assert.equal(ROOF_MOUNT_SPEC.rearY,149);assert.equal(RACK_SPEC.installation.lastCrossbarY,147);
// Independent intersection check uses completed rendered triangles, including ribs.
for(const cx of ROOF_MOUNT_SPEC.centerXs)for(const y of [26,30,65,79,92,110,135,144,149]){
  for(const dx of [-.925,-.4625,0,.4625,.925]){
    const x=cx+dx,ray=new T.Raycaster(new T.Vector3(x,y,1),new T.Vector3(0,0,-1));
    const hit=ray.intersectObject(shell.group,true)[0];assert(hit);
    assert(Math.abs(rack.mounts.surface(x,y)-hit.point.z)<1e-5,'Sample final roof, including ribs and rear warp');
    assert(rack.mounts.base(cx,y)>=hit.point.z+.0249,'Channel clears every sampled roof/rib');
  }
}
assert.equal(ladder.group.userData.upperMounts.length,2);
for(const mount of ladder.group.userData.upperMounts){
  assert.equal(mount.channelX,ROOF_MOUNT_SPEC.centerXs[0]);
  assert([79,92].includes(mount.bodyY));
  assert.equal(mount.plateBottom,rack.mounts.top(mount.channelX,mount.bodyY));
  assert(Math.abs(mount.armEnd[2]-LADDER_SPEC.upperMount.armRadius-mount.plateTop)<1e-9,'Arm rests on channel bracket');
  assert(mount.armEnd[2]+LADDER_SPEC.upperMount.armRadius<1.475,'End sits below black lower rack rail');
}
assert.equal(ladder.group.userData.treadCenters.length,7);
assert.deepEqual(ladder.group.userData.railPaths[0][0],[-7,79,2]);
assert.deepEqual(ladder.group.userData.railPaths[0].at(-1),[-14.5,79,-92]);
assert.deepEqual(ladder.group.userData.railPaths[1].at(-1),[-14.5,89,-92]);
let triangles=0,batches=0;
for(const group of [rack.group,ladder.group])group.traverse(o=>{if(!o.isMesh)return;batches++;triangles+=o.geometry.index.count/3;for(const k of ['position','normal'])assert([...o.geometry.attributes[k].array].every(Number.isFinite));});
assert(triangles<26000);assert(batches<=10);
console.log('PASS both roof channels, final shell/rib contact, driver-channel bracket and arm seats, unchanged ladder lower path and rack datum, finite bounded geometry.');
