import * as T from './vendor/three.module.js';
// Original reference-informed reconstruction. Inches, X right, Y rear, Z up.
// Reference images are not bundled. These surfaces are estimates, not factory CAD.
export const SHELL_SPEC={revision:'shell-2-overlay-1',units:'in',wheelbase:144,length:234,width:79.5,roofToGround:103,frontAxleY:-36,rearAxleY:108,frontY:-76.5,rearY:157.5,bodyStatus:'estimated',wheelbaseStatus:'owner-reported',referenceCount:33};
export function buildShell(){
 const group=new T.Group();group.name='Sprinter 144 high-roof reference reconstruction';
 const mats={};const material=(name,color,metalness=0,roughness=.5)=>mats[name]=new (name==='Tinted glass'?T.MeshPhysicalMaterial:T.MeshStandardMaterial)({name,color,metalness,roughness,side:T.DoubleSide});
 const paint=material('Blue-gray paint · photo estimate','#829bac',.22,.38),crease=material('Panel seam','#525957',.1,.65),plastic=material('Textured bumper','#24282a',.1,.6),black=material('Recess','#101619',0,.65),rubber=material('Tire rubber','#202426',0,.92),glass=material('Tinted glass','#52656b',.38,.21),chrome=material('Bright metal','#c9d1d3',.95,.19),steel=material('Steel wheels','#a0a8aa',.75,.35),light=material('Headlamp lens','#c6d5da',.65,.16),led=material('LED guides','#e7f2f4',.2,.2),red=material('Red lens','#9e101b',.25,.23),amber=material('Side reflectors','#d89439',.2,.28);
 paint.envMapIntensity=.75;
 glass.clearcoat=1;glass.clearcoatRoughness=.08;glass.envMapIntensity=1.5;
 const V=(x,y,z)=>new T.Vector3(x,y,z);
 function add(geo,mat,name){const o=new T.Mesh(geo,mat);o.name=name||mat.name;o.castShadow=true;o.receiveShadow=false;group.add(o);return o;}
 function patch(fn,nu,nv,mat,name){const pos=[],uv=[],idx=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){pos.push(...fn(i/nu,j/nv));uv.push(i/nu,j/nv);}for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+nu+1;idx.push(a,b,a+1,a+1,b,b+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return add(g,mat,name);}
 function tube(points,r,mat=crease,closed=false,name){const curve=new T.CatmullRomCurve3(points.map(p=>V(...p)),closed,'catmullrom',0);return add(new T.TubeGeometry(curve,Math.max(8,Math.min(256,points.length*2)),r,6,closed),mat,name);}
 function cyl(a,b,r,mat,n=32,r2=r){const av=V(...a),bv=V(...b),d=bv.clone().sub(av);const o=add(new T.CylinderGeometry(r2,r,d.length(),n),mat);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return o;}
 function box(c,size,mat,bevel=.25){const [w,l,h]=size;const shape=new T.Shape();const r=Math.min(bevel,w/2,h/2);shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new T.ExtrudeGeometry(shape,{depth:l,bevelEnabled:false,curveSegments:6});g.rotateX(Math.PI/2);g.translate(...[c[0],c[1]+l/2,c[2]]);return add(g,mat);}
 function smooth(points,t){if(t<=points[0][0])return points[0][1];for(let i=0;i<points.length-1;i++){const[a,b]=[points[i],points[i+1]];if(t<=b[0]){const s=(t-a[0])/(b[0]-a[0]),p=points[Math.max(0,i-1)],n=points[Math.min(points.length-1,i+2)],m0=(b[1]-p[1])/(b[0]-p[0]),m1=(n[1]-a[1])/(n[0]-a[0]);return (2*s**3-3*s*s+1)*a[1]+(s**3-2*s*s+s)*(b[0]-a[0])*m0+(-2*s**3+3*s*s)*b[1]+(s**3-s*s)*(b[0]-a[0])*m1;}}return points.at(-1)[1];}
 const roofProfile=[[-76.5,-62],[-73,-58.5],[-66,-55],[-54,-51],[-42,-47.6],[-39,-45.5],[-11,-18],[0,-9.5],[10,-3],[20,-.6],[36,0],[135,0],[149,-.35],[156,-.8]];
 const widthProfile=[[-76.5,38.6],[-73,36.5],[-64,38.4],[-48,39],[-40,38.7],[-22,37.4],[0,36.2],[20,36],[130,36],[150,36],[156,36]];
 const top=y=>smooth(roofProfile,y),topW=y=>smooth(widthProfile,y);
 const edgeDrop=y=>y<-65?T.MathUtils.lerp(.6,4,(y+76.5)/11.5):y<-40?4:y>15?9:4+(y+40)/55*5;
 function roof(x,y){const u=x/topW(y);return top(y)-edgeDrop(y)*Math.pow(Math.abs(u),10+14*step(-49,-40,y)*(1-step(-12,-1,y)));}
 function roundedRectDistance(x,y,cx,cy,w,h,r){const dx=Math.abs(x-cx)-(w/2-r),dy=Math.abs(y-cy)-(h/2-r);return Math.min(Math.max(dx,dy),0)+Math.hypot(Math.max(dx,0),Math.max(dy,0))-r;}
 const step=(a,b,x)=>{const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
 function sideWidth(y,z,relief=true){const upper=top(y)-edgeDrop(y),v=(z-upper)/(-91-upper);let w=topW(y)+(39.75-topW(y))*Math.sin(Math.min(1,v*1.25)*Math.PI/2);w-=1.1*step(-79,-91,z); // sill taper, below belt
  // Pinched nose and rounded rear corner.
  w-=3.4*(1-step(-76.5,-63,y))*step(-62,-89,z);
  if(relief&&y>19&&y<151){const d=roundedRectDistance(y,z,85,-34,127,32,4.2);w-=.62*(1-step(-.6,1.2,d));w+=.17*Math.exp(-(((z+56.4)/.75)**2));const d2=roundedRectDistance(y,z,85,-12.5,129,3,1.3);w-=.18*(1-step(-.3,.8,d2));}
  return w;
 }
 function wheelBottom(y){let z=-91;for(const axle of [-36,108]){const d=y-axle;if(Math.abs(d)<18.3)z=Math.max(z,-87.8+Math.sqrt(18.3**2-d*d));}return z;}
 // Shared loft joins the roof and both side panels without floating glass planes.
 patch((u,v)=>{const y=-76.5+232.5*v,x=(2*u-1)*topW(y);return [30+x,y,roof(x,y)];},56,200,paint,'Roof, hood and cowl continuous loft');
 for(const sign of [-1,1]){
  patch((u,v)=>{const y=-76.5+232.5*u,z=T.MathUtils.lerp(wheelBottom(y),top(y)-edgeDrop(y),v);return [30+sign*sideWidth(y,z),y,z];},400,60,paint,'Body side with open wheel arches');
  // Molding follows the curved body and stops precisely at each arch opening.
  patch((u,v)=>{const y=-76.5+232.5*u,z=T.MathUtils.lerp(Math.max(-82,wheelBottom(y)),Math.max(-73,wheelBottom(y)),v);return [30+sign*(sideWidth(y,z)+.13),y,z];},470,4,plastic,'Side protective molding');
  const sp=(y,z,offset=.11)=>[30+sign*(sideWidth(y,z)+offset),y,z];
  const seam=(pts,r=.075,mat=crease,closed=false,offset=.16)=>{const dense=[];const pp=closed?[...pts,pts[0]]:pts;for(let k=0;k<pp.length-1;k++){const a=pp[k],b=pp[k+1],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.65);for(let j=0;j<n;j++)dense.push(sp(a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n,offset));}dense.push(sp(...pp.at(-1),offset));return tube(dense,r,mat,closed);};
  patch((u,v)=>{const y=-76.5+38*u,upper=-65-8*step(-60,-38.5,y),bottom=wheelBottom(y),z=T.MathUtils.lerp(bottom,Math.max(bottom,upper),v);return [30+sign*(sideWidth(y,z)+.18),y,z];},90,25,plastic,'Wraparound front bumper');
  for(const axle of [-36,108]){const pts=[];for(let a=0;a<=Math.PI;a+=Math.PI/60){const y=axle+18.4*Math.cos(a),z=-87.8+18.4*Math.sin(a);pts.push(sp(y,z,.14));}tube(pts,.3,paint,false,'Rolled wheel arch lip');}
  // Front door shut line, no additional camper glazing.
  seam([[-26,-40],[-26,-63],[-25,-67],[-20,-72],[-16,-79],[-15,-90],[12,-90],[15,-88],[16,-82],[18,-67],[18,-17],[-1,-18],[-11,-22],[-26,-40]],.07,crease,true);
  const win=[[-32.2,-51.5],[-31,-47],[-10,-23],[-4,-20.4],[9.5,-19.9],[12,-21],[11,-40.5],[8.5,-43.1],[-22,-50.8]];
  curvedFace(win,p=>sp(p[0],p[1],.24),black,'Cab glass gasket',.12);
  const center=[-10,-35];const inset=win.map(p=>[center[0]+(p[0]-center[0])*.952,center[1]+(p[1]-center[1])*.925]);curvedFace(inset,p=>sp(p[0],p[1],.31),glass,'Cab window');
  tube([[-10,-48.4],[-9,-23.8]].map(p=>sp(...p,.4)),.28,plastic);
  // Door handles, mirror stalk and molded mirror shell.
  const h=sp(7,-54,.6);box(h,[.8,8.5,2.1],plastic,.8);tube([sp(4,-53.8,1.1),sp(7,-53.5,1.4),sp(10,-53.8,1.1)],.6,plastic);
  const mount=sp(-25,-49,.3);cyl(mount,[30+sign*42.4,-22,-48],.85,plastic);
  box([30+sign*42.5,-22,-44],[7.3,6.7,12.5],plastic,1.7);box([30+sign*42.5,-18.55,-43.7],[6.5,.25,10.6],glass,.8);box([30+sign*46.05,-23,-48.3],[.17,3,1.1],light,.2);
  for(const y of [17,86,144]){const p=sp(y,-79.1,.25);box(p,[.4,4.1,1.6],amber,.65);}
  // Cargo-panel seam, roof gutter, lower sill and pressed belt crease.
  seam([[20,-8],[20,-90]],.065);
  seam([[80,-7],[80,-90]],.065);
  const gutter=[];for(let y=18;y<151;y+=3)gutter.push(sp(y,-8.8,.06));tube(gutter,.13,paint);
  const sill=[];for(let y=-15;y<88;y+=3)sill.push(sp(y,-89.5,.05));tube(sill,.22,paint);
  // Passenger sliding door aperture and its rearward external guide rail.
  if(sign===1){seam([[20,-9],[78,-9],[80,-14],[80,-89],[20,-89]],.075,crease,true);tube([[80,-50],[116,-50],[149,-50]].map(p=>sp(...p,.21)),.38,paint);tube([[81,-50.4],[149,-50.4]].map(p=>sp(...p,.23)),.09,crease);box(sp(25,-54,.55),[.8,7.5,2.1],plastic,.7);}else{tube([[16,-58],[18,-58],[18,-70],[13,-70],[13,-59],[16,-58]].map(p=>sp(...p)),.08,crease,true);}
 }
 // Surface-triangulated curved panels: each fan vertex is projected onto its host surface.
 function curvedFace(points,project,mat,name,tension=.15){
  const curve=new T.CatmullRomCurve3(points.map(p=>V(p[0],p[1],0)),true,'catmullrom',tension),N=Math.max(32,points.length*6),pts=curve.getPoints(N),cx=points.reduce((s,p)=>s+p[0],0)/points.length,cy=points.reduce((s,p)=>s+p[1],0)/points.length,rings=name==='Rear body closure'?48:16,pos=[...project([cx,cy])],idx=[];
  for(let r=1;r<=rings;r++)for(let j=0;j<N;j++){const x=cx+(pts[j].x-cx)*r/rings,y=cy+(pts[j].y-cy)*r/rings;pos.push(...project([x,y]));if(r===1)idx.push(0,1+j,1+(j+1)%N);else{const a=1+(r-2)*N+j,b=1+(r-1)*N+j,c=1+(r-1)*N+(j+1)%N,d=1+(r-2)*N+(j+1)%N;idx.push(a,b,c,a,c,d);}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return add(g,mat,name);
 }
 // Windscreen is mapped onto the same loft as the cab, avoiding intersections.
 const screen=[[-35.5,-39.5],[-32,-12.7],[-29,-11.5],[29,-11.5],[32,-12.7],[35.5,-39.5],[33.7,-40.4],[-33.7,-40.4]];
 function roofPane(points,offset,mat,name){const contour=new T.CatmullRomCurve3(points.map(p=>V(p[0],p[1],0)),true,'catmullrom',.12).getPoints(80);for(const p of contour){const cap=(name==='Windscreen seal'?-19.5:-20.1)-1.3*step(28.8,32,Math.abs(p.x));if(roof(p.x,p.y)>cap){let lo=-25,hi=0;for(let k=0;k<30;k++){const m=(lo+hi)/2;if(roof(p.x,m)>cap)hi=m;else lo=m;}p.y=(lo+hi)/2;}}const cx=0,cy=-28.4;const pos=[[30,cy,roof(cx,cy)+offset]],idx=[];const rings=16,N=80;for(let r=1;r<=rings;r++){for(let j=0;j<N;j++){const x=contour[j].x*r/rings,y=cy+(contour[j].y-cy)*r/rings;pos.push([30+x,y,roof(x,y)+offset]);if(r===1)idx.push(0,1+j,1+(j+1)%N);else{const a=1+(r-2)*N+j,b=1+(r-1)*N+j,c=1+(r-1)*N+(j+1)%N,d=1+(r-2)*N+(j+1)%N;idx.push(a,b,c,a,c,d);}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos.flat(),3));g.setIndex(idx);g.computeVertexNormals();add(g,mat,name);}
 roofPane(screen,.14,black,'Windscreen seal');roofPane(screen.map(p=>[p[0]*.967,-26+(p[1]+26)*.965]),.21,glass,'Swept windshield');
 for(const x of [-25,8]){const pts=[];for(let j=0;j<=8;j++){const xx=x+j*2.4,y=-39.8;pts.push([30+xx,y,roof(xx,y)+.7]);}tube(pts,.21,plastic);tube([[30+x+10,-40,roof(x+10,-40)+.65],[30+x+2,-39.4,roof(x+2,-39.4)+.68]],.14,plastic);}
 for(const x of [-24,24]){const pts=[[-7,-2.1],[7,-2.1],[7,2.1],[-7,2.1]];curvedFace(pts,p=>[30+x+p[0],-43.6+p[1],roof(x+p[0],-43.6+p[1])+.16],plastic,'Cowl intake');for(let j=0;j<3;j++){const yy=-44.5+j*.8;const p=[];for(let k=-6;k<=6;k++)p.push([30+x+k,yy,roof(x+k,yy)+.3]);tube(p,.07,steel);}}
 for(const sign of [-1,1]){const pts=[];for(let y=-71;y<=-43;y+=2){const x=sign*(24+(y+71)*.1);pts.push([30+x,y,roof(x,y)+.04]);}tube(pts,.07,crease);}
 // Rounded bumper and nose. Grille and lights are projected onto its actual surface.
 const frontY=(x,z)=>-76.5+.2*Math.pow(Math.abs(x)/40,3)+.8*Math.exp(-(((z+77)/4)**2))+1.8*step(-86,-93,z)+1.1*(1-step(-.5,1.2,roundedRectDistance(x,z,0,-68.5,44,15,4)))-.5*Math.exp(-(((z+86)/1.8)**2));
 const fp=(x,z,d=.1)=>[30+x,frontY(x,z)-d,z];
 patch((u,v)=>{const x=(u*2-1)*38.6,z=-92+29*v;return fp(x,z,0);},80,50,plastic,'Rounded front bumper');
 const grille=[[-23,-61.6],[-21.5,-60.8],[21.5,-60.8],[23,-62.2],[21,-71],[18,-75.7],[0,-76.9],[-18,-75.7],[-21,-71]];
 curvedFace(grille,p=>fp(...p,.18),black,'Grille recess',.18);tube([...grille,grille[0]].map(p=>fp(...p,.22)),.35,plastic,false,'Grille surround');
 for(const z of [-64,-68.4,-72.7]){const w=z<-71?19.7:22;const pts=[];for(let x=-w;x<=w;x+=1)pts.push(fp(x,z+.65*(x/w)**2,.75));tube(pts,.52,plastic);const low=pts.map(p=>[p[0],p[1]-.04,p[2]-.35]);tube(low,.1,steel);}
 emblem([30,-78,-68.2],4.25,'front');
 function emblem(c,r,face){const tor=new T.TorusGeometry(r,.19,8,64);tor.rotateX(Math.PI/2);tor.translate(...c);add(tor,chrome,'Three-point emblem ring');const dir=face==='front'?-1:1;for(let k=0;k<3;k++){const a=k*Math.PI*2/3+Math.PI/2,p=[[c[0]+Math.cos(a)*r*.91,c[1]+dir*.12,c[2]+Math.sin(a)*r*.91],[c[0]+Math.cos(a+1.55)*r*.19,c[1]+dir*.25,c[2]+Math.sin(a+1.55)*r*.19],[c[0]+Math.cos(a-1.55)*r*.19,c[1]+dir*.25,c[2]+Math.sin(a-1.55)*r*.19]];const g=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(p.flat(),3));g.computeVertexNormals();add(g,chrome);}}
 for(const sign of [-1,1]){
  // One continuous lens surface sweeps around the corner from grille to body side.
  const headPoint=(t,v,d)=>{const q=t<.5?t*2:(t-.5)*2,zt=t<.5?T.MathUtils.lerp(-62.7,-59.6,q):T.MathUtils.lerp(-59.6,-58.3,q),zb=t<.5?T.MathUtils.lerp(-69.1,-67.9,q):T.MathUtils.lerp(-67.9,-58.8,q),z=T.MathUtils.lerp(zt,zb,v);if(t<.5){const x=T.MathUtils.lerp(24,sideWidth(-76.3,z),q);return [30+sign*x,frontY(x,z)-d,z];}const y=T.MathUtils.lerp(-76.3,-50.5,q),x=sideWidth(y,z)+d;return[30+sign*x,y,z];};
  patch((u,v)=>headPoint(u,v,.22),80,18,black,'Continuous wrapped headlight gasket');
  patch((u,v)=>headPoint(.025+.95*u,.11+.78*v,.32),80,18,light,'Continuous wrapped headlight lens');
  tube([[25.4,-67.5],[26.5,-64.1],[36.8,-61.1],[35.8,-65.6]].map(([x,z])=>fp(x*sign,z,.64)),.19,led);
  for(let j=0;j<3;j++){const x=(28+j*3)*sign;curvedFace([[x-sign*.65,-66.4],[x+sign*.65,-66.1],[x+sign*.9,-63.4],[x-sign*.4,-63.6]],p=>fp(...p,.56),chrome,'Lamp projector');}
  const fog=[[27,-79],[33,-78.9],[35,-82.5],[27.5,-82.7]];curvedFace(fog.map(([x,z])=>[x*sign,z]),p=>fp(...p,.22),black,'Foglight recess');const p=fp(30.7*sign,-81,.5);cyl(p,[p[0],p[1]-.25,p[2]],1.15,light);
  const side=[];for(let y=-75;y<=-55;y+=2)side.push([30+sign*(sideWidth(y,-82)+.1),y,-82]);tube(side,.13,plastic);
 }
 curvedFace([[-24,-79],[-18,-78.7],[18,-78.7],[24,-79],[18,-83.6],[-18,-83.6]],p=>fp(...p,.24),black,'Lower air intake',.2);for(let z=-79.7;z>-83.5;z-=.65)tube([fp(-18,z,.35),fp(0,z,.35),fp(18,z,.35)],.09,plastic);
 box([30,-77.05,-86],[22,.6,5.1],plastic,.4);box([30,-77.45,-86],[20.3,.2,4],steel,.25);
 // The rear skin shares the exact roof/side terminal section. No separate floating plate.
 const rearWidth=z=>z>top(156)-edgeDrop(156)?topW(156)*Math.pow(Math.max(0,(top(156)-z)/edgeDrop(156)),.1):sideWidth(156,z);
 const rearPress=(x,z)=>roundedRectDistance(x,z,0,-33.4,63.4,32.2,T.MathUtils.lerp(4.5,12,step(-25,-41,z)));
 const rearY=(x,z)=>{const edge=Math.min(rearWidth(z)-Math.abs(x),z+91,roof(x,156)-z),blend=step(0,2,edge);return 156+blend*(.55-.48*(1-step(-.5,1.25,rearPress(x,z))));};
 const rp=(x,z,d=0)=>[30+x,rearY(x,z)+d,z];
 function rearSeam(pts,r=.07,d=.15,closed=true){const dense=[],pp=closed?[...pts,pts[0]]:pts;for(let k=0;k<pp.length-1;k++){const a=pp[k],b=pp[k+1],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.6);for(let j=0;j<n;j++)dense.push(rp(a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n,d));}dense.push(rp(...pp.at(-1),d));return tube(dense,r,crease,closed);}
 // Two regular patches retain the exact terminal boundary and smooth stamped-panel normals.
 const rearShoulder=top(156)-edgeDrop(156);
 patch((u,v)=>{const z=T.MathUtils.lerp(-91,rearShoulder,v);return rp((2*u-1)*sideWidth(156,z),z);},128,128,paint,'Joined rear body closure');
 patch((u,v)=>{const x=(2*u-1)*topW(156),z=T.MathUtils.lerp(rearShoulder,roof(x,156),v);return rp(x,z);},64,8,paint,'Joined rear roof cap');
 for(const sign of [-1,1]){
  const pts=[[.18,-2.5],[25.8,-2.6],[28.5,-3.1],[30.5,-5],[31.7,-9],[33.6,-24],[34.8,-45],[33.5,-78],[32.3,-82],[30,-84.7],[25,-85.6],[.18,-85.6]].map(([x,z])=>[x*sign,z]);rearSeam(pts,.065,.12);
  const hi=[[.4,-9],[27.5,-9],[28,-9.5],[.4,-9.5]].map(([x,z])=>[x*sign,z]);curvedFace(hi,p=>rp(...p,.08),paint,'Rear upper swage');
  const lampShape=[[34.2,-50],[39,-49],[39,-72.5],[34,-72.5]].map(([x,z])=>[x*sign,z]);curvedFace(lampShape,p=>rp(...p,.25),red,'Tall rear tail lamp',.1);
  for(const z of [-53,-56,-64,-68,-71])tube([rp(34.6*sign,z,.43),rp(38.7*sign,z+.3,.43)],.10,red);curvedFace([[34.6*sign,-58],[36.6*sign,-58],[36.6*sign,-63],[34.6*sign,-65]],p=>rp(...p,.5),light,'Reverse lens',.1);
  for(const z of [-32,-74]){box(rp(34.6*sign,z,.55),[4.5,1.2,2.9],paint,.3);cyl(rp(35.3*sign,z-1.6,1.3),rp(35.3*sign,z+1.6,1.3),.45,steel);}
 }
 rearSeam([[0,-2.5],[0,-85.6]],.085,.12,false);box(rp(8.2,-60.2,.4),[9.5,1,1.8],plastic,.7);emblem(rp(0,-53.7,.5),2.4,'rear');
 box(rp(-16.5,-75.6,.4),[21.5,1.1,6.1],plastic,.6);box(rp(-16.5,-75.6,1),[19.7,.3,4.8],steel,.3);box(rp(-16.5,-71.9,1),[24,1.7,1.3],plastic,.5);
 box([30,156,-88.8],[78,3,5.3],plastic,2);for(const x of [-30,30])box([30+x,157.7,-87.5],[7,.25,.8],red,.2);
 box([30,156.3,-1.55],[13,.5,1.2],red,.4);box([30,155.4,-.2],[3.4,3,2.4],plastic,.7);
 // Seven stamped roof ribs and the two longitudinal gutters, following roof crown.
 for(const x of [-26,-18,-9,0,9,18,26]){const segments=(Math.abs(x)<10)?[[26,48],[80,146]]:[[26,146]];for(const [a,b] of segments){patch((u,v)=>{const y=a+(b-a)*u,xx=x+(v*2-1)*1.05,fade=step(a,a+4,y)*(1-step(b-4,b,y));return [30+xx,y,roof(xx,y)+Math.sin(v*Math.PI)*.25*fade];},80,8,paint,'Stamped roof rib');}}
 for(const sign of [-1,1]){const points=[];for(let y=20;y<151;y+=2){const x=sign*33.7;points.push([30+x,y,roof(x,y)+.12]);}tube(points,.15,paint);}
 box([30,-4.5,top(-4.5)+.75],[1.8,4,1.2],plastic,.6);cyl([30,-4.5,top(-4.5)+1],[30,4,6],.095,plastic,10);
 // Recessed wheel wells fill the open arches behind the tires without altering axle/tire dimensions.
 for(const sign of [-1,1])for(const axle of [-36,108])patch((u,v)=>{const a=u*Math.PI,r=v*18.2;return[30+sign*31.5,axle+r*Math.cos(a),-87.8+r*Math.sin(a)];},64,2,black,'Wheel well liner');
 for(const sign of [-1,1])for(const axle of [-36,108])patch((u,v)=>{const a=u*Math.PI,y=axle+18.15*Math.cos(a),z=-87.8+18.15*Math.sin(a),x=T.MathUtils.lerp(31.5,sideWidth(y,z)-.35,v);return[30+sign*x,y,z];},64,4,black,'Wheel well barrel');
 // Stock steel wheels: tire shoulder, barrel, perforated dish, six lug fasteners.
 for(const sign of [-1,1])for(const y of [-36,108]){
  const x=30+sign*36.1,z=-87.8,r=15.2;
  const tireProfile=[[3.1,9],[4,10.7],[4.2,12.6],[3.5,14.5],[2.4,15.2],[-2.4,15.2],[-3.5,14.5],[-4.2,12.6],[-4,10.7],[-3.1,9]];
  patch((u,v)=>{const k=v*(tireProfile.length-1),i=Math.min(tireProfile.length-2,Math.floor(k)),t=k-i,a=T.MathUtils.lerp(tireProfile[i][0],tireProfile[i+1][0],t),rr=T.MathUtils.lerp(tireProfile[i][1],tireProfile[i+1][1],t),ang=u*Math.PI*2;return[x+sign*a,y+rr*Math.cos(ang),z+rr*Math.sin(ang)];},96,36,rubber,'Rounded tire');
  cyl([x-sign*3,y,z],[x+sign*3.4,y,z],9.5,steel,64);cyl([x+sign*3.45,y,z],[x+sign*3.8,y,z],7.9,steel,64,8.7);
  for(let k=0;k<18;k++){const a=k*Math.PI*2/18;const yy=y+7.45*Math.cos(a),zz=z+7.45*Math.sin(a);cyl([x+sign*3.86,yy,zz],[x+sign*3.93,yy,zz],.53,black,12);}
  cyl([x+sign*3.9,y,z],[x+sign*4.3,y,z],5.3,plastic,48);for(let k=0;k<6;k++){const a=k*Math.PI/3;cyl([x+sign*4.35,y+3.1*Math.cos(a),z+3.1*Math.sin(a)],[x+sign*4.55,y+3.1*Math.cos(a),z+3.1*Math.sin(a)],.38,steel,6);}
  for(const rad of [10.4,13.8]){const pts=[];for(let a=0;a<Math.PI*2;a+=Math.PI/48)pts.push([x+sign*4.12,y+rad*Math.cos(a),z+rad*Math.sin(a)]);tube(pts,.065,rubber,true);}
  for(let k=0;k<64;k++){const a=k*Math.PI*2/64;const pts=[];for(let s=-2.3;s<=2.3;s+=1.15){const aa=a+s*.008;pts.push([x+s,y+(r+.02)*Math.cos(aa),z+(r+.02)*Math.sin(aa)]);}tube(pts,.085,black);}
 }
 box([30,45,-91],[65,208,1.5],black);for(const y of [-36,108])cyl([-4,y,-87],[64,y,-87],1.5,black);
 // Sweep the complete nose (paint, lenses and bumper together) around the front corners.
 group.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i)+o.position.x,y=a.getY(i)+o.position.y;if(y< -55 && !o.quaternion.x && !o.quaternion.y && !o.quaternion.z){const bow=11*Math.pow(Math.abs(x-30)/39.75,4)*(1-step(-76.5,-55,y));a.setY(i,a.getY(i)+bow);}}o.geometry.computeVertexNormals();});
 group.userData={...SHELL_SPEC};
 // Preserve axle spacing and round tires while registering the two overhangs
 // to the 234-inch nominal exterior envelope. This is an estimated scale target.
 group.updateMatrixWorld(true);
 // Shared surface warps are baked before envelope normalization; wheel geometry is outside their domains.
 for(const o of group.children){if(!o.isMesh)continue;o.geometry.applyMatrix4(o.matrixWorld);o.position.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i)-30,z=a.getZ(i);let y=a.getY(i);const cabBow=4.1*Math.max(0,1-(x/35.5)**2)*step(-55,-40,y)*(1-step(-12,1,y))*step(-60,-53,z);y-=cabBow;const rearLean=5.2*step(-90,0,z)*step(140,156,y);y-=rearLean;a.setY(i,y);}o.geometry.computeVertexNormals();}group.updateMatrixWorld(true);
 const extents=new T.Box3().setFromObject(group),frontScale=(-76.5+56)/(extents.min.y+56),rearScale=(157.5-128)/(extents.max.y-128);
 for(const o of group.children){if(!o.isMesh)continue;o.geometry.applyMatrix4(o.matrixWorld);o.position.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i);if(y < -56)a.setY(i,-56+(y+56)*frontScale);else if(y >128)a.setY(i,128+(y-128)*rearScale);}o.geometry.computeVertexNormals();}group.updateMatrixWorld(true);
 // Verify the final rear mesh boundary against the terminal loft, after all warps and scale registration.
 const roofMesh=group.children.find(o=>o.name==='Roof, hood and cowl continuous loft'),sideMeshes=group.children.filter(o=>o.name==='Body side with open wheel arches'),rearMesh=group.children.find(o=>o.name==='Joined rear body closure'),capMesh=group.children.find(o=>o.name==='Joined rear roof cap');
 const point=(o,i)=>new T.Vector3().fromBufferAttribute(o.geometry.attributes.position,i),roofEdge=Array.from({length:57},(_,i)=>point(roofMesh,200*57+i));
 const sideEdges=sideMeshes.map(o=>Array.from({length:61},(_,j)=>point(o,j*401+400)));
 const distance=(p,edge)=>Math.min(...edge.slice(1).map((q,i)=>new T.Line3(edge[i],q).closestPointToPoint(p,true,new T.Vector3()).distanceTo(p)));
 let seamMax=0;for(let i=0;i<=64;i++)seamMax=Math.max(seamMax,distance(point(capMesh,8*65+i),roofEdge));
 for(let j=0;j<=128;j++)for(const [k,edge] of [[0,sideEdges[0]],[128,sideEdges[1]]])seamMax=Math.max(seamMax,distance(point(rearMesh,j*129+k),edge));
 group.userData.rearBoundaryMaxDistance=seamMax;
 const seal=group.children.find(o=>o.name==='Windscreen seal'),sa=seal.geometry.attributes.position,topZ=[];for(let i=sa.count-80;i<sa.count;i++){const p=point(seal,i);if(Math.abs(p.x-30)<25&&p.z>-25)topZ.push(p.z);}group.userData.windshieldTopVariation=Math.max(...topZ)-Math.min(...topZ);
 // Batch static meshes by material: the same geometry with a small number of draw calls.
 const originals=[...group.children],buckets=new Map();group.updateMatrixWorld(true);
 for(const o of originals){if(!o.isMesh)continue;let b=buckets.get(o.material);if(!b){b={positions:[],normals:[],indices:[],count:0};buckets.set(o.material,b);}const geom=o.geometry.clone().applyMatrix4(o.matrixWorld),p=geom.attributes.position,n=geom.attributes.normal;for(let i=0;i<p.count;i++){b.positions.push(p.getX(i),p.getY(i),p.getZ(i));b.normals.push(n.getX(i),n.getY(i),n.getZ(i));}if(geom.index){for(let i=0;i<geom.index.count;i++)b.indices.push(b.count+geom.index.getX(i));}else{for(let i=0;i<p.count;i++)b.indices.push(b.count+i);}b.count+=p.count;geom.dispose();group.remove(o);o.geometry.dispose();}
 for(const [m,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.normals,3));g.setIndex(b.indices);add(g,m,m.name);}
 group.userData.originalParts=originals.length;group.userData.drawCalls=group.children.length;
 return {group,materials:mats};
}
