import * as T from './vendor/three.module.js';
import {buildInteractiveModel,INTERACTION_SPEC} from './interactive-model.js?v=interactive1';
export {INTERACTION_SPEC};

export function installInteractions({shell,emblems,exterior,rack,canvas,camera,body,requestRender,onState,onNight,visibility=()=>({})}) {
  const rig=buildInteractiveModel({shell,emblems,exterior,rack});
  const ids=['driver-door','passenger-door','sliding-door','rear-doors','driver-slider','flare-window','headlights','foglights','taillights','lightbar','porchlight','wheels'];
  const state=Object.fromEntries(ids.map(id=>[id,0])),target={...state};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),note=document.querySelector('#interaction-status'),buttons=[...document.querySelectorAll('[data-action]')];
  let frame=0,last=0,phase=0,wheelStarted=0,night=false,enabled=true;
  const labels={'driver-door':'Driver door','passenger-door':'Passenger door','sliding-door':'Sliding door','rear-doors':'Rear doors','driver-slider':'Driver middle window','flare-window':'Flare awning window',headlights:'Headlights',foglights:'Fog lights',taillights:'Tail lights',lightbar:'Roof light bar',porchlight:'Cassette hatch light',wheels:'Wheel and suspension demo'};
  const canonical=id=>id?.startsWith('wheel-')?'wheels':id?.startsWith('rear-')&&id.endsWith('-door')?'rear-doors':id;
  const announce=text=>{note.textContent=text;};
  function syncButtons(){for(const b of buttons){const id=b.dataset.action;if(id==='reset')continue;const on=id==='night'?night:!!target[id];b.setAttribute('aria-pressed',String(on));b.disabled=!enabled;const value=b.querySelector('span');if(value)value.textContent=id==='headlights'?['Off','Low beam','High beam'][target[id]]:id==='wheels'?(on?(reduced.matches?'Posed':'Playing'):'Stopped'):id==='night'?(on?'Night':'Day'):['headlights','foglights','taillights','lightbar','porchlight'].includes(id)?(on?'On':'Off'):(on?'Open':'Closed');}}
  function render(){rig.apply({...state,night,layers:visibility()},phase);onState({...state,night});requestRender();}
  function tick(now){frame=0;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;let active=false;for(const id of ids){if(['headlights','foglights','taillights','lightbar','porchlight','wheels'].includes(id)){state[id]=target[id];continue;}const delta=target[id]-state[id];if(Math.abs(delta)>.002){state[id]+=Math.sign(delta)*Math.min(Math.abs(delta),dt*1.6);active=true;}else state[id]=target[id];}
    if(target.wheels&&!reduced.matches){phase+=dt;if(now-wheelStarted>20000){target.wheels=state.wheels=0;phase=0;syncButtons();announce('Wheel demo stopped after 20 seconds.');}else active=true;}
    render();if(active)frame=requestAnimationFrame(tick);
  }
  function start(){if(frame)cancelAnimationFrame(frame);if(reduced.matches){Object.assign(state,target);render();return;}last=performance.now();frame=requestAnimationFrame(tick);}
  function reset(){cancelAnimationFrame(frame);frame=0;for(const id of ids)state[id]=target[id]=0;phase=0;night=false;onNight(false);render();syncButtons();announce('Doors and windows closed. Lights and wheel demo off.');}
  function activate(raw){const id=canonical(raw);if(id==='reset'){reset();return;}if(!enabled)return;if(id==='night'){night=!night;onNight(night);render();syncButtons();announce(night?'Night preview on. Choose low or high beams to compare their appearance.':'Day preview on.');return;}if(!(id in target))return;
    target[id]=id==='headlights'?(target[id]+1)%3:target[id]?0:1;
    if(id==='wheels'){wheelStarted=performance.now();phase=target.wheels&&reduced.matches?.72:0;}
    syncButtons();start();const word=id==='headlights'?['off','on low beam','on high beam'][target[id]]:id==='wheels'?(target[id]?(reduced.matches?'in a static demonstration pose; reduced motion is enabled':'running for up to 20 seconds'):'stopped'):['foglights','taillights','lightbar','porchlight'].includes(id)?(target[id]?'on':'off'):(target[id]?'open':'closed');
    announce(`${labels[id]} ${word}.${id==='rear-doors'&&target[id]?' Carrier, bike and container are temporarily hidden for this demonstration.':''}`);
  }
  for(const b of buttons)b.addEventListener('click',()=>activate(b.dataset.action));
  const ray=new T.Raycaster(),point=new T.Vector2(),pointers=new Map();let gesture=null;
  function visible(o){for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;}
  function pick(x,y){const rect=canvas.getBoundingClientRect();point.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);ray.setFromCamera(point,camera);body.updateMatrixWorld(true);const hits=ray.intersectObject(body,true);const first=hits.find(h=>visible(h.object)&&!h.object.userData.ignorePick);if(!first)return null;for(let p=first.object;p;p=p.parent){const id=canonical(p.userData.action||p.userData.motionPart);if(id&&id in target)return id;}return null;}
  rig.extras.traverse(o=>{if(o.material?.transparent)o.userData.ignorePick=true;});
  canvas.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,true);if(pointers.size>1){if(gesture)gesture.cancelled=true;return;}gesture={id:e.pointerId,x:e.clientX,y:e.clientY,button:e.button,cancelled:e.button!==0};});
  canvas.addEventListener('pointermove',e=>{if(gesture&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>7)gesture.cancelled=true;});
  canvas.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(gesture?.id!==e.pointerId)return;const g=gesture;gesture=null;if(!g.cancelled&&enabled){const id=pick(e.clientX,e.clientY);if(id)activate(id);}});
  canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;target.wheels=state.wheels=0;phase=0;Object.assign(state,target);render();syncButtons();}});
  reduced.addEventListener('change',()=>{if(reduced.matches){target.wheels=state.wheels=0;phase=0;}start();syncButtons();});
  render();syncButtons();
  return {rig,reset,activate,state,target,setEnabled(value){enabled=value;render();if(!enabled&&target.wheels){target.wheels=state.wheels=0;phase=0;start();}syncButtons();}};
}
