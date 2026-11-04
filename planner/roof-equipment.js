import * as T from './vendor/three.module.js';
import {RACK_SPEC} from './roof-rack.js?v=rack2';

// Installed reference only. All positions are inches from the track rectangle's
// front driver-side corner. Display registration remains a photo estimate.
export const INSTALLED_ROOF_SPEC={
 revision:'installed-roof-1',status:'photo-estimated',configuration:'Existing equipment reference, not proposed upgrades',
 planningOrigin:RACK_SPEC.installation.planningOrigin,
 solar:{count:4,model:null,powerWatts:null,panelSize:[23,23,1.4],panelCorners:[[4.5,3.5,5.65],[30,3,5.65],[4.5,53.5,5.65],[31,53.5,5.65]],cellPattern:'Illustrative six-column blue cell grid; electrical construction unverified',supports:'Estimated edge brackets and four lower transverse supports in the rack model; partly exposed hardware guides stations, concealed construction is inferred'},
 starlink:{model:null,corner:[.5,29.5,7.2],faceSize:[22.5,22.5,.7],rearwardTiltDegrees:8,mount:'Estimated low cradle; cable routing illustrative'},
 airConditioner:{model:null,corner:[18,84,1],size:[27,37,11.5],appearance:'Dark low-profile shroud, sloping front nose, transverse upper vent and rear ribs'},
 antennas:{count:2,model:null,mountPlate:{center:[30,0,6.72],size:[8,5,.25]},long:{base:[28.2,-.1,6.85],height:20.5,lowerSectionHeight:8,style:'Dark lower section and thin upper whip'},short:{base:[30.2,1.5,6.85],height:6.8,style:'Short straight black antenna'}},
 ownerObservations:{starlink:'Driver side; front offset 29, rear gap 69 and right-side gap 34 inches, endpoints unresolved',airConditioner:'Top reported 6 inches above top crossbar; crossbar datum unresolved',antennaMount:'Two antennas on front crossbar, owner identified'},
 unresolved:['Exact equipment model numbers and mounted envelopes','Panel dimensions, frame elevations and support brackets','Starlink tilt, face size, mount and endpoint definitions','A/C footprint and shared height datum','Both antenna heights, center offsets, diameters and mount plates'],
 excluded:'Fan, roof bag, awning and unidentified loose rooftop objects are deferred in this installed reference. They may exist in an independently saved planning layout.',
 limits:'Original visual reconstruction from owner photos, not a survey. A/C shroud top at model Z12.5 follows an illustrative 6.5-inch crossbar-top datum plus the reported 6 inches; this is not a resolved physical height. Installed reference meshes are hidden while editing a saved roof layout and are excluded from equipment box checks. No fit, shading, movement, airflow, RF or mounting validation.'
};

export function buildInstalledRoof(){
 const group=new T.Group();group.name='Installed roof equipment · photo estimates';group.position.set(...INSTALLED_ROOF_SPEC.planningOrigin);
 const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p);
 function material(name,color,metalness=0,roughness=.5){return materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});}
 const black=material('Roof equipment dark plastic','#24282b',.12,.6),seal=material('Roof equipment seals','#11191c',.04,.8),silver=material('Solar aluminum frames','#aeb9bb',.78,.32),blue=material('Blue solar cells','#173652',.42,.29),grid=material('Solar cell grid','#7795a8',.45,.4),white=material('Starlink white face','#e6e9e5',.1,.54),dishEdge=material('Starlink pale edge','#b8c0bf',.18,.57);
 let feature='';const featureBounds={};
 function add(g,m){if(!g.attributes.normal)g.computeVertexNormals();g.computeBoundingBox();(featureBounds[feature]??=new T.Box3()).union(g.boundingBox);const key=m.name;let b=buckets.get(key);if(!b){b={p:[],n:[],i:[],count:0,m,feature};buckets.set(key,b);}const p=g.attributes.position,n=g.attributes.normal;for(const v of p.array)b.p.push(v);for(const v of n.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let j=0;j<p.count;j++)b.i.push(j+b.count);b.count+=p.count;g.dispose();}
 function box(c,s,m=black){const g=new T.BoxGeometry(...s);g.translate(...c);add(g,m);}
 function cyl(a,b,r,m=black,n=12,r2=r){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r2,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m);}
 function tube(points,r,m=black){const g=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p))),Math.max(12,points.length*6),r,8,false);add(g,m);}
 function outline(w,l,r){const s=new T.Shape();s.moveTo(r,0);s.lineTo(w-r,0);s.quadraticCurveTo(w,0,w,r);s.lineTo(w,l-r);s.quadraticCurveTo(w,l,w-r,l);s.lineTo(r,l);s.quadraticCurveTo(0,l,0,l-r);s.lineTo(0,r);s.quadraticCurveTo(0,0,r,0);return s;}
 function roundedSolid(x,y,z,w,l,h,r,m,transform){const g=new T.ExtrudeGeometry(outline(w,l,r),{depth:h,bevelEnabled:false,curveSegments:8});g.translate(x,y,z);if(transform)g.applyMatrix4(transform);add(g,m);}
 function roundedSurface(cx,cy,w,l,r,rings,m){const pts=outline(w,l,r).getPoints(8),N=pts.length,p=[],idx=[];for(const [z,sx,sy] of rings)for(const q of pts)p.push(cx+(q.x-w/2)*sx,cy+(q.y-l/2)*sy,z);for(let k=0;k<rings.length-1;k++)for(let j=0;j<N;j++){const a=k*N+j,b=k*N+(j+1)%N,c=(k+1)*N+(j+1)%N,d=(k+1)*N+j;idx.push(a,b,c,a,c,d);}const center=p.length/3;p.push(cx,cy,rings.at(-1)[0]);for(let j=0;j<N;j++)idx.push(center,(rings.length-1)*N+j,(rings.length-1)*N+(j+1)%N);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();add(g,m);}
 // Four modules in two transverse pairs. Hidden support structure is not inferred.
 for(const [k,p] of INSTALLED_ROOF_SPEC.solar.panelCorners.entries()){
  feature='Solar panel '+(k+1);const [x,y,z]=p,[w,l,h]=INSTALLED_ROOF_SPEC.solar.panelSize;
  box([x+w/2,y+l/2,z+h/2],[w,l,h],silver);
  box([x+w/2,y+l/2,z+h+.012],[w-.65,l-.65,.025],seal);
  const rows=9,cols=6,iw=w-1.1,il=l-1.1,cw=iw/cols,ch=il/rows;
  for(let a=0;a<cols;a++)for(let b=0;b<rows;b++)box([x+.55+(a+.5)*cw,y+.55+(b+.5)*ch,z+h+.035],[cw-.09,ch-.09,.025],blue);
  for(let b=1;b<rows;b++)box([x+w/2,y+.55+b*ch,z+h+.055],[iw,.045,.012],grid);
  for(let a=1;a<cols;a++)box([x+.55+a*cw,y+l/2,z+h+.055],[.045,il,.012],grid);
  for(let a=0;a<cols;a++)for(let j=1;j<4;j++)box([x+.55+(a+j/4)*cw,y+l/2,z+h+.052],[.024,il,.012],grid);
  for(const xx of [x+.65,x+w-.65])for(const yy of [y+1.2,y+l-1.2]){box([xx,yy,5.5],[1.6,2.4,.3],silver);cyl([xx,yy,z+h+.06],[xx,yy,z+h+.13],.11,black,8);}
 }
 feature='Starlink';const st=INSTALLED_ROOF_SPEC.starlink,[sx,sy,sz]=st.corner,[sw,sl,sh]=st.faceSize,angle=st.rearwardTiltDegrees*Math.PI/180;
 const transform=new T.Matrix4().makeTranslation(sx,sy,sz).multiply(new T.Matrix4().makeRotationX(angle));
 roundedSolid(0,0,0,sw,sl,sh,1.1,dishEdge,transform);roundedSolid(.15,.15,sh,sw-.3,sl-.3,.035,.95,white,transform);
 // Shallow cradle follows the tilted face and seats over the estimated mounting strip.
 for(const x of [sx+4,sx+sw-4]){cyl([x,sy+4,6.85],[x,sy+4,sz+4*Math.sin(angle)-.05],.45,black);cyl([x,sy+sl-4,6.85],[x,sy+sl-4,sz+(sl-4)*Math.sin(angle)-.05],.45,black);box([x,sy+sl/2,6.65],[1.2,sl-2,.3],black);}
 tube([[sx+sw-2,sy+sl-3,8],[sx+sw+1,sy+sl-1,6.2],[sx+sw+2,sy+sl+3,1]],.11,seal);
 feature='Air conditioner';const ac=INSTALLED_ROOF_SPEC.airConditioner,[ax,ay,az]=ac.corner,[aw,al,ah]=ac.size,cx=ax+aw/2,cy=ay+al/2;
 roundedSolid(ax+1.4,ay+1.4,.12,aw-2.8,al-2.8,.9,3,seal);
 roundedSurface(cx,cy,aw,al,3.6,[[az,.98,.99],[az+1.2,1,1],[az+ah-3,.985,.97],[az+ah-1,.96,.94],[az+ah,.87,.86],[az+ah,.82,.81]],black);
 // Front shroud slopes toward the raised top; transverse grille and rear fine ribs.
 for(let j=0;j<25;j++){const xx=ax+2.8+j*(aw-5.6)/24;box([xx,ay+al*.5,az+ah+.025],[.32,4.5,.07],silver);}
 box([cx,ay+al*.5,az+ah+.08],[aw-5.1,.24,.06],black);
 for(let j=0;j<31;j++){const xx=ax+2.3+j*(aw-4.6)/30;box([xx,ay+al*.76,az+ah-.13],[.14,al*.27,.38],seal);}
 for(const xx of [ax+4,ax+aw-4])cyl([xx,ay+al*.34,az+ah-.01],[xx,ay+al*.34,az+ah+.08],.39,silver,16);
 for(const xx of [ax+.2,ax+aw-.2])for(let j=0;j<12;j++)box([xx,ay+6+j*1.5,az+3.2],[.13,.65,2.3],seal);
 feature='Front-crossbar antennas';const ant=INSTALLED_ROOF_SPEC.antennas;
 box(ant.mountPlate.center,ant.mountPlate.size,black);
 for(const x of [27,33])for(const y of [-1.5,1.5])cyl([x,y,6.82],[x,y,6.98],.15,silver,6);
 const lb=ant.long.base,sb=ant.short.base;
 cyl(lb,[lb[0],lb[1],lb[2]+.7],.52,seal,16);cyl([lb[0],lb[1],lb[2]+.5],[lb[0],lb[1],lb[2]+ant.long.lowerSectionHeight],.19,black,16,.13);
 cyl([lb[0],lb[1],lb[2]+ant.long.lowerSectionHeight],[lb[0]-.13,lb[1],lb[2]+ant.long.height],.065,silver,10,.035);
 cyl(sb,[sb[0],sb[1],sb[2]+.55],.32,seal,14);cyl([sb[0],sb[1],sb[2]+.4],[sb[0],sb[1],sb[2]+ant.short.height],.14,black,12,.10);
 for(const p of [lb,sb])tube([[p[0],p[1],6.7],[p[0]+1,p[1]+1,6.3],[p[0]+2,p[1]+3,5.3]],.08,seal);
 for(const b of buckets.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,b.m);mesh.name='Installed roof · '+b.m.name;mesh.userData.installedRoof=true;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}
 group.userData={spec:INSTALLED_ROOF_SPEC,featureBounds,modelBounds:new T.Box3().setFromObject(group)};
 return {group,materials};
}
