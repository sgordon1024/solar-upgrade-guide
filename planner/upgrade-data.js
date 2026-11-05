// Proposed equipment catalogue. Product dimensions and installation evidence are independent.
(function(root){
  const catalogue={
    revision:'underbody-options-1',units:'in',fitStatus:'unverified',
    tanks:{
      gocode28:{name:'GoCode · 28 gallons',model:'SP-ST-28',length:29.75,width:27.75,height:10,dimensionStatus:'manufacturer-approximate',variation:'Up to 1.5% per dimension',dryWeightLb:22,publishedFilledWeightLb:255,source:'https://gocodeoverland.com/collections/all-tanks/products/28-gallon-sprinter-spare-tire-water-tank'},
      sb35:{name:'S&B · 35 gallons',model:'10-3033',length:29,width:32,height:11.75,dimensionStatus:'manufacturer-approximate',variation:'Dimensions can vary up to 0.5 inch',dryWeightLb:20,source:'https://sbfilters.com/products/35-gallon-spare-tire-replacement-fresh-water-tank-07-24-mercedes-sprinter-144-170-copy'}
    },
    skids:{
      engine:{name:'Van Compass 4095 · engine',source:'https://vancompass.com/products/engine-skid-plate-sprinter-awd-2023-2500-by-van-compass',productClass:'2023+ Sprinter 2500 AWD',geometryStatus:'estimated',dimensions:[30,35,.25],center:[30,-37,-87],note:'Illustrative outline and mounting height. Exact outline/bends/holes unverified. 4102 is for the Van Compass 2-inch lift; do not select from this model’s estimated stance.'},
      transmission:{name:'Van Compass 4096 · transmission / transfer case',source:'https://vancompass.com/products/transmission-and-transfer-case-skid-plate-sprinter-awd-2023-by-van-compass',productClass:'2023+ Sprinter AWD',geometryStatus:'estimated',dimensions:[23,34,.25],center:[30,-2.5,-86],requires:'engine',note:'Requires Van Compass engine skid. Illustrative plate outline, bend and placement; mounting holes are not modeled.'}
    },
    tankPlacement:{center:[30,129,-88],positionStatus:'estimated',orientation:'Published length placed fore-aft for comparison; installed orientation unverified'},
    installationStatus:'proposed-not-installed',limits:'Original comparison envelopes, not product CAD. OEM spare basket presence, coach equipment, fittings, exhaust, moving parts and physical fit remain unverified. Excluded from roof box checks.'
  };
  function defaults(){return {version:1,tank:'none',engineSkid:false,transmissionSkid:false,solar:RooflabSolar.defaults(),roofExtras:RooflabRoofExtras.defaults()};}
  function validate(v){if(v===undefined)return defaults();if(!v||v.version!==1||!['none',...Object.keys(catalogue.tanks)].includes(v.tank)||typeof v.engineSkid!=='boolean'||typeof v.transmissionSkid!=='boolean')throw Error('Invalid optional upgrade settings.');if(v.transmissionSkid&&!v.engineSkid)throw Error('Transmission skid requires the engine skid.');return {version:1,tank:v.tank,engineSkid:v.engineSkid,transmissionSkid:v.transmissionSkid,solar:RooflabSolar.validate(v.solar),roofExtras:RooflabRoofExtras.validate(v.roofExtras)};}
  root.RooflabUpgrades={catalogue,defaults,validate};
})(globalThis);
