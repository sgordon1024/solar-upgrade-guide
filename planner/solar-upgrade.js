import * as T from './vendor/three.module.js';
import './solar-data.js?v=rail1';
import {RACK_SPEC} from './roof-rack.js?v=rail1';

// Original panel envelopes and generic supports. No product mounting CAD claimed.
export function buildSolarUpgrade(){
 const group=new T.Group();group.name='Proposed 800 W solar · estimated mounting';group.position.set(...RACK_SPEC.installation.planningOrigin);
 const materials={frame:new T.MeshStandardMaterial({color:'#a0aeb2',metalness:.75,roughness:.38}),cell:new T.MeshStandardMaterial({color:'#142d40',metalness:.42,roughness:.34}),grid:new T.MeshStandardMaterial({color:'#647d89',metalness:.5,roughness:.5}),support:new T.MeshStandardMaterial({color:'#bd8749',metalness:.4,roughness:.55}),black:new T.MeshStandardMaterial({color:'#171f22',roughness:.8})};
 let key='';
 function update(value){const v=globalThis.RooflabSolar.validate(value),next=JSON.stringify(v.panels);group.visible=v.enabled;if(next===key)return;key=next;for(const c of [...group.children]){c.geometry.dispose();group.remove(c);}const buckets=new Map(),panelBounds=[];let panelIndex=null;
  function box(c,s,m){const g=new T.BoxGeometry(...s);g.translate(...c);const key=String(panelIndex)+':'+m.uuid;let b=buckets.get(key);if(!b){b={p:[],n:[],i:[],count:0,material:m,panelIndex};buckets.set(key,b);}b.p.push(...g.attributes.position.array);b.n.push(...g.attributes.normal.array);for(const i of g.index.array)b.i.push(i+b.count);b.count+=g.attributes.position.count;g.dispose();}
  const panels=globalThis.RooflabSolar.envelopes(v);
  for(const [i,p] of panels.entries()){
   panelIndex=i;const {x,y,z,width:w,length:l,height:h}=p;
   panelBounds.push(new T.Box3(new T.Vector3(x,y,z),new T.Vector3(x+w,y+l,z+h)));
   // Open underside and perimeter frame, not a solid colored slab.
   for(const xx of [x+.12,x+w-.12])box([xx,y+l/2,z+h/2],[.24,l,h],materials.frame);
   for(const yy of [y+.12,y+l-.12])box([x+w/2,yy,z+h/2],[w-.48,.24,h],materials.frame);
   box([x+w/2,y+l/2,z+h-.1],[w-.5,l-.5,.12],materials.cell);
   const cols=p.rotation===90?16:4,rows=p.rotation===90?4:16;
   for(let a=1;a<cols;a++)box([x+.25+a*(w-.5)/cols,y+l/2,z+h-.025],[.045,l-.5,.015],materials.grid);
   for(let a=1;a<rows;a++)box([x+w/2,y+.25+a*(l-.5)/rows,z+h-.025],[w-.5,.045,.015],materials.grid);
   box([x+w/2,y+l*.23,z+h-.5],[3.8,2.7,.65],materials.black); // junction-box envelope, estimated

  }
  panelIndex=null;const supports=globalThis.RooflabSolar.supports(v);
  for(const p of supports)box([p.x+p.width/2,p.y+p.length/2,p.z+p.height/2],[p.width,p.length,p.height],materials.support);
  for(const b of buckets.values()){const material=b.material;const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(b.p,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));geometry.setIndex(b.i);const mesh=new T.Mesh(geometry,material);if(b.panelIndex!==null)mesh.userData.selectable='proposal-'+b.panelIndex;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}
  group.userData={proposed:true,dimensionStatus:'manufacturer-panel-envelope',mountingStatus:'estimated',panelBounds,riserCount:supports.filter(p=>p.name.startsWith('Raised span')).length*2};
 }
 return {group,materials,update};
}
