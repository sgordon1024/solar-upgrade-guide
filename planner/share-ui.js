(function(){
  'use strict';
  const S=RooflabShare,N=RooflabSnapshots,dialog=$('#share-dialog'),banner=$('#shared-setup-banner');
  let source=null,previous=null,sharedView=null,sequence=0,generation=0;
  function view(){return {layers:Object.fromEntries([...document.querySelectorAll('input[id^="show-"]')].map(n=>[n.id,n.checked])),environment:document.querySelector('[name=environment]:checked')?.value||'white'};}
  function applyView(v){for(const [id,value]of Object.entries(v.layers||{})){const el=document.getElementById(id);if(el?.type==='checkbox'&&id.startsWith('show-')){el.checked=value;el.dispatchEvent(new Event('change'));}}const e=[...document.querySelectorAll('[name=environment]')].find(e=>e.value===v.environment);if(e){e.checked=true;e.dispatchEvent(new Event('change'));}}
  const current=()=>S.create(state,'My setup',view(),valid);
  function download(data){const json=JSON.stringify(S.validate(data,valid));if(new TextEncoder().encode(json).length>S.MAX_BYTES)throw Error('Setup exceeds the 250 KB file limit. Shorten notes or source text before sharing.');const url=URL.createObjectURL(new Blob([json],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='rooflab-saved-setup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function closeDialogs(){window.rooflabInterface?.close(false);for(const d of document.querySelectorAll('dialog[open]'))d.close();}
  function open(data){source=data||current();generation++;$('#share-link').value='';$('#share-link-row').hidden=true;$('#share-status').textContent='Ready to share: '+source.name;$('#share-copy').disabled=false;closeDialogs();dialog.showModal();}
  $('#open-share').onclick=()=>open();
  $('#share-selected').onclick=()=>{try{const selected=N.parse(localStorage.getItem(N.KEY),valid).entries.find(s=>s.id===$('#snapshot-list').value);if(!selected)throw Error('Select a saved layout first.');open(S.create(selected.layout,selected.name,selected.view,valid));}catch(e){$('#snapshot-status').textContent=e.message;}};
  $('#share-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{generation++;$('#share-copy').disabled=false;});
  $('#share-copy').onclick=async()=>{
    const ticket=++generation;$('#share-copy').disabled=true;$('#share-status').textContent='Preparing your setup link…';
    try{const hash=await S.encode(source,valid);if(ticket!==generation||!dialog.open)return;const url=new URL(location.href);url.hash=hash;url.search='';$('#share-link').value=url.href;$('#share-link-row').hidden=false;
      try{await navigator.clipboard.writeText(url.href);if(ticket===generation)$('#share-status').textContent='Link copied. Send it to your friend to open this exact setup.';}
      catch{if(ticket===generation){$('#share-link').focus();$('#share-link').select();$('#share-status').textContent='Your link is ready below. Select and copy it to share.';}}
    }catch(e){if(ticket===generation)$('#share-status').textContent='Could not create a link: '+e.message;}
    finally{if(ticket===generation)$('#share-copy').disabled=false;}
  };
  $('#share-download').onclick=()=>{try{download(source);$('#share-status').textContent='Setup downloaded. A recipient can open it with Import specs.';}catch(e){$('#share-status').textContent=e.message;}};
  function enter(data){
    const next=S.validate(data,valid);if(!previous)previous={layout:structuredClone(state),view:view()};
    window.rooflabSharedPreview=true;window.rooflabInvalidateSnapshotUndo?.();state=next.layout;sharedView=next.view;renderUI();if(window.rooflabView)applyView(sharedView);save();banner.hidden=false;$('#shared-setup-save').hidden=false;$('#shared-setup-name').textContent=next.name||'Shared setup';$('#shared-setup-status').textContent='Preview only. Your saved layout and favorites are unchanged.';
  }
  function leave(){sequence++;if(previous){const restore=previous;previous=null;window.rooflabSharedPreview=false;window.rooflabInvalidateSnapshotUndo?.();state=valid(restore.layout);sharedView=null;renderUI();if(window.rooflabView)applyView(restore.view);}banner.hidden=true;$('#save').textContent='Your previous layout is restored. Local saves are unchanged.';}
  $('#shared-setup-return').onclick=()=>{leave();history.replaceState(null,'',location.pathname+location.search);};
  $('#shared-setup-save').onclick=()=>{try{const s=N.create(state,$('#shared-setup-name').textContent,view(),valid);N.append(localStorage,s,valid);$('#shared-setup-status').textContent='Saved as a new favorite on this device. Your previous working layout is unchanged.';}catch(e){$('#shared-setup-status').textContent='Could not save a favorite: '+e.message+' Use Share setup → Download setup for a backup.';}};
  window.rooflabPreviewSharedSetup=data=>{const checked=S.validate(data,valid);sequence++;closeDialogs();enter(checked);};
  window.rooflabApplySharedView=()=>{if(sharedView)applyView(sharedView);};
  async function fromLocation(){const ticket=++sequence;try{const data=await S.decode(location.hash,valid);if(ticket!==sequence)return;if(data)enter(data);else if(previous)leave();}catch(e){if(ticket!==sequence)return;banner.hidden=false;$('#shared-setup-save').hidden=true;$('#shared-setup-name').textContent='Could not open shared setup';$('#shared-setup-status').textContent=e.message+' Your current layout was kept.';}}
  window.addEventListener('hashchange',fromLocation);
  window.rooflabShareReady=fromLocation();
})();
