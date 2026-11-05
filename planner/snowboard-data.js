// Position of the detailed installed-reference bag, separate from editable roof boxes.
(function(root){
 const limits={x:[-60,100],y:[-150,100],z:[-6,40]};
 function defaults(){return {version:1,snowboard:{x:0,y:0,z:0}};}
 function validate(v){if(v===undefined)return defaults();if(!v||v.version!==1||!v.snowboard||Object.entries(limits).some(([k,[a,b]])=>typeof v.snowboard[k]!=='number'||!Number.isFinite(v.snowboard[k])||v.snowboard[k]<a||v.snowboard[k]>b))throw Error('Invalid detailed snowboard-bag position.');return {version:1,snowboard:Object.fromEntries(Object.keys(limits).map(k=>[k,v.snowboard[k]]))};}
 function envelopes(value){const p=validate(value).snowboard;return [{name:'packed snowboard case',x:-.7,y:77.9,z:6.1,width:18.4,length:64.2,height:13.2},...[81.74,122].map((y,i)=>({name:'snowboard clamp '+(i+1),x:-1.6,y:y-1.225,z:6.31,width:20.25,length:2.45,height:4.49}))].map(b=>({...b,x:b.x+p.x,y:b.y+p.y,z:b.z+p.z}));}
 function nudge(value,axis,distance){const v=validate(value);if(!Object.hasOwn(limits,axis)||!Number.isFinite(distance))throw Error('Invalid bag movement.');const [a,b]=limits[axis];v.snowboard[axis]=Math.min(b,Math.max(a,Math.round((v.snowboard[axis]+distance)*100)/100));return v;}
 root.RooflabSnowboard={defaults,validate,envelopes,nudge,limits};
})(globalThis);
