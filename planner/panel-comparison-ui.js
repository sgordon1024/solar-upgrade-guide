(function(){
 const C=RooflabPanelComparison,S=RooflabSolar,dialog=$('#panel-comparison-dialog');let undo=null;
 const select=(id,label)=>`<label>${label}<select id="${id}"><option value="mono">Monofacial · HSP200N-64L</option><option value="bifacial">Bifacial · HSP200N-64LT</option><option value="mixed" disabled>Mixed selection</option></select></label>`;
 for(const bank of ['fixed','sliding']){$('#panel-'+bank+'-choices').innerHTML=Array.from({length:4},(_,i)=>select('panel-'+bank+'-'+i,'Panel '+(i+1))).join('');}
 function render(){const choices=C.types(state),r=C.report(state);if(undo&&JSON.stringify(choices)!==undo.after)undo=null;$('#panel-type-undo').hidden=!undo;
 for(const bank of ['fixed','sliding']){const all=choices[bank].every(v=>v===choices[bank][0])?choices[bank][0]:'mixed';$('#panel-'+bank+'-all').value=all;for(let i=0;i<4;i++)$('#panel-'+bank+'-'+i).value=choices[bank][i];}
 $('#panel-comparison-state').textContent=(state.upgrades.solar.enabled?'Fixed array visible':'Fixed array preview off')+' · '+(r.activeHouseNameplateW===1600?'slide-outs enabled':'slide-outs off')+'. Changing type keeps X/Y/Z, rotations, deployment and visibility.';
 $('#panel-comparison-mass').textContent=`Selected fixed panels: ${r.massLb.fixed.toFixed(2)} lb. Sliding panels: ${r.massLb.sliding.toFixed(2)} lb. All eight: ${r.massLb.selectedEight.toFixed(2)} lb before hardware. Active illustration: ${r.massLb.active.toFixed(2)} lb of panels.`;
 $('#panel-comparison-power').textContent=`Visible house selection: ${r.activeHouseNameplateW} W front-side nameplate. Four panels: 800 W; eight: 1600 W. No rear-side bonus or guaranteed output. Chassis: ${r.separateChassisW} W on its separate circuit.`;
 $('#panel-comparison-warnings').innerHTML=r.warnings.map(x=>`<li>${esc(x)}</li>`).join('');$('#panel-comparison-contacts').textContent=r.clearanceContacts.length+' slide-out contacts (including full sweep); see Slide-out solar → Clearance review.';
 $('#panel-preview').hidden=state.upgrades.solar.enabled;
 }
 function commit(bank,values){const before=C.types(state);C.apply(state,bank,values);undo={before,after:JSON.stringify(C.types(state))};refresh();}
 function refresh(){save();renderSolarControls();draw();window.rooflabRefreshEditor?.();window.rooflabRefreshSlideouts?.();render();}
 function open(){window.rooflabInterface?.close(false);for(const id of ['#slideout-dialog','#roof-edit-dialog'])if($(id).open)$(id).close();render();dialog.showModal();}
 $('#open-panel-comparison').onclick=open;$('#slide-panel-comparison').onclick=open;$('#roof-panel-comparison').onclick=open;
 $('#panel-comparison-close').onclick=()=>{dialog.close();if(state.upgrades.retractable.enabled&&state.upgrades.solar.enabled)window.rooflabView?.showSlideouts?.();};
 for(const bank of ['fixed','sliding']){$('#panel-'+bank+'-all').onchange=e=>commit(bank,Array(4).fill(e.target.value));for(let i=0;i<4;i++)$('#panel-'+bank+'-'+i).onchange=e=>{const a=C.types(state)[bank];a[i]=e.target.value;commit(bank,a);};}
 $('#panel-all-mono').onclick=()=>{const before=C.types(state);C.restore(state,{fixed:Array(4).fill('mono'),sliding:Array(4).fill('mono')});undo={before,after:JSON.stringify(C.types(state))};refresh();};
 $('#panel-type-undo').onclick=()=>{if(!undo)return;C.restore(state,undo.before);undo=null;refresh();};
 $('#panel-preview').onclick=()=>{state.upgrades.solar.enabled=true;$('#show-equipment').checked=false;$('#show-installed-roof').checked=true;window.rooflabView?.showSolar?.();refresh();};
 $('#panel-comparison-export').onclick=()=>{const data={...C.report(state),layout:structuredClone(state)},url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='rooflab-panel-comparison.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#panel-comparison-export-status').textContent='Downloaded rooflab-panel-comparison.json. Attach it here for review. Nothing was uploaded.';};
 window.rooflabInvalidatePanelUndo=()=>{undo=null;$('#panel-type-undo').hidden=true;};
 window.rooflabRefreshPanelComparison=render;render();
})();
