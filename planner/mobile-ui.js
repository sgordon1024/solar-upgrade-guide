// Move the original controls, rather than cloning their state or event handlers.
export function mountInterface() {
  const $=s=>document.querySelector(s), media=matchMedia('(max-width: 900px)');
  const dock=document.createElement('nav');dock.className='mobile-dock';dock.setAttribute('aria-label','Van tools');
  const choices=[['views','Views','◈'],['controls','Controls','⌘'],['scene','Scene','△'],['tools','Tools','⋯']];
  dock.innerHTML=choices.map(([id,label,icon])=>`<button type="button" data-panel="${id}" aria-haspopup="dialog" aria-controls="mobile-sheet" aria-expanded="false"><b aria-hidden="true">${icon}</b>${label}</button>`).join('');
  const hud=document.createElement('div');hud.className='mobile-hud';hud.innerHTML='<div><strong>ROOFLAB</strong><small id="mobile-view-name">3D view · estimated geometry</small></div><button type="button" id="mobile-camera-reset" aria-label="Reset camera">↺</button>';
  const announcement=document.createElement('p');announcement.className='mobile-announcement';announcement.setAttribute('role','status');const interactionStatus=$('#interaction-status');new MutationObserver(()=>{if(media.matches)announcement.textContent=interactionStatus.textContent;}).observe(interactionStatus,{childList:true,characterData:true,subtree:true});
  const renderNotice=document.createElement('p');renderNotice.className='mobile-render-notice';renderNotice.setAttribute('role','status');const renderStatus=$('#render-status');function reflectStatus(){renderNotice.hidden=renderStatus.textContent.startsWith('Sprinter');renderNotice.textContent=renderStatus.textContent;}new MutationObserver(reflectStatus).observe(renderStatus,{childList:true,characterData:true,subtree:true});reflectStatus();
  const sheet=document.createElement('dialog');sheet.id='mobile-sheet';sheet.setAttribute('aria-labelledby','mobile-sheet-title');
  sheet.innerHTML='<div class="sheet-heading"><h2 id="mobile-sheet-title">Views</h2><button type="button" class="sheet-close" aria-label="Close menu">✕</button></div><div class="sheet-content"></div>';
  const feedback=document.createElement('p');feedback.className='sheet-feedback';feedback.setAttribute('role','status');feedback.hidden=true;sheet.querySelector('.sheet-heading').after(feedback);const message=$('#message');new MutationObserver(()=>{feedback.textContent=message.textContent;feedback.hidden=!message.textContent;}).observe(message,{childList:true,characterData:true,subtree:true});
  const panels={};for(const [id,label] of choices){const p=document.createElement('section');p.dataset.panelContent=id;p.hidden=true;sheet.querySelector('.sheet-content').append(p);panels[id]=p;}
  const quick=document.createElement('div');quick.className='mobile-quick-actions';quick.innerHTML='<button type="button" data-action="wheels" aria-pressed="false">Drive demo<span>Stopped</span></button><button type="button" data-action="night" aria-pressed="false">Day / night<span>Day</span></button>';panels.controls.append(quick);
  const info=document.createElement('p');info.className='sheet-help';info.textContent='Tap parts on the van to open doors or switch lights. Drag to orbit; pinch to zoom.';panels.controls.append(info);
  function section(parent,title){const d=document.createElement('details');d.className='tool-fold';const s=document.createElement('summary');s.textContent=title;d.append(s);parent.append(d);return d;}
  const roof=section(panels.tools,'Roof layout & measurements'),files=section(panels.tools,'Files, notes & model information');
  const slots=[];
  function slot(selector,target){const node=$(selector);if(!node)return;const anchor=document.createComment('original control position');node.before(anchor);slots.push({node,anchor,target});}
  slot('.viewbar',panels.views);slot('.display-switches',panels.views);slot('.viewfoot',panels.views);
  slot('.motion-panel',panels.controls);slot('.environment-panel',panels.scene);
  slot('.solar-mod-panel',panels.tools);slot('.layer-panel',panels.tools);slot('.upgrade-panel',panels.tools);
  slot('.planning-switches',roof);slot('aside',roof);slot('.lower',roof);
  slot('.actions',files);slot('details.card',files);slot('footer',files);slot('.notice',files);slot('.motion-note',files);slot('#render-status',files);
  const folds=[];for(const field of document.querySelectorAll('.motion-groups fieldset')){const anchor=document.createComment('original fieldset position');field.before(anchor);const d=document.createElement('details');d.className='control-fold';const s=document.createElement('summary');s.textContent=field.querySelector('legend').textContent;d.append(s);folds.push({field,anchor,d});}
  document.body.append(hud,dock,renderNotice,announcement,sheet);
  let trigger=null;
  const close=()=>{if(sheet.open)sheet.close();};
  function open(id,button){trigger=button;for(const [key,p] of Object.entries(panels))p.hidden=key!==id;$('#mobile-sheet-title').textContent=choices.find(v=>v[0]===id)[1];for(const b of dock.querySelectorAll('button'))b.setAttribute('aria-expanded',String(b===button));if(!sheet.open)sheet.showModal();sheet.querySelector('.sheet-content').scrollTop=0;sheet.querySelector('.sheet-close').focus();}
  for(const b of dock.querySelectorAll('button'))b.addEventListener('click',()=>open(b.dataset.panel,b));
  sheet.querySelector('.sheet-close').addEventListener('click',close);
  sheet.addEventListener('click',e=>{if(e.target===sheet){const r=sheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}if(e.target.closest('.viewbar button,[data-action]'))close();if(e.detail>0&&e.target.matches('[name=environment]'))close();});
  sheet.addEventListener('close',()=>{for(const b of dock.querySelectorAll('button'))b.setAttribute('aria-expanded','false');trigger?.focus();});
  $('#mobile-camera-reset').addEventListener('click',()=>$('#home').click());
  function arrange(){close();const mobile=media.matches;interactionStatus.setAttribute('aria-live',mobile?'off':'polite');announcement.setAttribute('aria-live',mobile?'polite':'off');document.body.classList.toggle('immersive',mobile);for(const {node,anchor,target} of slots){if(mobile)target.append(node);else anchor.after(node);}for(const {field,anchor,d} of folds){if(mobile){anchor.after(d);d.append(field);d.open=false;}else{anchor.after(field);d.remove();}}if(mobile){panels.tools.append(roof,files);$('.motion-panel').open=true;$('.environment-panel').open=true;}else $('.environment-panel').open=false;}
  media.addEventListener('change',arrange);arrange();
  return {setView(id){const source=document.getElementById(id);$('#mobile-view-name').textContent=(source?.textContent||'3D view')+' · estimated geometry';},close};
}
