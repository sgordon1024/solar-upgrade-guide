'use strict';
const $=s=>document.querySelector(s), KEY='rooflab.v1', provenance=['estimated','measured','manufacturer'];
const observations=[
['Planning rectangle','122 in long × 60 in wide','Owner measured; length is track-referenced. Rectangle location on body and reference endpoints need confirmation.'],
['Starlink','Driver side; front to Starlink 29 in; behind Starlink to rear 69 in; right of Starlink to right side 34 in','Owner measured; edge/datum definitions and meaning of “right” need confirmation. Not converted into a footprint or exact coordinates.'],
['Fan','On centerline; fully open 5 in above side-rail center; use 6 in planning allowance','Owner observation. Side-rail center elevation relative to roof is unresolved. Rendered height is a placeholder, not this measurement.'],
['A/C','6 in above top crossbar','Owner measured; exact crossbar surface reference needs confirmation. Position, footprint and roof-datum height are placeholders.'],
['Crossbar','2 in wide × 1 in tall; top crossbar 6.5 in from roof','Owner measured; confirm whether 6.5 in refers to top, center or bottom. No crossbar layout is preloaded.'],
['Side rail','Slot centers 3 in apart','Owner measured; orientation, rail section and roof-datum elevation need confirmation.'],
['Pending rail reference','4 in from center of lower side rail to bottom of top rail','Owner measured; identity of “top rail” is unresolved. Do not combine with other height datums.']
];
const item=(id,name,kind,x,y,w,l,h,z=0)=>({id,name,kind,x,y,z,width:w,length:l,height:h,rotation:0,dimensionStatus:'estimated',positionStatus:'estimated',evidence:'Illustrative placeholder. Measure the complete installed envelope including mounts and movement.'});
const START={schema:'rooflab',version:1,units:'in',vehicle:'2024 Entegra Launch 19Y / 2023 Sprinter 2500 / owner-reported 144-in wheelbase',roof:{width:60,length:122,status:'measured',evidence:'Owner-measured track-referenced planning area; endpoints require confirmation.'},clearance:0,notes:'Inventory is incomplete. Confirm existing panels, all rooftop accessories, rack geometry and required service zones. Item X/Y coordinates use the front driver-side corner; Z uses roof datum.',observations,items:[item('starlink','Starlink · driver side','starlink',3,29,20,24,5,3),item('fan','Fan · centerline','fan',21,64,18,18,10),item('ac','Air conditioner','ac',15,91,30,25,12)]};
let state=structuredClone(START),selected='starlink',storageOK=true;
function valid(v){if(!v||v.schema!=='rooflab'||v.version!==1||v.units!=='in')throw Error('Use a Rooflab version 1 file with inches as units.');
 const num=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
 const str=(s,max)=>typeof s==='string'&&s.length<=max;
 if(!v.roof||!num(v.roof.width,10,200)||!num(v.roof.length,20,400)||!provenance.includes(v.roof.status)||!str(v.roof.evidence,2000)||!num(v.clearance,0,24)||!str(v.notes,12000)||!Array.isArray(v.items)||v.items.length>60)throw Error('Invalid roof, notes, clearance, or item count (maximum 60).');
 const ids=new Set();for(const i of v.items){if(!i||!str(i.id,80)||!i.id||ids.has(i.id)||!str(i.name,100)||!i.name.trim()||!['solar','custom','crossbar','starlink','fan','ac'].includes(i.kind)||!['x','y'].every(k=>num(i[k],-500,500))||!num(i.z,0,200)||!['width','length','height'].every(k=>num(i[k],0.1,400))||![0,90].includes(i.rotation)||!provenance.includes(i.dimensionStatus)||!provenance.includes(i.positionStatus)||!str(i.evidence,2000))throw Error('Invalid equipment. Check dimensions, positions, source labels and unique IDs.');ids.add(i.id);}
 return {schema:'rooflab',version:1,units:'in',vehicle:START.vehicle,roof:{width:v.roof.width,length:v.roof.length,status:v.roof.status,evidence:v.roof.evidence},clearance:v.clearance,notes:v.notes,observations:structuredClone(observations),items:v.items.map(i=>Object.fromEntries(Object.keys(START.items[0]).map(k=>[k,i[k]])))};
}
try{const s=localStorage.getItem(KEY);if(s)state=valid(JSON.parse(s));}catch(e){storageOK=false;}
function toast(t){$('#message').textContent=t;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#message').textContent='',6500);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}$('#save').textContent=storageOK?'Saved on this device only. Export to share or back up.':'Storage unavailable or saved data invalid. Export to keep this session.';}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const options=value=>provenance.map(p=>`<option ${value===p?'selected':''} value="${p}">${p[0].toUpperCase()+p.slice(1)}</option>`).join('');
function field(label,key,value,min,max){return `<label>${label}<input name="${key}" type="number" value="${value}" min="${min}" max="${max}" step="0.1" required></label>`;}
function bounds(i){return {...i,w:i.rotation===90?i.length:i.width,l:i.rotation===90?i.width:i.length};}
function check(s){let out=[];const c=s.clearance;for(const i of s.items){const b=bounds(i);if(b.x-c<0||b.y-c<0||b.x+b.w+c>s.roof.width||b.y+b.l+c>s.roof.length)out.push(`${i.name}: box or clearance margin extends outside the planning rectangle.`);}
 for(let a=0;a<s.items.length;a++)for(let b=a+1;b<s.items.length;b++){const i=bounds(s.items[a]),j=bounds(s.items[b]);if(i.x-c<=j.x+j.w+c&&i.x+i.w+c>=j.x-c&&i.y-c<=j.y+j.l+c&&i.y+i.l+c>=j.y-c&&i.z-c<=j.z+j.height+c&&i.z+i.height+c>=j.z-c)out.push(`${i.name} + ${j.name}: boxes or clearance margins touch/overlap.`);}
 return out;
}
function renderUI(){if(!state.items.some(i=>i.id===selected))selected=state.items[0]?.id;$('#count').textContent=`${state.items.length} items`;
 $('#items').innerHTML=state.items.map(i=>`<button class="item" data-id="${esc(i.id)}" aria-pressed="${i.id===selected}"><span>${esc(i.name)}<small>${i.width} × ${i.length} × ${i.height} in · ${i.dimensionStatus} size<br>${i.positionStatus} position</small></span><span class="dot" style="background:${color(i)}"></span></button>`).join('');
 const i=state.items.find(i=>i.id===selected);$('#editor').innerHTML=i?`<h3>EDIT SELECTED EQUIPMENT</h3><label>Name<input name="name" maxlength="100" required value="${esc(i.name)}"></label><div class="grid">${field('Width (in)','width',i.width,.1,400)}${field('Length (in)','length',i.length,.1,400)}${field('Height (in)','height',i.height,.1,400)}<label>Rotation<select name="rotation"><option value="0" ${i.rotation===0?'selected':''}>0°</option><option value="90" ${i.rotation===90?'selected':''}>90°</option></select></label>${field('X · from driver edge','x',i.x,-500,500)}${field('Y · from front edge','y',i.y,-500,500)}${field('Z · bottom above roof','z',i.z,0,200)}</div><p class="small">X/Y locate the corner nearest the origin after rotation. Raising Z can hide a box overlap; supports, airflow and moving parts still need review.</p><div class="grid"><label>Dimensions source<select name="dimensionStatus">${options(i.dimensionStatus)}</select></label><label>Position source<select name="positionStatus">${options(i.positionStatus)}</select></label></div><label>Evidence / source / uncertainty<textarea name="evidence" maxlength="2000" rows="3">${esc(i.evidence)}</textarea></label><button type="button" class="delete" id="delete">Remove item</button>`:'<p>Add equipment to explore a layout.</p>';
 $('#roof-form').innerHTML=field('Planning width (in)','width',state.roof.width,10,200)+field('Planning length (in)','length',state.roof.length,20,400)+`<label>Dimension source<select name="status">${options(state.roof.status)}</select></label><label>Evidence<input name="evidence" maxlength="2000" value="${esc(state.roof.evidence)}"></label>`;
 $('#clearance').value=state.clearance;$('#notes').value=state.notes;updateChecks();draw();}
function updateChecks(){const issues=check(state);$('#check-title').textContent=issues.length?`${issues.length} geometry flags`:'No box conflicts detected';$('#checks').innerHTML=(issues.length?issues.map(s=>`<li>${esc(s)}</li>`).join(''):'<li>No overlap or edge overrun at the entered dimensions.</li>')+'<li>Fit remains unverified: estimated geometry, unmodeled equipment and service/movement zones can change this result.</li>';}
$('#items').onclick=e=>{const b=e.target.closest('[data-id]');if(b){selected=b.dataset.id;renderUI();}};
$('#editor').onsubmit=e=>e.preventDefault();$('#roof-form').onsubmit=e=>e.preventDefault();
$('#editor').onchange=e=>{const el=e.target,i=state.items.find(i=>i.id===selected);if(!i||!el.name)return;if(!el.checkValidity()){el.reportValidity();return;}const numeric=['width','length','height','x','y','z','rotation'];i[el.name]=numeric.includes(el.name)?Number(el.value):el.value;if(['width','length','height'].includes(el.name))i.dimensionStatus='estimated';if(['x','y','z','rotation'].includes(el.name))i.positionStatus='estimated';save();renderUI();};
$('#editor').onclick=e=>{if(e.target.id==='delete'){state.items=state.items.filter(i=>i.id!==selected);save();renderUI();}};
$('#roof-form').onchange=e=>{if(!e.target.checkValidity()){e.target.reportValidity();return;}const n=e.target.name;state.roof[n]=['width','length'].includes(n)?Number(e.target.value):e.target.value;if(['width','length'].includes(n))state.roof.status='estimated';save();renderUI();};
$('#clearance').onchange=e=>{if(!e.target.checkValidity()){e.target.reportValidity();return;}state.clearance=Number(e.target.value);save();updateChecks();draw();};$('#notes').oninput=e=>{state.notes=e.target.value;save();};
$('#add').onclick=()=>{if(state.items.length>=60)return toast('Maximum 60 items.');const k=$('#kind').value,i=k==='solar'?item(crypto.randomUUID(),'Solar panel · concept',k,5,5,26,58,1.4,8):k==='crossbar'?item(crypto.randomUUID(),'Crossbar · concept',k,0,10,state.roof.width,2,1,5.5):item(crypto.randomUUID(),'Custom equipment',k,5,5,20,20,5);state.items.push(i);selected=i.id;save();renderUI();};
$('#export').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.href=url;a.download='rooflab-specs.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Specs exported. Notes and evidence are included.');};
$('#import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>250000)throw Error('File exceeds 250 KB limit.');const next=valid(JSON.parse(await f.text()));state=next;save();renderUI();toast('Specs imported and saved on this device.');}catch(err){toast(`Import rejected: ${err.message}. Existing layout kept.`);}e.target.value='';};
$('#reset').onclick=()=>$('#reset-dialog').showModal();$('#cancel-reset').onclick=()=>$('#reset-dialog').close();$('#confirm-reset').onclick=()=>{state=structuredClone(START);save();renderUI();$('#reset-dialog').close();};
$('#observations').innerHTML=observations.map(([title,value,note])=>`<div class="observation"><strong>${esc(title)} · ${esc(value)}</strong><span>${esc(note)}</span></div>`).join('');
// Small orthographic 3D renderer: world geometry in inches, painter-sorted box faces.
const canvas=$('#scene'),ctx=canvas.getContext('2d');let yaw=-2.45,pitch=.66,zoom=1,view='orbit',screenW=700,screenH=490;
function color(i){return i.dimensionStatus==='estimated'||i.positionStatus==='estimated'?'#c4944b':i.dimensionStatus==='manufacturer'||i.positionStatus==='manufacturer'?'#5d8fb4':'#398d7a';}
function project(x,y,z){x-=state.roof.width/2;y-=state.roof.length/2;const u=x*Math.cos(yaw)-y*Math.sin(yaw),v=x*Math.sin(yaw)+y*Math.cos(yaw);const scale=(view==='top'?Math.min(screenW/(state.roof.width+70),screenH/(state.roof.length+45)):Math.min(screenW/300,screenH/245))*zoom;return [screenW/2+u*scale,screenH*(view==='top'?.5:.40)+(v*Math.sin(pitch)-z*Math.cos(pitch))*scale,v*Math.cos(pitch)+z*Math.sin(pitch)];}
function shade(hex,k){const n=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,((n>>16)&255)*k)},${Math.min(255,((n>>8)&255)*k)},${Math.min(255,(n&255)*k)})`;}
function draw(){if(!ctx)return;const r=canvas.getBoundingClientRect();screenW=r.width||700;screenH=r.height||490;const d=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(screenW*d)||canvas.height!==Math.round(screenH*d)){canvas.width=Math.round(screenW*d);canvas.height=Math.round(screenH*d);}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,screenW,screenH);
 const faces=[],labels=[];
 function box(x,y,z,w,l,h,col,outline=false){const p=[[x,y,z],[x+w,y,z],[x+w,y+l,z],[x,y+l,z],[x,y,z+h],[x+w,y,z+h],[x+w,y+l,z+h],[x,y+l,z+h]].map(v=>project(...v));[[0,1,2,3],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]].forEach((ids,k)=>faces.push({p:ids.map(n=>p[n]),depth:ids.reduce((a,n)=>a+p[n][2],0)/4,col:shade(col,[.65,.8,.85,.7,.75,1.12][k]),outline}));}
 // Original low-poly Sprinter-style exterior. Appearance is estimated, not factory CAD.
 if(view!=='top'){
  const cx=state.roof.width/2, body='#c7cebc', trim='#26372f', glass='#27483e';
  function poly(v,col){const p=v.map(q=>project(...q));faces.push({p,depth:p.reduce((a,q)=>a+q[2],0)/p.length,col,outline:false,noStroke:true});}
  function ring(y,top){return [[cx-35,y,-82],[cx-40,y,-72],[cx-41,y,Math.min(-29,top-8)],[cx-36,y,top-4],[cx-31,y,top],[cx+31,y,top],[cx+36,y,top-4],[cx+41,y,Math.min(-29,top-8)],[cx+40,y,-72],[cx+35,y,-82]];}
  const rings=[ring(-68,-49),ring(-53,-42),ring(-26,-8),ring(-12,0),ring(9,0),ring(66,0),ring(86,0),ring(142,0),ring(150,0),ring(166,-5)];
  for(let n=0;n<rings.length-1;n++)for(let k=0;k<10;k++)poly([rings[n][k],rings[n+1][k],rings[n+1][(k+1)%10],rings[n][(k+1)%10]],shade(body,[.70,.80,.92,1.03,1.08,1.03,.92,.83,.75,.66][k]));
  poly([...rings[0]].reverse(),shade(body,.85));poly(rings.at(-1),shade(body,.88));
  // Hood, swept windshield, grille and lamps.
  poly([[cx-32,-52.8,-41],[cx+32,-52.8,-41],[cx+30,-27,-9],[cx-30,-27,-9]],glass);
  poly([[cx-30,-52,-40.3],[cx-12,-52,-40.3],[cx+19,-27,-8.6],[cx+8,-27,-8.6]],'#618274');
  box(cx-31,-70,-68,62,2,15,trim);box(cx-40,-70,-79,80,4,9,'#344539');
  for(let n=0;n<3;n++)box(cx-19,-70.3,-64+n*3,38,.3,.6,'#aab49d');
  box(cx-36,-70.4,-57,15,.4,5,'#f7e4af');box(cx+21,-70.4,-57,15,.4,5,'#f7e4af');
  box(cx-7,-72.3,-74,14,.4,4,'#a3ad98');
  // Cab glass and camper side windows. Their locations are illustrative.
  for(const side of [-1,1]){
   const xx=cx+side*41.2;
   poly([[xx,-49,-43],[xx,-25,-13],[xx,-4,-13],[xx,-4,-43]],glass);
   poly([[xx,9,-15],[xx,66,-15],[xx,66,-43],[xx,9,-43]],glass);
   poly([[xx,86,-15],[xx,142,-15],[xx,142,-43],[xx,86,-43]],glass);
   poly([[xx,12,-16],[xx,23,-16],[xx,61,-42],[xx,50,-42]],'#517665');
   // Door seam strips, handles, sill and mirror assemblies.
   box(xx,-2,-72,.25,.5,60,'#71836d');box(xx,73,-72,.25,.5,60,'#71836d');
   box(xx,-12,-49,.8,5,1.8,trim);box(xx,65,-49,.8,5,1.8,trim);
   box(cx+side*40,-17,-81,side*5,91,3,'#2b3f31');
   box(cx+side*43,-42,-39,side*4,3,2,trim);box(cx+side*47,-44,-42,side*3,8,11,trim);
  }
  // Rear doors, black window surrounds, lamps and bumper.
  for(const side of [-1,1]){const x=cx+(side<0?-30:3);box(x,166.3,-38,27,.35,24,glass);box(cx+side*36,166.8,-63,3,.5,19,'#ad5033');}
  box(cx-.25,166.7,-78,.5,.3,71,'#6c806a');box(cx-39,165,-82,78,5,5,trim);
  // Round wheels: 144-inch axle spacing is owner-reported; tires/stance are estimates.
  function wheel(x,y){const z=-83,r=14.5,depth=8,N=20;for(let k=0;k<N;k++){const a=k/N*Math.PI*2,b=(k+1)/N*Math.PI*2;const p=[y+Math.cos(a)*r,z+Math.sin(a)*r],q=[y+Math.cos(b)*r,z+Math.sin(b)*r];poly([[x,p[0],p[1]],[x+depth,p[0],p[1]],[x+depth,q[0],q[1]],[x,q[0],q[1]]],shade('#26372e',.85+.15*Math.sin(a)));}
   for(const end of [x,x+depth]){const pts=Array.from({length:N},(_,k)=>[end,y+Math.cos(k/N*Math.PI*2)*r,z+Math.sin(k/N*Math.PI*2)*r]);poly(pts,'#26372e');const offset=end===x?-.15:.15;poly(Array.from({length:N},(_,k)=>[end+offset,y+Math.cos(k/N*Math.PI*2)*8,z+Math.sin(k/N*Math.PI*2)*8]),'#909e88');poly(Array.from({length:12},(_,k)=>[end+offset*2,y+Math.cos(k/12*Math.PI*2)*4,z+Math.sin(k/12*Math.PI*2)*4]),'#384c3b');}}
  for(const y of [-36,108]){wheel(cx-47,y);wheel(cx+39,y);}
 }

 box(0,0,-1,state.roof.width,state.roof.length,1,'#719e8a');
 for(const i of state.items){const b=bounds(i);box(i.x,i.y,i.z,b.w,b.l,i.height,color(i),i.id===selected);if(i.kind==='starlink'){box(i.x+.8,i.y+.8,i.z+i.height+.02,Math.max(.1,b.w-1.6),Math.max(.1,b.l-1.6),.1,'#dfdcc5');}if(i.kind==='fan'){box(i.x+b.w*.15,i.y+b.l*.15,i.z+i.height+.02,b.w*.7,b.l*.7,.1,'#66775a');}if(i.kind==='ac'){for(let k=1;k<8;k++)box(i.x+b.w*.2,i.y+b.l*k/9,i.z+i.height+.03,b.w*.6,.35,.05,'#6f765c');}if(i.kind==='solar'){for(let x=1;x<4;x++)box(i.x+b.w*x/4-.15,i.y+.5,i.z+i.height+.05,.3,b.l-1,.05,'#e4c695');for(let y=1;y<7;y++)box(i.x+.5,i.y+b.l*y/7-.15,i.z+i.height+.05,b.w-1,.3,.05,'#e4c695');}labels.push({p:project(i.x+b.w/2,i.y+b.l/2,i.z+i.height+1),text:i.name.split(' ·')[0],selected:i.id===selected});}
 faces.sort((a,b)=>a.depth-b.depth);for(const f of faces){ctx.beginPath();f.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f.col;ctx.fill();ctx.strokeStyle=f.outline?'#ffe2a9':'#314c3d55';ctx.lineWidth=f.outline?1.8:.6;if(!f.noStroke)ctx.stroke();}
 function line(a,b,c='#346f5c66'){a=project(...a);b=project(...b);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=c;ctx.lineWidth=.7;ctx.stroke();}
 if(view==='top'){for(let x=0;x<=state.roof.width;x+=12)line([x,0,.01],[x,state.roof.length,.01]);for(let y=0;y<=state.roof.length;y+=12)line([0,y,.01],[state.roof.width,y,.01]);}
 ctx.textAlign='center';ctx.font='600 10px system-ui';for(const l of labels){const w=ctx.measureText(l.text).width;ctx.fillStyle=l.selected?'#183f38':'#fcfdf5e8';ctx.fillRect(l.p[0]-w/2-7,l.p[1]-9,w+14,19);ctx.fillStyle=l.selected?'#fff':'#334e43';ctx.fillText(l.text,l.p[0],l.p[1]+4);}
 function label(t,x,y,z){const p=project(x,y,z);ctx.fillStyle='#e0e5c8';ctx.font='600 10px system-ui';ctx.fillText(t,p[0],p[1]);}
 label('FRONT',state.roof.width/2,-12,0);label('REAR',state.roof.width/2,state.roof.length+12,0);if(view==='top'){label('DRIVER',-18,state.roof.length/2,0);label('PASSENGER',state.roof.width+24,state.roof.length/2,0);}ctx.textAlign='left';ctx.fillStyle='#cfddc0';ctx.font='10px system-ui';ctx.fillText(`${state.roof.width} × ${state.roof.length} in planning area · ${state.roof.status}`,15,screenH-12);
}
let cameraFrame=0;
function moveCamera(target){cancelAnimationFrame(cameraFrame);if(matchMedia('(prefers-reduced-motion: reduce)').matches){({yaw,pitch,zoom}=target);draw();return;}const start={yaw,pitch,zoom},t0=performance.now();function frame(t){const p=Math.min(1,(t-t0)/330),ease=1-Math.pow(1-p,3);yaw=start.yaw+(target.yaw-start.yaw)*ease;pitch=start.pitch+(target.pitch-start.pitch)*ease;zoom=start.zoom+(target.zoom-start.zoom)*ease;draw();if(p<1)cameraFrame=requestAnimationFrame(frame);}cameraFrame=requestAnimationFrame(frame);}
function setView(v){view=v;const target=v==='top'?{yaw:0,pitch:Math.PI/2,zoom:1}:v==='side'?{yaw:Math.PI/2,pitch:0,zoom:1}:{yaw:-2.45,pitch:.66,zoom:1};for(const n of ['orbit','top','side'])$('#'+n).setAttribute('aria-pressed',String(v===n));moveCamera(target);}
for(const v of ['orbit','top','side'])$('#'+v).onclick=()=>setView(v);$('#home').onclick=()=>setView('orbit');function zoomBy(n){moveCamera({yaw,pitch,zoom:Math.min(2.5,Math.max(.5,zoom*n))});}$('#zoomin').onclick=()=>zoomBy(1.15);$('#zoomout').onclick=()=>zoomBy(1/1.15);
let drag=null;canvas.onpointerdown=e=>{cancelAnimationFrame(cameraFrame);drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.009;pitch=Math.min(1.55,Math.max(.08,pitch+(e.clientY-drag.y)*.007));drag={x:e.clientX,y:e.clientY};view='orbit';for(const n of ['orbit','top','side'])$('#'+n).setAttribute('aria-pressed',String(n==='orbit'));draw();};canvas.onpointerup=canvas.onpointercancel=()=>drag=null;canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key)){e.preventDefault();cancelAnimationFrame(cameraFrame);if(e.key==='+'||e.key==='=')zoomBy(1.1);else if(e.key==='-')zoomBy(1/1.1);else{yaw+=e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0;pitch=Math.max(.08,Math.min(1.55,pitch+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));draw();}}};new ResizeObserver(draw).observe(canvas);
renderUI();$('#save').textContent=storageOK?'Saved on this device only. Export to share or back up.':'Saved data could not be loaded or storage is unavailable. Export to keep this session.';
