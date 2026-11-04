import * as T from './vendor/three.module.js';
import {CARRIER_SPEC} from './rear-carrier.js';

// Original mesh. Local X points toward the front wheel/passenger side,
// Y points outboard from the van, Z is height above the wheel channel, in inches.
const mm=n=>n/25.4;
export const BIKE_SPEC={
  model:'2021 KTM 350 SX-F',revision:'ktm-1',
  source:'https://en.enduro.team/images/2/26/2021_350_sxf.pdf',
  sourceDescription:'KTM owner manual 3214215en, 07/2020, printed pages 139–140; manufacturer-authored manual hosted by a third party.',
  manufacturer:{wheelbase:mm(1485),wheelbaseAdjustment:mm(10),seatHeightUnloaded:mm(950),groundClearanceUnloaded:mm(370),frontTire:'80/100-21',rearTire:'110/90-19',frontRimDiameter:21,rearRimDiameter:19,frontDiscDiameter:mm(260),rearDiscDiameter:mm(220)},
  derived:{frontTireDiameter:21+2*mm(80),rearTireDiameter:19+2*mm(99)},
  installation:{status:'estimated',frontAxleX:59.4,rearAxleX:59.4-mm(1485),wheelCenterY:CARRIER_SPEC.installation.trackCenterY,contactZ:CARRIER_SPEC.installation.platformZ,frontWheelSide:'passenger',steeringDegrees:0,leanDegrees:0,upperForkPhotoCalibration:{vertical:2.25,rearward:1,status:'estimated'},measuredSuspensionCompression:null,measuredHandlebarClearance:null},
  appearance:{status:'photo-estimated',details:'Orange/white plastics, black seat, black spoked rims, knobby tires, silver right-side silencer and front number 69 from owner photos. Fine graphics, engine, controls, tire profiles and unseen side are reconstructed.'},
  limits:'Nominal tire diameters are calculated from stock size codes, not measured knobby-tire envelopes. Installation, steering, tie-down paths and transport stance are estimates. No load, restraint, door-opening or clearance validation.'
};

export function buildDirtbike(){
  const group=new T.Group();group.name='2021 KTM 350 SX-F · photo reconstruction';
  const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p);let frontCalibration=false;
  function mat(name,color,metalness=0,roughness=.5){return materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});}
  const orange=mat('KTM orange plastics','#f45116',.08,.35),white=mat('Warm white plastics','#eae8df',.04,.4),black=mat('Seat, frame and trim','#181b1c',.1,.68),rubber=mat('Knobby rubber','#212323',0,.92),silver=mat('Brushed aluminum','#a4a5a1',.7,.4),chrome=mat('Fork stanchions and spokes','#c7ceca',.82,.25),engine=mat('Cast engine alloy','#747771',.6,.58),gold=mat('Fork collars','#a97d35',.68,.38),blue=mat('Fork and graphic blue','#244e80',.15,.45),strap=mat('Transport webbing · estimated','#292b2b',0,.95);
  function add(g,m){if(frontCalibration){const a=g.attributes.position;for(let j=0;j<a.count;j++){const lift=Math.max(0,Math.min(1,(a.getZ(j)-35.3)/7.1));a.setXYZ(j,a.getX(j)-lift,a.getY(j),a.getZ(j)+2.25*lift);}g.computeVertexNormals();}if(!g.attributes.normal)g.computeVertexNormals();let b=buckets.get(m);if(!b){b={p:[],n:[],i:[],count:0};buckets.set(m,b);}const p=g.attributes.position,n=g.attributes.normal;for(const v of p.array)b.p.push(v);for(const v of n.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let j=0;j<p.count;j++)b.i.push(j+b.count);b.count+=p.count;g.dispose();}
  function box(c,s,m=black,rot=0){const g=new T.BoxGeometry(...s);if(rot)g.rotateY(rot);g.translate(...c);add(g,m);}
  function cyl(a,b,r,m=silver,r2=r,n=16){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r2,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m);}
  function tube(ps,r,m=black,n=8){const c=new T.CatmullRomCurve3(ps.map(p=>V(...p)),false,'catmullrom',.25);add(new T.TubeGeometry(c,Math.max(16,ps.length*8),r,n,false),m);}
  function ball(c,s,m){const g=new T.SphereGeometry(1,20,12);g.scale(...s);g.translate(...c);add(g,m);}
  function panel(points,m,depth=.12){const shape=new T.Shape(points.map(p=>new T.Vector2(p[0],p[2]))),g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:4});g.rotateX(Math.PI/2);g.translate(0,points[0][1]+depth/2,0);add(g,m);}
  // Loft transverse sections to give fenders, tank and saddle true volume.
  function loft(sections,m,thickness=.22){const p=[],idx=[];for(const [x,z,w,crown=0] of sections)for(const [f,dz] of [[-1,-thickness],[-1,0],[0,crown],[1,0],[1,-thickness],[0,-thickness]])p.push(x,w*f,z+dz);for(let i=0;i<sections.length-1;i++)for(let j=0;j<6;j++){const a=i*6+j,b=i*6+(j+1)%6;idx.push(a,b,a+6,b,b+6,a+6);}idx.push(0,2,1,0,3,2,0,4,3,0,5,4);const k=(sections.length-1)*6;idx.push(k,k+1,k+2,k,k+2,k+3,k,k+3,k+4,k,k+4,k+5);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();add(g,m);}
  function ring(x,y,z,r,t,m){const g=new T.TorusGeometry(r,t,6,64);g.rotateX(Math.PI/2);g.translate(x,y,z);add(g,m);}
  const wb=BIKE_SPEC.manufacturer.wheelbase,rf=BIKE_SPEC.derived.frontTireDiameter/2,rr=BIKE_SPEC.derived.rearTireDiameter/2;
  function wheel(x,r,rim,width,front){
    const root=new T.Group();root.name=front?'Front wheel':'Rear wheel';
    // Elliptical tire section, then individual staggered shoulder/center knobs.
    const outer=r-.38,inner=rim+.05,rad=(outer-inner)/2,mid=(outer+inner)/2;
    const tire=new T.TorusGeometry(mid,rad,12,72);tire.rotateX(Math.PI/2);tire.scale(1,width/(2*rad),1);tire.translate(x,0,r);add(tire,rubber);
    for(let row=-2;row<=2;row++)for(let j=0;j<48;j++){
      const a=(j+(Math.abs(row)%2)*.5)*2*Math.PI/48-Math.PI/2;
      const side=row*width*.18,radial=outer-.22*Math.abs(row),h=.38;
      const g=new T.BoxGeometry(row===0?.78:.68,width*.2,h);g.rotateY(Math.PI/2-a);g.translate(x+(radial+h/2)*Math.cos(a),side,r+(radial+h/2)*Math.sin(a));add(g,rubber);
    }
    for(const sy of [-1,1]){ring(x,sy*width*.31,r,rim,.16,black);ring(x,sy*width*.31,r,rim-.32,.12,silver);}
    const barrel=new T.CylinderGeometry(rim-.16,rim-.16,width*.64,64,1,true);barrel.translate(x,0,r);add(barrel,black);
    cyl([x,-1.5,r],[x,1.5,r],1.23,silver,1.23,24);
    for(let j=0;j<18;j++)for(const side of [-1,1]){const a=(j+(side>0?.5:0))*2*Math.PI/18,ha=a+side*.38;cyl([x+1.15*Math.cos(ha),side*1.32,r+1.15*Math.sin(ha)],[x+(rim-.36)*Math.cos(a),side*width*.29,r+(rim-.36)*Math.sin(a)],.046,chrome,.046,5);}
    const discR=(front?BIKE_SPEC.manufacturer.frontDiscDiameter:BIKE_SPEC.manufacturer.rearDiscDiameter)/2,dy=front?-1.7:1.72;
    const s=new T.Shape();for(let j=0;j<=80;j++){const a=j*2*Math.PI/80,dr=discR+(j%4<2?.04:-.08);j?s.lineTo(dr*Math.cos(a),dr*Math.sin(a)):s.moveTo(dr,0);}const center=new T.Path();center.absarc(0,0,discR*.42,0,Math.PI*2,true);s.holes.push(center);
    for(let j=0;j<18;j++){const a=j*Math.PI/9,h=new T.Path();h.absarc(discR*.82*Math.cos(a),discR*.82*Math.sin(a),.14,0,Math.PI*2,true);s.holes.push(h);}const dg=new T.ExtrudeGeometry(s,{depth:.08,bevelEnabled:false,curveSegments:6});dg.rotateX(Math.PI/2);dg.translate(x,dy,r);add(dg,silver);
    for(let j=0;j<6;j++){const a=j*Math.PI/3;cyl([x+1.1*Math.cos(a),dy,r+1.1*Math.sin(a)],[x+discR*.57*Math.cos(a+.15),dy,r+discR*.57*Math.sin(a+.15)],.18,silver,.18,6);}
    box([x+(front?-3:3),dy,r+2.4],[1.25,.9,2.5],engine,.15);
    cyl([x,-2.5,r],[x,2.5,r],.28,chrome,.28,12);
  }
  wheel(0,rr,9.5,mm(110),false);wheel(wb,rf,10.5,mm(80),true);
  // Swingarm, linkage and the thin double-cradle chassis stay visible under plastics.
  for(const y of [-2,2]){panel([[0,y,rr-.8],[0,y,rr+1],[26,y,20],[28,y,17.3],[8,y,12.2]],silver,.75);for(const x of [1.5,24])cyl([x,y-.48,rr+.5],[x,y+.48,rr+.5],.35,engine,.35,8);}
  for(const y of [-2.15,2.15]){
    tube([[42,y,38],[36,y,31],[34,y,17],[31,y,14.7],[24,y,14.7],[23,y,19],[28,y,29],[42,y,38]],.55,black);
    tube([[27,y,19],[18,y,32],[5,y,35.7]],.4,silver);
    tube([[29,y,25],[11,y,35.5],[0,y,36.7]],.35,silver);
  }
  tube([[27,0,19],[19,0,31]],.95,engine,12);
  const coil=[];for(let k=0;k<=180;k++){const t=k/180,a=t*Math.PI*18;coil.push([27-8*t+1.25*Math.cos(a),1.25*Math.sin(a),19+12*t]);}tube(coil,.18,white,6);
  cyl([24,-2.5,17],[24,2.5,17],.7,silver);
  // Four-stroke motor: cast cases, clutch cover, tilted cylinder/head and visible bolts.
  ball([29,0,20.2],[6,3.8,5.8],engine);ball([25.8,0,19.2],[4.3,3.6,3.6],engine);
  cyl([30,3.1,20],[30,4.1,20],4.45,silver,4.25,40);ring(30,4.14,20,3.9,.11,engine);
  cyl([28,-3.1,20],[28,-4,20],3.2,engine,3,28);
  for(let j=0;j<9;j++){const a=j*Math.PI*2/9;cyl([30+4.1*Math.cos(a),4.1,20+4.1*Math.sin(a)],[30+4.1*Math.cos(a),4.35,20+4.1*Math.sin(a)],.18,chrome,.18,6);}
  box([32,0,26.3],[5.5,5.8,7],engine,-.16);box([32.5,0,30],[6.8,6.4,2.5],silver,-.12);box([32.5,0,31.5],[6.8,6.4,.65],black,-.12);
  for(const z of [24,26,28])box([32,3.05,z],[5.8,.16,.22],silver,-.16);
  tube([[29,-3.8,28],[33,-4.1,25],[35,-3.8,20]],.27,black);tube([[34,3.4,28],[37,3.8,26]],.28,black);
  for(const y of [-4.5,4.5]){box([24,y,16.4],[2,2.1,.4],engine);for(let n=0;n<5;n++)box([23.2+n*.36,y,16.7],[.11,2.1,.25],silver);}
  // Chain and sprockets are on the inboard/left side; exhaust is outward/right.
  for(const [x,z,r] of [[0,rr,4.25],[25,19,1.6]]){ring(x,-2.65,z,r,.22,silver);for(let j=0;j<32;j++){const a=j*Math.PI*2/32;box([x+r*Math.cos(a),-2.65,z+r*Math.sin(a)],[.34,.22,.45],silver,-a);}cyl([x,-2.7,z],[x,-2.3,z],r*.55,engine,r*.55,24);}
  tube([[0,-2.7,rr+4.3],[25,-2.7,20.7]],.14,black,6);tube([[0,-2.7,rr-4.3],[25,-2.7,17.4]],.14,black,6);
  for(let k=0;k<40;k++){const t=k/39;box([25*t,-2.87,rr+4.3+(20.7-rr-4.3)*t],[.26,.12,.3],silver);box([25*t,-2.87,rr-4.3+(17.4-rr+4.3)*t],[.26,.12,.3],silver);}
  tube([[35,2.8,29],[39,4.2,27],[38,5.4,24.5],[34,5.5,25],[29,4.9,28],[21,4.6,29.5],[15,4.4,29.2]],.72,silver,12);
  cyl([4,4.2,33.5],[17,4.5,28.4],1.75,silver,1.45,12);cyl([3.4,4.2,33.8],[4.5,4.2,33.5],1.47,black,1.65,12);cyl([3.1,4.2,33.9],[3.7,4.2,33.7],.65,engine,.8,12);
  for(const t of [.2,.8]){const a=V(4,4.2,33.5).lerp(V(17,4.5,28.4),t);cyl(a.clone().add(V(-.22,0,.09)).toArray(),a.clone().add(V(.22,0,-.09)).toArray(),1.78,engine,1.78,12);}
  // Tank, shrouds and the owner's angular white/orange side treatment.
  loft([[25,32.5,3],[30,35,3.4,1],[36,37,2.9,1.3],[40,36,2.5]],black,5);
  for(const s of [-1,1]){
    const y=s*4.4;
    box([38,s*3.3,29.5],[4.4,1.6,8],engine,-.12);for(let j=0;j<12;j++)box([38,s*4.14,26+j*.6],[4.2,.08,.12],silver,-.12);
    panel([[18,y,34.1],[26,y,35.6],[35,y,37.8],[43,y,36.1],[38,y,24.2],[35,y,24.8],[36,y,31.7],[26,y,32.5]],orange,.22);
    panel([[21,y+s*.16,34.5],[28,y+s*.16,35.5],[35,y+s*.16,37.2],[40,y+s*.16,35.9],[35,y+s*.16,33.2],[29,y+s*.16,33.6]],white,.1);
    panel([[25,y+s*.24,34.7],[29,y+s*.24,35],[36,y+s*.24,36.7],[38,y+s*.24,36],[34,y+s*.24,34.2]],black,.08);
    panel([[20,y,32.7],[21,y,24],[16,y,24.5],[8,y,29],[1,y,35.7],[6,y,36.1]],white,.24);
    panel([[1,y+s*.19,35.9],[9,y+s*.19,34.6],[20,y+s*.19,32.9],[15,y+s*.19,34.9],[6,y+s*.19,36.3]],black,.08);
    panel([[15,y+s*.2,24.5],[21,y+s*.2,24],[24,y+s*.2,18],[21,y+s*.2,17.7],[18,y+s*.2,21]],orange,.18);
    panel([[3,y+s*.24,35.8],[10,y+s*.24,35.2],[17,y+s*.24,33.3],[14,y+s*.24,33.8]],orange,.08);
    panel([[30,y+s*.28,35.7],[33,y+s*.28,36.7],[34,y+s*.28,36.4],[31,y+s*.28,35.3]],blue,.06);
    cyl([19,y,25.2],[19,y+s*.3,25.2],.24,engine,.24,10);
  }
  loft([[-11,38.5,1.6],[-6,38,2.4],[0,37,3.5],[3,36.7,3.1]],orange,.32);
  loft([[-5,38.08,1.8],[0,37.1,2.5],[2.5,36.85,2.9]],white,.06);
  loft([[3,36.7,3.1,.5],[10,35.7,3.6,.55],[18,35.5,3.6,.65],[26,36.2,3.1,.6],[34,37.1,2.4,.3],[37,37.4,1.8]],black,.7);
  for(let k=0;k<11;k++)tube([[5+k*2.5,-2.6,36.9-Math.sin(k/10*Math.PI)*.9],[5+k*2.5,0,37.2-Math.sin(k/10*Math.PI)*.9],[5+k*2.5,2.6,36.9-Math.sin(k/10*Math.PI)*.9]],.055,rubber,5);
  cyl([38,0,37.2],[38,0,38],.85,black,.85,16);
  // Inverted 48 mm fork, polished lower stanchions, orange guards and triple clamps.
  frontCalibration=true;
  const lowX=wb,lowZ=rf,topX=44.1,topZ=42.4;
  for(const y of [-2.65,2.65]){
    cyl([lowX,y,lowZ],[49.2,y,32.2],.66,chrome,.66,18);
    cyl([49.2,y,32.2],[topX,y,topZ],mm(48)/2,silver,mm(48)/2,20);
    cyl([topX+.25,y,topZ-.6],[topX-.25,y,topZ+.6],1.08,gold,1.08,18);
    cyl([48.8,y,33],[49.5,y,31.5],1.05,gold,1.05,18);
    cyl([46,y,38.6],[46.7,y,37],.99,blue,.99,18);
    panel([[wb-1,y+Math.sign(y)*.8,rf-.2],[wb+1,y+Math.sign(y)*.8,rf+.3],[51,y+Math.sign(y)*.8,30.1],[49.5,y+Math.sign(y)*.8,29.6]],orange,.35);
    cyl([wb-.5,y,rf],[wb+1,y,rf],.9,silver,.9,16);
  }
  for(const [x,z] of [[44.3,41.9],[47,36.3]])cyl([x,-3.5,z],[x,3.5,z],.72,black,.72,14);
  tube([[42,0,38],[44.3,0,42.3]],1,black,12);
  // Distinct long front fender, narrow number board and wide swept handlebar.
  frontCalibration=false;
  loft([[44,34.8,2.4],[48,35.3,2.6],[54,36.6,3],[62,36.5,3.1],[68,35.4,2.5],[72,33.8,1.5]],orange,.25);
  loft([[50,36.1,1.6],[55,36.9,1.7],[62,36.8,1.6],[68,35.7,1.15],[71,34.2,.5]],white,.05);
  loft([[52,36.45,.55],[58,37.0,.6],[65,36.4,.5],[70,34.9,.25]],blue,.045);
  frontCalibration=true;
  const board=new T.Shape();board.moveTo(-3.8,0);board.lineTo(-3.6,8.2);board.quadraticCurveTo(0,8.8,3.6,8.2);board.lineTo(3.8,0);board.lineTo(2.1,-1);board.lineTo(-2.1,-1);board.closePath();
  const bg=new T.ExtrudeGeometry(board,{depth:.2,bevelEnabled:false,curveSegments:6});const bp=bg.attributes.position;for(let j=0;j<bp.count;j++){const u=bp.getX(j),v=bp.getY(j),d=bp.getZ(j);bp.setXYZ(j,48.5-v*.38+d,u,35.3+v);}bg.computeVertexNormals();add(bg,white);
  // Original seven-segment numerals reproduce the visible race number without a texture.
  const digits={6:[0,2,3,4,5,6],9:[0,1,2,3,5,6]},segs=[[-.6,2.2,.6,2.2],[.7,2.1,.7,1.2],[.7,1,.7,.1],[-.6,0,.6,0],[-.7,1,-.7,.1],[-.7,2.1,-.7,1.2],[-.6,1.1,.6,1.1]];
  for(const [digit,offset] of [[6,-1.55],[9,1.55]])for(const seg of digits[digit]){const [a,b,c,d]=segs[seg],scale=1.65;const p1=[48.8-(b*scale+1.8)*.38,-offset-a*scale,35.3+b*scale+1.8],p2=[48.8-(d*scale+1.8)*.38,-offset-c*scale,35.3+d*scale+1.8];cyl(p1,p2,.22,black,.22,5);}
  tube([[43.7,-15.7,46],[43.2,-10,45.9],[44,-5,44.7],[44.5,0,44.5],[44,5,44.7],[43.2,10,45.9],[43.7,15.7,46]],.44,silver,10);
  for(const s of [-1,1]){cyl([43.45,s*11.4,46],[43.7,s*15.7,46],.65,black,.65,14);tube([[43.6,s*10.2,46.1],[45.2,s*11.8,45.8],[45.4,s*15,45.6]],.14,silver,7);box([44.2,s*8.9,46.1],[1.3,1.6,1.2],black);}
  box([44.5,0,45.3],[2.6,5,1.6],black);tube([[44.2,8,46],[47,7,43],[45,5,36],[50,3.7,29],[wb,-3,rf+3]],.09,black,6);tube([[43,-8,46],[40,-5,43],[42,0,36],[35,0,32]],.1,black,6);
  // Estimated webbing routes anchored to the modeled carrier eyes; no restraint claim.
  frontCalibration=false;
  function web(a,b,w=.65){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.BoxGeometry(w,.07,d.length());g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,0,1),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,strap);}
  const rearX=BIKE_SPEC.installation.rearAxleX;
  for(const s of [-1,1]){web([44.55,s*3.6,39.51],[56-rearX,s*11.8,.55],.72);web([10,s*4,34],[4-rearX,s*11.8,.55],.6);box([54-rearX,s*11.3,3],[1.1,.4,2],silver);}
  for(const [m,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,m);mesh.name=m.name;mesh.castShadow=true;mesh.receiveShadow=false;group.add(mesh);}
  group.position.set(rearX,BIKE_SPEC.installation.wheelCenterY,BIKE_SPEC.installation.contactZ);
  group.userData={spec:BIKE_SPEC,axles:{rear:[rearX,BIKE_SPEC.installation.wheelCenterY,BIKE_SPEC.installation.contactZ+rr],front:[BIKE_SPEC.installation.frontAxleX,BIKE_SPEC.installation.wheelCenterY,BIKE_SPEC.installation.contactZ+rf]},nominalContactZ:BIKE_SPEC.installation.contactZ};
  group.updateMatrixWorld(true);group.userData.bounds=new T.Box3().setFromObject(group);
  return {group,materials};
}
