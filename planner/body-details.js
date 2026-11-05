import * as T from './vendor/three.module.js';

export const BODY_DETAILS_SPEC={
 revision:'owner-closeups-1',units:'in',status:'photo-estimated',
 powerInlet:{side:'driver rear quarter',centerY:132,centerZ:-68.8,width:4.6,height:5.1,projection:.8,appearance:'Black round hinged inlet cover with shaped center latch and small green indicator; two warning labels above',electricalRating:'Not inferred from visual geometry'},
 acOutlet:{side:'passenger rear quarter',centerY:144,centerZ:-69.1,width:4.6,height:2.9,projection:.42,appearance:'Closed black rectangular cover with upper hinge and two lower grip tabs'},
 traction:{brand:'MAXTRAX',installedModel:null,referenceFamily:'XTREME-like alloy teeth; exact model not confirmed',referenceSource:'https://www.dometic.com/en-us/product/maxtrax-xtreme',referenceDimensions:{length:1150/25.4,width:330/25.4,stackedPairDepth:85/25.4,status:'manufacturer family reference, installed product unverified'},installation:{side:'passenger rear door',centerX:54.9,centerZ:-57,doorPlaneY:156.8,standOff:.9,depictedCount:2,countStatus:'nested pair inferred; confirm'},mounting:'Owner reports magnetic mounting. Four dark round contact pads, variable-length spacers and pin hardware are visual estimates, not identified/rated mounts.',appearance:'Pale olive/sand boards, sculpted ribbed face, six carry slots, alloy-colored traction teeth and dark locking pins'},
 rearDetails:'Original hinge recesses, fasteners and parking-sensor outlines; no identifying plate text or photographic textures.',
 limits:'Photo references establish appearance and side assignment, not dimensions or physical clearance. Magnetic retention, load rating, door sweep and motorcycle/board gaps are not validated. Utility covers are closed visual features; no electrical operation modeled.',
 geometryLicense:'Original MIT geometry. No private images or identifying metadata redistributed.'
};

export function buildBodyDetails(shell){
 const group=new T.Group(),ports=new T.Group(),traction=new T.Group();group.name='Owner exterior close-up details';ports.name='Shore inlet and passenger AC outlet';traction.name='Magnet-mounted MAXTRAX · visual estimate';group.add(ports,traction);
 const materials={},buckets=new Map(),V=(...p)=>new T.Vector3(...p);
 function mat(name,color,m=0,r=.6){return materials[name]=new T.MeshStandardMaterial({name,color,metalness:m,roughness:r,side:T.DoubleSide});}
 const black=mat('Utility cover molded charcoal','#202525',.08,.58),seal=mat('Utility gasket and recess','#0c1416',0,.85),highlight=mat('Utility molded edge','#48504e',.18,.48),metal=mat('Exterior closeup fasteners','#afb7b5',.8,.23),cream=mat('Traction board pale olive nylon','#b3b5a0',.02,.69),inner=mat('Traction board rib shadows','#8d9380',.04,.74),paper=mat('Utility label off-white','#deded4',0,.8),orange=mat('Utility warning header','#dba139',0,.62),green=mat('Inlet latch green detail','#9ab650',0,.6);
 let target=ports;
 function add(g,m){if(!g.attributes.normal)g.computeVertexNormals();const key=target.name+m.uuid;let b=buckets.get(key);if(!b){b={target,m,p:[],n:[],i:[],count:0};buckets.set(key,b);}for(const v of g.attributes.position.array)b.p.push(v);for(const v of g.attributes.normal.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let k=0;k<g.attributes.position.count;k++)b.i.push(k+b.count);b.count+=g.attributes.position.count;g.dispose();}
 function box(c,size,m){const g=new T.BoxGeometry(...size);g.translate(...c);add(g,m);}
 function cyl(a,b,r,m,n=12,r2=r){const av=V(...a),bv=V(...b),d=bv.clone().sub(av),g=new T.CylinderGeometry(r2,r,d.length(),n);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(g,m);}
 function rr(w,h,r){const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
 const hp=[];for(const o of shell.children){if(!o.isMesh||o.userData.sleepingFlare||!o.material?.name.startsWith('Blue-gray paint'))continue;const a=o.geometry.attributes.position,idx=o.geometry.index;for(let j=0;j<idx.count;j+=3){const ii=[idx.getX(j),idx.getX(j+1),idx.getX(j+2)];if(ii.some(k=>a.getY(k)>123&&a.getY(k)<150&&a.getZ(k)>-77&&a.getZ(k)<-59))for(const k of ii)hp.push(a.getX(k),a.getY(k),a.getZ(k));}}const hg=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(hp,3)),hm=new T.MeshBasicMaterial({side:T.DoubleSide}),host=new T.Mesh(hg,hm),hosts=[host],ray=new T.Raycaster();host.updateMatrixWorld(true);
 function projectPort(sign,cy,cz,shape,depth,offset,m){const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:8}),a=g.attributes.position,cache=new Map();for(let k=0;k<a.count;k++){const y=cy+a.getX(k),z=cz+a.getY(k),key=y.toFixed(5)+','+z.toFixed(5);let x=cache.get(key);if(x===undefined){ray.set(V(30+sign*100,y,z),V(-sign,0,0));const hit=ray.intersectObjects(hosts,false)[0];if(!hit)throw Error('Missing utility cover body surface');x=hit.point.x;cache.set(key,x);}a.setXYZ(k,x+sign*(offset+a.getZ(k)),y,z);}g.computeVertexNormals();add(g,m);}
 const inlet=BODY_DETAILS_SPEC.powerInlet,outlet=BODY_DETAILS_SPEC.acOutlet;
 const side=(s,c,shape,d,o,m)=>projectPort(s,c.centerY,c.centerZ,shape,d,o,m);
 side(-1,inlet,rr(4.6,5.1,2.15),.1,.035,seal);side(-1,inlet,rr(4.36,4.8,2.05),.18,.135,highlight);side(-1,inlet,rr(4.12,4.6,1.95),.32,.31,black);
 const latch=new T.Shape([[-.7,2.1],[.7,2.1],[1.1,1.3],[.7,.6],[.35,.25],[.55,-.5],[1.15,-1.5],[.75,-2],[-.75,-2],[-1.15,-1.5],[-.55,-.5],[-.35,.25],[-.7,.6],[-1.1,1.3]].map(p=>new T.Vector2(...p)));
 side(-1,inlet,latch,.12,.65,highlight);side(-1,inlet,rr(1.1,.8,.17),.03,.79,black);
 for(let j=0;j<3;j++)projectPort(-1,inlet.centerY,inlet.centerZ+1.3-j*.2,rr(.85-j*.12,.07,.025),.025,.8,j===2?green:black);
 projectPort(-1,inlet.centerY,inlet.centerZ+2.65,rr(1.8,.46,.15),.32,.16,black);
 for(const [z,h] of [[inlet.centerZ+4,1.8],[inlet.centerZ+6,1.7]]){projectPort(-1,inlet.centerY,z,rr(3.25,h,.04),.012,.03,paper);projectPort(-1,inlet.centerY,z+h/2-.23,rr(3,.34,.02),.012,.05,orange);for(let j=0;j<4;j++)projectPort(-1,inlet.centerY,z+.2-j*.22,rr(2.7-(j%2)*.35,.035,.01),.01,.05,highlight);}
 side(1,outlet,rr(4.6,2.9,.22),.1,.035,seal);side(1,outlet,rr(4.35,2.65,.15),.27,.14,black);projectPort(1,outlet.centerY,outlet.centerZ+1.38,rr(4.5,.22,.08),.19,.16,highlight);
 for(const dy of [-1.4,1.4])projectPort(1,outlet.centerY+dy,outlet.centerZ-1.05,rr(.7,.15,.04),.08,.41,highlight);
 hg.dispose();hm.dispose();
// Rear parking sensor rings and hinge screw recesses remain on the body.
 target=group;
 const rearRay=new T.Raycaster(),contacts=[];shell.updateMatrixWorld(true);
 function rearSurface(x,z){rearRay.set(V(x,190,z),V(0,-1,0));const hit=rearRay.intersectObject(shell,true)[0];if(!hit)throw Error('Missing rear attachment surface');return hit.point.y;}
 for(const x of [-1,17,43,61]){const y=rearSurface(x,-87.7);contacts.push({type:'sensor',x,z:-87.7,hostY:y,backY:y+.02});cyl([x,y+.02,-87.7],[x,y+.12,-87.7],.52,black,24);cyl([x,y+.13,-87.7],[x,y+.16,-87.7],.37,highlight,24);}
 // Pair of nested recovery boards. Body contact pads are depiction only.
 target=traction;const spec=BODY_DETAILS_SPEC.traction,i=spec.installation,w=spec.referenceDimensions.width,l=spec.referenceDimensions.length;
 const backY=i.doorPlaneY+i.standOff;
 for(const x of [i.centerX-4.6,i.centerX+4.6])for(const z of [i.centerZ-12.5,i.centerZ+12.5]){const y=rearSurface(x,z);contacts.push({type:'magnetic-pad',x,z,hostY:y,backY:y+.025});cyl([x,y+.025,z],[x,y+.42,z],1.58,black,24);cyl([x,y+.42,z],[x,backY+.3,z],.5,metal,12);}
 function boardShape(){const s=new T.Shape();s.moveTo(-w/2+1.5,-l/2);s.lineTo(w/2-1.5,-l/2);s.quadraticCurveTo(w/2-.4,-l/2,w/2,-l/2+4);s.lineTo(w/2,l/2-4);s.quadraticCurveTo(w/2-.4,l/2,w/2-1.5,l/2);s.lineTo(-w/2+1.5,l/2);s.quadraticCurveTo(-w/2+.4,l/2,-w/2,l/2-4);s.lineTo(-w/2,-l/2+4);s.quadraticCurveTo(-w/2+.4,-l/2,-w/2+1.5,-l/2);for(const x of [-w/2+1.25,w/2-1.25])for(const z of [-14.8,0,14.8]){const pts=rr(.9,4.7,.42).getPoints(8).map(p=>new T.Vector2(p.x+x,p.y+z));s.holes.push(new T.Path(pts));}return s;}
 function face(shape,y,depth,m,bevel=.08){const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,curveSegments:8});g.rotateX(Math.PI/2);g.translate(i.centerX,y+depth,i.centerZ);add(g,m);}
 face(boardShape(),backY+.2,.28,inner);face(boardShape(),backY+.75,.38,cream);
 // Sculpted central channels and raised longitudinal ribs, with tapered ends.
 for(const x of [-3,0,3]){const s=new T.Shape([[-.68,-18],[.68,-18],[1,0],[.68,18],[-.68,18],[-1,0]].map(p=>new T.Vector2(p[0]+x,p[1])));face(s,backY+1.1,.24,inner,.18);}
 const faceY=backY+1.48;
 for(let row=0;row<22;row++){const z=i.centerZ-l/2+2+row*(l-4)/21;for(const [k,dx] of [-4.1,-1.35,1.35,4.1].entries()){const x=i.centerX+dx,yy=faceY+.12*((row+k)%2);cyl([x,yy-.2,z],[x,yy+.26,z],.43,cream,10,.32);cyl([x,yy+.26,z],[x,yy+.52,z],.27,metal,8,.18);}}
 for(const x of [i.centerX-4.8,i.centerX+4.8])for(const z of [i.centerZ-9.8,i.centerZ+9.8]){cyl([x,faceY,z],[x,faceY+.55,z],.4,black,12);box([x,faceY+.63,z],[1.25,.25,.38],black);cyl([x,faceY+.76,z],[x,faceY+.83,z],.12,metal,6);}
 for(const b of buckets.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const m=new T.Mesh(g,b.m);m.name=b.m.name;m.castShadow=true;m.receiveShadow=true;b.target.add(m);}
 traction.userData={action:'rear-passenger-door',spec:BODY_DETAILS_SPEC.traction,bounds:new T.Box3().setFromObject(traction)};ports.userData.bounds=new T.Box3().setFromObject(ports);group.userData.spec=BODY_DETAILS_SPEC;group.userData.attachmentContacts=contacts;
 return {group,ports,traction,materials};
}
