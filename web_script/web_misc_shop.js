module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/misc_shop.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var shopTable = serverData['tableData']['shop'];

        var output = layout.toString();
        var resultString = '';

        var array = [];
        for (param in shopTable){
            if (shopTable[param]==undefined || shopTable[param]['ShopName']==undefined) continue;
            if (request.query.id!=undefined && request.query.id.length>0 && request.query.id!=shopTable[param]['ShopName']) continue;
            if (array[shopTable[param]['ShopName']]==undefined){
                array[shopTable[param]['ShopName']] = [];
            }
            array[shopTable[param]['ShopName']].push(shopTable[param]);
        }

        for (shopname in array){
            resultString += '<h2>'+shopname+'</h2>';
            resultString += '<table class="search-result-table"><tbody>';
            resultString += '<tr>';
            resultString += '<td>Item</td>';
            resultString += '<td>Price</td>';
            resultString += '</tr>';
            for (param in array[shopname]){
                var itemdata = tos.FindDataClassName(serverData,'item',array[shopname][param]['ItemName']);
                if (itemdata == undefined) continue;
                var price = -1;
                if (itemdata['Price'] != undefined) price = Number(itemdata['Price']);

                
                resultString += '<tr>';
                resultString += '<td>'+tos.GetItemResultString(serverData,array[shopname][param]['ItemName'])+'</td>';
                resultString += '<td>'+price.toLocaleString()+'</td>';
                resultString += '</tr>';
            }
            resultString += '</tbody></table><br/><br/>';
        }

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}