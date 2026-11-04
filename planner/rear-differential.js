import * as T from './vendor/three.module.js';

// Original, estimated outer housing. Reference ring-gear diameter is not a casing drawing.
export const DIFFERENTIAL_SPEC={
  revision:'rear-housing-1',units:'in',status:'estimated',installedAxleVariant:null,
  housingWidth:11.8,housingHeight:11.5,housingLength:10.2,pinionExtension:5.8,
  centerX:30,centerY:108,centerBelowAxle:.5,axleZ:-92.5,
  nominalLowestZ:-98.75,nominalGroundZ:-107.75,nominalGroundGap:9,
  ringGearReference:{diameterMm:245,diameterIn:245/25.4,status:'manufacturer-sourced family reference; exact installed axle unverified',source:'https://www.arb.com.au/product/rd262-arb-air-locker-rear-axle-mercedes-benz-sprinter'},
  sources:[{url:'https://arbusa.com/news/sprinters-get-an-air-locker',scope:'Sprinter NCV3/VS30 rear differential family'},
    {url:'https://mbparts.mbusa.com/v-2023-mercedes-benz-sprinter-2500--base--2-0l-l4-diesel/suspension--axle-and-differential',scope:'2023 diesel axle catalogue and cover; not a matched dimensional drawing'},
    {url:'https://vancompass.com/products/hardcore-differential-cover-sprinter-2007-up',scope:'Description of stock low-hanging cover lip; aftermarket cover is not modeled as installed'}],
  limitations:'Outer casing, cover, fasteners and pinion shape are visualization estimates. Owner rear photo is obscured by the carrier. Ground gap is calculated from the illustrative stance and nominal tire radius, not measured clearance or safe fit. Axle/wheel positions are unchanged.',
  measurementRequest:'U07',includedInRoofBoxChecks:false
};

export function buildRearDifferential(axleZ=DIFFERENTIAL_SPEC.axleZ){
  const group=new T.Group();group.name='Estimated Sprinter rear differential housing';
  const materials={housing:new T.MeshStandardMaterial({name:'Cast rear axle housing',color:'#303537',metalness:.25,roughness:.77}),cover:new T.MeshStandardMaterial({name:'Rear differential cover',color:'#414749',metalness:.4,roughness:.5}),fastener:new T.MeshStandardMaterial({name:'Differential fasteners',color:'#596063',metalness:.6,roughness:.42})};
  const z=axleZ-DIFFERENTIAL_SPEC.centerBelowAxle;
  function mesh(geo,mat,name){const o=new T.Mesh(geo,mat);o.name=name;o.castShadow=true;group.add(o);return o;}
  function loft(rings,mat,name){
    const p=[],ix=[],n=48;
    for(const [y,rx,rz] of rings)for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;p.push(30+rx*Math.cos(a),108+y,z+rz*Math.sin(a));}
    for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+n+1;ix.push(a,b,a+1,a+1,b,b+1);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return mesh(g,mat,name);
  }
  loft([[-4.7,2.25,2.25],[-3.4,4.25,4.1],[-1.5,5.55,5.35],[.5,5.7,5.5],[3.65,5.7,5.45],[4.15,5.9,5.75],[4.45,5.9,5.75]],materials.housing,'Cast bowl and low cover flange');
  loft([[4.45,5.65,5.5],[4.8,5.48,5.32],[5.3,4.3,4.1],[5.5,0,0]],materials.cover,'Domed original-style rear cover');
  function cylinder(y1,y2,r1,r2,x=30,zz=z,n=24,mat=materials.housing){const g=new T.CylinderGeometry(r2,r1,y2-y1,n);const o=mesh(g,mat,'Estimated housing detail');o.position.set(x,(y1+y2)/2,zz);return o;}
  cylinder(97.5,104.1,1.65,2.45);cylinder(97.5,98.15,2.4,2.4);
  // Illustrative perimeter fasteners; count and locations await an underside photo.
  for(let i=0;i<10;i++){const a=(i+.5)*Math.PI*2/10;cylinder(112.45,112.9,.26,.26,30+5.5*Math.cos(a),z+5.3*Math.sin(a),6,materials.fastener);}
  cylinder(113.35,113.68,.48,.48,30,z+.9,6,materials.fastener);
  group.userData={...DIFFERENTIAL_SPEC,axleZ,bounds:new T.Box3().setFromObject(group)};
  return {group,materials};
}
