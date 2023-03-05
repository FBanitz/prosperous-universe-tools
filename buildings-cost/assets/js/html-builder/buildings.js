import { camelToCapitalize } from '../../../../../../assets/js/text.js';

/// builds html for buildings accordion
function buildHtmlBuildings(buildings, expertises, materials) {

    console.log('buildings', buildings);
    let buildingsDivHtml = '';
    expertises = ['BASE'].concat(expertises.concat('PLANETARY_PROJETS','CORPORATION_PROJETS'));
    
    buildingsDivHtml = buildingsDivHtml = '<ul class="pt-3 nav nav-tabs" id="tab-bar" role="tablist">';
    for (let i = 0; i < expertises.length; i++) {
        let expertise = expertises[i];
        buildingsDivHtml = buildingsDivHtml + '<li class="nav-item" role="presentation"><button class="nav-link' + (i==0 ? " active" : "" ) + '" id="nav-'+ expertise +'-tab" data-bs-toggle="tab" data-bs-target="#nav-'+ expertise +'" type="button" role="tab" aria-controls="nav-'+ expertise +'" aria-selected="false">'+ expertise +'</button></li>';
    }
    buildingsDivHtml = buildingsDivHtml + '</ul>';

    for (let i = 0; i < expertises.length; i++) {
        let expertise = expertises[i];
        buildingsDivHtml = buildingsDivHtml + '<div class="p-3 tab-pane fade collapse' + (i==0 ? " show active" : "" ) + '" id="nav-'+ expertise +'" role="tabpanel" aria-labelledby="nav-'+ expertise +'-tab" tabindex="0">';
        
        let buildingsFiltered;
        if (expertise == 'PLANETARY_PROJETS') {
            buildingsFiltered = buildings.filter(building => building['Expertise'] == null && building['Name'].includes('planetary'));
        } else if (expertise == 'CORPORATION_PROJETS') {
            buildingsFiltered = buildings.filter(building => building['Expertise'] == null && building['Name'].includes('corporation'));
        } else if (expertise == 'BASE') {
            buildingsFiltered = buildings.filter(building => building['Expertise'] == null && !building['Name'].includes('planetary') && !building['Name'].includes('corporation'));
        } else {
            buildingsFiltered = buildings.filter(building => building['Expertise'] == expertise);
        }
            
        buildingsDivHtml = buildingsDivHtml + '<div class="accordion" id="buildingsAccordion">';
        
        for (let i = 0; i < buildingsFiltered.length; i++) {
            let building = buildingsFiltered[i];

            let buildingName = building['Name'];
            buildingName = camelToCapitalize(buildingName);

            let buildingTicker = building['Ticker'];
            let buildingCosts = building['BuildingCosts'];
            let buildingCostPriceAverage = 0;

            let buildingCostsHtml = '<table class="table table-hover"><thead><tr><th scope="col">Material</th><th scope="col">Amount</th><th scope="col">Unit Price Average</th><th scope="col">Total Price Average</th></tr></thead><tbody>';
            
            for (let j = 0; j < buildingCosts.length; j++) {
                let buildingCost = buildingCosts[j];
                let material = materials.find(material => material['Ticker'] == buildingCost['CommodityTicker']);
                let materialTicker = material['Ticker'];
                let materialAmount = buildingCost['Amount'];
                let materialPriceAverage = material['Exchange'][0]['PriceAverage'];
                let materialsPriceAverage = materialPriceAverage * materialAmount;
                materialPriceAverage = materialPriceAverage.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                buildingCostPriceAverage = buildingCostPriceAverage + materialsPriceAverage;
                materialsPriceAverage = materialsPriceAverage.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                buildingCostsHtml = buildingCostsHtml + '<tr><td><span class="badge text-bg-primary">'+ materialTicker +'</span></td><td>' + materialAmount + '</td><td>' + materialPriceAverage + '</td><td>' + materialsPriceAverage + '</td></tr>';
            }
            buildingCostPriceAverage = buildingCostPriceAverage.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            buildingCostsHtml = buildingCostsHtml + '</tbody></table>';
            buildingCostsHtml = buildingCostsHtml + '<div class="d-flex justify-content-between"><h3>Total Price Average</h3><h3>' + buildingCostPriceAverage + '</h3></div>';
            buildingsDivHtml = buildingsDivHtml + '<div class="accordion-item" id="'+ buildingTicker +'"> <h2 class="accordion-header" id="heading'+ buildingTicker +'"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse'+ buildingTicker +'" aria-expanded="false" aria-controls="collapse'+ buildingTicker +'"><h2><span class="badge text-bg-info mx-3" style="width:85px;">'+ buildingTicker +'</span></h2><div class="d-flex"><div><h2>'+ buildingName +'</h2></div><div class="ml-auto p-2 align-self-center"><p>' + buildingCostPriceAverage + '</p></button></h2><div id="collapse'+ buildingTicker + '" class="accordion-collapse collapse" aria-labelledby="heading'+ buildingTicker + '" data-bs-parent="#buildingsAccordion"><div class="accordion-body bg-dark-subtle">' + buildingCostsHtml + '</div></div></div> ';
            
        }
        buildingsDivHtml = buildingsDivHtml + '</div></div>';
    }
    return buildingsDivHtml + '</div>';
}

export { buildHtmlBuildings };