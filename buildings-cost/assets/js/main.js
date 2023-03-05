import { buildHtmlBuildings } from './html-builder/buildings.js';

const exchangeTicker = "IC1";

const urls = {
  allBuildings : 'https://rest.fnar.net/building/allBuildings',
  allMaterials : 'https://rest.fnar.net/material/allMaterials',
  allExchanges : 'https://rest.fnar.net/exchange/all',
  material     : 'https://rest.fnar.net/material/',
}

// let buildingsRawData = "";
let buildingsRawDataDiv = document.querySelector('#buildings-raw-data');
let buildingsDiv = document.querySelector('#buildings');

let exchangeData = await fetch(urls.allExchanges)
  .then(res => res.json())
  .then((res) => {return res});

let allBuildings = await fetch(urls.allBuildings)
  .then(res => res.json())
  .then((res) => {return res});

allBuildings = allBuildings.sort((a, b) => (a['Ticker'] > b['Ticker']) ? 1 : -1);
let allexpertises = [];

for (let i = 0; i < allBuildings.length; i++) {
  let building = allBuildings[i];
  let expertise = building['Expertise'];

  if (allexpertises.indexOf(expertise) === -1 && expertise != null) {
    allexpertises.push(expertise);
  }
}

let allMaterials = await fetch(urls.allMaterials)
  .then(res => res.json())
  .then((res) => {return res});

for (let i = 0; i < allMaterials.length; i++) {
  let exchange = [];
  for (let j = 0; j < exchangeData.length; j++) {
    let exchangeItem = exchangeData[j];
    if (exchangeItem['MaterialTicker'] === allMaterials[i]['Ticker'] && exchangeItem['ExchangeCode'] === exchangeTicker) {
      // console.log(exchangeItem);
      exchange.push(exchangeItem);
    }
  }
  allMaterials[i]['Exchange'] = exchange;
}
    
let buildingsRawData = JSON.stringify(allBuildings, undefined, 2);

if (buildingsRawDataDiv != null) {
  var buildingsRawDataHTML
  buildingsRawDataHTML =  '<div class="d-flex flex-row justify-content-between align-items-center">';
  buildingsRawDataHTML +=     '<div><span class="badge text-bg-success">GET</span> https://rest.fnar.net/building/allBuildings <a href="https://doc.fnar.net/#/building/get_building_allbuildings" target="_blank"><i class="bi bi-info-circle"></i></a></div>';
  buildingsRawDataHTML +=     '<a class="btn btn-outline-secondary" role="button" href="data:text/plain;charset=utf-8,' + encodeURIComponent(buildingsRawData) + '" download="buildings.json"><i class="bi bi-download"></i></a>';
  buildingsRawDataHTML += '</div>';
  buildingsRawDataHTML += '<pre>' + buildingsRawData + '</pre>';
  buildingsRawDataDiv.innerHTML = buildingsRawDataHTML;
}
if (buildingsDiv != null) {
  buildingsDiv.innerHTML = buildHtmlBuildings(allBuildings, allexpertises, allMaterials);
}
