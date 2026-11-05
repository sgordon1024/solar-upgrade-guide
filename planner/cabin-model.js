import * as T from './vendor/three.module.js';

export const CABIN_SPEC={revision:'cabin-1',units:'in',status:'reference-estimated',
  upholstery:{material:'black leather',status:'owner-confirmed'},
  reference:'Owner-supplied Sprinter renderings 22–24: dashboard, circular vents, steering wheel, seats and door trim. These are reference renderings, not measurements of this coach.',
  seatCenters:[[8,5,-73.6],[52,5,-73.6]],seatWidth:21,seatDepth:21,swivelDegrees:180,illustrativeSeatSlide:11,illustrativeArmrestLiftDegrees:90,illustrativeAisleOffset:5.5,
  display:{diagonal:10.25,diagonalStatus:'manufacturer-sourced',width:8.94,height:5.03,faceSizeStatus:'estimated from an assumed 16:9 aspect ratio'},
  limits:'Cabin dimensions, seat rails, swivel axis and clearance are estimated. The demo opens the corresponding cab door, raises its inner armrest and slides the upper seat an illustrative 11 inches rearward. During the turn it moves up to 5.5 inches toward the aisle, returning to its original lateral position at either end. Seats turn one at a time. This display clearance path does not model the real swivel hardware, measured rail travel or a safe operating sequence. Screen graphics are illustrative. Camper furnishings behind the front seats are not modeled.',
  ropeLights:{estimatedBedroomFrontY:103,estimatedRearReachY:127,requestedBedroomReach:24,status:'owner-described, route estimated',description:'Starts left of driver seat, rises up wall and follows ceiling corners approximately two feet into rear bedroom. Routing around furniture and exact termination are unverified.'},
  manufacturerSource:'https://www.entegracoach.com/models/previous-model-years/2024/launch/',
  measurementRequest:'M06-M10'};

// Original code-built geometry; no reference textures or third-party meshes.
export function buildCabin(){
  const group=new T.Group();group.name='Reference-estimated front cabin';const seats={},armrests={},doorTrims={},materials={};
  const V=(...p)=>new T.Vector3(...p);
  const mat=(name,color,roughness=.65,metalness=0)=>materials[name]=new T.MeshStandardMaterial({name,color,roughness,metalness,side:T.DoubleSide});
  const dash=mat('Cockpit graphite molding','#303438'),black=mat('Cockpit recesses','#101416'),leather=mat('Owner-confirmed black leather','#202326',.42),insert=mat('Leather center panels','#292d30',.48),stitch=mat('Leather seam piping','#404347',.7),silver=mat('Cockpit satin trim','#adb3b7',.32,.65),red=mat('Seat belt release buttons','#a32b25'),floor=mat('Cab rubber flooring','#252a2d',.95),headliner=mat('Cab headliner','#4e5051',.95),screen=mat('Inactive display glass','#101b23',.18,.15);
  function mesh(g,m,c=[0,0,0],target=group){const o=new T.Mesh(g,m);o.position.set(...c);o.castShadow=o.receiveShadow=true;target.add(o);return o;}
  function round(c,size,m,r=.7,target=group){const [ow,d,oh]=size,b=Math.min(r,ow/2-.01,d/2-.01,oh/2-.01),w=ow-2*b,h=oh-2*b,cr=Math.max(.001,Math.min(b,w/2-.001,h/2-.001)),s=new T.Shape();s.moveTo(-w/2+cr,-h/2);s.lineTo(w/2-cr,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+cr);s.lineTo(w/2,h/2-cr);s.quadraticCurveTo(w/2,h/2,w/2-cr,h/2);s.lineTo(-w/2+cr,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-cr);s.lineTo(-w/2,-h/2+cr);s.quadraticCurveTo(-w/2,-h/2,-w/2+cr,-h/2);const g=new T.ExtrudeGeometry(s,{depth:Math.max(.02,d-2*b),bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:5,curveSegments:12});
    const pos=g.attributes.position,n=g.attributes.normal,shared=new Map();for(let i=0;i<pos.count;i++){const k=[pos.getX(i),pos.getY(i),pos.getZ(i)].map(v=>v.toFixed(5)).join(',');if(!shared.has(k))shared.set(k,[]);shared.get(k).push(i);}for(const ids of shared.values()){const v=new T.Vector3();for(const i of ids)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of ids)n.setXYZ(i,v.x,v.y,v.z);}
    g.rotateX(Math.PI/2);g.translate(0,d/2-b,0);return mesh(g,m,c,target);}
  function rod(a,b,r,m,target=group){const va=V(...a),vb=V(...b),d=vb.clone().sub(va),o=mesh(new T.CylinderGeometry(r,r,d.length(),12),m,va.clone().add(vb).multiplyScalar(.5).toArray(),target);o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return o;}
  function tube(points,r,m,target=group,closed=false){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p)),closed,'catmullrom',.1),Math.max(16,points.length*7),r,6,closed),m,[0,0,0],target);}
  function ring(c,r,t,m,target=group){const g=new T.TorusGeometry(r,t,8,40);g.rotateX(Math.PI/2);return mesh(g,m,c,target);}
  round([30,53,-87.4],[76,194,1.6],floor,.45);
  for(const x of [8,52]){round([x,-22,-86.3],[22,28,.5],black,.2);for(let i=0;i<12;i++)rod([x-9,-33+i*1.9,-85.9],[x+9,-33+i*1.9,-85.9],.065,dash);}
  round([30,-31,-70],[75,2,33],black,.6);
  for(const x of [-1,61])round([x,-27,-79],[12,23,17],black,2.8);
  for(const x of [-1,61])round([x,108,-80],[12,35,22],black,2);
  // Broad dashboard with tapered end caps, center media fascia and lower cubbies.
  round([30,-26,-48],[68,18,12],dash,2.2);
  round([30,-31,-42.2],[63,13,2.6],dash,1.1);
  round([34,-15.8,-48.5],[29,3,11],black,1);
  round([34,-13.95,-47.9],[8.94,.25,5.03],screen,.08);
  // Unbranded muted display marks, without personal or simulated live data.
  round([34,-13.75,-50.4],[7.7,.08,.14],silver,.03);
  for(const x of [23.2,44.8,-.2,60.2]){
    ring([x,-13.6,-48],2.25,.24,silver);round([x,-14.1,-48],[4.2,.5,4.2],black,.7);
    for(let k=0;k<8;k++){const a=k*Math.PI/4;rod([x+Math.cos(a)*.6,-13.52,-48+Math.sin(a)*.6],[x+Math.cos(a)*1.9,-13.52,-48+Math.sin(a)*1.9],.1,dash);}
    ring([x,-13.4,-48],.65,.14,dash);
  }
  round([52,-15.9,-48.2],[14,1.3,9],dash,1.2);
  tube([[46,-15.08,-52],[57.3,-15.08,-52],[58.5,-15.08,-50],[58.5,-15.08,-44.5]],.06,black);
  round([34,-15,-57],[23,4,3.6],black,.8);
  for(const x of [27,34,41]){ring([x,-12.6,-57],.68,.16,silver);rod([x,-12.6,-57],[x,-12.4,-57],.45,black);}
  round([34,-19,-64],[26,12,9],dash,1.5);
  for(const x of [27,41]){round([x,-12.7,-64],[10,.5,6.2],black,.7);tube([[x-4.5,-12.3,-66.5],[x-3.7,-11.8,-67.2],[x+3.7,-11.8,-67.2],[x+4.5,-12.3,-66.5]],.22,dash);}
  // Driver binnacle, two circular instruments and three-spoke steering wheel.
  round([8,-17.3,-46],[17,7,10],black,1.6);
  for(const x of [4.2,11.8]){ring([x,-13.55,-45.5],2.25,.18,silver);rod([x,-13.3,-45.5],[x-1,-13.3,-44.3],.09,silver);}
  round([8,-13.45,-46],[2.2,.15,3.3],screen,.04);
  const steering=new T.Group();steering.name='Three-spoke steering wheel';steering.position.set(8,-5,-51);steering.rotation.x=-.3;group.add(steering);
  ring([0,0,0],7.6,.7,leather,steering);rod([0,-7,0],[0,0,0],1.4,black,steering);rod([0,-.5,0],[0,.7,0],2.5,leather,steering);
  for(const a of [0,Math.PI,Math.PI*1.5]){rod([Math.cos(a)*2,0,Math.sin(a)*2],[Math.cos(a)*7.1,0,Math.sin(a)*7.1],.7,silver,steering);}
  for(const x of [-4.5,4.5]){round([x,.42,-.2],[2.6,.5,1.6],black,.18,steering);for(const dz of [-.35,.35])rod([x-.65,.75,dz],[x+.65,.75,dz],.055,silver,steering);}
  ring([0,.8,0],1.4,.09,silver,steering);for(let k=0;k<3;k++){const a=k*Math.PI*2/3+Math.PI/2;rod([0,.85,0],[Math.cos(a)*1.3,.85,Math.sin(a)*1.3],.1,silver,steering);}
  rod([7,-14,-53],[1,-9,-52],.22,black);rod([10,-13,-51],[16,-10,-50],.22,black);
  for(const [x,w] of [[6,4],[14,2]])round([x,-29,-80],[w,2,6],black,.3).rotation.x=-.25;
  // Independent swivel upper assemblies; pedestals and rails remain fixed.
  for(const [id,cx] of [['driver-seat',8],['passenger-seat',52]]){
    round([cx,5,-80.7],[19,21,11.8],dash,.6);for(const dx of [-7.8,7.8])round([cx+dx,5,-74.5],[1.2,23,.8],silver,.15);
    const s=new T.Group();s.name=id;s.userData.action=id;s.position.set(cx,5,-73.6);group.add(s);seats[id]=s;
    rod([0,0,-.3],[0,0,.3],7.8,black,s).rotation.x=Math.PI/2;
    round([0,0,3.8],[21,21,5],leather,1.7,s);round([0,-1,6.05],[14.8,17,1.3],insert,.5,s);
    for(const dx of [-9,9])round([dx,.2,6.4],[3.1,19,3.4],leather,1.25,s);
    tube([[-7.3,-9,6.7],[-7.3,7.5,6.7],[7.3,7.5,6.7],[7.3,-9,6.7]],.065,stitch,s);
    tube([[-7.2,-5.2,6.8],[0,-5.6,6.8],[7.2,-5.2,6.8]],.055,stitch,s);
    const back=new T.Group();back.position.set(0,8.2,7);back.rotation.x=-.12;s.add(back);
    round([0,1.8,13.2],[20,5.5,27],leather,1.8,back);round([0,-1.1,14],[13.9,.8,21.5],insert,.6,back);
    for(const dx of [-8.5,8.5])round([dx,-.9,12.9],[3.6,2.8,23.5],leather,1.2,back);
    for(const dx of [-6.8,6.8])tube([[dx,-1.64,4],[dx,-1.64,23.3]],.065,stitch,back);
    tube([[-6.8,-1.66,17.4],[6.8,-1.66,17.4]],.065,stitch,back);
    for(const dx of [-3.6,3.6])rod([dx,1.7,25],[dx,1.7,29.1],.22,silver,back);
    round([0,1.8,32],[12.6,5.5,8.5],leather,1.45,back);
    const inner=id==='driver-seat'?1:-1,arm=new T.Group();arm.name=id+' lifting inner armrest';arm.position.set(inner*11.3,8,13.5);s.add(arm);armrests[id]=arm;
    round([0,-5.7,0],[2.5,14.5,2.7],leather,.8,arm);rod([inner*10,8,11],[inner*11.3,8,13.5],.7,black,s);
    round([inner*10.7,4,6],[1.6,2.6,2.1],black,.3,s);round([inner*10.7,3.7,7.15],[1.3,1.8,.28],red,.1,s);
  }
  // Door cards sit on the interior side and follow the exterior door pivots.
  for(const [id,sign] of [['driver-door',-1],['passenger-door',1]]){
    const g=new T.Group();g.name=id+' interior card';doorTrims[id]=g;
    const x=30+sign*35.4;
    round([x,0,-63],[2.3,33,28],dash,.8,g);round([x-sign*1.2,-1,-60],[1.8,26,12],black,.6,g);
    round([x-sign*2,-3,-56.1],[3.2,25,2.2],dash,.7,g);
    round([x-sign*2.1,0,-55.3],[2.3,6,.3],black,.12,g);
    rod([x-sign*2.1,-8,-60],[x-sign*2.1,-2,-58.5],.35,silver,g);
    round([x-sign*1.5,2,-73.5],[2,22,5],black,.6,g);
    for(let k=0;k<8;k++)rod([x-sign*2,-9+k*.6,-69],[x-sign*2,-9+k*.6,-74],.07,dash,g);
  }
  for(const sign of [-1,1]){tube([[30+sign*34,-39,-49],[30+sign*33,-26,-34],[30+sign*32,-12,-20]],1.1,headliner);tube([[30+sign*34,18,-82],[30+sign*34,18,-21],[30+sign*30,16,-17]],1.2,headliner);}
  // Visors and overhead console; no cargo-van partition in the camper.
  for(const x of [11,49])round([x,2,-23.5],[25,7,2],headliner,.7);
  round([30,1,-21],[9,12,3],dash,.8);round([30,4,-22.7],[5,4,.25],silver,.1);
  round([30,-16,-25],[10,1.6,4.8],black,.7);round([30,-15.1,-25],[9,.15,3.8],screen,.2);
  const ropePath=new T.CatmullRomCurve3([[-4,18,-70],[-4,18,-24],[-2,13,-17],[-1,0,-23],[5,-3,-23],[55,-3,-23],[61,0,-23],[63,16,-14],[63,35,-11.5],[63,118,-11.5],[60,127,-11.5],[0,127,-11.5],[-3,118,-11.5],[-3,35,-11.5],[-3,19,-15]].map(p=>V(...p)),false,'centripetal');
  const ropeGeo=new T.TubeGeometry(ropePath,180,.19,6,false),colors=new Float32Array(ropeGeo.attributes.position.count*3);ropeGeo.setAttribute('color',new T.BufferAttribute(colors,3));
  const ropeMaterial=materials.rope=new T.MeshBasicMaterial({name:'Custom ceiling rope light',vertexColors:true,toneMapped:false});
  const rope=mesh(ropeGeo,ropeMaterial);rope.name='Owner-described ceiling rope route';rope.castShadow=false;rope.userData.ignorePick=true;
  const ropeGlow=[];for(const p of [[30,4,-19],[30,50,-15],[30,119,-15]]){const l=new T.PointLight('#f4c88d',0,90,1);l.position.set(...p);group.add(l);ropeGlow.push(l);}
  const palettes={warm:['#ffd29a','#ffd29a'],aurora:['#52edb3','#3ea7ff','#b27dff'],sunset:['#ffa442','#ed5d92','#e8a3db'],rainbow:['#ff7767','#ffd263','#7ce9a1','#6caeff','#bb84ff']};
  function setRope({preset='off',pattern='steady',speed=.7}={},time=0){
    const palette=(palettes[preset]||palettes.warm).map(c=>new T.Color(c));
    const level=preset==='off'?0:pattern==='breathe'?.5+.5*(.5+.5*Math.sin(time*speed*.8)):1;
    const sample=u=>{const v=((u*palette.length+(pattern==='flow'?time*speed*.18:0))%palette.length+palette.length)%palette.length,i=Math.floor(v);return palette[i].clone().lerp(palette[(i+1)%palette.length],v-i).multiplyScalar(level);};
    const c=ropeGeo.attributes.color;for(let i=0;i<c.count;i++){const color=preset==='off'?new T.Color('#525659'):sample(Math.floor(i/7)/180);c.setXYZ(i,color.r,color.g,color.b);}c.needsUpdate=true;
    for(let i=0;i<ropeGlow.length;i++){ropeGlow[i].color.copy(sample(i/3));ropeGlow[i].intensity=preset==='off'?0:80*level;}
  }
  // Batch static surfaces within each independently moving assembly.
  function batch(target,excluded=new Set()){
    target.updateMatrixWorld(true);const inv=target.matrixWorld.clone().invert(),meshes=[];
    function walk(o){for(const c of o.children){if(excluded.has(c))continue;if(c.isMesh&&!c.geometry.attributes.color)meshes.push(c);else walk(c);}}walk(target);
    const buckets=new Map();for(const o of meshes){const g=o.geometry.clone().applyMatrix4(inv.clone().multiply(o.matrixWorld)),a=g.index?g.toNonIndexed():g,key=o.material;let b=buckets.get(key);if(!b){b={p:[],n:[]};buckets.set(key,b);}for(const v of a.attributes.position.array)b.p.push(v);for(const v of a.attributes.normal.array)b.n.push(v);a.dispose();g.dispose();o.parent.remove(o);o.geometry.dispose();}
    for(const [m,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));mesh(g,m,[0,0,0],target);}
  }
  for(const [id,seat] of Object.entries(seats))batch(seat,new Set([armrests[id]]));for(const trim of Object.values(doorTrims))batch(trim);batch(group,new Set(Object.values(seats)));
  setRope();group.userData.spec=CABIN_SPEC;
  return {group,seats,armrests,doorTrims,materials,setRope,rope,ropeGlow,spec:CABIN_SPEC};
}
