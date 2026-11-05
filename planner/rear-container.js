import * as T from './vendor/three.module.js';
export const REAR_CONTAINER_SPEC={revision:'vp-container-2-closeup-spout',name:'VP Racing 3-gallon container',installationStatus:'existing-owner-identified',capacityGallons:3,capacityStatus:'owner-reported',installedPartNumber:null,units:'in',dimensionStatus:'estimated',positionStatus:'photo-estimated',envelope:{width:10,depth:10,height:19.77},installation:{centerX:61.3,centerY:167.75,bottomZ:-91.85,support:'Stored loading ramp, passenger end, inboard of motorcycle',logoFaces:'passenger'},source:'https://plasticproductformers.com/products/3-gallon-motorsport-container%C2%AE-square',sourceScope:'Official family reference for contoured handle, bottom grip and capped white utility container; no manufacturer dimensions or exact installed SKU established.',observations:'Cream body with rounded lower corners, sloped shoulder rising toward van, molded handle area and dark over-strap; black ribbed cap, red upright spout and vent now visible in the closer owner photos.',unresolved:['Actual outside width, depth and total height','Ramp-relative position and footprint overhang','Cap/handle profile and exact installed part number','Strap routing, ratchet and attachment points','Nearest van, tire, fork and carrier gaps'],limits:'Original exterior estimate, not product CAD. Contents, permitted use, restraint, load capacity and physical clearances are not verified. Static existing-equipment reference, excluded from roof box checks.',geometryLicense:'Original MIT geometry; no owner or manufacturer imagery redistributed.'};
export function buildRearContainer(){
 const group=new T.Group();group.name='VP Racing 3-gallon container · estimated';const materials={},buckets=new Map(),s=REAR_CONTAINER_SPEC.installation;
 const mat=(name,color,m=0,r=.7)=>materials[name]=new T.MeshStandardMaterial({name,color,metalness:m,roughness:r,side:T.DoubleSide});
 const cream=mat('Container ivory HDPE','#dbd8ba',0,.65),black=mat('Container cap and webbing','#242826',.05,.9),metal=mat('Container ratchet estimate','#93968d',.55,.45),white=mat('Container label white','#eeede4'),red=mat('Container label red','#cf2531'),blue=mat('Container label blue','#16468a');
 function add(g,m){if(!g.attributes.normal)g.computeVertexNormals();let b=buckets.get(m);if(!b){b={p:[],n:[],i:[],count:0};buckets.set(m,b);}for(const v of g.attributes.position.array)b.p.push(v);for(const v of g.attributes.normal.array)b.n.push(v);if(g.index)for(const v of g.index.array)b.i.push(v+b.count);else for(let i=0;i<g.attributes.position.count;i++)b.i.push(i+b.count);b.count+=g.attributes.position.count;g.dispose();}
 function box(c,size,m){const g=new T.BoxGeometry(...size);g.translate(...c);add(g,m);}
 function cyl(c,r,h,m,n=32){const g=new T.CylinderGeometry(r,r,h,n);g.rotateX(Math.PI/2);g.translate(...c);add(g,m);}
 function tube(points,r,m){add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),40,r,10,false),m);}
 // Rounded rectangular rings form the squat lower body and sloped shoulders.
 const sections=[[0,8.8,8.8,0],[.45,10,10,0],[6.8,10,10,0],[8.2,9.6,9.2,-.2],[9.8,8.1,7.1,-1],[12.5,4.3,4.2,-2.1],[13.45,3.7,3.7,-2.2]],p=[],idx=[],n=40;
 for(const [z,w,d,offset] of sections){for(let k=0;k<n;k++){const a=k*Math.PI*2/n,c=Math.cos(a),sn=Math.sin(a);p.push(w/2*Math.sign(c)*Math.pow(Math.abs(c),.28),offset+d/2*Math.sign(sn)*Math.pow(Math.abs(sn),.28),z);}}
 for(let j=0;j<sections.length-1;j++)for(let k=0;k<n;k++){const a=j*n+k,b=j*n+(k+1)%n;idx.push(a,b,b+n,a,b+n,a+n);}for(let k=1;k<n-1;k++){idx.push(0,k+1,k);const a=(sections.length-1)*n;idx.push(a,a+k,a+k+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();const host=new T.Mesh(g.clone(),cream);host.updateMatrixWorld(true);add(g,cream);
 // Raised integral handgrip leaves real open space ahead of the tapered neck.
 tube([[0,3.75,8.25],[0,3.45,10.1],[0,2.1,12.25],[0,.3,13.2],[0,-1.4,13.3]],.63,cream);
 cyl([0,-2.2,13.65],1.66,.6,cream);cyl([0,-2.2,14.8],1.82,2.1,black);
 for(let k=0;k<32;k++){const a=k*Math.PI/16;cyl([1.83*Math.cos(a),-2.2+1.83*Math.sin(a),14.8],.075,1.72,black,6);}
 cyl([1.6,-.4,12.9],.32,.45,black,16);
 // Owner close-up shows a red spout above the black ribbed cap.
 cyl([0,-2.2,16.05],.74,.5,black,24);
 const spout=new T.ConeGeometry(1.1,1.3,32);spout.rotateX(Math.PI/2);spout.translate(0,-2.2,16.8);add(spout,red);
 cyl([0,-2.2,18.25],.42,2.2,red,24);cyl([0,-2.2,19.47],.5,.3,red,24);cyl([0,-2.2,19.68],.39,.18,black,24);

 // A shallow lower molded grip on the van-facing side, not a body cutout.
 box([0,-4.96,1.45],[4.2,.05,.5],black);
 // Visible webbing follows the outer surface; hidden restraint anchors remain unknown.
 const ray=new T.Raycaster();function outer(y,z,offset=.085){ray.set(new T.Vector3(15,y,z),new T.Vector3(-1,0,0));const hit=ray.intersectObject(host)[0];if(!hit)throw Error('Container accessory falls outside host surface');return [hit.point.x+offset,y,z];}
 const curve=new T.CatmullRomCurve3([[0,3.6,8],[0,1.2,10],[0,-1.3,12.7],[0,-2.7,12.7],[0,-3.8,11.2],[0,-4.3,8.2],[0,-4.4,5.8],[0,-4.4,1]].map(p=>new T.Vector3(...p))),sp=[],si=[],steps=96,across=4;
 for(let k=0;k<=steps;k++){const p=curve.getPoint(k/steps),t=curve.getTangent(k/steps);for(let j=0;j<=across;j++){const side=j/across*2-1;sp.push(...outer(p.y-side*t.z*.32,p.z+side*t.y*.32));}if(k<steps)for(let j=0;j<across;j++){const a=k*(across+1)+j,b=a+across+1;si.push(a,a+1,b+1,a,b+1,b);}}

 const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(sp,3));sg.setIndex(si);sg.computeVertexNormals();add(sg,black);
 function patch(y,z,w,h,offset,m){const p=[...outer(y-w/2,z-h/2,offset),...outer(y+w/2,z-h/2,offset),...outer(y+w/2,z+h/2,offset),...outer(y-w/2,z+h/2,offset)],g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();add(g,m);}
 patch(-4.1,7.7,1.1,1.8,.11,metal);patch(-4.1,7.7,.52,.95,.17,black);patch(-4.1,8.27,.8,.22,.24,metal);host.geometry.dispose();
 // Original simple vector VP mark; no product-photo texture is included.
 function face(g,x,m){const a=g.attributes.position;for(let k=0;k<a.count;k++){const u=a.getX(k),v=a.getY(k);a.setXYZ(k,x,-u+.25,v+3.7);}g.computeVertexNormals();add(g,m);}
 const oval=new T.CircleGeometry(1,40);oval.scale(2.55,1.68,1);face(oval,5.035,white);const oval2=new T.CircleGeometry(1,40);oval2.scale(2.4,1.55,1);face(oval2,5.047,red);
 const v=new T.Shape([[-2.3,1.65],[-1.65,1.65],[-1.05,-.35],[-.7,1.65],[-.15,1.65],[-.7,-1.2],[-1.4,-1.2]].map(p=>new T.Vector2(...p)));face(new T.ShapeGeometry(v),5.075,white);
 const vs=new T.Shape([[-2.14,1.52],[-1.75,1.52],[-1.02,-.68],[-.58,1.52],[-.3,1.52],[-.82,-1.06],[-1.28,-1.06]].map(p=>new T.Vector2(...p)));face(new T.ShapeGeometry(vs),5.09,blue);
 const letter=new T.Shape();letter.moveTo(-.6,-1.2);letter.lineTo(-.6,2.1);letter.lineTo(.7,2.1);letter.quadraticCurveTo(2.05,2.1,2.05,.95);letter.quadraticCurveTo(2.05,-.1,.5,-.1);letter.lineTo(.25,-.1);letter.lineTo(.25,-1.2);letter.closePath();const hole=new T.Path();hole.moveTo(.25,.55);hole.lineTo(.75,.55);hole.quadraticCurveTo(1.25,.55,1.25,1);hole.quadraticCurveTo(1.25,1.4,.75,1.4);hole.lineTo(.25,1.4);hole.closePath();letter.holes.push(hole);face(new T.ShapeGeometry(letter,10),5.1,blue);
 for(const [m,b] of buckets){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setIndex(b.i);const mesh=new T.Mesh(g,m);mesh.name=m.name;mesh.castShadow=true;group.add(mesh);}
 group.position.set(s.centerX,s.centerY,s.bottomZ);group.userData={spec:REAR_CONTAINER_SPEC,bounds:new T.Box3().setFromObject(group)};return {group,materials};
}
