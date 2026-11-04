import * as T from './vendor/three.module.js';

// Original geometry, inches in the shell's unmirrored body coordinates.
export const EXTERIOR_DETAILS_SPEC={
  revision:'spare-hatch-1',status:'photo-estimated',units:'in',
  coordinateFrame:'Body coordinates: X passengerward, Y rearward, Z up; roof datum Z=0.',
  spare:{side:'driver rear door',center:[11,164.5,-54.5],outsideDiameter:30.5,sectionWidth:9.65,rimDiameter:17,rimOuterLipDiameter:18.5,wheelStyle:'Six forked charcoal spokes',tireModel:null,tireSize:null,mountModel:null,
    dimensionBasis:'Illustrative nominal diameter and width borrowed from the recorded road-tire size, not an identification or measurement of the spare. Position, tread, wheel profile and mounting hardware are photo estimates.',
    observations:'Rear-facing wheel overlaps the lower driver rear glass; its inner shoulder is near the door center seam. A round diagonal upper brace meets the driver hinge. Motorcycle obscures the central retention and lower mount.',
    unresolved:['Spare tire size/model and actual outside diameter/width','Wheel size, offset and model','Wheel center relative to rear-door seam and bumper','Door-to-wheel standoff and bracket details','Bike-to-spare gap and rear-door movement']},
  cassetteHatch:{side:'driver',centerY:71,centerZ:-64.5,outerWidth:14,outerHeight:16,cornerRadius:1.25,maxFrameProjection:.65,model:null,
    observations:'Closed body-colored access door just ahead of the side ladder, above the dark molding. Rounded bezel, inset lid, two aft-edge latch bosses and two small forward hinges.',
    unresolved:['Outer bezel width/height and corner radius','Offsets to ladder, body seam and molding top','Visible lid dimensions and latch/hinge locations','Installed make/model and outward projection']},
  limits:'Exterior visualization only. Dimensions are not surveyed; hidden mount geometry is illustrative. Excluded from roof equipment box checks. No door-opening, mounting, load, restraint or physical clearance validation.',
  geometryLicense:'Original MIT geometry; no owner photos, identifying metadata, product textures or third-party meshes redistributed.'
};

export function buildExteriorDetails(shell){
  const group=new T.Group(),spare=new T.Group(),hatch=new T.Group();group.name='Photo-estimated exterior accessories';spare.name='Rear-door spare and mount';hatch.name='Cassette toilet access door';group.add(spare,hatch);
  const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p),spec=EXTERIOR_DETAILS_SPEC,s=spec.spare,h=spec.cassetteHatch;
  const mat=(name,color,metalness,roughness)=>materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});
  const rubber=mat('Spare all-terrain rubber','#202426',0,.92),alloy=mat('Spare charcoal alloy','#505458',.62,.36),black=mat('Accessory seal and recess','#141a1d',.1,.68),mount=mat('Spare mount coating','#262b2e',.4,.53),metal=mat('Accessory fasteners','#c2c4c3',.35,.45),paint=mat('Hatch blue-gray molded bezel','#7094b1',.12,.5);
  const lid=mat('Hatch painted lid','#709bc0',.22,.38);lid.envMapIntensity=.75;
  function add(g,m,target=spare){if(!g.attributes.normal)g.computeVertexNormals();const key=target.name+'|'+m.name;let b=buckets.get(key);if(!b){b={target,m,p:[],n:[],i:[],count:0};buckets.set(key,b);}for(const v of g.attributes.position.array)b.p.push(v);for(const v of g.attributes.normal.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let k=0;k<g.attributes.position.count;k++)b.i.push(k+b.count);b.count+=g.attributes.position.count;g.dispose();}
  function surface(p,i,m,target=spare){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(i);g.computeVertexNormals();add(g,m,target);}
  function cyl(a,b,r,m=mount,n=12,target=spare){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m,target);}
  function box(c,size,m=mount){const g=new T.BoxGeometry(...size);g.translate(...c);add(g,m);}
  const [cx,cy,cz]=s.center,r=s.outsideDiameter/2;
  const radial=(d,rr,a)=>[cx+rr*Math.cos(a),cy+d,cz+rr*Math.sin(a)];
  function lathe(profile,m){const p=[],ids=[],n=96;for(const [d,rr] of profile)for(let k=0;k<=n;k++)p.push(...radial(d,rr,k*2*Math.PI/n));for(let j=0;j<profile.length-1;j++)for(let k=0;k<n;k++){const a=j*(n+1)+k,b=a+n+1;ids.push(a,b,a+1,a+1,b,b+1);}surface(p,ids,m);}
  lathe([[-3.7,8.5],[-4.25,9.4],[-4.78,11.4],[-4.825,12.7],[-4.45,14.1],[-3.7,r-.35],[-2.9,r-.45],[0,r-.43],[2.9,r-.45],[3.7,r-.35],[4.45,14.1],[4.825,12.7],[4.78,11.4],[4.25,9.4],[3.7,8.5]],rubber);
  // Angular all-terrain blocks and shoulders; exact spare tread is unverified.
  for(let k=0;k<46;k++){
    const a=k*Math.PI*2/46;
    for(let row=0;row<4;row++){
      const d=-2.85+row*1.9,shift=row%2?.4:-.4,slant=(row<2?1:-1)*(k%2?1:-1),poly=[[-.79,-.69],[-.2,-.86],[.79,-.48],[.84,.56],[.21,.82],[-.78,.55]],p=[],ids=[];
      for(const rr of [r-.48,r])for(const [u,v] of poly)p.push(...radial(d+u,rr,a+(v+shift+u*.22*slant)/r));
      for(let j=1;j<5;j++)ids.push(0,j+1,j,6,6+j,7+j);for(let j=0;j<6;j++){const n=(j+1)%6;ids.push(j,n,n+6,j,n+6,j+6);}surface(p,ids,rubber);
    }
    for(const sign of [-1,1]){const p=[];for(const [d,rr,t] of [[3.65,r-.35,-.75],[4.65,r-1.3,-.55],[4.65,r-1.3,.65],[3.65,r-.35,.75],[3.65,r+.01,-.75],[4.65,r-1.06,-.55],[4.65,r-1.06,.65],[3.65,r+.01,.75]])p.push(...radial(sign*d,rr,a+t/r));surface(p,[0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0],rubber);}
  }
  lathe([[-3.7,8.5],[-3.7,8.9],[3.6,8.9],[3.95,9.25],[4.12,9.25],[4.12,8.78],[3.8,8.6],[-3.7,8.5]],alloy);
  // Rim is open between spokes; a spare has no rotor or brake caliper.
  const fork=[[2.5,-.70],[5.35,-.91],[8.45,-2.05],[8.75,-1.67],[6.35,0],[8.75,1.67],[8.45,2.05],[5.35,.91],[2.5,.70]];
  for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3,shape=new T.Shape(fork.map(([rr,t])=>new T.Vector2(rr,t*1.3))),g=new T.ExtrudeGeometry(shape,{depth:.58,bevelEnabled:true,bevelSegments:1,bevelSize:.1,bevelThickness:.1,curveSegments:1});const p=g.attributes.position;for(let j=0;j<p.count;j++){const rr=p.getX(j),t=p.getY(j),d=p.getZ(j)+2.7+.11*(rr-2.5);p.setXYZ(j,cx+rr*Math.cos(a)-t*Math.sin(a),cy+d,cz+rr*Math.sin(a)+t*Math.cos(a));}g.computeVertexNormals();add(g,alloy);}
  cyl([cx,cy+2.6,cz],[cx,cy+3.35,cz],3.35,alloy,48);
  for(let k=0;k<6;k++){const a=k*Math.PI/3;cyl(radial(3.36,2.56,a),radial(3.5,2.56,a),.47,black,12);}
  // Visible central retainer and partly concealed support use estimated construction.
  box([cx,cy+3.53,cz],[3.2,.3,3.2]);cyl([cx,cy+3.7,cz],[cx,cy+4.22,cz],.63,metal,6);
  const anchors=[[-4.6,153.7,-32],[-4.6,156.7,-74]];
  for(const [x,y,z] of anchors){box([x,y+.3,z],[2.6,.6,3.4]);for(const dz of [-1,1])cyl([x,y+.65,z+dz],[x,y+.85,z+dz],.28,metal,6);cyl([x+.3,y+.5,z],[cx,cy-3.6,cz],.68,mount,12);}
  cyl([cx,cy-3.6,cz],[cx,cy+3.5,cz],.85,mount,16);

  // Extract only the host-side triangles to project the hatch onto the actual
  // shell surface. This avoids a flat floating panel or expensive full-body rays.
  const hostPositions=[];
  for(const o of shell.children){if(!o.isMesh||o.userData.sleepingFlare||!o.material.name.startsWith('Blue-gray paint'))continue;const p=o.geometry.attributes.position,ind=o.geometry.index;for(let j=0;j<ind.count;j+=3){const ii=[ind.getX(j),ind.getX(j+1),ind.getX(j+2)];if(ii.every(k=>p.getX(k)<0&&p.getY(k)>60&&p.getY(k)<82&&p.getZ(k)>-77&&p.getZ(k)<-52))for(const k of ii)hostPositions.push(p.getX(k),p.getY(k),p.getZ(k));}}
  if(!hostPositions.length)throw new Error('Cassette hatch host surface missing');
  const hostGeo=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(hostPositions,3)),hostMat=new T.MeshBasicMaterial({side:T.DoubleSide}),host=new T.Mesh(hostGeo,hostMat),ray=new T.Raycaster();host.updateMatrixWorld(true);
  const cache=new Map();function bodyX(y,z){const key=y.toFixed(5)+','+z.toFixed(5);if(cache.has(key))return cache.get(key);ray.set(V(-40,y,z),V(1,0,0));const hit=ray.intersectObject(host)[0];if(!hit)throw new Error('Hatch point outside host surface');cache.set(key,hit.point.x);return hit.point.x;}
  function contour(w,hh,rr){const pts=[],point=(k,t)=>{const a=k*Math.PI/2,yy=Math.cos(a+Math.PI/4)>0?w/2-rr:-w/2+rr,zz=Math.sin(a+Math.PI/4)>0?hh/2-rr:-hh/2+rr;return [h.centerY+yy+rr*Math.cos(a+t*Math.PI/2),h.centerZ+zz+rr*Math.sin(a+t*Math.PI/2)];};for(let k=0;k<4;k++){for(let j=0;j<=8;j++)pts.push(point(k,j/8));const end=point(k,1),next=point((k+1)%4,0);for(let j=1;j<8;j++)pts.push([T.MathUtils.lerp(end[0],next[0],j/8),T.MathUtils.lerp(end[1],next[1],j/8)]);}return pts;}
  function ring(rows,m){const p=[],ids=[],n=64;for(const [w,hh,rr,d] of rows)for(const [y,z] of contour(w,hh,rr))p.push(bodyX(y,z)-d,y,z);for(let j=0;j<rows.length-1;j++)for(let k=0;k<n;k++){const a=j*n+k,b=j*n+(k+1)%n;ids.push(a,a+n,b,a+n,b+n,b);}surface(p,ids,m,hatch);}
  ring([[14,16,1.25,.035],[13.94,15.94,1.22,.26],[13.3,15.3,1.15,.65],[11.3,13.3,.7,.65],[10.9,12.9,.55,.25]],paint);
  ring([[10.93,12.93,.57,.28],[10.57,12.57,.5,.29]],black);
  const points=contour(10.55,12.55,.5),p=[bodyX(h.centerY,h.centerZ)-.30,h.centerY,h.centerZ],ids=[];for(const [y,z] of points)p.push(bodyX(y,z)-.30,y,z);for(let k=0;k<points.length;k++)ids.push(0,k+1,(k+1)%points.length+1);surface(p,ids,lid,hatch);
  const latchCenters=[];
  for(const z of [h.centerZ+5.1,h.centerZ-5.1]){
    const y=h.centerY+5.35,x=bodyX(y,z)-.62;latchCenters.push([x,y,z]);const shape=new T.Shape();shape.moveTo(.7,-.95);shape.lineTo(-.05,-.95);shape.bezierCurveTo(-1.2,-.95,-1.2,.95,-.05,.95);shape.lineTo(.7,.95);shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:.17,bevelEnabled:true,bevelSize:.16,bevelThickness:.14,bevelSegments:3,curveSegments:10});const a=g.attributes.position;for(let j=0;j<a.count;j++){const u=a.getX(j),v=a.getY(j),d=a.getZ(j);a.setXYZ(j,x-d,y+u,z+v);}g.computeVertexNormals();add(g,paint,hatch);cyl([x-.32,y,z],[x-.38,y,z],.19,metal,12,hatch);
    const fy=h.centerY-6.15,fx=bodyX(fy,z)-.42;cyl([fx,fy,z-.6],[fx,fy,z+.6],.23,paint,10,hatch);
  }
  hostGeo.dispose();hostMat.dispose();
  for(const b of buckets.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,b.m);mesh.name=b.m.name;mesh.castShadow=true;mesh.receiveShadow=false;b.target.add(mesh);}
  spare.userData={bounds:new T.Box3().setFromObject(spare),wheelCenter:s.center,hingeAnchors:anchors};hatch.userData={bounds:new T.Box3().setFromObject(hatch),latchCenters,hostSampleCount:cache.size};
  group.userData={spec};return {group,spare,hatch,materials};
}
