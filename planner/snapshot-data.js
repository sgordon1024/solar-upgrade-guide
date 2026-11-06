// Private to this browser. These records are never uploaded by Rooflab.
(function(root){
 const KEY='rooflab.snapshots.v1';
 function parse(raw,validateLayout){const v=JSON.parse(raw||'{"version":1,"entries":[]}');if(v.version!==1||!Array.isArray(v.entries)||v.entries.length>30)throw Error('Saved-layout collection is invalid. Export your current layout before clearing browser data.');return {version:1,entries:v.entries.map(s=>validate(s,validateLayout))};}
 function validate(s,validateLayout){if(s?.schema!=='rooflab-snapshot'||s.version!==1||typeof s.id!=='string'||typeof s.name!=='string'||s.name.length>160||typeof s.createdAt!=='string')throw Error('Invalid named layout.');return {schema:'rooflab-snapshot',version:1,id:s.id,name:s.name,createdAt:s.createdAt,layout:validateLayout(s.layout),view:s.view&&typeof s.view==='object'?structuredClone(s.view):{}};}
 function create(layout,name,view,validateLayout,now=new Date()){return validate({schema:'rooflab-snapshot',version:1,id:crypto.randomUUID(),name:(name.trim()||'My layout').slice(0,100)+' — '+now.toISOString().slice(0,19).replace('T',' ')+' UTC',createdAt:now.toISOString(),layout:structuredClone(layout),view:structuredClone(view)},validateLayout);}
 function append(storage,snapshot,validateLayout){const v=parse(storage.getItem(KEY),validateLayout);if(v.entries.length>=30)throw Error('30 named layouts are stored. Download a backup; no existing snapshot was overwritten.');v.entries.push(validate(snapshot,validateLayout));const encoded=JSON.stringify(v);storage.setItem(KEY,encoded);if(storage.getItem(KEY)!==encoded)throw Error('Browser did not verify the saved snapshot. Download the JSON backup.');return snapshot;}
 root.RooflabSnapshots={KEY,parse,validate,create,append};
})(globalThis);
