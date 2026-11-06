import * as T from './vendor/three.module.js';
import './solar-data.js?v=bi1';
import {RACK_SPEC} from './roof-rack.js?v=rail1';

// Independent chassis circuit and cargo volume. These are configurable placeholders.
export function buildRoofExtras(){
 const group=new T.Group();group.name='Chassis panel and cargo · estimated';group.position.set(...RACK_SPEC.installation.planningOrigin);
 const materials={frame:new T.MeshStandardMaterial({color:'#a4b5bb',metalness:.65,roughness:.4}),cell:new T.MeshStandardMaterial({color:'#174955',metalness:.35,roughness:.4}),grid:new T.MeshStandardMaterial({color:'#7da1ac'}),cargo:new T.MeshStandardMaterial({color:'#818c79',roughness:.85}),trim:new T.MeshStandardMaterial({color:'#28352e',roughness:.7}),support:new T.MeshStandardMaterial({color:'#bd8749',metalness:.4,roughness:.55})};
 let key='';
 function update(value){const E=globalThis.RooflabRoofExtras,v=E.validate(value),next=JSON.stringify(v);group.visible=v.chassis.enabled||v.cargo.enabled;if(key===next)return;key=next;for(const m of [...group.children]){m.geometry.dispose();group.remove(m);}const buckets=new Map();let selected=null;
  function box(x,y,z,w,l,h,material){const g=new T.BoxGeometry(w,l,h);g.translate(x+w/2,y+l/2,z+h/2);const k=(selected||'support')+material.uuid;let b=buckets.get(k);if(!b){b={p:[],n:[],i:[],count:0,material,selected};buckets.set(k,b);}b.p.push(...g.attributes.position.array);b.n.push(...g.attributes.normal.array);for(const i of g.index.array)b.i.push(i+b.count);b.count+=g.attributes.position.count;g.dispose();}
  for(const p of E.envelopes(v)){selected=p.id;const {x,y,z,width:w,length:l,height:h}=p;
   if(p.id==='roof-chassis'){
    for(const xx of [x,x+w-.22])box(xx,y,z,.22,l,h,materials.frame);for(const yy of [y,y+l-.22])box(x,yy,z,w,.22,h,materials.frame);
    box(x+.22,y+.22,z+h-.14,w-.44,l-.44,.12,materials.cell);
    for(let i=1;i<4;i++)box(x+i*w/4,y+.22,z+h-.01,.045,l-.44,.01,materials.grid);
    for(let i=1;i<8;i++)box(x+.22,y+i*l/8,z+h-.01,w-.44,.045,.01,materials.grid);
   }else{
    box(x,y,z,w,l,h-.3,materials.cargo);box(x,y,z+h-.3,w,l,.3,materials.trim);
    for(const xx of [x+.3,x+w-.7])box(xx,y,z+Math.min(h*.55,h-.4),.4,.15,Math.min(1.5,h*.4),materials.trim);
   }
  }
  selected=null;for(const p of E.supports(v))box(p.x,p.y,p.z,p.width,p.length,p.height,materials.support);
  for(const b of buckets.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const m=new T.Mesh(g,b.material);if(b.selected)m.userData.selectable=b.selected;m.castShadow=m.receiveShadow=true;group.add(m);}
  group.userData={dimensionStatus:'estimated',circuit:'chassis separate from house',cargoSupport:'illustrative independent tray and feet; attachment/load path unverified'};
 }
 return {group,materials,update};
}
