import * as T from './vendor/three.module.js';
// Comparison envelopes only. Actual underbody structure and installation are unmeasured.
export function buildUnderbodyUpgrades(catalogue){
  const group=new T.Group();group.name='Proposed underbody upgrades · fit unverified';const parts={},materials={};
  materials.tank=new T.MeshStandardMaterial({name:'Proposed tank envelope',color:'#d79a4f',metalness:.05,roughness:.65,transparent:true,opacity:.72,depthWrite:false,side:T.DoubleSide});
  materials.skid=new T.MeshStandardMaterial({name:'Proposed skid outline',color:'#c78d42',metalness:.4,roughness:.48,side:T.DoubleSide});
  materials.edge=new T.LineBasicMaterial({color:'#6e451e',transparent:true,opacity:.85});
  function add(name,geometry,material,center){const p=new T.Group();p.name=name;const m=new T.Mesh(geometry,material);m.castShadow=false;m.receiveShadow=false;p.add(m);p.add(new T.LineSegments(new T.EdgesGeometry(geometry,35),materials.edge));p.position.set(...center);group.add(p);p.visible=false;parts[name]=p;return p;}
  for(const [key,t] of Object.entries(catalogue.tanks)){const p=add(key,new T.BoxGeometry(t.width,t.length,t.height),materials.tank,catalogue.tankPlacement.center);p.userData={installationStatus:'proposed',dimensionStatus:t.dimensionStatus,positionStatus:'estimated',fitStatus:'unverified',nominalSize:[t.width,t.length,t.height]};}
  // Explicit transverse rows keep the plate fields planar on each side of a bend.
  for(const [key,s] of Object.entries(catalogue.skids)){
    const [w,l,t]=s.dimensions,rows=key==='engine'?[[-.5,.36],[-.25,.5],[-.2,.5],[.35,.5],[.5,.32]]:[[-.5,.36],[-.25,.5],[.25,.5],[.35,.5],[.5,.32]],p=[],indices=[];
    for(const [yf,xf] of rows){const y=yf*l,z=key==='engine'?Math.max(0,(-yf-.2)/.3)*3:Math.max(0,(yf-.25)/.25)*1.2;for(const dz of [0,t])for(const x of [-xf*w,xf*w])p.push(x,y,z+dz);}
    function quad(a,b,c,d){indices.push(a,b,c,a,c,d);}
    for(let i=0;i<rows.length-1;i++){const a=i*4,b=a+4;quad(a+2,a+3,b+3,b+2);quad(a,b,b+1,a+1);quad(a,a+2,b+2,b);quad(a+1,b+1,b+3,a+3);}
    quad(0,1,3,2);const end=(rows.length-1)*4;quad(end,end+2,end+3,end+1);
    const indexed=new T.BufferGeometry();indexed.setAttribute('position',new T.Float32BufferAttribute(p,3));indexed.setIndex(indices);const g=indexed.toNonIndexed();indexed.dispose();g.computeVertexNormals();
    const part=add(key,g,materials.skid,s.center);part.userData={installationStatus:'proposed',dimensionStatus:'estimated',positionStatus:'estimated',fitStatus:'unverified'};
  }
  function update(settings){for(const [key,p] of Object.entries(parts))p.visible=key==='engine'?settings.engineSkid:key==='transmission'?settings.transmissionSkid:key===settings.tank;}
  const bounds=Object.fromEntries(Object.entries(parts).map(([key,p])=>[key,new T.Box3().setFromObject(p)]));group.userData={bounds,limits:catalogue.limits};return {group,parts,materials,update};
}
