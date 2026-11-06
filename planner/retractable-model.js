import * as T from './vendor/three.module.js';
import './retractable-data.js?v=tap1';
import {RACK_SPEC} from './roof-rack.js?v=rail1';
export function buildRetractable({requestRender=()=>{},onPose=()=>{}}={}){
 const D=globalThis.RooflabRetractable,group=new T.Group();group.position.set(...RACK_SPEC.installation.planningOrigin);group.name='Optional retractable solar concept';
 const materials={frame:new T.MeshStandardMaterial({color:'#b5c4ce',metalness:.75,roughness:.35}),cell:new T.MeshStandardMaterial({color:'#173e57',metalness:.4,roughness:.38,side:T.DoubleSide}),track:new T.MeshStandardMaterial({color:'#c98f45',metalness:.65,roughness:.45}),grid:new T.MeshStandardMaterial({color:'#718994',roughness:.5})};
 let key='',state,pose=[0,0,0,0],target=[0,0,0,0],moving=[],middle=[],frame=0,last=0,initialized=false;const reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:true};
 function box(p,m,parent){const mesh=new T.Mesh(new T.BoxGeometry(p.width,p.length,p.height),m);mesh.position.set(p.x+p.width/2,p.y+p.length/2,p.z+p.height/2);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function apply(){const a=D.assemblies(state,pose);a.forEach((s,i)=>{moving[i].position.x=s.dx*pose[i];middle[i].position.x=s.dx*pose[i]/2;});onPose([...pose]);requestRender();}
 function tick(now){frame=0;pose=D.step(pose,target,(now-last)/1000,reduced.matches);last=now;apply();if(pose.some((p,i)=>p!==target[i]))frame=requestAnimationFrame(tick);}
 function settle(){if(frame)cancelAnimationFrame(frame);frame=0;pose=[...target];if(state)apply();}
 function update(next){state=next;const d=D.validate(next.upgrades.retractable),k=JSON.stringify([next.upgrades.solar.panels,d.drop,d.directions]);group.visible=d.enabled&&next.upgrades.solar.enabled;
  if(k!==key){key=k;if(frame)cancelAnimationFrame(frame);frame=0;group.traverse(o=>o.geometry?.dispose());group.clear();moving=[];middle=[];for(const s of D.assemblies(next,[0,0,0,0])){const part=new T.Group();part.userData.selectable='slideout-'+s.i;group.add(part);moving.push(part);const p=s.base,{x,y,z,width:w,length:l,height:h}=p;
   for(const xx of [x,x+w-.25])box({x:xx,y,z,width:.25,length:l,height:h},materials.frame,part);for(const yy of [y,y+l-.25])box({x,y:yy,z,width:w,length:.25,height:h},materials.frame,part);
   box({x:x+.25,y:y+.25,z:z+h-.15,width:w-.5,length:l-.5,height:.12},materials.cell,part);
   for(let n=1;n<8;n++)box({x:x+.25,y:y+n*l/8,z:z+h-.025,width:w-.5,length:.04,height:.02},materials.grid,part);
   for(let n=1;n<4;n++)box({x:x+n*w/4,y:y+.25,z:z+h-.025,width:.04,length:l-.5,height:.02},materials.grid,part);
   const bridge=new T.Group();group.add(bridge);middle.push(bridge);for(const t of s.middle)box(t,materials.track,bridge);for(const t of s.tracks)box(t,materials.track,group);for(const t of s.moving)box(t,materials.frame,part);
  }}
  target=[...d.extensions];if(!initialized||!group.visible||reduced.matches||typeof document!=='undefined'&&document.hidden){pose=[...target];initialized=true;settle();}else{if(frame)cancelAnimationFrame(frame);apply();last=performance.now();if(pose.some((p,i)=>p!==target[i]))frame=requestAnimationFrame(tick);}
 }
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});reduced.addEventListener?.('change',()=>{if(reduced.matches)settle();});
 return {group,materials,update,settle,get pose(){return [...pose];}};
}
