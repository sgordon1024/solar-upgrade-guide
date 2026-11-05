import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';

// Samples generated wheel/hub and B-pillar vertices against moving seat meshes.
// This guards a visible animation regression, not real-world swivel clearance.
export function assertCabinSwivelClearance(rig, closed) {
  rig.apply(closed);
  const cabin = rig.cabin;
  // The static leather batch contains the steering rim and hub; seat upholstery
  // is batched separately under each independently moving seat group.
  const wheel = cabin.group.children.find(o => o.isMesh && o.material.name === 'Owner-confirmed black leather');
  assert(wheel, 'production steering upholstery batch exists');
  function pointsFrom(mesh, filter = () => true) {
    const unique = new Map(), positions = mesh.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const p = new T.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
      if (filter(p)) unique.set(p.toArray().map(v => v.toFixed(4)).join(','), p);
    }
    return [...unique.values()];
  }
  const points = pointsFrom(wheel);
  assert(points.length > 100, 'steering sampling includes the generated rim');
  const headliner = cabin.group.children.find(o => o.isMesh && o.material.name === 'Cab headliner');
  assert(headliner, 'production B-pillar trim exists');
  const pillars = {
    'driver-seat': pointsFrom(headliner, p => p.x < 0 && p.y > 15 && p.z < -35),
    'passenger-seat': pointsFrom(headliner, p => p.x > 60 && p.y > 15 && p.z < -35),
  };
  for (const p of Object.values(pillars)) assert(p.length > 50, 'pillar sampling includes its generated surface');
  const ray = new T.Raycaster(), direction = new T.Vector3(.927, .281, .249).normalize();
  let checked = 0;
  try {
    for (const [id, seat] of Object.entries(cabin.seats)) {
      const meshes = [];
      seat.traverse(o => { if (o.isMesh) meshes.push(o); });
      const fixtures = [{name: 'B-pillar trim', points: pillars[id]}];
      if (id === 'driver-seat') fixtures.push({name: 'steering upholstery', points});
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        rig.apply({...closed, [id.replace('-seat', '-door')]: 1, [id]: t});
        // Recompute after articulation: the raised armrest is not in the same
        // local bounds as the forward-facing seat's lowered armrest.
        const bounds = new T.Box3().setFromObject(seat);
        for (const fixture of fixtures) for (const p of fixture.points) {
        if (!bounds.containsPoint(p)) continue;
        checked++;
        ray.set(p, direction);
        // Signed crossings retain overlapping upholstery solids. Plain odd/even
        // parity would incorrectly cancel two overlapping closed surfaces.
        const seen = []; let winding = 0;
        for (const hit of ray.intersectObjects(meshes, true)) {
          const sign = Math.sign(hit.face.normal.clone().transformDirection(hit.object.matrixWorld).dot(direction));
          if (seen.some(h => h.object === hit.object && h.sign === sign && Math.abs(h.distance - hit.distance) < 1e-5)) continue;
          seen.push({object: hit.object, sign, distance: hit.distance});
          winding += sign;
        }
        assert(winding <= 0, `${fixture.name} penetrates ${id} at swivel fraction ${t}`);
        }
      }
    }
  } finally {
    rig.apply(closed);
  }
  assert(checked > 0, 'swivel test exercised nearby production geometry');
  return {posesPerSeat: 101, steeringVertices: points.length, pillarVertices: Object.values(pillars).map(p => p.length), nearbySamples: checked};
}
