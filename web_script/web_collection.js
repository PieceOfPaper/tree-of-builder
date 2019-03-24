module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
      tos.RequestLog(request);
      var baseTable = tableData['collection'];
  
      // id값이 존재하는 경우, 상세 페이지로 이동
      if (baseTable != undefined && request.query.id != undefined && request.query.id != ''){
        for (var i = 0; i < baseTable.length; i ++){
          if (baseTable[i].ClassID === Number(request.query.id)){
            detailPage(i, request, response);
            return;
          }
        }
      }
  
      response.send('no data');
    });
  
    var layout_detail = fs.readFileSync('./web/CollectionPage/detail.html');
  
    function detailPage(index, request, response) {
      var baseTable = tableData['collection'];

      var iconPath = 'icon/itemicon/icon_item_box.png';
      var itemData = tos.FindDataClassName(tableData,'item',baseTable[index].ClassName);
      if (itemData!=undefined){
        if (itemData.EqpType != undefined && itemData.UseGender != undefined && itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
        } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            iconPath = '../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png';
        } else if(itemData.Icon != undefined){
            iconPath = '../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png';
        } else if(itemData.Illust != undefined){
            iconPath = '../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png';
        }
      }
      
      var baseItemString = '<h3>Base Item</h3><p>'+tos.GetItemResultString(tableData,baseTable[index].ClassName)+'</p>';

      var itemString = '<h3>Items</h3>';
      for (var i=1;i<=9;i++){
          if (baseTable[index]['ItemName_'+i]==undefined) continue;
          if (baseTable[index]['ItemName_'+i].length==0) continue;
          itemString += '<p>'+tos.GetItemResultString(tableData,baseTable[index]['ItemName_'+i])+'</p>';
      }

      var rewardString = '<h3>Rewards</h3>';
      if (baseTable[index]['PropList']!=undefined && baseTable[index]['PropList'].length>0){
        var probsplited = baseTable[index]['PropList'].split('/');
        for (var i=0;i<probsplited.length;i+=2){
            rewardString += '<p>'+tos.ClassName2Lang(tableData,probsplited[i])+' +'+probsplited[i+1]+'</p>';
        }
      }
      if (baseTable[index]['AccPropList']!=undefined && baseTable[index]['AccPropList'].length>0){
        var probsplited = baseTable[index]['AccPropList'].split('/');
        for (var i=0;i<probsplited.length;i+=2){
            rewardString += '<p>'+tos.ClassName2Lang(tableData,probsplited[i])+' +'+probsplited[i+1]+'</p>';
        }
      }
      if (baseTable[index]['AccGiveItemList']!=undefined && baseTable[index]['AccGiveItemList'].length>0){
        var probsplited = baseTable[index]['AccGiveItemList'].split('/');
        for (var i=0;i<probsplited.length;i+=2){
            rewardString += '<p>'+tos.GetItemResultString(tableData,probsplited[i],probsplited[i+1])+'</p>';
        }
      }
  
      var output = layout_detail.toString();
      output = output.replace(/style.css/g, '../style.css');
      output = output.replace(/%ImagePath%/g, 'http://'+request.headers.host+'/img/'+iconPath);
      output = output.replace(/%Name%/g, baseTable[index].Name);
      output = output.replace(/%ClassName%/g, baseTable[index].ClassName);
      output = output.replace(/%ClassID%/g, baseTable[index].ClassID);
      output = output.replace(/%Journal%/g, baseTable[index].Journal);

      output = output.replace(/%BaseItemString%/g, baseItemString);
      output = output.replace(/%ItemString%/g, itemString);
      output = output.replace(/%RewardString%/g, rewardString);

      response.send(output);
    }
  
    return route;
  }