import {buildShell} from './shell-model.js?v=body16';

// Original visual approximation, not an OEM channel section or mounting design.
export const ROOF_MOUNT_SPEC={
  status:'owner-described, photo-positioned; section and brackets estimated',
  centerXs:[4.7,55.3],frontY:26,rearY:149,width:1.85,height:.42,
  baseThickness:.12,wallThickness:.12,seatAllowance:.045,
  description:'Two silver aluminum roof mounting channels below the separate black rack rails. Ladder upper brackets land on the driver channel.',
  evidence:'Owner driver-side and overhead photos establish the ladder/rack relationship; owner identifies the silver mounting track. Upper hardware is partly concealed.',
  limits:'Channel section, endpoints, fasteners, roof attachment and load path are estimates. No physical fit, climbing load or structural approval.'
};

// Sample the final original mesh, including its stamped ribs and baked rear warp.
// Y buckets keep construction cheap; no raycasting or work is done per animation frame.
function surfaceSampler(group){
  const bins=new Map();
  group.traverse(o=>{
    if(!o.isMesh||!o.material.name.startsWith('Blue-gray paint')||o.userData.motionPart||o.userData.sleepingFlare)return;
    const p=o.geometry.attributes.position,idx=o.geometry.index;
    for(let k=0;k<(idx?.count||p.count);k+=3){
      const t=[0,1,2].map(j=>{const n=idx?idx.getX(k+j):k+j;return[p.getX(n),p.getY(n),p.getZ(n)];});
      const xs=t.map(a=>a[0]),ys=t.map(a=>a[1]),zs=t.map(a=>a[2]);
      if(Math.max(...ys)<25||Math.min(...ys)>150||Math.min(...zs)<-3||Math.max(...zs)>1)continue;
      if(Math.min(...xs)>8&&Math.max(...xs)<52)continue;
      const [a,b,c]=t,d=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
      if(Math.abs(d)<1e-10)continue;
      for(let y=Math.floor(Math.min(...ys));y<=Math.floor(Math.max(...ys));y++){
        if(!bins.has(y))bins.set(y,[]);bins.get(y).push({a,b,c,d});
      }
    }
  });
  return (x,y)=>{
    let top=-Infinity;
    for(const {a,b,c,d} of bins.get(Math.floor(y))||[]){
      const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/d;
      const v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/d,w=1-u-v;
      if(u>=-1e-7&&v>=-1e-7&&w>=-1e-7)top=Math.max(top,u*a[2]+v*b[2]+w*c[2]);
    }
    if(!Number.isFinite(top))throw new Error('Roof mounting channel has no roof surface at '+x+', '+y);
    return top;
  };
}
let standalone;
export function createRoofMounts(shellGroup){
  if(!shellGroup){
    if(standalone)return standalone;
    const shell=buildShell({includeFlares:true,includeCamperWindows:true,includeRunningGear:true});
    standalone=createRoofMounts(shell.group);
    shell.group.traverse(o=>{if(o.isMesh)o.geometry.dispose();});
    for(const m of Object.values(shell.materials))m.dispose();
    return standalone;
  }
  const surface=surfaceSampler(shellGroup),spec=ROOF_MOUNT_SPEC;
  const seat=(x,y)=>surface(x,y)+spec.seatAllowance;
  // Keep a straight cross-section above the highest sampled roof/rib beneath it.
  const base=(x,y)=>Math.max(...[-.5,-.25,0,.25,.5].map(t=>seat(x+t*spec.width,y)));
  const top=(x,y)=>base(x,y)+spec.height;
  return {spec,surface,seat,base,top};
}
