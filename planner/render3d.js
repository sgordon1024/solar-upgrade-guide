import * as T from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
// Original geometry traced by visual reference, not a scan or a dimensional survey.
// World units: inches; X passengerward, Y rearward, Z upward, roof datum Z=0.
const $=s=>document.querySelector(s), canvas=$('#scene'), status=$('#render-status');
T.Object3D.DEFAULT_UP.set(0,0,1);
const scene=new T.Scene(), body=new T.Group(), equipment=new T.Group(), boundary=new T.Group(), labels=new T.Group(), rearGear=new T.Group();
scene.add(body,equipment,boundary,labels);body.add(rearGear);
const mats={};
function mat(name,color,metalness=0,roughness=.6){return mats[name]=new T.MeshStandardMaterial({color,metalness,roughness,side:T.DoubleSide});}
const paint=mat('paint','#829ba5',.35,.31),dark=mat('dark','#20262b',.15,.5),rubber=mat('rubber','#14181b',0,.88),glass=mat('glass','#172b32',.4,.17),chrome=mat('chrome','#b9c4c7',.8,.22),lamp=mat('lamp','#e6eee7',.3,.2),red=mat('red','#a50c1e',.2,.3),rim=mat('rim','#333a3d',.6,.4),solar=mat('solar','#162c4d',.35,.3),bag=mat('bag','#424a50',0,.95),orange=mat('orange','#ee561e',.1,.45),white=mat('white','#dce3de',.1,.4);
let renderer,controls,camera,mode='orbit',current,selected,anim=0;
const V=(x,y,z)=>new T.Vector3(x,y,z);
function mesh(g,m,p=[0,0,0],group=body){const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
function box(x,y,z,w,l,h,m=dark,g=body){return mesh(new T.BoxGeometry(w,l,h),m,[x+w/2,y+l/2,z+h/2],g);}
function tube(points,r,m=dark,g=body){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p))),Math.max(8,points.length*5),r,8,false),m,[0,0,0],g);}
function cylinder(a,b,r,m=dark,g=body,r2=r){const av=V(...a),bv=V(...b),d=bv.clone().sub(av);const o=mesh(new T.CylinderGeometry(r2,r,d.length(),20),m,av.clone().add(bv).multiplyScalar(.5).toArray(),g);o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return o;}
function polygon(points,m,g=body){const shape=new T.Shape(points.map(p=>new T.Vector2(p[0],p[1])));return mesh(new T.ShapeGeometry(shape,24),m,[0,0,0],g);}
function surface(points,m,g=body){const geo=new T.BufferGeometry();const pos=[],ids=[];points.forEach(p=>pos.push(...p));for(let i=1;i<points.length-1;i++)ids.push(0,i,i+1);geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(ids);geo.computeVertexNormals();return mesh(geo,m,[0,0,0],g);}
function roundedShape(w,h,r){const s=new T.Shape();s.moveTo(r,0);s.lineTo(w-r,0);s.quadraticCurveTo(w,0,w,r);s.lineTo(w,h-r);s.quadraticCurveTo(w,h,w-r,h);s.lineTo(r,h);s.quadraticCurveTo(0,h,0,h-r);s.lineTo(0,r);s.quadraticCurveTo(0,0,r,0);return s;}
function panel(x,y,z,w,h,m=glass,side=true,g=body,r=3){const geo=new T.ShapeGeometry(roundedShape(w,h,r),12);const a=geo.attributes.position;for(let i=0;i<a.count;i++){const u=a.getX(i),v=a.getY(i);a.setXYZ(i,side?x:x+u,side?y+u:y,z+v);}geo.computeVertexNormals();return mesh(geo,m,[0,0,0],g);}
function label(text,p,width=40,g=labels){const c=document.createElement('canvas');c.width=256;c.height=54;const q=c.getContext('2d');q.fillStyle='#f6f2e7';q.fillRect(0,0,256,54);q.fillStyle='#23392e';q.font='600 28px system-ui';q.textAlign='center';q.textBaseline='middle';q.fillText(text,128,27,244);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false,transparent:true}));s.position.set(...p);s.scale.set(width,width*54/256,1);s.renderOrder=10;g.add(s);return s;}
function torus(p,r,t,m=dark,axis='x',g=body){const o=mesh(new T.TorusGeometry(r,t,10,48),m,p,g);if(axis==='x')o.rotation.y=Math.PI/2;else if(axis==='y')o.rotation.x=Math.PI/2;return o;}
function wheel(x,y,z=-88,r=16,g=body,axis='x'){
 const a=axis==='x'?[x-4,y,z]:[x,y-4,z],b=axis==='x'?[x+4,y,z]:[x,y+4,z];cylinder(a,b,r,rubber,g);
 for(const sign of [-1,1]){const p=axis==='x'?[x+sign*4.15,y,z]:[x,y+sign*4.15,z];torus(p,r-2.2,1.4,rubber,axis,g);torus(p,r*.56,.8,rim,axis,g);
 const end=axis==='x'?[p[0]+sign*.35,y,z]:[x,p[1]+sign*.35,z];cylinder(p,end,r*.54,rim,g);
 for(let k=0;k<6;k++){const t=k*Math.PI/3;const pp=axis==='x'?[end[0],y+Math.cos(t)*r*.48,z+Math.sin(t)*r*.48]:[x+Math.cos(t)*r*.48,end[1],z+Math.sin(t)*r*.48];cylinder(end,pp,1.4,rim,g);}
 const cap=axis==='x'?[end[0]+sign*.4,y,z]:[x,end[1]+sign*.4,z];cylinder(end,cap,3,dark,g);
 }
 // Alternating raised tread blocks give the all-terrain tires their visible silhouette.
 for(let k=0;k<36;k++){const a=k*Math.PI*2/36;for(const s of [-1,1]){const p=axis==='x'?[x+s*2.5,y+Math.cos(a)*r,z+Math.sin(a)*r]:[x+Math.cos(a)*r,y+s*2.5,z+Math.sin(a)*r];const o=mesh(new T.BoxGeometry(axis==='x'?3.5:2.7,axis==='x'?2.7:3.5,1.3),rubber,p,g);if(axis==='x')o.rotation.x=a-Math.PI/2;else o.rotation.y=Math.PI/2-a;}}
}
function buildBody(){
 // Curved upper shell: rounded roof shoulders and a swept cab, with separate wheel-arch side skins.
 const stations=[[-68,-53,36],[-64,-48,38],[-57,-44,40],[-48,-42,41],[-38,-29,41],[-26,-14,40],[-14,-5,39],[-2,-1,38],[10,0,38],[50,0,38],[100,0,38],[148,-1,38],[158,-3,37],[166,-8,35]];
 const pos=[],indices=[],N=23;
 for(const [y,top,hw] of stations){for(let j=0;j<N;j++){const a=j/(N-1)*Math.PI;const x=30-Math.cos(a)*hw;const z=top-(Math.pow(Math.abs(Math.cos(a)),8))*(Math.min(60,60+top));pos.push(x,y,z);}}
 for(let i=0;i<stations.length-1;i++)for(let j=0;j<N-1;j++){const a=i*N+j;indices.push(a,a+N,a+1,a+1,a+N,a+N+1);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,paint);
 for(const x of [-11,71]){
  const shape=new T.Shape();shape.moveTo(-68,-59);shape.lineTo(166,-59);shape.lineTo(166,-85);shape.lineTo(130,-85);for(let k=0;k<=32;k++){const a=k/32*Math.PI;shape.lineTo(108+22*Math.cos(a),-88+22*Math.sin(a));}shape.lineTo(-14,-85);for(let k=0;k<=32;k++){const a=k/32*Math.PI;shape.lineTo(-36+22*Math.cos(a),-88+22*Math.sin(a));}shape.lineTo(-68,-85);shape.closePath();
  const g=new T.ShapeGeometry(shape,32),a=g.attributes.position;for(let i=0;i<a.count;i++){const y=a.getX(i),z=a.getY(i);a.setXYZ(i,x,y,z);}g.computeVertexNormals();mesh(g,paint);
  // Black protective side molding, interrupted by the wheel openings.
  for(const [y,l] of [[-67,9],[-13,99],[130,35]])box(x-.3,y,-76,.6,l,7,dark);
  for(const y of [-36,108]){const pts=[];for(let k=0;k<=32;k++){const a=k/32*Math.PI;pts.push([x,y+22*Math.cos(a),-88+22*Math.sin(a)]);}tube(pts,1.1,paint);}
 }
 // Front face and hood; the recognizable inset grille, chrome rails and lamp clusters.
 panel(-8,-68.3,-82,76,30,paint,false,body,8);panel(5,-69,-72,50,19,dark,false,body,6);
 for(let j=0;j<3;j++)tube([[7,-69.5,-69+j*6],[30,-70.4,-70+j*6],[53,-69.5,-69+j*6]],.5,chrome);
 torus([30,-71,-62],6.3,.6,chrome,'y');for(let k=0;k<3;k++){const a=k*Math.PI*2/3+Math.PI/2;cylinder([30,-71.6,-62],[30+5.6*Math.cos(a),-71.6,-62+5.6*Math.sin(a)],.48,chrome);}
 for(const x of [-8,57]){panel(x,-68.7,-62,11,9,lamp,false,body,2);for(let k=0;k<3;k++)cylinder([x+2+k*3,-69,-60],[x+2+k*3,-69,-55],.25,chrome);}
 panel(-10,-69,-84,80,11,dark,false,body,4);panel(12,-69.7,-82,36,5,rubber,false,body,1);box(23,-71,-85,14,1,7,dark);
 for(const x of [-4,64]){cylinder([x,-69.2,-78],[x,-70,-78],2.5,chrome);cylinder([x,-70.1,-78],[x,-70.3,-78],1.7,lamp);}
 // Windscreen lies just above the shell, with broad dark surround.
 surface([[-3,-48.5,-40],[63,-48.5,-40],[61,-21,-9],[-1,-21,-9]],dark);
 surface([[0,-47.9,-39],[60,-47.9,-39],[58,-22,-10],[2,-22,-10]],glass);
 
 for(const x of [8,35])tube([[x,-48.8,-39],[x+8,-49.1,-38.7],[x+20,-48.6,-39]],.32,rubber);
 for(const x of [-2,50]){box(x,-53,-42.7,12,3,.4,dark);for(let k=0;k<6;k++)box(x+1+k*1.7,-53.1,-42.1,.5,2.8,.15,rim);}
 tube([[-4,-63,-46],[30,-64,-45],[64,-63,-46]],1.1,dark);
 // Side glass and asymmetric camper panels from the supplied side photographs.
 for(const [x,sgn]of [[-11.15,-1],[71.15,1]]){
  surface([[x,-45,-42],[x,-24,-15],[x,-4,-15],[x,-4,-45]],dark);
  surface([[x+sgn*.2,-41,-40],[x+sgn*.2,-23,-17],[x+sgn*.2,-6,-17],[x+sgn*.2,-6,-43]],glass);
  tube([[x,-1,-17],[x,-1,-84]],.18,dark);panel(x+sgn*.2,-17,-51,10,2.5,dark,true,body,1.2);
  cylinder([x,-34,-39],[x+sgn*7,-35,-36],.9,dark);box(x+sgn*8-(sgn<0?4:0),-40,-41,4,10,14,dark);
  cylinder([x,-7,-91],[x,91,-91],1.7,dark);for(let j=0;j<8;j++)box(x-2,1+j*10,-89.8,4,7,.5,rim);
  tube([[x,4,-12],[x,153,-12]],.15,paint);
 }
 panel(-11.4,5,-49,65,31,dark);panel(-11.6,7,-47,61,27,glass);panel(-11.8,16,-39,17,18,dark);panel(-12,17,-38,15,16,glass);
 panel(-11.4,78,-49,72,31,paint);panel(-11.8,108,-36,25,12,dark);panel(-12,109,-35,23,10,glass);
 panel(71.4,6,-49,65,31,dark);panel(71.6,8,-47,61,27,glass);panel(71.8,19,-40,18,18,dark);panel(72,20,-39,16,16,glass);
 panel(71.4,75,-49,76,31,dark);panel(71.6,77,-47,72,27,paint);
 tube([[72,2,-84],[72,2,-10],[72,74,-10],[72,74,-84]],.18,dark);box(71.7,75,-51,.6,75,.7,chrome);
 for(const x of [-11.8,71.8])panel(x,8,-54,10,2,dark,true,body,1);
 panel(-11.8,58,-70,12,15,paint);panel(-12,59,-69,10,13,rim);panel(-12.2,59.7,-68.3,8.6,11.6,paint);
 for(const y of [86,136])cylinder([-11.5,y,-65],[-12.3,y,-65],1.8,dark);
 // Rear split doors, glazing, tall lamps, hinges and step.
 panel(-7,166.2,-83,74,74,paint,false,body,7);panel(-4,166.6,-61,68,37,dark,false,body,5);
 tube([[30,167,-10],[30,167,-82]],.23,dark);box(-8,166.9,-79,3,1,25,red);box(65,166.9,-79,3,1,25,red);
 box(23,167,-9,14,1,1.3,red);for(const x of [-8,66])for(const z of [-25,-69])box(x,166.5,z,3,2,3,chrome);
 box(-9,165,-87,78,7,5,dark);box(13,171,-87,34,8,2,rim);
 for(const x of [-13,73])for(const y of [-36,108])wheel(x,y);
 // Rack silhouette, awning, front LED bar and driver-side ladder. Estimates only.
 for(const x of [-1,61])for(const z of [3,7])box(x,-5,z,1.2,151,1.2,dark);
 for(const y of [-5,24,52,84,116,145])box(-1,y,5.5,63,2,1,dark);
 for(const x of [-1,61])for(const y of [0,40,80,120,145])box(x,y,0,1.5,2,7,dark);
 surface([[-2,-9,2],[62,-9,2],[62,-5,10],[-2,-5,10]],dark);box(2,-9.5,5,56,1.5,3,dark);
 for(let j=0;j<40;j++)box(3+j*1.35,-9.7,5.5,.8,.2,1.8,lamp);
 cylinder([66,-5,5],[66,146,5],2.6,dark);box(63,-5,2,7,151,2,dark);
 for(const y of [81,94])tube([[-14,y,-86],[-14,y,3],[-5,y,7]],.8,dark);for(let z=-82;z<6;z+=12)cylinder([-14,81,z],[-14,94,z],.65,dark);
 for(const x of [41,55])tube([[x,168,-22],[x,168,9],[x,145,9]],.65,dark);for(const z of [-20,-8,4])cylinder([41,168,z],[55,168,z],.65,dark);
 cylinder([8,-12,6],[8,-12,34],.14,dark);cylinder([49,-6,7],[49,-6,19],.12,dark);
 // Roof ribs are visual body detail and do not alter the roof datum.
 for(const x of [10,20,30,40,50])tube([[x,0,.5],[x,75,.5],[x,149,-.5]],.28,paint);
 buildGear();
}
function buildGear(){
 wheel(12,175,-61,16,rearGear,'y');tube([[-7,168,-43],[9,174,-64],[-7,168,-83]],1.3,dark,rearGear);
 box(-10,179,-94,84,26,2,dark,rearGear);for(let x=-8;x<74;x+=7)box(x,179,-92,1,26,.5,rim,rearGear);
 box(25,168,-95,7,38,4,dark,rearGear);
 // Parked motorcycle silhouette based on the rear photo; transport envelope is unmeasured.
 for(const x of [-1,63])wheel(x,194,-78,12,rearGear,'y');
 tube([[-1,194,-78],[21,194,-59],[43,194,-64],[-1,194,-78]],.8,chrome,rearGear);
 tube([[21,194,-59],[29,194,-45],[48,194,-43],[43,194,-64],[21,194,-59]],1,orange,rearGear);
 for(const y of [191,197])cylinder([63,y,-78],[48,y,-39],1,chrome,rearGear);
 box(3,190,-47,37,8,2,dark,rearGear);box(-8,189,-46,18,10,1,orange,rearGear);
 surface([[20,189,-49],[40,189,-48],[34,189,-61],[18,189,-56]],white,rearGear);
 surface([[36,189,-48],[47,189,-44],[43,189,-57],[34,189,-61]],orange,rearGear);
 box(47,189,-49,26,10,1,orange,rearGear);cylinder([48,194,-39],[46,194,-34],.7,dark,rearGear);cylinder([46,186,-34],[46,202,-34],.7,dark,rearGear);
 cylinder([26,190,-61],[26,198,-61],7,rim,rearGear);cylinder([1,198,-53],[16,198,-57],2.4,chrome,rearGear);
 for(const x of [-1,63])for(let k=0;k<12;k++){const a=k*Math.PI/6;cylinder([x,189.7,-78],[x+10*Math.cos(a),189.7,-78+10*Math.sin(a)],.12,chrome,rearGear);}
}
function clear(g){while(g.children.length){const o=g.children[0];g.remove(o);o.traverse(n=>{n.geometry?.dispose();if(n.material&&!Object.values(mats).includes(n.material)){n.material.map?.dispose();n.material.dispose();}});}}
function update(s,id){current=s;selected=id;clear(equipment);clear(labels);clear(boundary);
 for(const i of s.items){const w=i.rotation===90?i.length:i.width,l=i.rotation===90?i.width:i.length;const g=new T.Group();equipment.add(g);
  const m=i.kind==='solar'?solar:i.kind==='starlink'?white:i.kind==='custom'?bag:dark;
  if(['ac','starlink','fan'].includes(i.kind)){mesh(new T.ExtrudeGeometry(roundedShape(w,l,Math.min(w,l)*.12),{depth:i.height,bevelEnabled:false,curveSegments:12}),m,[i.x,i.y,i.z],g);}else if(i.kind==='custom'){const shell=mesh(new T.SphereGeometry(1,24,16),m,[i.x+w/2,i.y+l/2,i.z+i.height/2],g);shell.scale.set(w/2,l/2,i.height/2);}else box(i.x,i.y,i.z,w,l,i.height,m,g);
  if(i.kind==='solar'){for(const x of [i.x,i.x+w-.5])box(x,i.y,i.z+i.height,.5,l,.15,chrome,g);for(const y of [i.y,i.y+l-.5])box(i.x,y,i.z+i.height,w,.5,.15,chrome,g);for(let j=1;j<6;j++)box(i.x+j*w/6,i.y+.5,i.z+i.height+.1,.07,l-1,.04,chrome,g);for(let j=1;j<10;j++)box(i.x+.5,i.y+j*l/10,i.z+i.height+.1,w-1,.07,.04,chrome,g);}
  if(i.kind==='fan'){box(i.x+w*.12,i.y+l*.12,i.z+i.height,w*.76,l*.76,.3,glass,g);}
  if(i.kind==='ac'){for(let k=1;k<16;k++)box(i.x+w*.12,i.y+l*.5+k*l*.025,i.z+i.height+.05,w*.76,.3,.1,rim,g);}
  if(i.kind==='custom'){for(const x of [i.x+w*.2,i.x+w*.8])box(x,i.y,i.z+i.height+.1,.5,l,.2,dark,g);}
  const c=i.dimensionStatus==='estimated'||i.positionStatus==='estimated'?0xd6a461:i.dimensionStatus==='manufacturer'||i.positionStatus==='manufacturer'?0x82b9de:0x81b6a4;
  const edge=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(w,l,i.height)),new T.LineBasicMaterial({color:i.id===id?0xffd79a:c,transparent:true,opacity:i.id===id?1:.45}));edge.position.set(i.x+w/2,i.y+l/2,i.z+i.height/2);g.add(edge);
  label(i.name.replace(' · photo estimate','').replace(' · driver side','').replace('Solar · front driver','Solar 1').replace('Solar · front passenger','Solar 2').replace('Solar · rear driver','Solar 3').replace('Solar · rear passenger','Solar 4').replace(' · centerline',''),[i.x+w/2,i.y+l/2,i.z+i.height+5],Math.min(43,Math.max(25,w+8)));
 }
 const points=[[0,0,.8],[s.roof.width,0,.8],[s.roof.width,s.roof.length,.8],[0,s.roof.length,.8],[0,0,.8]];
 boundary.add(new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>V(...p))),new T.LineBasicMaterial({color:0xe4ae67})));
 for(let x=0;x<=s.roof.width;x+=12)boundary.add(new T.Line(new T.BufferGeometry().setFromPoints([V(x,0,.5),V(x,s.roof.length,.5)]),new T.LineBasicMaterial({color:0x9cb2a1,transparent:true,opacity:.35})));
 for(let y=0;y<=s.roof.length;y+=12)boundary.add(new T.Line(new T.BufferGeometry().setFromPoints([V(0,y,.5),V(s.roof.width,y,.5)]),new T.LineBasicMaterial({color:0x9cb2a1,transparent:true,opacity:.35})));
 label('FRONT',[s.roof.width/2,-8,1],18,boundary);label(`${s.roof.width} × ${s.roof.length} in · ${s.roof.status}`,[s.roof.width/2,s.roof.length+10,1],53,boundary);
 boundary.visible=mode==='top'||$('#show-envelope').checked;labels.visible=$('#show-labels').checked;requestRender();
}
function requestRender(){if(!renderer)return;if(mode==='top'){camera.up.set(0,1,0);camera.lookAt(controls.target);}else {camera.up.set(0,0,1);camera.lookAt(controls.target);}renderer.render(scene,camera);}
function preset(v,immediate=false){mode=v;cancelAnimationFrame(anim);for(const n of ['orbit','top','side','passenger','rear'])$('#'+n).setAttribute('aria-pressed',String(n===v));
 const center=v==='top'?V(current.roof.width/2,-current.roof.length/2,0):V(30,65,-40);
 const end=v==='top'?center.clone().add(V(0,-.001,400)):v==='side'?center.clone().add(V(-420,0,0)):v==='passenger'?center.clone().add(V(420,0,0)):v==='rear'?center.clone().add(V(0,420,0)):center.clone().add(V(-270,-340,220));
 body.visible=v!=='top';ground.visible=v!=='top';boundary.visible=v==='top'||$('#show-envelope').checked;controls.enableRotate=v!=='top';for(const g of [equipment,labels,boundary])g.scale.y=v==='top'?-1:1;camera.zoom=1;camera.updateProjectionMatrix();
 const from=camera.position.clone(),target=controls.target.clone(),start=performance.now();function step(t){const k=immediate||matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,(t-start)/450),e=1-Math.pow(1-k,3);camera.position.lerpVectors(from,end,e);controls.target.lerpVectors(target,center,e);controls.update();requestRender();if(k<1)anim=requestAnimationFrame(step);}anim=requestAnimationFrame(step);
}
let ground;
try{
 renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 camera=new T.OrthographicCamera(-180,180,180,-180,.1,2000);camera.up.set(0,0,1);
 controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.minZoom=.5;controls.maxZoom=4;controls.maxPolarAngle=Math.PI*.9;controls.enablePan=false;controls.addEventListener('change',requestRender);controls.addEventListener('start',()=>cancelAnimationFrame(anim));
 scene.add(new T.AmbientLight(0xc9e4f4,1.4));const key=new T.DirectionalLight(0xfff4de,3);key.position.set(-140,-180,300);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-220,right:220,top:220,bottom:-220,far:800});key.shadow.bias=-.001;scene.add(key);const fill=new T.DirectionalLight(0xc0d8ff,1.5);fill.position.set(180,150,100);scene.add(fill);
 ground=mesh(new T.PlaneGeometry(1300,1300),new T.ShadowMaterial({opacity:.16}),[30,50,-105],scene);ground.castShadow=false;
 buildBody();window.rooflabView={update};update(window.rooflabState.state,window.rooflabState.selected);
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;const span=mode==='top'?Math.max(current.roof.length+34,(current.roof.width+35)/aspect):mode==='rear'?Math.max(165,140/aspect):mode==='side'||mode==='passenger'?Math.max(180,320/aspect):Math.max(240,280/aspect);camera.left=-span*aspect/2;camera.right=-camera.left;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();requestRender();};
 new ResizeObserver(resize).observe(canvas);resize();preset('orbit',true);
 for(const v of ['orbit','top','side','passenger','rear'])$('#'+v).onclick=()=>{preset(v);resize();};$('#home').onclick=()=>{preset('orbit');resize();};
 for(const [id,m] of [['zoomin',1.15],['zoomout',1/1.15]])$('#'+id).onclick=()=>{camera.zoom=T.MathUtils.clamp(camera.zoom*m,.5,4);camera.updateProjectionMatrix();requestRender();};
 $('#show-envelope').onchange=()=>{boundary.visible=mode==='top'||$('#show-envelope').checked;requestRender();};$('#show-labels').onchange=()=>{labels.visible=$('#show-labels').checked;requestRender();};$('#show-gear').onchange=()=>{rearGear.visible=$('#show-gear').checked;requestRender();};
 canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();if(mode==='top'&&e.key.startsWith('Arrow'))return;cancelAnimationFrame(anim);if(['+','-','='].includes(e.key)){camera.zoom=T.MathUtils.clamp(camera.zoom*(e.key==='-'?1/1.1:1.1),.5,4);camera.updateProjectionMatrix();}else{const offset=camera.position.clone().sub(controls.target);const spherical=new T.Spherical().setFromVector3(V(offset.x,offset.z,offset.y));if(e.key==='ArrowLeft')spherical.theta-=.12;if(e.key==='ArrowRight')spherical.theta+=.12;if(e.key==='ArrowUp')spherical.phi-=.1;if(e.key==='ArrowDown')spherical.phi+=.1;spherical.makeSafe();const p=new T.Vector3().setFromSpherical(spherical);camera.position.copy(controls.target).add(V(p.x,p.z,p.y));controls.update();}requestRender();};
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='3D graphics paused. Reload to restore; your editable layout remains saved.';});
 status.textContent='Photo-informed exterior · all unmeasured contours and rack details are estimates';
}catch(e){status.textContent='3D graphics unavailable on this device. Measurement editing and JSON export still work.';console.error(e);}
