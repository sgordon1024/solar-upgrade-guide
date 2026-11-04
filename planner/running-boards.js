import * as T from './vendor/three.module.js';

// Original photo-referenced geometry. Body frame: X passengerward, Y rearward,
// Z upward; inches, roof Z=0. The two sides intentionally have unequal lengths.
export const RUNNING_BOARDS_SPEC = {
  revision:'running-boards-1', installationStatus:'existing-photo-observed',
  units:'in', dimensionStatus:'estimated', positionStatus:'photo-estimated',
  brand:null, installedModel:null,
  section:{width:5.2,height:3.2,centerFromVehicleCenter:42,centerZ:-95},
  driver:{frontY:-14,rearY:24,length:38,pads:[{centerY:-2,length:22}],mountStations:[-9,17]},
  passenger:{frontY:-14,rearY:87,length:101,pads:[{centerY:0,length:22},{centerY:35,length:19},{centerY:62,length:19}],mountStations:[-9,24,54,80]},
  observations:'Short driver cab step with one pad; long passenger cab/sliding-door step with three separated pads. Straight dark oval tubes, rounded caps, clipped tread ends and round perforations. No continuous full-width deck.',
  evidence:'Owner driver and passenger photos; lengths and fore-aft locations estimated from axle spacing. Perspective, terrain and partly obscured brackets limit precision.',
  unresolved:['Both end-to-end lengths and end offsets from wheel openings','Tube width/height and outward projection from sill','Sill-to-step-top drop on each side','Pad lengths, spacing and perforation pattern','Bracket positions, connections and installed brand/model'],
  limits:'Static visual reference, not manufacturer CAD. Hidden brackets, tube section and tread construction are illustrative. No structural, load, ground-clearance or door/tire movement validation; excluded from roof box checks.',
  geometryLicense:'Original MIT geometry; no owner photos, product textures or third-party meshes redistributed.'
};

export function buildRunningBoards(){
  const group=new T.Group();group.name='Running boards · photo estimated';
  const materials={},buckets=new Map(),s=RUNNING_BOARDS_SPEC;
  const mat=(name,color,metalness,roughness)=>materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});
  const tube=mat('Running board charcoal coating','#303639',.28,.62);
  const tread=mat('Running board perforated treads','#3b4143',.28,.70);
  const cap=mat('Running board end caps and mounts','#202628',.15,.76);
  const bolt=mat('Running board dark hardware','#60696b',.55,.45);
  function add(g,m,target){if(!g.attributes.normal)g.computeVertexNormals();const key=target.name+'|'+m.name;let b=buckets.get(key);if(!b){b={m,target,p:[],n:[],i:[],count:0};buckets.set(key,b);}for(const v of g.attributes.position.array)b.p.push(v);for(const v of g.attributes.normal.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let i=0;i<g.attributes.position.count;i++)b.i.push(i+b.count);b.count+=g.attributes.position.count;g.dispose();}
  function surface(p,i,m,target){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(i);g.computeVertexNormals();add(g,m,target);}
  function box(c,size,m,target){const g=new T.BoxGeometry(...size);g.translate(...c);add(g,m,target);}
  // Split the planar tread triangulation into narrow crosswise bands before
  // bending it onto the oval tube. Large end triangles otherwise form fins.
  function subdivideTread(g){
    const a=g.attributes.position,out=[];
    function clip(poly,v,keepAbove){const next=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],inside=keepAbove?p[1]>=v:p[1]<=v,other=keepAbove?q[1]>=v:q[1]<=v;if(inside)next.push(p);if(inside!==other){const t=(v-p[1])/(q[1]-p[1]);next.push(p.map((x,k)=>T.MathUtils.lerp(x,q[k],t)));}}return next;}
    for(let i=0;i<a.count;i+=3){const tri=[0,1,2].map(k=>[a.getX(i+k),a.getY(i+k),a.getZ(i+k)]);for(let lo=-1.75;lo<1.75;lo+=.25){const poly=clip(clip(tri,lo,true),lo+.25,false);for(let j=1;j<poly.length-1;j++)out.push(...poly[0],...poly[j],...poly[j+1]);}}
    g.dispose();return new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(out,3));
  }
  const sides={};
  for(const [name,sign] of [['driver',-1],['passenger',1]]){
    const side=new T.Group();side.name=name+' running board';group.add(side);sides[name]=side;
    const cfg=s[name],cx=30+sign*s.section.centerFromVehicleCenter,cz=s.section.centerZ,rx=s.section.width/2,rz=s.section.height/2;
    const point=(y,a,scale=1,offset=0)=>[cx+sign*(rx*scale+offset)*Math.cos(a),y,cz+(rz*scale+offset)*Math.sin(a)];
    // Lower shell is continuous; inset openings beneath each perforated tread
    // leave genuine holes and an interior shadow instead of printed dots.
    const ys=[cfg.frontY,cfg.frontY+.18,cfg.frontY+.55,cfg.frontY+1,cfg.rearY-1,cfg.rearY-.55,cfg.rearY-.18,cfg.rearY];
    for(const pad of cfg.pads)ys.push(pad.centerY-pad.length/2+3,pad.centerY+pad.length/2-3);
    ys.sort((a,b)=>a-b);
    const angles=Array.from({length:41},(_,k)=>k*Math.PI*2/40);angles.push(.2,1.95);angles.sort((a,b)=>a-b);
    const p=[],ids=[],n=angles.length;
    const endScale=y=>{const d=Math.min(y-cfg.frontY,cfg.rearY-y);return d>=1?1:d>=.55?.93+(d-.55)*.07/.45:d>=.18?.72+(d-.18)*.21/.37:.53+d*.19/.18;};
    for(const y of ys)for(const a of angles)p.push(...point(y,a,endScale(y)));
    for(let j=0;j<ys.length-1;j++)for(let k=0;k<n-1;k++){
      const y=(ys[j]+ys[j+1])/2,a=(angles[k]+angles[k+1])/2;
      const opening=a>.2&&a<1.95&&cfg.pads.some(p=>Math.abs(y-p.centerY)<p.length/2-3);
      if(!opening){const u=j*n+k;ids.push(u,u+n,u+1,u+1,u+n,u+n+1);}
    }
    surface(p,ids,tube,side);
    for(const end of [cfg.frontY,cfg.rearY]){
      const pp=[cx,end,cz],ii=[];for(const a of angles)pp.push(...point(end,a,.53));for(let k=1;k<angles.length;k++)ii.push(0,k,k+1);surface(pp,ii,cap,side);
      // Narrow end-cap seam, following the same oval section.
      const y=end+(end===cfg.frontY?.72:-.72),pp2=[],ii2=[];
      for(const yy of [y-.045,y+.045])for(const a of angles)pp2.push(...point(yy,a,endScale(yy),.025));
      for(let k=0;k<n-1;k++)ii2.push(k,k+n,k+1,k+1,k+n,k+n+1);surface(pp2,ii2,cap,side);
    }
    for(const pad of cfg.pads){
      const l=pad.length/2,w=1.75;
      const shape=new T.Shape([[-l,-w],[-l+2.6,w],[l-2.6,w],[l,-w]].map(p=>new T.Vector2(...p)));
      for(const row of [-.72,.72])for(let y=-l+3.1;y<l-2.5;y+=1.7){const hole=new T.Path();hole.absarc(y+(row>0?.35:0),row,.34,0,Math.PI*2,true);shape.holes.push(hole);}
      const g=subdivideTread(new T.ExtrudeGeometry(shape,{depth:.11,bevelEnabled:false,curveSegments:6})),a=g.attributes.position;
      for(let i=0;i<a.count;i++){const y=pad.centerY+a.getX(i),angle=.2+(a.getY(i)+w)/(2*w)*1.75,off=.07+a.getZ(i);a.setXYZ(i,...point(y,angle,1,off));}g.computeVertexNormals();add(g,tread,side);
      // Recessed dark inner surface beneath the perforations.
      const pp=[],ii=[];for(const y of [pad.centerY-l+2.5,pad.centerY+l-2.5])for(let k=0;k<=12;k++)pp.push(...point(y,.2+k*1.75/12,.82));for(let k=0;k<12;k++)ii.push(k,k+13,k+1,k+1,k+13,k+14);surface(pp,ii,cap,side);
    }
    // Sparse support arms reach the underside of the sill; attachment details
    // are concealed in the reference and are explicitly illustrative.
    for(const y of cfg.mountStations){
      box([30+sign*39,y,-92.5],[6.4,1.6,.24],cap,side);
      box([30+sign*36,y,-91.6],[.22,2.2,2.0],cap,side);
      box([cx-sign*.8,y,-93.15],[.24,1.6,1.25],cap,side);
      const g=new T.CylinderGeometry(.19,.19,.15,6);g.rotateZ(Math.PI/2);g.translate(30+sign*36.2,y,-91.6);add(g,bolt,side);
    }
    side.userData={padCount:cfg.pads.length,mountsAreIllustrative:true};
  }
  for(const b of buckets.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,b.m);mesh.name=b.m.name;mesh.castShadow=true;b.target.add(mesh);}
  for(const side of Object.values(sides))side.userData.bounds=new T.Box3().setFromObject(side);
  group.userData={spec:s};return {group,materials,...sides};
}
