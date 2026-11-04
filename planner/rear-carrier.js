import * as T from './vendor/three.module.js';

// Original visualization of HAUL-MASTER 57720. Inches, X passengerward,
// Y rearward, Z up. Product dimensions and estimated installation are separate.
export const CARRIER_SPEC={
  product:'HAUL-MASTER 600 lb. motorcycle carrier',sku:'57720',
  source:'https://www.harborfreight.com/600-lb-capacity-motorcycle-carrier-57720.html',
  manual:'https://manuals.harborfreight.com/manuals/57000-57999/57720-193175421548.pdf',
  manufacturer:{overallLength:83.125,overallDepth:36.25,overallHeight:15.5,platformLength:78.75,platformWidth:8,platformThickness:.109,rampLength:72,receiverSize:2,hitchPinDiameter:.625,productWeightLb:91.9,ratedLoadLb:600},
  installation:{status:'estimated',trackCenterX:30,trackCenterY:176.5,platformZ:-91.5,receiverFaceY:157.75,receiverCenterZ:-94,insertFrontY:152.25,actualExtensionLength:null,actualReceiverHeight:null},
  configuration:{chockSide:'passenger',ramp:'stored on vehicle side of channel',motorcycle:false},
  limits:'Installation coordinates, tube walls, mount brackets and fine details are estimates. Product capacity is not a vehicle/hitch load assessment. No clearance or mounting validation.'
};

export function buildRearCarrier(){
  const group=new T.Group(),receiver=new T.Group(),carrier=new T.Group();
  group.name='Rear receiver and motorcycle carrier';receiver.name='Estimated two-inch receiver';carrier.name='HAUL-MASTER 57720 · reference reconstruction';group.add(receiver,carrier);
  const materials={};
  function material(name,color,metalness,roughness){return materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});}
  const steel=material('Carrier powder-coated steel','#292d30',.5,.44),metal=material('Carrier fasteners','#8d989d',.8,.3),recess=material('Receiver interior','#111719',0,.8);
  let target=receiver;
  const V=(...p)=>new T.Vector3(...p);
  function add(g,m,name){const o=new T.Mesh(g,m);o.name=name;o.castShadow=true;o.receiveShadow=false;target.add(o);return o;}
  function box(c,s,m=steel,name='Steel member'){const g=new T.BoxGeometry(...s);g.translate(...c);return add(g,m,name);}
  function cylinder(a,b,r,m=metal,n=12){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());return add(g,m,'Fastener');}
  function tube(points,r=.35,m=steel,name='Tubular member'){const c=new T.CatmullRomCurve3(points.map(p=>V(...p)),false,'catmullrom',.2);return add(new T.TubeGeometry(c,Math.max(24,points.length*7),r,8,false),m,name);}
  function rectShape(w,h){const s=new T.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h/2);s.lineTo(-w/2,h/2);s.closePath();return s;}
  // Four actual walls leave the receiver opening and hook-tube ends hollow.
  function squareTubeY(x,y0,y1,z,outer,wall,name){
    for(const sign of [-1,1]){box([x+sign*(outer-wall)/2,(y0+y1)/2,z],[wall,y1-y0,outer],steel,name);box([x,(y0+y1)/2,z+sign*(outer-wall)/2],[outer-2*wall,y1-y0,wall],steel,name);}
  }
  function bolt(x,y,z,axis='z',r=.23){const d=axis==='z'?[0,0,.17]:axis==='y'?[0,.17,0]:[.17,0,0];cylinder([x-d[0],y-d[1],z-d[2]],[x+d[0],y+d[1],z+d[2]],r,metal,6);}
  // Receiver crossmember and two chassis attachment plates are illustrative.
  box([30,147,-93],[52,3,2.5],steel,'Estimated hitch crossmember');
  for(const x of [6,54]){box([x,143,-91.3],[.3,13,5],steel,'Estimated chassis plate');for(const y of [139,146])bolt(x+.2,y,-89.5,'x',.28);}
  squareTubeY(30,145,157.75,-94,2.5,.25,'Two-inch receiver tube');
  squareTubeY(30,157,157.75,-94,3,.5,'Receiver collar');
  box([30,145,-94],[2,.06,2],recess,'Receiver dark interior');
  for(const sign of [-1,1])tube([[30+sign*2.1,154,-94.5],[30+sign*3.1,154,-95.2],[30+sign*3.1,156,-95.2],[30+sign*2.1,156,-94.5]],.2,steel,'Safety-chain loop');

  target=carrier;
  const m=CARRIER_SPEC.manufacturer,i=CARRIER_SPEC.installation,cx=i.trackCenterX,cy=i.trackCenterY,z=i.platformZ;
  squareTubeY(cx,i.insertFrontY,cy+3,-94,2,.18,'Two-inch carrier shank');
  // Pin and clamp are independent of the vehicle's assumed receiver rating.
  cylinder([27.8,155.2,-94],[32.2,155.2,-94],m.hitchPinDiameter/2,metal,16);
  tube([[32.2,155.2,-94],[32.8,154.8,-94],[33.2,155.1,-94],[32.8,155.7,-94]],.07,metal,'Hitch pin retaining clip');
  box([30,158.8,-95.2],[5,2,.3],steel,'Anti-rattle clamp plate');
  tube([[28.4,158.8,-95.6],[28.4,158.8,-92.6],[29,158.8,-92.2],[31,158.8,-92.2],[31.6,158.8,-92.6],[31.6,158.8,-95.6]],.14,metal,'Anti-rattle U-bolt');
  for(const x of [28.4,31.6])bolt(x,158.8,-95.5,'z',.25);
  box([cx,cy,-92.6],[13,8,.35],steel,'Carrier support saddle');
  for(const x of [cx-5,cx,cx+5])for(const y of [cy-2.7,cy+2.7])bolt(x,y,z+.11);

  function channel(xCenter,yCenter,floor,length,width,flange,name,holes=false){
    box([xCenter,yCenter,floor-m.platformThickness/2],[length,width,m.platformThickness],steel,name+' floor');
    for(const sign of [-1,1]){
      const shape=rectShape(length,flange);
      if(holes)for(let x=10;x<length/2-1;x+=1.7){const hole=new T.Path();hole.absarc(x,0,.18,0,Math.PI*2,true);shape.holes.push(hole);}
      const geo=new T.ExtrudeGeometry(shape,{depth:m.platformThickness,bevelEnabled:false,curveSegments:6});
      geo.rotateX(Math.PI/2);geo.translate(xCenter,yCenter+sign*(width/2-m.platformThickness/2)+m.platformThickness/2,floor+flange/2);
      add(geo,steel,name+' side flange');
    }
  }
  channel(cx,cy,z,m.platformLength,m.platformWidth,1.8,'Wheel channel',true);
  // The unloaded ramp is stowed inboard, parallel to the wheel channel.
  channel(cx,166.75,z-.35,m.rampLength,8,1.4,'Stored loading ramp');
  for(const x of [cx-26,cx+26]){
    squareTubeY(x,158.5,188.5,z-1.15,1.25,.13,'Tie-down cross tube');
    for(const y of [158.7,188.3])tube([[x-.42,y,z-.6],[x-.42,y,z+.1],[x,y,z+.55],[x+.42,y,z+.1],[x+.42,y,z-.6]],.11,steel,'Tie-down eye');
    for(const y of [cy-2,cy+2])bolt(x,y,z+.12);
    cylinder([x,166.75,z-.5],[x,166.75,z+.22],.12,metal,10);
    box([x,166.75,z+.18],[1.1,.25,.15],metal,'Ramp wing fastener');
  }
  // Passenger-side front wheel stop; the published overall length includes it.
  for(const sign of [-1,1]){
    box([65.2,cy+sign*3.45,z+4.7],[3.5,.18,9.4],steel,'Wheel-stop support plate');
    for(const x of [64,66.4])bolt(x,cy+sign*3.6,z+.7,'y');
  }
  tube([[63.2,cy-3.45,z+8.5],[69.6,cy-3.45,-80.545],[72.5,cy-2.6,-80.545],[73.375,cy,-80.545],[72.5,cy+2.6,-80.545],[69.6,cy+3.45,-80.545],[63.2,cy+3.45,z+8.5]],.375,steel,'Front wheel-stop hoop');
  // Adjustable rocking cradle, shown unloaded. Fine pivot positions are estimated.
  const cradleCurve=new T.CatmullRomCurve3([V(47,0,z+8),V(50,0,z+2.2),V(53.5,0,z+1),V(57,0,z+4.5)],false,'catmullrom',.3);
  const pts=cradleCurve.getPoints(28);
  for(const sign of [-1,1]){
    const pos=[],idx=[];for(let k=0;k<pts.length;k++)for(const edge of [-1,1])pos.push(pts[k].x,cy+sign*2.7+edge*.325,pts[k].z);
    for(let k=0;k<pts.length-1;k++){const a=k*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);}
    const cg=new T.BufferGeometry();cg.setAttribute('position',new T.Float32BufferAttribute(pos,3));cg.setIndex(idx);cg.computeVertexNormals();add(cg,steel,'Open wheel cradle contact band');
    tube(pts.map(p=>[p.x,cy+sign*3.025,p.z]),.07,steel,'Cradle band edge');
    box([51,cy+sign*3.25,z+1.5],[6,.15,3],steel,'Cradle pivot cheek');bolt(51,cy+sign*3.5,z+1,'y',.28);
  }
  for(const p of [pts[0],pts.at(-1)])box([p.x,cy,p.z],[.55,6.1,.55],steel,'Cradle transverse brace');

  // Batch each assembly independently so hiding the carrier leaves the receiver.
  for(const assembly of [receiver,carrier]){
    const buckets=new Map();for(const o of [...assembly.children]){const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;let b=buckets.get(o.material);if(!b){b={p:[],n:[],i:[],count:0};buckets.set(o.material,b);}b.p.push(...p.array);b.n.push(...n.array);const ind=o.geometry.index;if(ind)for(const v of ind.array)b.i.push(v+b.count);else for(let k=0;k<p.count;k++)b.i.push(k+b.count);b.count+=p.count;o.geometry.dispose();assembly.remove(o);}
    target=assembly;for(const [mat,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);add(g,mat,assembly.name+' · '+mat.name);}
  }
  group.userData={spec:CARRIER_SPEC,receiverBounds:new T.Box3().setFromObject(receiver),carrierBounds:new T.Box3().setFromObject(carrier)};
  return {group,receiver,carrier,materials};
}
