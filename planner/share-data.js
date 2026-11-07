// A self-contained setup, carried only in a URL fragment or an explicitly downloaded file.
// Fragments are not sent to the web server. They are readable by anyone holding the link.
(function(root){
  'use strict';
  const MAX_BYTES=250000,MAX_FRAGMENT=32000;
  const environments=['white','desert','dunes','mud','gravel','highway','rain','snow'];
  function view(v={}){
    if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid setup view.');
    const layers=v.layers??{};
    if(!layers||typeof layers!=='object'||Array.isArray(layers)||Object.keys(layers).length>60)throw Error('Invalid setup layers.');
    for(const [id,value]of Object.entries(layers))if(!/^show-[a-z-]{1,60}$/.test(id)||typeof value!=='boolean')throw Error('Invalid setup layer.');
    if(v.environment!==undefined&&!environments.includes(v.environment))throw Error('Unknown setup scene.');
    return {layers:Object.fromEntries(Object.entries(layers)),environment:v.environment||'white'};
  }
  function validate(data,validateLayout){
    if(!data||data.schema!=='rooflab-share'||data.version!==1||typeof data.name!=='string'||data.name.length>160)throw Error('Use a Rooflab shared setup version 1.');
    return {schema:'rooflab-share',version:1,name:data.name,layout:validateLayout(data.layout),view:view(data.view)};
  }
  function create(layout,name,v,validateLayout){return validate({schema:'rooflab-share',version:1,name:name||'Shared setup',layout,view:v},validateLayout);}
  function base64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function unbase64(s){if(!/^[A-Za-z0-9_-]+$/.test(s)||s.length%4===1)throw Error('The setup link is incomplete or invalid.');const bin=atob(s.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(bin,c=>c.charCodeAt(0));}
  async function bounded(stream){const reader=stream.getReader();let length=0;const parts=[];try{while(true){const {value,done}=await reader.read();if(done)break;length+=value.byteLength;if(length>MAX_BYTES)throw Error('Setup exceeds the 250 KB limit.');parts.push(value);}}finally{await reader.cancel().catch(()=>{});}const out=new Uint8Array(length);let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length;}return out;}
  async function encode(data,validateLayout){
    const bytes=new TextEncoder().encode(JSON.stringify(validate(data,validateLayout)));
    if(bytes.length>MAX_BYTES)throw Error('Setup exceeds the 250 KB limit.');
    let token='v1j.'+base64(bytes);
    if(typeof CompressionStream==='function'){
      const zipped=await bounded(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))),packed='v1z.'+base64(zipped);
      if(packed.length<token.length)token=packed;
    }
    const fragment='#setup='+token;
    if(fragment.length>MAX_FRAGMENT)throw Error('This setup is too large for a reliable link. Use Download setup instead.');
    return fragment;
  }
  async function decode(hash,validateLayout){
    if(!hash.startsWith('#setup='))return null;
    if(hash.length>MAX_FRAGMENT)throw Error('Setup link exceeds the size limit.');
    const match=/^#setup=(v1j|v1z)\.([A-Za-z0-9_-]+)$/.exec(hash);
    if(!match)throw Error('The setup link is incomplete or uses an unsupported version.');
    let bytes=unbase64(match[2]);
    if(match[1]==='v1z'){
      if(typeof DecompressionStream!=='function')throw Error('This browser cannot open compressed setups. Open the link in a current browser, or import the saved setup file.');
      bytes=await bounded(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')));
    }
    if(bytes.length>MAX_BYTES)throw Error('Setup exceeds the 250 KB limit.');
    return validate(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)),validateLayout);
  }
  root.RooflabShare={create,validate,encode,decode,view,MAX_BYTES,MAX_FRAGMENT};
})(globalThis);
