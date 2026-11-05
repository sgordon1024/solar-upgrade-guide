import './snowboard-data.js?v=layout1';
import * as T from './vendor/three.module.js';
import {RACK_SPEC} from './roof-rack.js?v=rack2';

// Installed reference only. All positions are inches from the track rectangle's
// front driver-side corner. Display registration remains a photo estimate.
export const INSTALLED_ROOF_SPEC={
 revision:'installed-roof-2-fan-snowboard',status:'photo-estimated',configuration:'Existing equipment reference, not proposed upgrades',
 planningOrigin:RACK_SPEC.installation.planningOrigin,
 solar:{count:4,model:null,powerWatts:null,panelSize:[23,23,1.4],panelCorners:[[4.5,3.5,5.65],[30,3,5.65],[4.5,53.5,5.65],[31,53.5,5.65]],cellPattern:'Illustrative six-column blue cell grid; electrical construction unverified',supports:'Estimated edge brackets and four lower transverse supports in the rack model; partly exposed hardware guides stations, concealed construction is inferred'},
 starlink:{model:null,corner:[.5,29.5,7.2],faceSize:[22.5,22.5,.7],rearwardTiltDegrees:8,mount:'Estimated low cradle; cable routing illustrative'},
 airConditioner:{model:null,corner:[18,84,1],size:[27,37,11.5],appearance:'Dark low-profile shroud, sloping front nose, transverse upper vent and rear ribs'},
 fan:{brand:'Maxxair',brandStatus:'owner-identified',model:null,referenceFamily:'MAXXFAN Deluxe smoke lid',source:'https://www.maxxair.com/products/fans/maxxfan-deluxe/',sourceScope:'Family reference confirms an integrated rain shield and 14 × 14-inch opening; installed model and external dimensions are unverified.',corner:[21.8,21.5,.12],size:[16.4,23,5],displayPose:'Closed/low lid assumed for reference display; photo does not establish lid position.',openHeightObservation:'Owner reports fully open fan 5 inches above side-rail center, with 6 inches as planning allowance. Rail center and lid envelope remain unresolved.',appearance:'Smoke-colored cowl, front top-panel relief, rounded rear rain hood and rear-facing louver detail'},
 snowboard:{contents:'Snowboard and clothes in a canvas-style case',identificationStatus:'owner-identified',caseBrand:null,boardModel:null,dimensionStatus:'photo-estimated',centerX:8.5,frontY:78,rearY:142,maximumWidth:17.4,maximumTopZ:19,appearance:'Light gray soft case with dark lower gusset, irregular packed bulges, tapered ends, zipper seam and black carrying webbing',rack:{type:'Two closed clamp-style carriers',brand:null,crossbarIndices:[2,3],stationYs:[2,3].map(k=>RACK_SPEC.installation.crossbarStations[k]*122),jawSpan:19.5,jawCenterX:8.5,baseBottomZ:6.5,padTopZ:7.8,upperPadBottomZ:9.7},limits:'Packed shape and overhang change with contents. Clamp geometry, connections and compression are illustrative; no transport-load or secure-restraint validation.'},
 antennas:{count:2,model:null,mountPlate:{center:[30,0,6.72],size:[8,5,.25]},long:{base:[28.2,-.1,6.85],height:20.5,lowerSectionHeight:8,style:'Dark lower section and thin upper whip'},short:{base:[30.2,1.5,6.85],height:6.8,style:'Short straight black antenna'}},
 ownerObservations:{starlink:'Driver side; front offset 29, rear gap 69 and right-side gap 34 inches, endpoints unresolved',airConditioner:'Top reported 6 inches above top crossbar; crossbar datum unresolved',antennaMount:'Two antennas on front crossbar, owner identified',fan:'Maxxair exhaust fan on centerline; open-height observation kept separate from closed display.',snowboard:'Rear driver-side snowboard in a canvas-style case with clothes, held by a clamp-style rack on two rear crossbars.'},
 unresolved:['Exact equipment model numbers and mounted envelopes','Panel dimensions, frame elevations and support brackets','Starlink tilt, face size, mount and endpoint definitions','A/C footprint and shared height datum','Both antenna heights, center offsets, diameters and mount plates','Fan closed and open envelopes, hinge motion and crossbar clearance','Packed snowboard case envelope, overhang, clamp positions and attachment hardware'],
 excluded:'Awning and unidentified loose rooftop objects are deferred in this installed reference. Independently saved roof layouts may retain earlier generic fan and roof-bag estimates.',
 limits:'Original visual reconstruction from owner photos, not a survey. A/C shroud top at model Z12.5 follows an illustrative 6.5-inch crossbar-top datum plus the reported 6 inches; this is not a resolved physical height. Installed reference meshes are hidden while editing a saved roof layout and are excluded from equipment box checks. No fit, shading, movement, airflow, RF or mounting validation.'
};

export function buildInstalledRoof(){
 const group=new T.Group();group.name='Installed roof equipment · photo estimates';group.position.set(...INSTALLED_ROOF_SPEC.planningOrigin);
 const snowboard=new T.Group();snowboard.name='Detailed snowboard bag and both clamps';snowboard.userData.selectable='snowboard';group.add(snowboard);
 const parts={snowboard};const featureIds={'Starlink':'starlink','Air conditioner':'ac','Maxxair exhaust fan':'fan','Front-crossbar antennas':'antennas',...Object.fromEntries([0,1,2,3].map(i=>['Solar panel '+(i+1),'existing-'+i]))};for(const id of Object.values(featureIds)){const part=new T.Group();part.userData.roofId=id;part.userData.installedSolar=id.startsWith('existing-');parts[id]=part;group.add(part);}
 const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p);
 function material(name,color,metalness=0,roughness=.5){return materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});}
 const black=material('Roof equipment dark plastic','#24282b',.12,.6),seal=material('Roof equipment seals','#11191c',.04,.8),silver=material('Solar aluminum frames','#aeb9bb',.78,.32),blue=material('Blue solar cells','#173652',.42,.29),grid=material('Solar cell grid','#7795a8',.45,.4),white=material('Starlink white face','#e6e9e5',.1,.54),dishEdge=material('Starlink pale edge','#b8c0bf',.18,.57),canvas=material('Snowboard case woven canvas','#9ca7ae',0,.98),gusset=material('Snowboard case lower gusset','#4b565f',0,.98);
 let feature='';const featureBounds={};
 function add(g,m){if(!g.attributes.normal)g.computeVertexNormals();g.computeBoundingBox();(featureBounds[feature]??=new T.Box3()).union(g.boundingBox);const isSolar=feature.startsWith('Solar panel');const isSnowboard=feature==='Bagged snowboard'||feature==='Snowboard clamp rack';const key=(isSnowboard?'snowboard':feature)+':'+m.name;let b=buckets.get(key);if(!b){b={p:[],n:[],i:[],count:0,m,feature,isSolar,isSnowboard};buckets.set(key,b);}const p=g.attributes.position,n=g.attributes.normal;for(const v of p.array)b.p.push(v);for(const v of n.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let j=0;j<p.count;j++)b.i.push(j+b.count);b.count+=p.count;g.dispose();}
 function box(c,s,m=black){const g=new T.BoxGeometry(...s);g.translate(...c);add(g,m);}
 function cyl(a,b,r,m=black,n=12,r2=r){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r2,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m);}
 function tube(points,r,m=black,segments){const g=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p))),segments??Math.max(12,points.length*6),r,8,false);add(g,m);}
 function outline(w,l,r){const s=new T.Shape();s.moveTo(r,0);s.lineTo(w-r,0);s.quadraticCurveTo(w,0,w,r);s.lineTo(w,l-r);s.quadraticCurveTo(w,l,w-r,l);s.lineTo(r,l);s.quadraticCurveTo(0,l,0,l-r);s.lineTo(0,r);s.quadraticCurveTo(0,0,r,0);return s;}
 function roundedSolid(x,y,z,w,l,h,r,m,transform){const g=new T.ExtrudeGeometry(outline(w,l,r),{depth:h,bevelEnabled:false,curveSegments:8});g.translate(x,y,z);if(transform)g.applyMatrix4(transform);add(g,m);}
 function roundedSurface(cx,cy,w,l,r,rings,m){const pts=outline(w,l,r).getPoints(8),N=pts.length,p=[],idx=[];for(const [z,sx,sy] of rings)for(const q of pts)p.push(cx+(q.x-w/2)*sx,cy+(q.y-l/2)*sy,z);for(let k=0;k<rings.length-1;k++)for(let j=0;j<N;j++){const a=k*N+j,b=k*N+(j+1)%N,c=(k+1)*N+(j+1)%N,d=(k+1)*N+j;idx.push(a,b,c,a,c,d);}const center=p.length/3;p.push(cx,cy,rings.at(-1)[0]);for(let j=0;j<N;j++)idx.push(center,(rings.length-1)*N+j,(rings.length-1)*N+(j+1)%N);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();add(g,m);}
 // Four modules in two transverse pairs; estimated lower supports live in the rack module.
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
 feature='Maxxair exhaust fan';const fan=INSTALLED_ROOF_SPEC.fan,[fx,fy,fz]=fan.corner,[fw,fl]=fan.size;
 // Closed display pose only. No hole is cut in the body; roof thickness is unknown.
 roundedSolid(fx-.2,fy+.3,fz,fw+.4,16.3,.35,1,dishEdge);
 roundedSolid(fx+.2,fy+.65,fz+.35,fw-.4,15.6,.75,.9,seal);
 for(const x of [fx+.35,fx+fw-.35])for(const y of [fy+1.1,fy+7.8,fy+15.6])cyl([x,y,.51],[x,y,.62],.10,silver,8);
 const fanTop=y=>3.05+1.65*Math.sin(Math.PI*(.12+.82*T.MathUtils.clamp((y-fy)/fl,0,1)));
 const halfAt=(y,w,l,r,cy)=>w/2-r+Math.sqrt(Math.max(0,r*r-Math.max(0,Math.abs(y-cy)-(l/2-r))**2));
 const hoodZ=(x,y)=>fanTop(y)-.48*Math.pow(Math.abs((x-fx-fw/2)/halfAt(y,fw,fl,1.7,fy+fl/2)),10);
 function topPatch(x,y,w,l,r,rows,cols,zAt){const p=[],idx=[];for(let j=0;j<=rows;j++){const yy=y+l*j/rows,h=halfAt(yy,w,l,r,y+l/2);for(let k=0;k<=cols;k++){const xx=x+w/2+(2*k/cols-1)*h;p.push(xx,yy,zAt(xx,yy));}}for(let j=0;j<rows;j++)for(let k=0;k<cols;k++){const a=j*(cols+1)+k,b=a+cols+1;idx.push(a,b,a+1,a+1,b,b+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();add(g,black);}
 topPatch(fx,fy,fw,fl,1.7,40,24,hoodZ);
 const fp=outline(fw,fl,1.7).getPoints(10),fn=fp.length,pos=[],indices=[];
 for(const t of [0,.35,.75,1])for(const p of fp){const x=fx+p.x,y=fy+p.y;pos.push(x,y,1.12+t*(hoodZ(x,y)-1.12));}
 for(let row=0;row<3;row++)for(let j=0;j<fn;j++){const a=row*fn+j,b=row*fn+(j+1)%fn,c=(row+1)*fn+(j+1)%fn,d=(row+1)*fn+j;indices.push(a,b,c,a,c,d);}
 const fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(pos,3));fg.setIndex(indices);fg.computeVertexNormals();add(fg,black);
 // Fine grid follows the curved top without long triangulated shading artifacts.
 topPatch(fx+1.8,fy+1.9,12.8,11.6,.7,20,14,(x,y)=>hoodZ(x,y)+.07);
 const cap=outline(12.8,11.6,.7).getPoints(8);
 tube(cap.map(p=>[fx+1.8+p.x,fy+1.9+p.y,hoodZ(fx+1.8+p.x,fy+1.9+p.y)+.08]),.03,seal);
 box([fx+fw/2,fy+fl-.12,1.72],[fw-2,.15,.75],seal);
 for(let j=0;j<18;j++)box([fx+1.2+j*(fw-2.4)/17,fy+fl-.21,1.73],[.13,.18,.62],black);
 for(const x of [fx+.25,fx+fw-.25])cyl([x,fy+5.8,1.5],[x,fy+11.5,2.1],.12,black,10);

 const snow=INSTALLED_ROOF_SPEC.snowboard,clamps=snow.rack;
 feature='Snowboard clamp rack';
 for(const y of clamps.stationYs){
   // Short feet seat directly on the two existing main crossbar crowns.
   for(const x of [2,15]){box([x,y,6.78],[2.1,1.85,.56],black);box([x,y,6.4],[2.3,2.45,.18],silver);cyl([x,y,7.05],[x,y,7.25],.17,silver,6);}
   roundedSolid(-1.25,y-.75,7.08,19.5,1.5,.5,.5,black);
   box([8.5,y,7.65],[18.4,1.32,.3],seal);
   roundedSolid(-1.25,y-.75,10,19.5,1.5,.7,.45,black);
   box([8.5,y,9.85],[18.2,1.25,.3],seal);
   // Driver-side pivot and inboard clasp; manufacturer and clamp span unknown.
   cyl([-.55,y-.95,8.9],[-.55,y+.95,8.9],1.05,black,16);
   cyl([-.55,y-1.02,8.9],[-.55,y-.96,8.9],.27,silver,12);
   box([17.7,y,9.12],[1.5,2.05,3.25],black);
   box([18.48,y,9.25],[.14,1.35,1.45],seal);
   cyl([18.5,y,9.65],[18.61,y,9.65],.23,silver,12);
 }
 feature='Bagged snowboard';
 // An original soft loft: packing bulges between clamped, compressed necks.
 // Each section is [Y, half-width, bottom Z, top Z, lateral center offset].
 const sections=[[78,.2,8.2,8.6,0],[79,5.2,7.9,12.2,.1],[80,7.4,7.8,12.4,.2],[81.0,8.2,7.8,9.7,0],[82.5,8.2,7.8,9.7,0],[84,8.5,7.85,14.2,-.15],[88,8.7,7.9,18.1,-.2],[94,8.4,7.9,19,-.2],[101,8.1,7.85,16.6,-.1],[108,8.35,7.85,17.7,.15],[115,8.25,7.8,16.1,.1],[119.5,8.1,7.8,13.1,0],[121.2,8.0,7.8,9.7,0],[122.8,8.0,7.8,9.7,0],[125,7.7,7.35,11.2,.15],[130,7.3,6.7,10.8,.25],[136,7.25,6.3,10.1,.25],[139.5,6.4,6.5,9.7,.1],[141.5,3.1,7.25,9,0],[142,.2,7.9,8.2,0]];
 function section(y){for(let k=0;k<sections.length-1;k++){const a=sections[k],b=sections[k+1];if(y<=b[0]){const t=T.MathUtils.clamp((y-a[0])/(b[0]-a[0]),0,1),e=t*t*(3-2*t);return a.map((v,j)=>j===0?y:T.MathUtils.lerp(v,b[j],e));}}return sections.at(-1);}
 function bagPoint(y,a,offset=0){const [yy,w,b,t,dx]=section(y),c=Math.cos(a),s=Math.sin(a),power=v=>Math.sign(v)*Math.pow(Math.abs(v),.72),compressed=Math.min(...clamps.stationYs.map(v=>Math.abs(y-v)))<1.2,wrinkle=compressed?0:.10*Math.sin(y*1.8+a*6)+.055*Math.sin(y*3.2-a*5);return [snow.centerX+dx+(w+wrinkle+offset)*power(c),yy,(b+t)/2+((t-b)/2+wrinkle+offset)*power(s)];}
 const nY=96,nA=32,bp=[],biTop=[],biBottom=[];
 for(let j=0;j<=nY;j++)for(let k=0;k<nA;k++)bp.push(...bagPoint(T.MathUtils.lerp(78,142,j/nY),k/nA*Math.PI*2));
 for(let j=0;j<nY;j++)for(let k=0;k<nA;k++){const a=j*nA+k,b=j*nA+(k+1)%nA,c=(j+1)*nA+(k+1)%nA,d=(j+1)*nA+k;(k<nA/2?biTop:biBottom).push(a,b,c,a,c,d);}
 for(const [idx,m] of [[biTop,canvas],[biBottom,gusset]]){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(bp,3));g.setIndex(idx);g.computeVertexNormals();add(g,m);}
 for(const a of [0,Math.PI])tube(Array.from({length:65},(_,j)=>bagPoint(78+j,a,.025)),.035,gusset,64);
 // Dark zipper follows the raised top; stitched tape and loose carry handle.
 tube(Array.from({length:65},(_,j)=>bagPoint(78+j,Math.PI/2,.15)),.075,seal,64);
 function bagTopPoint(x,y){const [,w,,,dx]=section(y),u=T.MathUtils.clamp((x-snow.centerX-dx)/w,-1,1),a=Math.acos(Math.sign(u)*Math.pow(Math.abs(u),1/.72)),p=bagPoint(y,a,.16);return p;}
 tube([[1,103],[4,104],[8,109],[12,104],[16,103]].map(([x,y])=>bagTopPoint(x,y)),.30,seal,32);
 // Small unbranded fabric label beside the forward zipper.
 for(const x of [4.1,6.1])tube([89.3,90.5,92.1].map(y=>bagTopPoint(x,y)),.10,seal,12);
 for(const y of [89.3,92.1])tube([4.1,5.1,6.1].map(x=>bagTopPoint(x,y)),.10,seal,12);
 for(const y of [97,117]){const p=bagPoint(y,Math.PI/2,.15);box([p[0],p[1],p[2]],[1.0,.45,.15],seal);}
 // Two wrapping webbing bands follow the deformed case, distinct from the clamp jaws.
 for(const y of [119]){const p=[],idx=[];for(let j=0;j<=40;j++){const a=j/40*Math.PI*2;for(const yy of [y-.42,y+.42])p.push(...bagPoint(yy,a,.07));}for(let j=0;j<40;j++){const a=j*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();add(g,seal);}
 feature='Front-crossbar antennas';const ant=INSTALLED_ROOF_SPEC.antennas;
 box(ant.mountPlate.center,ant.mountPlate.size,black);
 for(const x of [27,33])for(const y of [-1.5,1.5])cyl([x,y,6.82],[x,y,6.98],.15,silver,6);
 const lb=ant.long.base,sb=ant.short.base;
 cyl(lb,[lb[0],lb[1],lb[2]+.7],.52,seal,16);cyl([lb[0],lb[1],lb[2]+.5],[lb[0],lb[1],lb[2]+ant.long.lowerSectionHeight],.19,black,16,.13);
 cyl([lb[0],lb[1],lb[2]+ant.long.lowerSectionHeight],[lb[0]-.13,lb[1],lb[2]+ant.long.height],.065,silver,10,.035);
 cyl(sb,[sb[0],sb[1],sb[2]+.55],.32,seal,14);cyl([sb[0],sb[1],sb[2]+.4],[sb[0],sb[1],sb[2]+ant.short.height],.14,black,12,.10);
 for(const p of [lb,sb])tube([[p[0],p[1],6.7],[p[0]+1,p[1]+1,6.3],[p[0]+2,p[1]+3,5.3]],.08,seal);
 for(const b of buckets.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,b.m);mesh.name='Installed roof · '+b.m.name;mesh.userData.installedRoof=true;mesh.userData.installedSolar=b.isSolar;mesh.castShadow=true;mesh.receiveShadow=true;(b.isSnowboard?snowboard:parts[featureIds[b.feature]]).add(mesh);}
 group.userData={spec:INSTALLED_ROOF_SPEC,featureBounds,modelBounds:new T.Box3().setFromObject(group)};
 const bagBounds=new T.Box3().copy(featureBounds['Bagged snowboard']).union(featureBounds['Snowboard clamp rack']);const selection=new T.Box3Helper(bagBounds,0xf4d195);selection.userData.ignorePick=true;selection.visible=false;snowboard.add(selection);
 return {group,materials,snowboard,parts,selection,setSnowboardPosition(value){const v=globalThis.RooflabSnowboard.validate(value),p=v.snowboard;snowboard.position.set(p.x,p.y,p.z);snowboard.visible=!v.bagHidden;parts.starlink.visible=!v.starlinkHidden;for(const [id,o]of Object.entries(v.offsets))parts[id].position.set(o.x,o.y,o.z);}};
}
