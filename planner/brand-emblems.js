import * as T from './vendor/three.module.js';

export const EMBLEMS_SPEC={
  revision:'coach-emblems-3-passenger-alignment',units:'in',status:'photo-estimated',
  source:'Owner front, driver, passenger and rear photographs inspected in pixels.',
  instances:[
    {id:'driver-launch',text:'LAUNCH',host:'driver body directly below rear flare',centerY:129.5,centerZ:-49,width:18.8,height:2.6,finish:'raised silver'},
    {id:'passenger-launch',text:'LAUNCH',host:'passenger body below rear flare and sliding-door metal channel',centerY:131,centerZ:-50.6,width:18.8,height:2.6,finish:'raised silver'},
    {id:'rear-launch',text:'LAUNCH',host:'upper driver rear door above glass',centerX:14,centerZ:-12.5,width:21.5,height:2.7,finish:'raised silver'},
    {id:'driver-entegra',text:'ENTEGRA',host:'lower driver cab door',centerY:-15.5,centerZ:-66.4,width:10.7,height:1.15,finish:'dark lettering'},
    {id:'passenger-entegra',text:'ENTEGRA',host:'lower passenger cab door',centerY:-15.5,centerZ:-66.4,width:10.7,height:1.15,finish:'dark lettering'},
    {id:'rack-entegra',text:'ENTEGRA',host:'front fairing below light bar',centerX:30,centerZ:1.55,width:13.4,height:.8,finish:'dark inset appearance'}
  ],
  observations:'Three slanted, split-stroke Launch wordmarks with a small upper-right flourish; two widely spaced dark serif Entegra cab marks and one dark Entegra fairing mark. No additional coach mark is established on the obscured lower rear.',
  dimensionBasis:'Positions and outer dimensions inferred from photos; shallow relief, letter outlines and finish are visual estimates. Body lettering is projected onto the actual modeled panels.',
  unresolved:['Overall width/height of each badge','Badge edge offsets to flare, door seam and rear glass','Raised depth and exact letter/bevel details','Whether fairing letters are cut through or applied'],
  limits:'Visual identity details only; not factory logo artwork or surveyed dimensions. Excluded from roof equipment box checks. Brand names and marks identify the depicted vehicle; trademark rights remain with their owners.',
  geometryLicense:'Original vector reconstruction; no photo textures or third-party font/mesh assets redistributed.'
};

const polygon=pts=>new T.Shape(pts.map(p=>new T.Vector2(...p)));
const rect=(x,y,w,h)=>polygon([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);

// The Launch badge has squared, forward-slanted letterforms, a narrow break
// across the strokes and an extended upper-right terminal on the final H.
function launchGlyphs(){
  const glyphs=[
    [rect(0,.49,.25,.51),polygon([[0,0],[.9,0],[.94,.23],[.25,.23],[.25,.42],[0,.42]])],
    [polygon([[0,.49],[0,.83],[.17,1],[.84,1],[.95,.88],[.95,.49],[.7,.49],[.7,.75],[.25,.75],[.25,.49]]),polygon([[0,0],[.25,0],[.25,.23],[.7,.23],[.7,0],[.95,0],[.95,.42],[0,.42]])],
    [rect(0,.49,.25,.51),rect(.7,.49,.25,.51),polygon([[0,.42],[.25,.42],[.25,.23],[.7,.23],[.7,.42],[.95,.42],[.95,.14],[.81,0],[.14,0],[0,.14]])],
    [polygon([[0,.49],[0,1],[.8,1],[.95,.86],[.95,.49],[.7,.49],[.7,.75],[.25,.75],[.25,.49]]),rect(0,0,.25,.42),rect(.7,0,.25,.42)],
    [polygon([[0,.49],[0,.84],[.16,1],[.95,1],[.95,.75],[.25,.75],[.25,.49]]),polygon([[0,.42],[.25,.42],[.25,.23],[.95,.23],[.95,0],[.15,0],[0,.15]])],
    [rect(0,.49,.25,.51),polygon([[.7,.49],[.95,.49],[.95,.82],[1.48,1],[.7,1]]),polygon([[0,0],[.25,0],[.25,.23],[.7,.23],[.7,0],[.95,0],[.95,.42],[0,.42]])]
  ];
  return glyphs.flatMap((shapes,index)=>shapes.map(shape=>({shape,x:index*1.07})));
}

// Small serif capitals are drawn as original outlines, with open counters.
function entegraGlyphs(){
  const E=()=>polygon([[0,0],[.84,0],[.87,.27],[.79,.27],[.72,.1],[.28,.1],[.28,.46],[.56,.46],[.61,.36],[.67,.36],[.67,.67],[.61,.67],[.56,.56],[.28,.56],[.28,.9],[.7,.9],[.77,.74],[.85,.74],[.82,1],[0,1],[0,.92],[.1,.9],[.1,.1],[0,.08]]);
  const N=()=>polygon([[0,0],[.34,0],[.34,.08],[.24,.1],[.24,.73],[.82,0],[.94,0],[.94,.9],[1.04,.92],[1.04,1],[.69,1],[.69,.92],[.8,.9],[.8,.3],[.26,1],[0,1],[0,.92],[.1,.9],[.1,.1],[0,.08]]);
  const TT=()=>polygon([[.02,1],[1,1],[1.03,.72],[.95,.72],[.86,.9],[.62,.9],[.62,.1],[.76,.08],[.76,0],[.25,0],[.25,.08],[.4,.1],[.4,.9],[.16,.9],[.08,.72],[0,.72]]);
  const G=()=>{const s=new T.Shape();s.moveTo(.93,.93);s.bezierCurveTo(.56,1.13,.03,1.01,.03,.52);s.bezierCurveTo(.03,.03,.5,-.1,.94,.08);s.lineTo(.94,.4);s.lineTo(1.02,.43);s.lineTo(1.02,.5);s.lineTo(.57,.5);s.lineTo(.57,.43);s.lineTo(.72,.4);s.lineTo(.72,.16);s.bezierCurveTo(.39,.02,.28,.26,.28,.53);s.bezierCurveTo(.28,.8,.47,1.04,.76,.86);s.lineTo(.87,.7);s.lineTo(.94,.7);s.closePath();return s;};
  const R=()=>{const s=new T.Shape();s.moveTo(0,0);s.lineTo(.4,0);s.lineTo(.4,.08);s.lineTo(.28,.1);s.lineTo(.28,.45);s.lineTo(.41,.45);s.lineTo(.7,0);s.lineTo(1.03,0);s.lineTo(1.03,.08);s.lineTo(.9,.1);s.lineTo(.66,.49);s.bezierCurveTo(1.09,.56,.99,1,.58,1);s.lineTo(0,1);s.lineTo(0,.92);s.lineTo(.1,.9);s.lineTo(.1,.1);s.lineTo(0,.08);s.closePath();const h=new T.Path();h.moveTo(.28,.55);h.lineTo(.52,.55);h.bezierCurveTo(.8,.55,.8,.9,.52,.9);h.lineTo(.28,.9);h.closePath();s.holes.push(h);return s;};
  const A=()=>{const s=polygon([[0,0],[.38,0],[.38,.08],[.25,.11],[.34,.33],[.7,.33],[.8,.11],[.68,.08],[.68,0],[1.12,0],[1.12,.08],[1.02,.11],[.62,1],[.48,1],[.08,.11],[0,.08]]);const h=new T.Path();h.moveTo(.39,.44);h.lineTo(.65,.44);h.lineTo(.52,.76);h.closePath();s.holes.push(h);return s;};
  return [E(),N(),TT(),E(),G(),R(),A()].map((shape,index)=>({shape,x:index*1.38}));
}

function createMaterials(){
  return {
    silver:new T.MeshStandardMaterial({name:'Launch satin silver lettering',color:'#eef2ef',metalness:.4,roughness:.24,side:T.DoubleSide}),
    edge:new T.MeshStandardMaterial({name:'Launch dark relief edges',color:'#4b5153',metalness:.55,roughness:.38,side:T.DoubleSide}),
    dark:new T.MeshStandardMaterial({name:'Entegra dark lettering',color:'#080b0c',metalness:0,roughness:.8,side:T.DoubleSide})
  };
}

function buildMark(spec,project,materials){
  const group=new T.Group();group.name=spec.id;
  const launch=spec.text==='LAUNCH',glyphs=launch?launchGlyphs():entegraGlyphs(),total=launch?7.05:9.4;
  const geo=new T.ExtrudeGeometry(glyphs.map(({shape,x})=>{
    const curves=shape.clone();for(const path of [curves,...curves.holes])for(const c of path.curves){for(const key of ['v0','v1','v2','v3'])if(c[key]){c[key].x+=x;if(launch)c[key].x+=c[key].y*.22;}}
    return curves;
  }),{depth:launch?.075:.018,bevelEnabled:launch,bevelSize:.02,bevelThickness:.018,bevelSegments:1,curveSegments:6});
  // Host queries are cached at identical letter vertices. Project the cap and
  // relief onto the actual shell rather than placing a floating planar label.
  const a=geo.attributes.position;
  for(let i=0;i<a.count;i++){const u=(a.getX(i)/total-.5)*spec.width,v=(a.getY(i)-.5)*spec.height,d=a.getZ(i);a.setXYZ(i,...project(u,v,.035+d));}
  geo.computeVertexNormals();
  // ExtrudeGeometry emits a material group for every letter component. Gather
  // matching groups so each whole badge costs only one or two draw calls.
  const byMaterial=[[],[]];for(const g of geo.groups)for(let i=g.start;i<g.start+g.count;i++)byMaterial[launch?g.materialIndex:0].push(i);
  geo.setIndex([...byMaterial[0],...byMaterial[1]]);geo.clearGroups();geo.addGroup(0,byMaterial[0].length,0);if(byMaterial[1].length)geo.addGroup(byMaterial[0].length,byMaterial[1].length,1);
  const mesh=new T.Mesh(geo,launch?[materials.silver,materials.edge]:[materials.dark]);mesh.name=spec.text+' surface-fitted lettering';mesh.castShadow=false;group.add(mesh);group.userData={spec,bounds:new T.Box3().setFromObject(group)};return group;
}

export function buildBodyEmblems(shell){
  const group=new T.Group();group.name='Launch and Entegra coach emblems';const materials=createMaterials(),bounds={};
  const paint=shell.children.filter(o=>o.isMesh&&o.material.name.startsWith('Blue-gray paint')&&!o.userData.sleepingFlare&&!o.userData.camperWindow);
  for(const spec of EMBLEMS_SPEC.instances.filter(s=>s.id!=='rack-entegra')){
    const rear=spec.id==='rear-launch',sign=spec.id.startsWith('driver')?-1:1,cache=new Map(),p=[];
    // Restrict raycasts to a small patch of painted host triangles.
    for(const o of paint){const a=o.geometry.attributes.position,ind=o.geometry.index;for(let i=0;i<ind.count;i+=3){const ids=[ind.getX(i),ind.getX(i+1),ind.getX(i+2)];if(ids.some(k=>Math.abs(a.getZ(k)-spec.centerZ)<spec.height/2+2&&(rear?Math.abs(a.getX(k)-spec.centerX)<spec.width/2+2&&a.getY(k)>145:Math.abs(a.getY(k)-spec.centerY)<spec.width/2+2&&(sign<0?a.getX(k)<10:a.getX(k)>50))))for(const k of ids)p.push(a.getX(k),a.getY(k),a.getZ(k));}}
    const g=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(p,3)),m=new T.MeshBasicMaterial({side:T.DoubleSide}),host=new T.Mesh(g,m),ray=new T.Raycaster();host.updateMatrixWorld(true);
    const project=(u,v,d)=>{const z=spec.centerZ+v,along=(rear?spec.centerX:spec.centerY)+(rear?u:-sign*u),key=along.toFixed(6)+','+z.toFixed(6);let hit=cache.get(key);if(!hit){ray.set(rear?new T.Vector3(along,190,z):new T.Vector3(30+sign*80,along,z),rear?new T.Vector3(0,-1,0):new T.Vector3(-sign,0,0));hit=ray.intersectObject(host)[0]?.point;if(!hit)throw new Error('Missing body surface for '+spec.id);cache.set(key,hit);}return rear?[hit.x,hit.y+d,hit.z]:[hit.x+sign*d,hit.y,hit.z];};
    const mark=buildMark(spec,project,materials);group.add(mark);bounds[spec.id]=mark.userData.bounds;g.dispose();m.dispose();
  }
  group.userData={spec:EMBLEMS_SPEC,bounds};return {group,materials};
}

export function buildRackWordmark(){
  const materials=createMaterials(),spec=EMBLEMS_SPEC.instances.find(s=>s.id==='rack-entegra');
  const group=buildMark(spec,(u,v,d)=>{const z=spec.centerZ+v;return[spec.centerX-u,19+(z-.7)*1.1-d,z];},materials);
  return {group,materials};
}
