import * as T from './vendor/three.module.js';

export const ENVIRONMENTS={
  white:{label:'White',sky:'#f3f3ee',ground:'#eeeee8'},
  desert:{label:'Desert',sky:'#e7cbb0',ground:'#bd8d67'},
  dunes:{label:'Sand dunes',sky:'#ede0bf',ground:'#d6bc86'},
  mud:{label:'Mud',sky:'#b5b4a0',ground:'#756049'},
  gravel:{label:'Gravel back road',sky:'#ccd4c0',ground:'#8a9474',road:'#aaa28d'},
  highway:{label:'Paved highway',sky:'#d6e4e8',ground:'#a0ad8d',road:'#525c61'},
  rain:{label:'Rain',sky:'#919fab',ground:'#697b72',road:'#475660'},
  snow:{label:'Snow',sky:'#dfe8ed',ground:'#e8edef',road:'#b0bdc4'}
};
const wrap=(n,size)=>((n%size)+size)%size;
// All scenery is original, low-detail geometry. One shared motion clock; no
// independent render loop, external assets, weather API or physical simulation.
export function buildEnvironment({groundZ=-107.82}={}){
  const group=new T.Group();group.name='Stylized environment';
  let selected='white',distance=0,phaseLast=0,wasMoving=false,night=false,texture,roadTexture,particles,scatter=[];
  const groundMaterial=new T.MeshStandardMaterial({roughness:1});
  const ground=new T.Mesh(new T.PlaneGeometry(2600,2600),groundMaterial);ground.position.set(30,-40,groundZ);ground.receiveShadow=true;group.add(ground);
  const detail=new T.Group();group.add(detail);
  const transform=new T.Object3D();
  function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
  function mapTexture(base,style){const size=128,data=new Uint8Array(size*size*4),color=new T.Color(base);const r=random(1427);for(let y=0;y<size;y++)for(let x=0;x<size;x++){let n=0;if(style==='gravel')n=r()<.22?(r()-.5)*.33:0;else if(style==='mud')n=Math.sin(x/size*Math.PI*4+Math.sin(y/size*Math.PI*2))*Math.cos(y/size*Math.PI*4)*.012;else if(style==='dunes')n=Math.sin(y/size*Math.PI*6+Math.sin(x/size*Math.PI*2))*.012;else if(style!=='white')n=(r()-.5)*.025;const i=(y*size+x)*4;data[i]=Math.max(0,Math.min(255,(color.r+n)*255));data[i+1]=Math.max(0,Math.min(255,(color.g+n)*255));data[i+2]=Math.max(0,Math.min(255,(color.b+n)*255));data[i+3]=255;}const tx=new T.DataTexture(data,size,size);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.magFilter=T.LinearFilter;tx.minFilter=T.LinearFilter;tx.repeat.set(2600/300,2600/300);tx.needsUpdate=true;return tx;}
  function mesh(g,m,p,scale=[1,1,1]){const o=new T.Mesh(g,m);o.position.set(...p);o.scale.set(...scale);o.receiveShadow=true;detail.add(o);return o;}
  function material(color,roughness=1){return new T.MeshStandardMaterial({color,roughness,flatShading:true});}
  function instances(g,m,rows){const o=new T.InstancedMesh(g,m,rows.length);o.frustumCulled=false;detail.add(o);scatter.push({o,rows});return o;}
  function terrainRows(count,seed,scaleFn){const r=random(seed);return Array.from({length:count},(_,i)=>({x:30+(i%2?1:-1)*(230+r()*420),y:-1100+r()*2200,z:groundZ,scale:scaleFn(r),rotation:r()*Math.PI}));}
  function drawMotion(){if(texture)texture.offset.y=distance/300;if(roadTexture)roadTexture.offset.y=distance/300;for(const {o,rows} of scatter){for(let i=0;i<rows.length;i++){const row=rows[i];transform.position.set(row.x,wrap(row.y-distance+1100,2200)-1100,row.z);transform.rotation.set(0,0,row.rotation||0);transform.scale.set(...row.scale);transform.updateMatrix();o.setMatrixAt(i,transform.matrix);}o.instanceMatrix.needsUpdate=true;}if(particles){const a=particles.geometry.attributes.position,points=particles.userData.points;for(let i=0;i<points.length;i++){const p=points[i],y=wrap(p.y-distance*.6+500,1000)-500,z=groundZ+wrap(p.z-distance*(selected==='rain'?2.2:.45),430);if(selected==='rain'){a.setXYZ(i*2,p.x,y,z);a.setXYZ(i*2+1,p.x+1,y-2,z-10);}else a.setXYZ(i,p.x+Math.sin(distance*.01+i)*3,y,z);}a.needsUpdate=true;}}
  function clearDetails(){detail.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});detail.clear();scatter=[];particles=null;roadTexture?.dispose();roadTexture=null;}
  function setPreset(id){if(!(id in ENVIRONMENTS))id='white';selected=id;clearDetails();const c=ENVIRONMENTS[id];texture?.dispose();texture=mapTexture(c.ground,id);groundMaterial.map=texture;groundMaterial.color.set('#ffffff');groundMaterial.roughness=id==='mud'?.55:1;groundMaterial.needsUpdate=true;
    if(c.road){const isGravel=id==='gravel',width=isGravel?180:330,x=isGravel?30:-55;roadTexture=mapTexture(c.road,isGravel?'gravel':'road');roadTexture.repeat.x=width/300;const m=material('#ffffff',id==='rain'?.35:.95);m.map=roadTexture;mesh(new T.PlaneGeometry(width,2600),m,[x,-40,groundZ+.015]);if(id==='highway'||id==='rain'){const line=material(id==='rain'?'#c5bf8c':'#f3d88a');instances(new T.PlaneGeometry(4,42),line,Array.from({length:25},(_,i)=>({x:-55,y:-1100+i*88,z:groundZ+.025,scale:[1,1,1]})));for(const x of [-215,105])mesh(new T.PlaneGeometry(2,2600),material('#e9e8d9'),[x,-40,groundZ+.025]);}}
    if(id==='desert'){instances(new T.DodecahedronGeometry(1,0),material('#9b6c50'),terrainRows(24,52,r=>[12+r()*18,10+r()*20,8+r()*12]));const g=new T.CylinderGeometry(4,5,36,5);g.rotateX(Math.PI/2);g.translate(0,0,18);instances(g,material('#6e8060'),terrainRows(18,83,r=>[1+r(),1+r(),1+r()*1.7]));}
    if(id==='dunes'){const g=new T.SphereGeometry(1,10,5,0,Math.PI*2,0,Math.PI/2);g.rotateX(Math.PI/2);instances(g,material('#d7bb7f'),terrainRows(14,72,r=>[130+r()*90,150+r()*130,35+r()*30]).map(row=>({...row,x:row.x+Math.sign(row.x-30)*150})));}
    if(id==='mud'){const g=new T.CircleGeometry(1,12);instances(g,material('#443b32',.3),terrainRows(22,17,r=>[12+r()*55,22+r()*70,1]).map(row=>({...row,z:groundZ+.025})));}
    if(id==='gravel'){instances(new T.DodecahedronGeometry(1,0),material('#777b6c'),terrainRows(32,22,r=>[3+r()*8,4+r()*9,3+r()*5]));}
    if(id==='snow'){const g=new T.ConeGeometry(20,65,5);g.rotateX(Math.PI/2);g.translate(0,0,32.5);instances(g,material('#bdcdd0'),terrainRows(22,31,r=>[1+r(),1+r(),1+r()]));}
    if(id==='rain'||id==='snow'){const r=random(43),count=id==='rain'?130:180,points=Array.from({length:count},()=>({x:30+(r()<.5?-1:1)*(110+r()*370),y:-500+r()*1000,z:r()*430}));const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(count*(id==='rain'?6:3)),3));particles=id==='rain'?new T.LineSegments(g,new T.LineBasicMaterial({color:'#d9e4eb',transparent:true,opacity:.52})):new T.Points(g,new T.PointsMaterial({color:'#ffffff',size:2.5,sizeAttenuation:true,transparent:true,opacity:.85}));particles.userData.points=points;particles.frustumCulled=false;detail.add(particles);}
    drawMotion();return palette();
  }
  function palette(){const c=ENVIRONMENTS[selected];return {background:new T.Color(night?'#15212b':c.sky),fog:new T.Fog(night?'#15212b':c.sky,650,1250)};}
  function update({phase=0,wheels=0,night:isNight=false,reducedMotion=false}={}){night=isNight;const moving=!!wheels&&!reducedMotion;if(moving&&wasMoving&&phase>=phaseLast)distance+=(phase-phaseLast)*2.1*15.25;phaseLast=phase;wasMoving=moving;drawMotion();}
  setPreset('white');
  return {group,ground,setPreset,update,palette,get selected(){return selected;},get distance(){return distance;},get diagnostics(){return {instances:scatter.reduce((n,s)=>n+s.rows.length,0),particles:particles?.userData.points.length||0,drawObjects:detail.children.length+1};}};
}
