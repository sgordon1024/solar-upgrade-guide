import * as T from './vendor/three.module.js';

export const DRIVER_DETAILS_SPEC={revision:'driver-access-1',units:'in',status:'estimated',
 fuel:{centerY:22.25,centerZ:-64.5,width:5.1,height:12,capDiameter:2.7,capColor:'red',location:'Fixed driver-side body immediately aft of cab door',access:'Driver door must be open to access fuel flap; owner-confirmed. Cutaway hides the closed flap only, not an opening simulation.',colorSource:'Owner-confirmed red cap; interior not visible in supplied photos',dimensionsSource:'Photo-estimated outline and position; cap, recess and concealed parts illustrative',measurementRequest:'E14'},
 hatchLight:{centerY:71,centerZ:-52.3,width:10.6,height:2.3,projection:1.4,status:'photo-estimated',description:'Small black housing with pale unlit lower lens, above cassette hatch',measurementRequest:'E15'},
 limits:'No door travel, interlock mechanism, fuel plumbing or mounting fit validated. Excluded from roof box checks.'};

// Project onto the same analytical body surface used to build the shell.
export function buildDriverDetails(project){
 const group=new T.Group(),flap=new T.Group(),interior=new T.Group(),light=new T.Group();group.name='Driver fuel access and hatch light';flap.name='Closed fuel flap on fixed body';interior.name='Fuel recess and owner-described red cap';light.name='Black light above cassette hatch';group.add(flap,interior,light);
 const materials={},mat=(name,color,metalness=0,roughness=.5)=>materials[name]=new T.MeshStandardMaterial({name,color,metalness,roughness,side:T.DoubleSide});
 const paint=mat('Fuel flap blue-gray paint','#709bc0',.22,.38),black=mat('Fuel recess and light housing','#171c1f',.1,.64),red=mat('Owner-described red fuel cap','#a51d20',.08,.5),lens=mat('Unlit hatch-light lens','#bac1bb',.1,.35);paint.envMapIntensity=.75;
 function mesh(g,m,target,name){g.computeVertexNormals();const o=new T.Mesh(g,m);o.name=name;o.castShadow=true;target.add(o);return o;}
 function face(points,d,m,target,name){const shape=new T.Shape(points.map(p=>new T.Vector2(...p))),g=new T.ShapeGeometry(shape,12),p=g.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,...project(p.getX(i),p.getY(i),d));return mesh(g,m,target,name);}
 function rounded(cy,cz,w,h,r){const pts=[];for(let k=0;k<4;k++){const a=k*Math.PI/2,y=cy+(Math.cos(a+Math.PI/4)>0?1:-1)*(w/2-r),z=cz+(Math.sin(a+Math.PI/4)>0?1:-1)*(h/2-r);for(let i=0;i<=8;i++)pts.push([y+r*Math.cos(a+i*Math.PI/16),z+r*Math.sin(a+i*Math.PI/16)]);}return pts;}
 function strip(rows,m,target,name){const p=[],ix=[],n=rows[0].points.length;for(const row of rows)for(const [y,z] of row.points)p.push(...project(y,z,row.d));for(let j=0;j<rows.length-1;j++)for(let k=0;k<n;k++){const a=j*n+k,b=j*n+(k+1)%n;ix.push(a,b,a+n,b,b+n,a+n);}const g=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);return mesh(g,m,target,name);}
 const f=DRIVER_DETAILS_SPEC.fuel,outline=rounded(f.centerY,f.centerZ,f.width,f.height,.6),mouth=rounded(f.centerY,f.centerZ,4.65,11.5,.5),back=rounded(f.centerY,f.centerZ,4.1,10.8,.6);
 face(back,-1.2,black,interior,'Fuel recess back');strip([{points:outline,d:.06},{points:mouth,d:.07},{points:back,d:-1.2}],black,interior,'Fuel recess surround');
 face(outline,.16,paint,flap,'Closed painted fuel flap');
 const rim=rounded(f.centerY,f.centerZ,4.98,11.88,.57);strip([{points:outline,d:.11},{points:rim,d:.17}],black,flap,'Fuel flap thin shut line');
 const capPoints=r=>Array.from({length:64},(_,i)=>[f.centerY+r*Math.cos(i*Math.PI/32),f.centerZ+r*Math.sin(i*Math.PI/32)]);
 strip([{points:capPoints(1.45),d:-.85},{points:capPoints(1.45),d:-.4}],black,interior,'Fuel filler neck');
 strip([{points:capPoints(1.35),d:-.4},{points:capPoints(1.35),d:-.1}],red,interior,'Red cap edge');face(capPoints(1.35),-.1,red,interior,'Red fuel cap face');
 face(rounded(f.centerY,f.centerZ,2.15,.48,.18),.04,red,interior,'Red cap grip');
 const l=DRIVER_DETAILS_SPEC.hatchLight,outer=[[-5.3,.8],[-4.7,1.15],[4.7,1.15],[5.3,.8],[4.1,-1.15],[-4.1,-1.15]].map(([y,z])=>[l.centerY+y,l.centerZ+z]),front=outer.map(([y,z])=>[l.centerY+(y-l.centerY)*.94,l.centerZ+(z-l.centerZ)*.9]);
 strip([{points:outer,d:.04},{points:front,d:l.projection}],black,light,'Hatch light tapered case');face(front,l.projection,black,light,'Hatch light front');face(rounded(l.centerY,l.centerZ-.45,5.9,.6,.18),l.projection+.025,lens,light,'Hatch light unlit lens');
 for(let i=1;i<8;i++)face(rounded(l.centerY-2.95+i*5.9/8,l.centerZ-.45,.055,.57,.02),l.projection+.035,black,light,'Lens segmentation');
 group.userData={spec:DRIVER_DETAILS_SPEC};return {group,flap,interior,light,materials};
}
