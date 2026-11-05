// First-frame loading boundary. Retry reloads code without clearing any saved data.
(function(){
 const screen=document.querySelector('#load-screen'),title=document.querySelector('#load-title'),detail=document.querySelector('#load-detail'),actions=document.querySelector('.load-actions'),main=document.querySelector('main'),retry=document.querySelector('#load-retry'),tools=document.querySelector('#load-tools');
 let phase='loading',timer;
 function busy(value){main.inert=value;main.setAttribute('aria-busy',String(value));document.body.classList.toggle('is-loading',value);}
 function fail(message='The model could not load. Check your connection, then try again.'){
  clearTimeout(timer);if(phase==='tools')return;phase='error';screen.hidden=false;screen.dataset.phase='error';title.textContent='Let’s try that again';detail.textContent=message;actions.hidden=false;tools.hidden=!window.rooflabState;busy(true);main.setAttribute('aria-busy','false');
 }
 function ready(){clearTimeout(timer);phase='ready';screen.hidden=true;busy(false);detail.textContent='Your van is ready.';if(screen.contains(document.activeElement))document.querySelector('#scene').focus();}
 retry.onclick=()=>{retry.disabled=true;detail.textContent='Reloading your van…';location.reload();};
 tools.onclick=()=>{screen.hidden=true;busy(false);phase='tools';if(window.rooflabInterface)window.rooflabInterface.openTools();else{document.body.classList.remove('immersive');document.body.classList.add('tools-fallback','planning-mode');document.querySelector('#open-roof-editor')?.focus();}};
 window.RooflabBoot={ready,fail,get phase(){return phase;}};
 window.addEventListener('error',e=>{const source=e.target?.src||e.filename||'';if(source.startsWith(location.origin)&&(/\/(app|roof-editor|solar-data|snowboard-data|roof-edit-data|upgrade-data)\.js/.test(source)))fail('A required planner file did not load correctly. Please retry.');},true);
 timer=setTimeout(()=>fail('Loading is taking longer than expected. You can retry or open your saved layout tools.'),45000);
 async function start(){if(phase!=='tools')busy(true);try{
   // Give the loading artwork a paint before constructing the geometry.
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   if(!window.rooflabState)throw Error('Layout data unavailable');
   const {mountInterface}=await import('./mobile-ui.js?v=landing1');window.rooflabInterface=mountInterface();
   await import('./render3d.js?v=landing3');
  }catch(error){console.error(error);fail();}}
 // Deferred scripts run while readyState is interactive; wait for all later
 // deferred layout scripts, not just the parsed DOM.
 if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
