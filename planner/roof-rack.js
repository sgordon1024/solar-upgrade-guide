import * as T from './vendor/three.module.js';
import {buildRackWordmark} from './brand-emblems.js?v=close1';

// Inches in the same body datum as the shell. Installation is a photo estimate;
// owner observations are retained verbatim rather than silently joining datums.
export const RACK_SPEC={
  revision:'rack-4-rear-photo-boundary',description:'Open two-level roof rack with four exposed main crossbars, four inferred panel supports, sloping fairings and front LED bar',
  source:'https://www.entegracoach.com/models/previous-model-years/2024/launch/',
  sourceScope:'Entegra lists double roof rack and front/rear wind deflectors with front LED light bar. This source does not establish dimensions or hardware manufacturer.',
  ownerReported:{planningLength:122,planningWidth:60,railOutsideWidthObservation:'just under 52 inches',railOutsideWidthUpperBound:52,frontRearCrossbarCenters:130,crossbarForeAftWidth:2,crossbarHeight:1,sideSlotCenterSpacing:3,roofToTopCrossbarObservation:6.5,lowerSideRailCenterToTopRailBottomObservation:4},
  unresolved:['Measured 130 in crossbar-center span is not reconciled with the photo-estimated 121 in visible span; do not infer support capacity or move the saved planning origin','Alignment of the 130 in crossbar-center span with the separate 122 × 60 roof reference; 52 in is an outside-width upper bound and centering is assumed','Whether the 6.5-inch observation reaches the crossbar top, center or bottom','Identity of top rail in the separate 4-inch observation','Exact rail sections, hidden crossbars, mounting feet and light-bar model'],
  installation:{status:'estimated',planningOrigin:[0,26,0],firstCrossbarY:26,lastCrossbarY:147,sideRailFrontY:26,sideRailRearY:149,rearFairingLowerTipY:150,rearFairingUpperY:147,rearEndEvidence:'Driver and passenger photos show the rack ending over the roof. Rear beam, end caps and fairing are retracted to the final shell roof silhouette; exact offsets remain estimates. Front and intermediate stations, light bar and saved planning origin are unchanged.',railCenterXs:[4.7,55.3],crossbarCenterZ:6,crossbarStations:[0,29.9/121,87.1/121,1],sideRailCenterZs:[2,5],frontFairingTipY:19,lightBarCenter:[30,23,4.9],lightBarSize:[49,2.6,3.1]},
  panelSupports:{status:'estimated',count:4,bodyCenterYs:[33.5,49,83,99],centerZ:5.15,section:[1.25,1],span:52,evidence:'Four rows of exposed edge stubs and center-gap fasteners in the overhead photo. Continuous spans beneath panels, sections and heights are inferred, not measured.'},
  limits:'Owner measured <52 in outside side rails and 130 in front/rear crossbar centers. Drawn at the 52 in upper bound, assumed centered on roof reference with front crossbar at Y0. The measured 130 in span is retained as an unregistered observation: the illustrated main-beam centers span 121 in after the rear correction. The side rails end at body Y149 (planning Y123), rear beam at body Y147, and fairing at Y150; all are photo estimates. Intermediate crossbars and sections remain estimates. Photo-estimated registration and hardware. 6.5 inches is used only as an illustrative crossbar-top elevation, not a resolved measurement datum. The separate 4-inch observation is not used to solve heights. Four main beams are visible; four lower panel-support spans are inferred from partly exposed hardware. No load, mounting or equipment-clearance validation.'
};

export function buildRoofRack(){
  const group=new T.Group();group.name='Roof rack and front LED bar · photo estimate';
  const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p);
  function material(name,color,metalness,roughness){return materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});}
  const frame=material('Rack satin black','#24282a',.45,.51),recess=material('Rack channels and seals','#101719',.12,.7),metal=material('Rack fasteners','#77817f',.7,.36),reflector=material('LED reflector cups · unlit','#c1cbc8',.8,.24),lens=material('LED optical faces · unlit','#d8dfd6',.18,.24),amber=material('Fairing amber details','#bb6a27',.15,.4);
  function add(g,m){if(!g.attributes.normal)g.computeVertexNormals();let b=buckets.get(m);if(!b){b={p:[],n:[],i:[],count:0};buckets.set(m,b);}const p=g.attributes.position,n=g.attributes.normal;for(const v of p.array)b.p.push(v);for(const v of n.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let j=0;j<p.count;j++)b.i.push(j+b.count);b.count+=p.count;g.dispose();}
  function box(c,s,m=frame){const g=new T.BoxGeometry(...s);g.translate(...c);add(g,m);}
  function cyl(a,b,r,m=metal,n=12,r2=r){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r2,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m);}
  function plate(points,m=frame){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));const idx=[];for(let j=1;j<points.length-1;j++)idx.push(0,j,j+1);g.setIndex(idx);g.computeVertexNormals();add(g,m);}
  function sidePlate(x,outline,thick=.16){const s=new T.Shape(outline.map(p=>new T.Vector2(...p))),g=new T.ExtrudeGeometry(s,{depth:thick,bevelEnabled:false});const a=g.attributes.position;for(let j=0;j<a.count;j++){const y=a.getX(j),z=a.getY(j),dx=a.getZ(j);a.setXYZ(j,x+dx-thick/2,y,z);}g.computeVertexNormals();add(g,frame);}
  const i=RACK_SPEC.installation,y0=i.firstCrossbarY,y1=i.lastCrossbarY,r0=i.sideRailFrontY,r1=i.sideRailRearY;
  const roofApprox=(x,y)=>-9*Math.pow(Math.abs(x-30)/36,10)-.35*T.MathUtils.clamp((y-135)/14,0,1)-.08*(1-T.MathUtils.clamp((y-26)/10,0,1));
  // Longitudinal extrusions have open daylight between levels, not basket walls.
  for(const x of i.railCenterXs){
    for(const [z,h] of [[2,1.05],[5,1.2]]){
      box([x,(r0+r1)/2,z],[1.4,r1-r0,h]);
      for(const s of [-1,1])box([x+s*.708,(r0+r1)/2,z],[.025,r1-r0-.5,.19],recess);
      box([x,(r0+r1)/2,z+h/2+.012],[.34,r1-r0-.5,.03],recess);
      for(const y of [r0-.035,r1+.035])box([x,y,z],[1.43,.1,h+.03],recess);
    }
    for(const y of [30,65,110,144]){
      const base=roofApprox(x,y);
      const g=new T.BoxGeometry(2.5,5.6,.16),p=g.attributes.position;for(let j=0;j<p.count;j++){const xx=x+p.getX(j),yy=y+p.getY(j);p.setXYZ(j,xx,yy,roofApprox(xx,yy)+.13+p.getZ(j));}g.computeVertexNormals();add(g,frame);
      box([x,y,(base+1.5)/2],[.24,2.6,1.5-base]);
      sidePlate(x,[[y-1.35,1.5],[y+1.35,1.5],[y+.7,5.5],[y-.7,5.5]],.18);
      for(const yy of [y-1.8,y+1.8])cyl([x,yy,roofApprox(x,yy)+.22],[x,yy,roofApprox(x,yy)+.37],.2,metal,6);
      for(const z of [2,5])cyl([x-.85,y,z],[x+.85,y,z],.18,metal,6);
    }
  }
  for(const t of i.crossbarStations){const y=y0+(y1-y0)*t;
    box([30,y,i.crossbarCenterZ],[t===0?53:52,2,1]);
    box([30,y,i.crossbarCenterZ+.51],[49.2,.28,.035],recess);
    for(const x of i.railCenterXs){box([x,y,5.55],[2.2,3.5,.15]);for(const yy of [y-.6,y+.6])cyl([x,yy,6.52],[x,yy,6.65],.18,metal,6);}
  }
  // The photo exposes short stubs and central fasteners at four panel rows.
  // Continue those spans below the panel frames; the concealed construction is estimated.
  for(const y of RACK_SPEC.panelSupports.bodyCenterYs){
    box([30,y,5.15],[52,1.25,1]);
    for(const x of [i.railCenterXs[0],30,i.railCenterXs[1]]){box([x,y,5.66],[1.5,2.1,.1]);cyl([x,y,5.71],[x,y,5.85],.17,metal,6);}
  }
  // Front fairing: forward/lower tip, taller side cheeks and a lamp opening.
  const fy=z=>19+(z-.7)*1.1;
  plate([[4,fy(.7),.7],[56,fy(.7),.7],[55.4,fy(3.1),3.1],[4.6,fy(3.1),3.1]]);
  for(const s of [-1,1]){
    const x=s<0?i.railCenterXs[0]:i.railCenterXs[1];sidePlate(x,[[19,.7],[27,1.8],[27,6.5],[24.8,6.5]],.22);
    const a=s<0?4.6:54.6,b=s<0?5.4:55.4;
    plate([[a,fy(3.1),3.1],[b,fy(3.1),3.1],[b-.15*s,fy(6.5),6.5],[a+.2*s,fy(6.5),6.5]]);
  }
  // Light-bar dimensions and optic count are visual approximations, lights off.
  box(i.lightBarCenter,i.lightBarSize,frame);
  box([30,21.64,4.9],[47.8,.12,2.7],recess);
  for(let row=0;row<2;row++)for(let col=0;col<34;col++){
    const x=6.8+col*46.4/33,z=4.2+row*1.4;
    cyl([x,21.55,z],[x,21.40,z],.56,reflector,12,.38);
    cyl([x,21.39,z],[x,21.35,z],.22,lens,10);
  }
  for(const x of [5,55]){sidePlate(x,[[21.3,2.8],[25,2.8],[25,5.5],[23,5.5]],.2);cyl([x-.25,23,4.9],[x+.25,23,4.9],.27,metal,6);}
  for(const x of [7,53])for(const z of [3.7,6.1])cyl([x,21.6,z],[x,21.5,z],.13,metal,6);
  for(const z of [3.9,4.6,5.3,6])box([30,24.42,z],[46,.15,.12],frame);
  for(const x of [6,22,30,38,54]){const z=x===6||x===54?2:2.55;cyl([x,fy(z)-.13,z],[x,fy(z)-.25,z],.25,amber,12);}
  // The photo-referenced serif fairing wordmark is added below as a separate mesh.
  // Rear fairing is partially obscured in the photo; retain an open center roof.
  const rearTip=i.rearFairingLowerTipY,rearTop=i.rearFairingUpperY;
  plate([[4,rearTip,1.25],[56,rearTip,1.25],[55.3,rearTop,5.6],[4.7,rearTop,5.6]]);
  for(const x of i.railCenterXs)sidePlate(x,[[rearTop-1,1.5],[rearTip,1.25],[rearTop,5.6],[rearTop-1.2,5.6]],.2);
  for(const [m,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,m);mesh.name=m.name;mesh.castShadow=true;mesh.receiveShadow=false;group.add(mesh);}
  const wordmark=buildRackWordmark();group.add(wordmark.group);Object.assign(materials,wordmark.materials);
  group.userData={spec:RACK_SPEC,bounds:new T.Box3().setFromObject(group),crossbarCenters:i.crossbarStations.map(t=>[30,y0+(y1-y0)*t,i.crossbarCenterZ]),panelSupportCenters:RACK_SPEC.panelSupports.bodyCenterYs.map(y=>[30,y,RACK_SPEC.panelSupports.centerZ])};
  return {group,materials};
}
