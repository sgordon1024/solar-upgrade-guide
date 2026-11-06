(function(){
 const D=RooflabRetractable,N=RooflabSnapshots,dialog=$('#slideout-dialog'),favorites=$('#snapshot-dialog');let undo=null,restoreUndo=null,pose=[0,0,0,0],lastPanel='proposal-0';
 const download=(data,name)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 function view(){return {layers:Object.fromEntries([...document.querySelectorAll('input[id^="show-"]')].map(n=>[n.id,n.checked])),environment:document.querySelector('[name=environment]:checked')?.value||'white'};}
 function applyView(v){for(const [id,value]of Object.entries(v.layers||{})){const el=document.getElementById(id);if(el?.type==='checkbox'&&id.startsWith('show-')&&typeof value==='boolean'){el.checked=value;el.dispatchEvent(new Event('change'));}}const e=[...document.querySelectorAll('[name=environment]')].find(e=>e.value===v.environment);if(e){e.checked=true;e.dispatchEvent(new Event('change'));}}
 function show(d){window.rooflabInterface?.close(false);if(dialog.open)dialog.close();if(favorites.open)favorites.close();d.showModal();}
 function report(){return D.report(state);}
 function render(){if(undo&&(JSON.stringify(state.upgrades.retractable)!==undo.after||state.upgrades.solar.enabled!==undo.afterSolar))undo=null;const v=D.validate(state.upgrades.retractable),r=report();$('#slide-enabled').checked=v.enabled;$('#slide-enabled').disabled=!state.upgrades.solar.enabled;$('#slide-prerequisite').hidden=state.upgrades.solar.enabled;$('#slide-drop').value=v.drop;$('#slide-dock').hidden=!r.active;$('#slide-status').textContent=r.active?`1600 W nominal house array · ${r.fullyExtended} fully extended · ${r.partiallyExtended} partial · ${r.stowed} stowed`:'Optional concept off · fixed layout unchanged';$('#slide-footprint').textContent=`Full-extension panel footprint: ${r.deployedFootprint.width.toFixed(1)} × ${r.deployedFootprint.length.toFixed(1)} in. Panel undersides: ${r.geometry.map(s=>s.base.z.toFixed(2)).join(', ')} in above the estimated roof datum. Tracks extend another 0.85 in below these panels.`;
 for(let i=0;i<4;i++){const range=$('#slide-range-'+i);range.value=v.extensions[i]*100;range.disabled=!r.active;$('#slide-value-'+i).textContent=Math.round(v.extensions[i]*100)+'% extension';$('#slide-direction-'+i).value=v.directions[i];$('#slide-direction-'+i).disabled=!r.active||v.extensions[i]>0||pose[i]>.0001;}
 for(const b of document.querySelectorAll('[data-slide-all]'))b.disabled=!r.active;
 $('#slide-undo').hidden=!undo;$('#slide-contact-count').textContent=r.contacts.length+' screened contacts · includes full travel';$('#slide-contacts').innerHTML=r.contacts.length?r.contacts.map(c=>`<li>${esc(c.phase)} · slider ${c.panel}: ${esc(c.part)} intersects ${esc(c.obstacle)}.</li>`).join(''):'<li>No box intersection found. Unseen brackets, cable loops, ventilation and required clearances remain unverified.</li>';$('#slide-warning').textContent=r.active?(r.contacts.length?'Interference found. This geometry is not ready to build. Open Clearance review for stowed, current and full-path contacts.':'Box screen only. Mechanical, electrical and structural design remain unverified.'):'Enable to examine the extra panels without changing the fixed array.';
 $('#slide-dock-status').textContent=r.contacts.length?'Concept · interference flagged':'Concept · fit unverified';
 }
 function commit(mutator){const before=structuredClone(D.validate(state.upgrades.retractable)),beforeSolar=state.upgrades.solar.enabled;mutator();undo={before,beforeSolar,afterSolar:state.upgrades.solar.enabled,after:JSON.stringify(state.upgrades.retractable)};save();renderSolarControls();draw();render();window.rooflabRefreshEditor?.();}
 function open(){render();show(dialog);}
 $('#open-slideouts').onclick=open;$('#slide-dock-open').onclick=open;$('#slide-close').onclick=()=>{dialog.close();window.rooflabView?.showSlideouts?.();};
 $('#slide-enabled').onchange=e=>commit(()=>{state.upgrades.retractable.enabled=e.target.checked;});
 for(let i=0;i<4;i++){$('#slide-range-'+i).oninput=e=>{$('#slide-value-'+i).textContent=e.target.value+'% extension';};$('#slide-range-'+i).onchange=e=>commit(()=>{state.upgrades.retractable.extensions[i]=Number(e.target.value)/100;});$('#slide-direction-'+i).onchange=e=>{if(state.upgrades.retractable.extensions[i]||pose[i]>.0001){render();return;}commit(()=>{state.upgrades.retractable.directions[i]=Number(e.target.value);});};}
 $('#slide-drop').onchange=e=>{if(!e.target.checkValidity()){e.target.reportValidity();return;}commit(()=>{state.upgrades.retractable.drop=Number(e.target.value);});};
 for(const b of document.querySelectorAll('[data-slide-all]'))b.onclick=()=>{commit(()=>{state.upgrades.retractable.extensions.fill(Number(b.dataset.slideAll));});if(dialog.open)dialog.close();window.rooflabView?.showSlideouts?.();};
 $('#slide-undo').onclick=()=>{if(!undo)return;state.upgrades.retractable=undo.before;state.upgrades.solar.enabled=undo.beforeSolar;undo=null;save();renderSolarControls();draw();render();window.rooflabRefreshEditor?.();};
 $('#slide-export').onclick=()=>download({schema:'rooflab-retractable-review',version:1,layout:structuredClone(state),review:report()},'rooflab-slideout-review.json');
 window.rooflabSlidePose=p=>{pose=p;for(let i=0;i<4;i++)$('#slide-direction-'+i).disabled=!state.upgrades.retractable.enabled||state.upgrades.retractable.extensions[i]>0||p[i]>.0001;};
 function editRoof(){if(dialog.open)dialog.close();window.rooflabSelectPanel?.(lastPanel);}
 $('#slide-dock-edit').onclick=editRoof;$('#slide-edit-roof').onclick=editRoof;
 window.rooflabTapSolar=id=>{
  const editing=!!window.rooflabRoofEditing?.();
  if(editing){const intent=D.tapPanel(state,id,true);if(intent.kind==='edit')window.rooflabSelectPanel?.(intent.id);return;}
  let result;commit(()=>{result=D.tapPanel(state,id);});
  if(result.kind==='ignore')return;
  lastPanel=id.startsWith('slideout-')||id.startsWith('existing-')?'proposal-'+id.slice(9):id;
  const message=(result.enabledNow?'Slide-out preview enabled. ':'')+(result.kind==='deploy'?'Deploying all four extra panels.':'Stowing all four extra panels.')+' Fixed positions unchanged. Use Edit roof to move or rotate panels.';
  $('#interaction-status').textContent=message;toast(message);
 };
 window.rooflabOpenSlideouts=open;window.rooflabRefreshSlideouts=render;
 function records(){return N.parse(localStorage.getItem(N.KEY),valid).entries;}
 function list(){try{const a=records();$('#snapshot-list').innerHTML=a.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');$('#snapshot-restore').disabled=$('#snapshot-download').disabled=!a.length;$('#snapshot-status').textContent=a.length?`${a.length} named layouts stored privately in this browser. Download for a durable backup.`:'No named snapshots saved in this browser. Your exact favorite is not backed up until you save or export it on its actual device.';}catch(e){$('#snapshot-status').textContent=e.message;}}
 $('#open-snapshots').onclick=()=>{list();show(favorites);};$('#snapshot-close').onclick=()=>favorites.close();
 $('#snapshot-save').onclick=()=>{try{const s=N.create(state,$('#snapshot-name').value,view(),valid);try{N.append(localStorage,s,valid);list();$('#snapshot-status').textContent='Saved and read back: '+s.name+'. Download requested; keep the JSON outside browser storage.';}catch(e){$('#snapshot-status').textContent='Browser save failed: '+e.message+' Download requested; keep the JSON backup.';}download(s,'rooflab-favorite-'+s.createdAt.replace(/[:.]/g,'-')+'.json');}catch(e){$('#snapshot-status').textContent='Snapshot failed: '+e.message;}};
 $('#snapshot-download').onclick=()=>{try{const s=records().find(s=>s.id===$('#snapshot-list').value);if(s)download(s,'rooflab-named-layout.json');}catch(e){$('#snapshot-status').textContent=e.message;}};
 $('#snapshot-restore').onclick=()=>{try{const s=records().find(s=>s.id===$('#snapshot-list').value);if(!s)return;restoreUndo={layout:structuredClone(state),view:view()};window.rooflabInvalidatePanelUndo?.();state=valid(s.layout);save();renderUI();applyView(s.view);render();$('#snapshot-undo').hidden=false;$('#snapshot-status').textContent='Restored '+s.name+'. Undo is available until reload or another restore.';}catch(e){$('#snapshot-status').textContent='Restore failed: '+e.message;}};
 $('#snapshot-undo').onclick=()=>{if(!restoreUndo)return;window.rooflabInvalidatePanelUndo?.();state=valid(restoreUndo.layout);save();renderUI();applyView(restoreUndo.view);restoreUndo=null;render();$('#snapshot-undo').hidden=true;$('#snapshot-status').textContent='Previous layout restored.';};
 window.rooflabInvalidateSnapshotUndo=()=>{window.rooflabInvalidatePanelUndo?.();restoreUndo=null;undo=null;$('#snapshot-undo').hidden=true;};
 window.rooflabAfterImport=data=>{if(data.schema==='rooflab-snapshot')applyView(N.validate(data,valid).view);};
 window.rooflabUnwrapImport=data=>data.schema==='rooflab-snapshot'?N.validate(data,valid).layout:['rooflab-retractable-review','rooflab-panel-comparison'].includes(data.schema)?valid(data.layout):data;
 render();
})();
