import * as T from './vendor/three.module.js';

export const INTERACTION_SPEC = {
  revision: 'interactive-1', units: 'in', status: 'illustrative motion',
  cabDoorAngle: 68, rearDoorAngle: 88, slidingDoorTravel: 56, slidingDoorOutset: 5.2,
  driverWindowTravel: 16.8, flareWindowAngle: 32, suspensionCompression: 2.4,
  source: 'Owner describes rearward-sliding driver middle window and top-hinged flare window with support stays. Axes, angles, travel and hidden surfaces are estimates.',
  limits: 'Animation is not a clearance, collision, suspension, road-load or beam-pattern simulation. Interior openings are dark placeholders. Rear cargo is temporarily hidden for rear-door demonstrations. Animation state is temporary and does not change exported roof measurements.',
  measurementRequest: 'M01-M05'
};
const V = (...p) => new T.Vector3(...p);
const smooth = x => x*x*(3-2*x);

// Preserve interpolated normals when splitting the existing closed shell. The
// extracted panel and its host retain precisely the same surface at rest.
export function splitGeometry(geometry, polygon, axes=[1,2], eligible=()=>true) {
  const turns=polygon.map((b,i)=>{const a=polygon[(i+polygon.length-1)%polygon.length],c=polygon[(i+1)%polygon.length];return Math.sign((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]));}).filter(Boolean);
  if(turns.some(t=>t!==turns[0])){
    const faces=T.ShapeUtils.triangulateShape(polygon.map(p=>new T.Vector2(...p)),[]),pieces=[];
    const a=geometry.attributes.position,sourceNormal=geometry.attributes.normal,ix=geometry.index,lo=[0,1].map(i=>Math.min(...polygon.map(p=>p[i]))),hi=[0,1].map(i=>Math.max(...polygon.map(p=>p[i]))),candidate=[],rest=[];
    for(let i=0;i<(ix?.count||a.count);i+=3){const ids=[0,1,2].map(j=>ix?ix.getX(i+j):i+j),tri=ids.map(k=>[a.getX(k),a.getY(k),a.getZ(k)]),inside=eligible(tri)&&!axes.some((axis,j)=>tri.every(p=>p[axis]<lo[j])||tri.every(p=>p[axis]>hi[j]));(inside?candidate:rest).push(...ids);}
    function subset(ids){const p=[],norm=[];for(const k of ids){p.push(a.getX(k),a.getY(k),a.getZ(k));norm.push(sourceNormal.getX(k),sourceNormal.getY(k),sourceNormal.getZ(k));}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(norm,3));return g;}
    let remainder=subset(candidate);const untouched=subset(rest);
    for(const face of faces){const split=splitGeometry(remainder,face.map(i=>polygon[i]),axes,eligible);remainder.dispose();remainder=split.outside;pieces.push(split.inside);}
    const p=[],n=[];for(const piece of pieces){for(const v of piece.attributes.position.array)p.push(v);for(const v of piece.attributes.normal.array)n.push(v);piece.dispose();}
    const inside=new T.BufferGeometry();inside.setAttribute('position',new T.Float32BufferAttribute(p,3));inside.setAttribute('normal',new T.Float32BufferAttribute(n,3));inside.setIndex(Array.from({length:p.length/3},(_,i)=>i));inside.computeBoundingBox();inside.computeBoundingSphere();const outside=new T.BufferGeometry();for(const key of ['position','normal']){const a=untouched.attributes[key].array,b=remainder.attributes[key].array,data=new Float32Array(a.length+b.length);data.set(a);data.set(b,a.length);outside.setAttribute(key,new T.BufferAttribute(data,3));}outside.setIndex(Array.from({length:outside.attributes.position.count},(_,i)=>i));remainder.dispose();untouched.dispose();return {outside,inside};
  }
  const pos=geometry.attributes.position, normal=geometry.attributes.normal, ix=geometry.index;
  let area=0; for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length];area+=a[0]*b[1]-b[0]*a[1];}
  const orientation=area>=0?1:-1;
  const planes=polygon.map((a,i)=>{const b=polygon[(i+1)%polygon.length];return p=>orientation*((b[0]-a[0])*(p[axes[1]]-a[1])-(b[1]-a[1])*(p[axes[0]]-a[0]));});
  const outside=[],inside=[];
  const emit=(poly,out)=>{for(let i=1;i<poly.length-1;i++)out.push(...poly[0],...poly[i],...poly[i+1]);};
  function clip(poly,fn,sign){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=fn(p)*sign,b=fn(q)*sign;if(a>=0)out.push(p);if((a>=0)!==(b>=0)){const t=a/(a-b);out.push(p.map((v,j)=>v+(q[j]-v)*t));}}return out;}
  for(let i=0;i<(ix?.count||pos.count);i+=3){const tri=[0,1,2].map(j=>{const k=ix?ix.getX(i+j):i+j;return[pos.getX(k),pos.getY(k),pos.getZ(k),normal.getX(k),normal.getY(k),normal.getZ(k)];});
    if(!eligible(tri)||planes.some(fn=>tri.every(p=>fn(p)<0))){emit(tri,outside);continue;}
    let poly=tri;for(const fn of planes){emit(clip(poly,fn,-1),outside);poly=clip(poly,fn,1);if(!poly.length)break;}emit(poly,inside);
  }
  function make(data){const p=[],n=[];for(let i=0;i<data.length;i+=6){p.push(...data.slice(i,i+3));const v=V(...data.slice(i+3,i+6)).normalize();n.push(...v.toArray());}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(n,3));g.setIndex(Array.from({length:p.length/3},(_,i)=>i));g.computeBoundingBox();g.computeBoundingSphere();return g;}
  return {outside:make(outside),inside:make(inside)};
}
function rounded(cy,cz,w,h,r){const p=[];for(let k=0;k<4;k++){const a=k*Math.PI/2,y=cy+(Math.cos(a+Math.PI/4)>0?1:-1)*(w/2-r),z=cz+(Math.sin(a+Math.PI/4)>0?1:-1)*(h/2-r);for(let i=0;i<=5;i++)p.push([y+r*Math.cos(a+i*Math.PI/10),z+r*Math.sin(a+i*Math.PI/10)]);}return p;}

export function buildInteractiveModel({shell,emblems,exterior,rack}) {
  const root=shell.group, parts={}, materials={}, extras=new T.Group();extras.name='Interactive openings and lighting';root.add(extras);
  const dark=materials.opening=new T.MeshStandardMaterial({name:'Unmodeled interior recess',color:'#10191d',roughness:1,side:T.DoubleSide});
  const metal=materials.stay=new T.MeshStandardMaterial({name:'Window support stay',color:'#a8b3b4',metalness:.7,roughness:.3});
  const sealMat=materials.seal=new T.MeshStandardMaterial({name:'Opening frame',color:'#20292b',roughness:.8,side:T.DoubleSide});
  function makePart(id,pivot=[0,0,0]){const g=new T.Group();g.name=id;g.userData.action=id;g.position.set(...pivot);root.add(g);parts[id]=g;return g;}
  const cabOutline=[[-33,-52],[-11,-23],[-4,-20],[18,-17],[18,-67],[16,-82],[15,-88],[12,-90],[-15,-90],[-16,-79],[-20,-72],[-25,-67],[-26,-63]];
  const sliderOutline=[[20.1,-89],[79.8,-89],[79.8,-14],[78,-9],[20.1,-9]];
  for(const sign of [-1,1])makePart(sign<0?'driver-door':'passenger-door',[30+sign*38,-27,-56]);
  makePart('sliding-door');makePart('driver-slider');makePart('flare-window',[-13.15,118.5,-24.82]);
  makePart('rear-driver-door',[-4.6,155,-45]);makePart('rear-passenger-door',[64.6,155,-45]);
  for(const side of ['driver','passenger'])for(const axle of ['front','rear']){
    const x=30+(side==='driver'?-1:1)*36.1,y=axle==='front'?-36:108;
    makePart(`wheel-${side}-${axle}`,[x,y,-92.5]);makePart(`wheel-${side}-${axle}-caliper`);
  }
  makePart('suspension');makePart('rear-springs');makePart('rear-axle');makePart('driver-middle-fixed');
  for(const id of ['headlights','foglights','taillights'])makePart(id);
  function attach(g,o){o.position.sub(g.position);g.add(o);}
  for(const o of [...root.children]){if(o===extras||Object.values(parts).includes(o))continue;const key=o.userData.motionPart;if(parts[key])attach(parts[key],o);}
  // Extract panels from the stationary painted skin and lower plastic molding.
  function extract(o,outline,axes,predicate,target,discard=false){o.geometry.computeBoundingBox();const b=o.geometry.boundingBox,lo=axes.map((axis,i)=>Math.min(...outline.map(p=>p[i]))),hi=axes.map((axis,i)=>Math.max(...outline.map(p=>p[i])));if(axes.some((axis,i)=>b.max.getComponent(axis)<lo[i]||b.min.getComponent(axis)>hi[i]))return;const corners=[b.min.toArray(),b.max.toArray()];if(!corners.some(p=>predicate([p])))return;const g=splitGeometry(o.geometry,outline,axes,predicate);o.geometry.dispose();o.geometry=g.outside;if(g.inside.attributes.position.count){if(discard)g.inside.dispose();else{const piece=new T.Mesh(g.inside,o.material);piece.name=target.name+' extracted surface';piece.userData={...o.userData};piece.castShadow=true;attach(target,piece);}}else g.inside.dispose();}
  const stationary=root.children.filter(o=>o.isMesh&&!o.userData.motionPart&&!o.userData.underfloorPlaceholder);
  for(const o of stationary){
    if(o.userData.sleepingFlare||o.userData.camperWindow)continue;
    for(const sign of [-1,1]){
      const side=tri=>tri.every(p=>sign*(p[0]-30)>30);
      extract(o,cabOutline,[1,2],side,parts[sign<0?'driver-door':'passenger-door']);
      if(sign>0)extract(o,sliderOutline,[1,2],side,parts['sliding-door']);
    }
    // The rear bumper, tail lights and hinge barrels stay on the body.
    if(o.material.name.startsWith('Blue-gray paint')||['Panel seam','Recess','Textured bumper','Steel wheels','Bright metal'].includes(o.material.name)){
      for(const sign of [-1,1]){const poly=[[0,-85.5],[30,-85.5],[33,-80],[34,-45],[32,-15],[29,-4],[0,-3]].map(([x,z])=>[30+sign*x,z]);extract(o,poly,[0,2],tri=>tri.every(p=>p[1]>146),parts[sign<0?'rear-driver-door':'rear-passenger-door']);}
    }
  }
  // Body-mounted Entegra marks and spare must follow their own door.
  for(const [name,key] of [['driver-entegra','driver-door'],['passenger-entegra','passenger-door'],['rear-launch','rear-driver-door']]){const badge=emblems.group.children.find(o=>o.name===name);if(badge)attach(parts[key],badge);}
  attach(parts['rear-driver-door'],exterior.spare);
  function panel(points,x,mat=dark,target=extras){const shape=new T.Shape(points.map(p=>new T.Vector2(...p))),g=new T.ShapeGeometry(shape,8),a=g.attributes.position;for(let i=0;i<a.count;i++)a.setXYZ(i,x,a.getX(i),a.getY(i));g.computeVertexNormals();const o=new T.Mesh(g,mat);o.name='Dark illustrative opening';target.add(o);return o;}
  function outline(points,x,target=extras,r=.16){const curve=new T.CatmullRomCurve3(points.map(p=>V(x,...p)),true,'catmullrom',0),o=new T.Mesh(new T.TubeGeometry(curve,points.length*4,r,6,true),sealMat);target.add(o);return o;}
  const doorBacks=[];
  for(const sign of [-1,1]){const o=panel(cabOutline,30+sign*25);o.visible=false;o.userData.action=sign<0?'driver-door':'passenger-door';doorBacks.push([o,sign<0?'driver-door':'passenger-door']);}
  const sb=panel(sliderOutline,57);sb.visible=false;sb.userData.action='sliding-door';doorBacks.push([sb,'sliding-door']);
  const rearBack=new T.Mesh(new T.PlaneGeometry(63,79),dark);rearBack.rotation.x=Math.PI/2;rearBack.position.set(30,139,-45);rearBack.visible=false;rearBack.userData.action='rear-doors';extras.add(rearBack);
  // Cut the opening behind the moving middle pane out of BOTH the glazing and
  // the original metal skin. A fixed insect-screen recess remains behind it.
  const vent=rounded(43,-32.5,15.4,19.4,1.3),flare=rounded(118.5,-29.3,23.75,8.95,2.6);
  for(const o of [...root.children,...parts['driver-middle-fixed'].children])if(o.isMesh&&!o.userData.underfloorPlaceholder&&!o.userData.motionPart?.startsWith('wheel')){
    if(o.parent===parts['driver-middle-fixed']||(!o.userData.sleepingFlare&&!o.userData.camperWindow))extract(o,vent,[1,2],tri=>tri.every(p=>p[0]<1),parts['driver-slider'],true);
    if(o.userData.sleepingFlare||o.material.name.startsWith('Blue-gray paint'))extract(o,flare,[1,2],tri=>tri.every(p=>p[0]<1),parts['flare-window'],true);
  }
  const ventBack=panel(vent,-6),ventRim=outline(vent,-8.8);ventBack.userData.camperWindow=ventRim.userData.camperWindow=true;
  const flareBack=panel(rounded(118.5,-29.3,26,11.2,2.6),-8.8);flareBack.userData.sleepingFlare=true;
  // Dark reveal walls connect the actual aperture to the recessed placeholder;
  // oblique rays must not see blue body slivers between these separated planes.
  function reveal(points,source,innerX,flag,action){const a=source.geometry.attributes.position,outer=[];for(const [y,z] of points){let best=Infinity,x=0;for(let i=0;i<a.count;i++){const d=(a.getY(i)-y)**2+(a.getZ(i)-z)**2;if(d<best){best=d;x=a.getX(i);}}outer.push([x+.08,y,z]);}const p=[],ix=[];for(const row of [outer,outer.map(v=>[innerX,v[1],v[2]])])for(const v of row)p.push(...v);for(let i=0;i<points.length;i++){const j=(i+1)%points.length,n=points.length;ix.push(i,j,i+n,j,j+n,i+n);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();const wall=new T.Mesh(g,dark);wall.userData[flag]=true;wall.userData.action=action;extras.add(wall);}
  reveal(vent,parts['driver-slider'].children[0],-6,'camperWindow','driver-slider');
  reveal(flare,parts['flare-window'].children[0],-8.8,'sleepingFlare','flare-window');
  ventBack.userData.action='driver-slider';flareBack.userData.action='flare-window';
  // Fine screen lines and a fixed window rail make the opening legible.
  for(let y=36;y<=50;y+=1.4){const g=new T.BufferGeometry().setFromPoints([V(-6.1,y,-41),V(-6.1,y,-24)]),line=new T.Line(g,new T.LineBasicMaterial({color:'#495655',transparent:true,opacity:.35}));line.userData.camperWindow=true;extras.add(line);}
  const flareGlass=parts['flare-window'].children.find(o=>o.isMesh);
  let hingeAxis=V(0,1,0),glassEdge=[];
  if(flareGlass){
    const g=flareGlass.geometry,a=g.attributes.position,counts=new Map();for(let i=0;i<g.index.count;i+=3){const t=[g.index.getX(i),g.index.getX(i+1),g.index.getX(i+2)];for(let j=0;j<3;j++){const u=t[j],v=t[(j+1)%3],key=[Math.min(u,v),Math.max(u,v)].join(',');counts.set(key,(counts.get(key)||0)+1);}}
    const edges=[...counts].filter(([,n])=>n===1).map(([key])=>key.split(',').map(Number));if(edges.length){const ring=[edges[0][0]];let end=edges[0][1];edges.splice(0,1);while(edges.length){ring.push(end);const i=edges.findIndex(e=>e.includes(end));if(i<0)break;const e=edges.splice(i,1)[0];end=e[0]===end?e[1]:e[0];}glassEdge=ring.map(i=>V().fromBufferAttribute(a,i));}
    const zMax=Math.max(...glassEdge.map(p=>p.z)),top=glassEdge.filter(p=>p.z>zMax-.12).sort((a,b)=>a.y-b.y),left=top[0],right=top.at(-1);
    hingeAxis=right.clone().sub(left).normalize();const old=parts['flare-window'].position.clone(),pivot=left.clone().add(right).multiplyScalar(.5);for(const child of parts['flare-window'].children)child.position.add(old).sub(pivot);parts['flare-window'].position.copy(pivot);
    const rim=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(glassEdge,true,'catmullrom',0),glassEdge.length*2,.12,6,true),sealMat);rim.userData.sleepingFlare=true;attach(parts['flare-window'],rim);
  }
  const stays=[];
  function rod(){const o=new T.Mesh(new T.CylinderGeometry(.11,.11,1,10),metal);o.userData.sleepingFlare=true;extras.add(o);return o;}
  for(const y of [109,128]){const end=glassEdge.reduce((best,p)=>Math.abs(p.y-y)+Math.abs(p.z+33.3)<Math.abs(best.y-y)+Math.abs(best.z+33.3)?p:best,glassEdge[0]).clone();stays.push({base:V(end.x+2.5,end.y,-32.8),end,bar:rod(),sleeve:rod()});}
  function setRod(o,a,b,r=1){const d=b.clone().sub(a);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(V(0,1,0),d.clone().normalize());o.scale.set(r,d.length(),r);}
  // Independent lens materials prevent the fuel cap or body trim from glowing.
  const lamps={};
  function lampGroup(id,objects,color){const materialSet=new Set();for(const o of objects){if(!o.isMesh)continue;const m=o.material.clone();m.emissive.set(color);m.emissiveIntensity=0;o.material=m;materialSet.add(m);o.userData.action=id;}lamps[id]=[...materialSet];}
  for(const id of ['headlights','foglights','taillights'])lampGroup(id,parts[id].children,id==='taillights'?'#ff3129':'#fff4d6');
  lampGroup('lightbar',rack.group.children.filter(o=>o.isMesh&&o.material.name.includes('LED optical')),'#eaf5ff');
  lampGroup('porchlight',shell.driverDetails.light.children.filter(o=>o.name==='Hatch light unlit lens'),'#fff0c9');
  // Real spot lights illuminate the optional night-preview floor. Distances,
  // spread and intensity are illustrative, not a certified headlamp pattern.
  const beams={};
  for(const id of ['headlights','foglights','lightbar']){const group=new T.Group();extras.add(group);beams[id]=group;const starts=id==='lightbar'?[[30,20,4.9]]:id==='foglights'?[[.5,-74,-81],[59.5,-74,-81]]:[[1,-71,-64],[59,-71,-64]];for(const p of starts){const light=new T.SpotLight('#f2f5e4',0,480,.34,.65,1);light.position.set(...p);light.target.position.set(p[0],p[1]-170,-107.7);group.add(light,light.target);}}
  const nightFloor=new T.Mesh(new T.PlaneGeometry(1200,1200),new T.MeshStandardMaterial({name:'Night preview ground',color:'#39444a',roughness:1}));nightFloor.position.set(30,30,-107.8);nightFloor.userData.ignorePick=true;nightFloor.visible=false;extras.add(nightFloor);
  const suspensionBase=[];for(const key of ['suspension','rear-springs'])parts[key].traverse(o=>{if(o.isMesh)suspensionBase.push({o,spring:key==='rear-springs',base:o.geometry.attributes.position.array.slice()});});
  function apply(state,phase=0){
    parts['driver-door'].rotation.z=state['driver-door']*68*Math.PI/180;parts['passenger-door'].rotation.z=-state['passenger-door']*68*Math.PI/180;
    const slide=state['sliding-door'];parts['sliding-door'].position.set(5.2*smooth(Math.min(1,slide/.22)),56*smooth(Math.max(0,(slide-.16)/.84)),0);
    parts['driver-slider'].position.set(-.25*state['driver-slider'],16.8*state['driver-slider'],0);
    parts['flare-window'].quaternion.setFromAxisAngle(hingeAxis,state['flare-window']*32*Math.PI/180);
    parts['rear-driver-door'].rotation.z=state['rear-doors']*88*Math.PI/180;parts['rear-passenger-door'].rotation.z=-state['rear-doors']*88*Math.PI/180;
    for(const [o,id] of doorBacks)o.visible=state[id]>.01;rearBack.visible=state['rear-doors']>.01;
    const matrix=new T.Matrix4().makeTranslation(...parts['flare-window'].position.toArray()).multiply(new T.Matrix4().makeRotationFromQuaternion(parts['flare-window'].quaternion)).multiply(new T.Matrix4().makeTranslation(...parts['flare-window'].position.clone().negate().toArray()));
    for(const s of stays){const end=s.end.clone().applyMatrix4(matrix),mid=s.base.clone().lerp(end,.58);setRod(s.bar,s.base,end);setRod(s.sleeve,s.base,mid,1.8);s.bar.visible=s.sleeve.visible=state['flare-window']>.025&&state.layers?.flares!==false;}
    const travel=state.wheels*1.2*(1-Math.cos(phase*2.3));
    for(const [id,g] of Object.entries(parts))if(id.startsWith('wheel-')){g.position.z=(id.endsWith('caliper')?0:-92.5)+travel;if(!id.endsWith('caliper'))g.rotation.x=phase*2.1;}
    parts['rear-axle'].position.z=travel;
    for(const {o,base,spring} of suspensionBase){const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const z=base[i*3+2],y=base[i*3+1],weight=spring?Math.max(0,1-((y-108)/28)**2):T.MathUtils.clamp((-69-z)/22,0,1);a.setZ(i,z+travel*weight);}a.needsUpdate=true;o.geometry.computeBoundingSphere();}
    for(const [id,ms] of Object.entries(lamps)){const level=state[id]||0;for(const m of ms)m.emissiveIntensity=id==='headlights'?(level===2?3.4:level?1.5:0):level*2.2;}
    parts['flare-window'].visible=state.layers?.flares!==false;parts['driver-slider'].visible=state.layers?.windows!==false;nightFloor.visible=!!state.night;for(const [id,g] of Object.entries(beams)){g.visible=id!=='lightbar'||state.layers?.rack!==false;for(const o of g.children){if(!o.isSpotLight)continue;const high=id==='headlights'&&state[id]===2;o.intensity=state[id]?(high?1800:1100):0;o.angle=high?.31:.42;o.target.position.y=o.position.y-(high?155:90);}}
    root.updateMatrixWorld(true);
  }
  return {parts,extras,materials,lamps,apply,spec:INTERACTION_SPEC};
}
