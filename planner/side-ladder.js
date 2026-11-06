import * as T from './vendor/three.module.js';
import {createRoofMounts,ROOF_MOUNT_SPEC} from './roof-mounts.js?v=mount1';

// Original geometry. Body coordinates in inches; owner photo proportions are estimates.
export const LADDER_SPEC={
  revision:'owl-side-ladder-2-roof-channel',side:'driver',brand:'Owl Vans',status:'photo-estimated',
  productReference:'Explorer Sprinter Side Ladder',installedProductRevision:null,
  sources:['https://owlvans.com/products/sprinter-side-ladder-explorer','https://ready.owlvans.com/how-to-install-the-owl-ladder-for-sprinter-vans'],
  sourceScope:'Black aluminum side ladder, two joined sections, slotted steps, upper roof/rack and lower pinch-weld mounts. Published 13-inch wheel-opening-to-front clearance is not ladder width. Exact installed revision and dimensions remain unverified.',
  installation:{frontRailY:79,rearRailY:92,lowerRearRailY:89,topZ:2,bottomZ:-92,railDiameter:1.15,treadDepth:3.3,treadFractions:[.045,.181,.331,.479,.632,.811,.95]},
  upperMount:{status:'estimated',channel:ROOF_MOUNT_SPEC,channelSide:'driver',bodyYs:[79,92],bracketPlate:[1.8,2.6,.16],armRadius:.4,description:'Bent arms terminate on estimated brackets seated on the roof-mounted aluminum channel, below the black rack rail. Concealed fasteners are illustrative.'},
  observations:'Seven tread levels: four narrow upper treads, two broad slotted/notched lower plates and one low narrow tread. Rear upright sweeps forward at the bottom, immediately ahead of rear wheel. Ladder straddles driver window/flare junction.',
  unresolved:['Overall height and width','Tread spacing, depth and rail section','Standoff at roof, flare and sill','Position relative to rear wheel opening and body seams','Exact top/bottom brackets and installed model'],
  limits:'Photo-estimated visual accessory, excluded from equipment box checks. No physical fit, climbing load, mounting or structural validation. Separate rear-door steps remain deferred.',
  geometryLicense:'Original MIT geometry; no product mesh, photo textures or reference imagery redistributed.'
};

export function buildSideLadder({mounts=createRoofMounts()}={}){
  const group=new T.Group();group.name='Owl driver-side ladder · photo estimate';
  const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p),i=LADDER_SPEC.installation;
  const mat=(name,color,metalness,roughness)=>materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});
  const frame=mat('Ladder powder-coated black','#22272a',.35,.57),joint=mat('Ladder joint collars','#151b1e',.4,.51),bolt=mat('Ladder black fasteners','#596268',.7,.38);
  function add(g,m=frame){if(!g.attributes.normal)g.computeVertexNormals();let b=buckets.get(m);if(!b){b={p:[],n:[],i:[],count:0};buckets.set(m,b);}const p=g.attributes.position;for(const v of p.array)b.p.push(v);for(const v of g.attributes.normal.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let j=0;j<p.count;j++)b.i.push(j+b.count);b.count+=p.count;g.dispose();}
  function box(c,s,m=frame){const g=new T.BoxGeometry(...s);g.translate(...c);add(g,m);}
  function cyl(a,b,r,m=bolt,n=10){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m);}
  const lerp=T.MathUtils.lerp;
  function xAt(z){const points=[[2,-7],[-2,-12],[-14,-15],[-28,-16],[-72,-16.3],[-92,-14.5]];for(let k=0;k<points.length-1;k++){const a=points[k],b=points[k+1];if(z>=b[0])return lerp(a[1],b[1],(a[0]-z)/(a[0]-b[0]));}return points.at(-1)[1];}
  function rearY(z){return lerp(i.rearRailY,i.lowerRearRailY,T.MathUtils.smoothstep(-z,74,92));}
  const railPoints=(rear)=>[2,0,-2,-5,-14,-28,-42,-60,-72,-78,-85,-92].map(z=>[xAt(z),rear?rearY(z):i.frontRailY,z]);
  for(const rear of [false,true]){
    const pts=railPoints(rear),curve=new T.CatmullRomCurve3(pts.map(p=>V(...p)),false,'centripetal');
    add(new T.TubeGeometry(curve,96,i.railDiameter/2,10,false));
    for(const end of [pts[0],pts.at(-1)])cyl([end[0],end[1]-.025,end[2]],[end[0],end[1]+.025,end[2]],.55,joint,12);
    const y=rear?rearY(-35):i.frontRailY;
    cyl([xAt(-35),y,-36.15],[xAt(-35),y,-33.85],.64,joint,12);
    cyl([xAt(-35)-.7,y,-35],[xAt(-35)-.56,y,-35],.16,bolt,6);
  }
  // Keep the ladder itself in place; only its upper arms/feet meet the roof channel.
  cyl([xAt(2),i.frontRailY,2],[xAt(2),i.rearRailY,2],.5,frame,12);
  const upperMounts=[];
  for(const y of [i.frontRailY,i.rearRailY]){
    const x=mounts.spec.centerXs[0],base=mounts.top(x,y),armZ=base+.16+.4;
    const curve=new T.CatmullRomCurve3([V(-7,y,2),V(-4,y,2.65),V(0,y,2),V(2.4,y,armZ),V(3.4,y,armZ),V(x,y,armZ)],false,'centripetal');
    add(new T.TubeGeometry(curve,36,.4,10,false));
    box([x,y,base+.08],[1.8,2.6,.16],joint);
    for(const yy of [y-.95,y+.95])cyl([x,yy,base+.16],[x,yy,base+.31],.18,bolt,6);
    upperMounts.push({channelX:x,bodyY:y,channelTop:base,armEnd:[x,y,armZ],plateBottom:base,plateTop:base+.16});
    const by=y===i.frontRailY?y:i.lowerRearRailY-.4;
    box([-11.2,by,-90.8],[6.6,1.5,.22],joint);box([-8.4,by,-91.45],[.22,2.2,1.5],joint);
    cyl([-8.65,by,-91.45],[-8.1,by,-91.45],.18,bolt,6);
  }
  function slot(cx,cy,w,h){const p=new T.Path(),r=h/2;p.moveTo(cx-w/2+r,cy-h/2);p.lineTo(cx+w/2-r,cy-h/2);p.absarc(cx+w/2-r,cy,r,-Math.PI/2,Math.PI/2);p.lineTo(cx-w/2+r,cy+h/2);p.absarc(cx-w/2+r,cy,r,Math.PI/2,Math.PI*1.5);return p;}
  function plate(shape,depth,axis,origin){const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:4});const a=g.attributes.position;for(let j=0;j<a.count;j++){const u=a.getX(j),v=a.getY(j),w=a.getZ(j);if(axis==='vertical')a.setXYZ(j,origin[0]+w,origin[1]+u,origin[2]+v);else a.setXYZ(j,origin[0]+v,origin[1]+u,origin[2]+w);}g.computeVertexNormals();add(g);}
  const treadCenters=[];
  i.treadFractions.forEach((t,index)=>{
    const z=lerp(i.topZ,i.bottomZ,t),x=xAt(z)-.52,front=i.frontRailY+.2,rear=rearY(z)-.2,w=rear-front,cy=(front+rear)/2,broad=index===4||index===5;
    treadCenters.push([x,cy,z]);
    const tread=new T.Shape([new T.Vector2(-w/2,0),new T.Vector2(w/2,0),new T.Vector2(w/2,i.treadDepth),new T.Vector2(-w/2,i.treadDepth)]);
    for(const row of [.85,2.35])for(const u of [-w*.30,0,w*.30])tread.holes.push(slot(u,row,w*.21,.32));
    plate(tread,.15,'horizontal',[x,cy,z]);
    const h=broad?6.6:1.25,outline=broad?[[-w/2,0],[w/2,0],[w/2,-h],[w*.25,-h],[w*.12,-h+2.1],[-w*.12,-h+2.1],[-w*.25,-h],[-w/2,-h]]:[[-w/2,0],[w/2,0],[w/2,-h],[-w/2,-h]];
    const face=new T.Shape(outline.map(p=>new T.Vector2(...p)));
    for(const v of broad?[-1.2,-3.05,-4.85]:[-.63])for(const u of [-w*.3,0,w*.3]){if(broad&&v<-4&&u===0)continue;face.holes.push(slot(u,v,w*.20,.3));}
    plate(face,.16,'vertical',[x-.05,cy,z]);
    for(const y of [front+.25,rear-.25])cyl([x-.17,y,z-.6],[x+.1,y,z-.6],.13,bolt,6);
  });
  for(const [m,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,m);mesh.name=m.name;mesh.castShadow=true;mesh.receiveShadow=false;group.add(mesh);}
  group.userData={spec:LADDER_SPEC,bounds:new T.Box3().setFromObject(group),treadCenters,upperMounts,railPaths:[railPoints(false),railPoints(true)]};
  return {group,materials};
}
