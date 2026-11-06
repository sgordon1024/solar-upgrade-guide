import * as T from './vendor/three.module.js';
import {buildInteractiveModel,INTERACTION_SPEC} from './interactive-model.js?v=seam1';
export {INTERACTION_SPEC};

export function installInteractions({shell,emblems,exterior,rack,canvas,camera,body,requestRender,onState,onNight,environmentGround=false,onSelectSnowboard=()=>{},onSelectPanel=()=>{},canDrive=()=>true,visibility=()=>({})}) {
  const rig=buildInteractiveModel({shell,emblems,exterior,rack});
  const ids=['cassette-door','driver-seat','passenger-seat','driver-door','passenger-door','sliding-door','rear-doors','driver-slider','flare-window','headlights','foglights','taillights','lightbar','porchlight','wheels'];
  const state=Object.fromEntries(ids.map(id=>[id,0])),target={...state};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),note=document.querySelector('#interaction-status'),buttons=[...document.querySelectorAll('[data-action]')];
  let frame=0,last=0,phase=0,wheelStarted=0,night=false,enabled=true,ropeTime=0,ropeStarted=0,ropePaused=false,movingSeat=null;
  const rope={preset:'off',pattern:'steady',speed:.7};
  const ropeSelect=document.querySelector('#rope-preset'),ropePattern=document.querySelector('#rope-pattern'),ropeSpeed=document.querySelector('#rope-speed'),ropePause=document.querySelector('#rope-pause');
  const ropeMoving=()=>rope.preset!=='off'&&rope.pattern!=='steady'&&!ropePaused&&!reduced.matches&&!document.hidden&&enabled;
  function ropeUI(){if(!ropePause?.setAttribute)return;ropePause.setAttribute('aria-pressed',String(ropePaused));ropePause.textContent=ropePaused?'Resume animation':'Pause animation';ropePause.disabled=reduced.matches||rope.preset==='off'||rope.pattern==='steady';}
  function ropeChanged(){rope.preset=ropeSelect.value;rope.pattern=ropePattern.value;rope.speed=Number(ropeSpeed.value);ropeStarted=performance.now();ropePaused=false;ropeUI();start();}
  for(const el of [ropeSelect,ropePattern,ropeSpeed])el?.addEventListener?.('input',ropeChanged);
  ropePause?.addEventListener?.('click',()=>{ropePaused=!ropePaused;ropeStarted=performance.now();ropeUI();start();});
  const labels={'cassette-door':'Cassette access door','driver-seat':'Driver seat','passenger-seat':'Passenger seat','driver-door':'Driver door','passenger-door':'Passenger door','sliding-door':'Sliding door','rear-doors':'Rear doors','driver-slider':'Driver middle window','flare-window':'Flare awning window',headlights:'Headlights',foglights:'Fog lights',taillights:'Tail lights',lightbar:'Roof light bar',porchlight:'Cassette hatch light',wheels:'Wheel and suspension demo'};
  const canonical=id=>id?.startsWith('wheel-')?'wheels':id?.startsWith('rear-')&&id.endsWith('-door')?'rear-doors':id;
  const announce=text=>{note.textContent=text;};
  function syncButtons(){for(const b of buttons){const id=b.dataset.action;if(id==='reset')continue;const on=id==='night'?night:!!target[id];b.setAttribute('aria-pressed',String(on));b.disabled=!enabled||(id==='wheels'&&!target.wheels&&!canDrive());const value=b.querySelector('span');if(id==='wheels')b.setAttribute('aria-description',!canDrive()?'Stow all slide-outs before the wheel demo.':'Illustrative wheel and suspension movement.');if(value)value.textContent=id==='headlights'?['Off','Low beam','High beam'][target[id]]:id.endsWith('-seat')?(state[id]!==target[id]?(id===movingSeat?'Turning…':'Queued'):(on?'Facing rear':'Facing front')):id==='wheels'?(on?(reduced.matches?'Posed':'Playing'):'Stopped'):id==='night'?(on?'Night':'Day'):['headlights','foglights','taillights','lightbar','porchlight'].includes(id)?(on?'On':'Off'):(on?'Open':'Closed');}}
  function render(){rig.cabin.setRope(rope,ropeTime);rig.apply({...state,night,environmentGround,layers:visibility()},phase);onState({...state,night,phase,reducedMotion:reduced.matches});requestRender();}
  function tick(now){frame=0;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;let active=false;const priorSeat=movingSeat;if(!movingSeat||state[movingSeat]===target[movingSeat])movingSeat=ids.find(id=>id.endsWith('-seat')&&state[id]!==target[id])||null;if(priorSeat!==movingSeat)syncButtons();for(const id of ids){if(['headlights','foglights','taillights','lightbar','porchlight','wheels'].includes(id)){state[id]=target[id];continue;}if(id.endsWith('-seat')&&state[id]!==target[id]&&(id!==movingSeat||state[id.replace('-seat','-door')]<.98)){active=true;continue;}const delta=target[id]-state[id];if(Math.abs(delta)>.002){state[id]+=Math.sign(delta)*Math.min(Math.abs(delta),dt*1.6);active=true;}else state[id]=target[id];}
    if(movingSeat&&state[movingSeat]===target[movingSeat])syncButtons();
    if(target.wheels&&!reduced.matches){phase+=dt;if(now-wheelStarted>20000){target.wheels=state.wheels=0;phase=0;syncButtons();announce('Wheel demo stopped after 20 seconds.');}else active=true;}
    if(ropeMoving()){if(now-ropeStarted>60000){ropePaused=true;ropeUI();announce('Rope animation paused after 60 seconds. Resume it when ready.');}else{ropeTime+=dt;active=true;}}
    render();if(active)frame=requestAnimationFrame(tick);
  }
  function start(){if(frame)cancelAnimationFrame(frame);if(reduced.matches){Object.assign(state,target);render();syncButtons();return;}last=performance.now();frame=requestAnimationFrame(tick);}
  function reset(){cancelAnimationFrame(frame);frame=0;movingSeat=null;for(const id of ids)state[id]=target[id]=0;phase=0;night=false;ropeTime=0;rope.preset='off';ropePaused=false;if(ropeSelect)ropeSelect.value='off';ropeUI();onNight(false);render();syncButtons();announce('Doors and windows closed. Lights and wheel demo off.');}
  function activate(raw){const id=canonical(raw);if(id==='reset'){reset();return;}if(!enabled)return;if(id?.startsWith('proposal-')||id?.startsWith('slideout-')||id?.startsWith('existing-')||['roof-chassis','roof-cargo'].includes(id)){onSelectPanel(id);return;}if(id==='snowboard'){onSelectSnowboard();return;}if(id==='night'){night=!night;onNight(night);render();syncButtons();announce(night?'Night preview on. Choose low or high beams to compare their appearance.':'Day preview on.');return;}if(!(id in target))return;
    if(['driver-door','passenger-door'].includes(id)&&target[id]&&Math.abs(state[id.replace('-door','-seat')]-target[id.replace('-door','-seat')])>.002){announce('The cab door stays open while the seat demonstration finishes.');return;}
    if(id.endsWith('-seat')){target[id.replace('-seat','-door')]=1;if(!movingSeat||state[movingSeat]===target[movingSeat])movingSeat=id;}
    target[id]=id==='headlights'?(target[id]+1)%3:target[id]?0:1;
    if(id==='wheels'&&target.wheels&&!canDrive()){target.wheels=0;syncButtons();announce('Stow every slide-out before the wheel demo. Physical travel safety is unverified.');return;}if(id==='wheels'){wheelStarted=performance.now();phase=target.wheels&&reduced.matches?.72:0;}
    syncButtons();start();const word=id==='headlights'?['off','on low beam','on high beam'][target[id]]:id.endsWith('-seat')?(target[id]?'facing rear; door opened for the illustrative clearance pose':'facing front'):id==='wheels'?(target[id]?(reduced.matches?'in a static demonstration pose; reduced motion is enabled':'running for up to 20 seconds'):'stopped'):['foglights','taillights','lightbar','porchlight'].includes(id)?(target[id]?'on':'off'):(target[id]?'open':'closed');
    announce(`${id.endsWith('-seat')&&id!==movingSeat&&!reduced.matches?labels[id]+' queued until the other seat finishes':labels[id]+' '+word}.${id==='rear-doors'&&target[id]?' Carrier, bike and container are temporarily hidden for this demonstration.':''}`);
  }
  for(const b of buttons)b.addEventListener('click',()=>activate(b.dataset.action));
  const ray=new T.Raycaster(),point=new T.Vector2(),pointers=new Map();let gesture=null;
  function visible(o){for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;}
  function pick(x,y){const rect=canvas.getBoundingClientRect();point.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);ray.setFromCamera(point,camera);body.updateMatrixWorld(true);const hits=ray.intersectObject(body,true).filter(h=>visible(h.object)&&!h.object.userData.ignorePick);const solid=hits.find(h=>!h.object.userData.hitTarget);const fixture=hits.find(h=>h.object.userData.hitTarget&&(!solid||h.distance<=solid.distance+3));const first=fixture||solid;if(!first)return null;for(let p=first.object;p;p=p.parent){if(p.userData.selectable?.startsWith('proposal-')||p.userData.selectable?.startsWith('slideout-')||p.userData.selectable?.startsWith('existing-')||['roof-chassis','roof-cargo'].includes(p.userData.selectable))return p.userData.selectable;if(p.userData.selectable==='snowboard')return 'snowboard';const id=canonical(p.userData.action||p.userData.motionPart);if(id&&id in target)return id;}return null;}
  rig.extras.traverse(o=>{if(o.material?.transparent&&!o.userData.hitTarget)o.userData.ignorePick=true;});
  canvas.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,true);if(pointers.size>1){if(gesture)gesture.cancelled=true;return;}gesture={id:e.pointerId,x:e.clientX,y:e.clientY,button:e.button,cancelled:e.button!==0};});
  canvas.addEventListener('pointermove',e=>{if(gesture&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>7)gesture.cancelled=true;});
  canvas.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(gesture?.id!==e.pointerId)return;const g=gesture;gesture=null;if(!g.cancelled&&enabled&&Math.hypot(e.clientX-g.x,e.clientY-g.y)<=7){const id=pick(e.clientX,e.clientY);if(id)activate(id);}});
  canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;});
  globalThis.addEventListener?.('pointerup',e=>{pointers.delete(e.pointerId);if(gesture?.id===e.pointerId)gesture=null;});
  globalThis.addEventListener?.('blur',()=>{pointers.clear();gesture=null;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){ropePaused=true;ropeUI();cancelAnimationFrame(frame);frame=0;target.wheels=state.wheels=0;phase=0;Object.assign(state,target);render();syncButtons();}});
  reduced.addEventListener('change',()=>{if(reduced.matches){target.wheels=state.wheels=0;phase=0;}ropeUI();start();syncButtons();});
  render();syncButtons();ropeUI();
  return {rig,reset,activate,state,target,rope,enforceTravel(){if(!canDrive()&&(target.wheels||state.wheels)){target.wheels=state.wheels=0;phase=0;render();announce('Wheel demo stopped. Stow the slide-outs before travel; physical safety is unverified.');}syncButtons();},setCamera(value){camera=value;},setEnabled(value){if(enabled&&!value&&ropeMoving()){ropePaused=true;ropeUI();}enabled=value;render();if(!enabled&&target.wheels){target.wheels=state.wheels=0;phase=0;start();}syncButtons();}};
}
