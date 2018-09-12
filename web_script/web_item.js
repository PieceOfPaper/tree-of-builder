module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-item.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  // var jobTable = tableData['job'];
  // var skillTable = tableData['skill'];
  // var skillTreeTable = tableData['skilltree'];

  route.get('/', function (request, response) {
    var itemTable = tableData['item'];
    var itemEquipTable = tableData['item_Equip'];
    var itemPremiumTable = tableData['item_premium'];
    var itemQuestTable = tableData['item_Quest'];
    var itemGemTable = tableData['item_gem'];
    var itemRecipeTable = tableData['item_recipe'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.table != undefined && request.query.id != undefined){
      if (request.query.table == 'item_Equip') {

      // } else if (request.query.table == 'item_premium') {

      // } else if (request.query.table == 'item_Quest') {

      // } else if (request.query.table == 'item_gem') {

      // } else if (request.query.table == 'item_recipe') {

      } else {
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === request.query.id){
            itemDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      }
    }

    var filteredItemTable = [];
    var filteredItemEquipTable = [];
    var filteredItemPremiumTable = [];
    var filteredItemQuestTable = [];
    var filteredItemGemTable = [];
    var filteredItemRecipeTable = [];

    var resultArray = [];

    // Item
    for (var i = 0; i < itemTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemTable.length; j ++){
        if (filteredItemTable[j] === itemTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemTable[i]);
    }

    // Item Equip
    for (var i = 0; i < itemEquipTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemEquipTable.length; j ++){
        if (filteredItemEquipTable[j] === itemEquipTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemEquipTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemEquipTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemEquipTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemEquipTable[i]);
    }

    // Item Premium
    for (var i = 0; i < itemPremiumTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemPremiumTable.length; j ++){
        if (filteredItemPremiumTable[j] === itemPremiumTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemPremiumTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemPremiumTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemPremiumTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemPremiumTable[i]);
    }

    // Item Quest
    for (var i = 0; i < itemQuestTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemQuestTable.length; j ++){
        if (filteredItemQuestTable[j] === itemQuestTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemQuestTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemQuestTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemQuestTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemQuestTable[i]);
    }

    // Item Gem
    for (var i = 0; i < itemGemTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemGemTable.length; j ++){
        if (filteredItemGemTable[j] === itemGemTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemGemTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemGemTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemGemTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemGemTable[i]);
    }

    // Item Recipe
    for (var i = 0; i < itemRecipeTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemRecipeTable.length; j ++){
        if (filteredItemRecipeTable[j] === itemRecipeTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemRecipeTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemRecipeTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemRecipeTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemRecipeTable[i]);
    }

    // 최종 소팅
    resultArray.sort(function(a,b){
      if (Number(a.ClassID) > Number(b.ClassID)) return 1;
      else if (Number(a.ClassID) < Number(b.ClassID)) return -1;
      else return 0;
    });

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?table=' + resultArray[i].TableName + '&id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      //resultString += '<td align="center">' + resultArray[i].ClassID + '</td>';
      // 공용 코스튬은 아이콘이 두개
      if (resultArray[i].EqpType != undefined && resultArray[i].UseGender != undefined && 
          resultArray[i].EqpType.toLowerCase() == 'outer' && resultArray[i].UseGender.toLowerCase() == 'both'){
        resultString += '<td align="center"><img src="../img/icon/itemicon/' + resultArray[i].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + resultArray[i].Icon.toLowerCase()  + '_f.png"/></td>';
      } else if(resultArray[i].EquipXpGroup != undefined && resultArray[i].EquipXpGroup.toLowerCase() == 'gem_skill') {
        resultString += '<td align="center"><img src="../img/icon/mongem/' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      } else if(resultArray[i].Icon != undefined){
        resultString += '<td align="center"><img src="../img/icon/itemicon/' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      } else if(resultArray[i].Illust != undefined){
        resultString += '<td align="center"><img src="../img/icon/itemicon/' + resultArray[i].Illust.toLowerCase()  + '.png"/></td>';
      } else {
        resultString += '<td align="center">No Img</td>';
      }
      resultString += '<td>';
      resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '</p>';
      //resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '<br/>' + '<br/>' + tos.parseCaption(resultArray[i].Desc) + '</p>';
      resultString += '</td>';
      resultString += '</tr>';
    }


    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');

    output = output.replace(/%SearchResult%/g, resultString);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  });

  var layout_item_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemEquip_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemPremium_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemQuest_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemGem_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemRecipe_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');

  function itemDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];

    var output = layout_item_detail.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase() + '.png" />');
    if (itemTable[index].TooltipImage == undefined){
      output = output.replace(/%TooltipImage%/g, '');
    } else if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'card'){
      output = output.replace(/%TooltipImage%/g, '<img src="../img/bosscard2/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
    } else {
      output = output.replace(/%TooltipImage%/g, '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
    }
    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);

    output = output.replace(/%ItemType%/g, itemTable[index].ItemType);
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, itemTable[index].GroupName);
    output = output.replace(/%Weight%/g, itemTable[index].Weight);
    output = output.replace(/%MaxStack%/g, itemTable[index].MaxStack);
    if (itemTable[index].CardGroupName == undefined){
      output = output.replace(/%CardGroupName%/g, '');
    } else {
      output = output.replace(/%CardGroupName%/g, itemTable[index].CardGroupName);
    }

    output = output.replace(/%MaterialPrice%/g, itemTable[index].MaterialPrice);
    output = output.replace(/%Price%/g, itemTable[index].Price);
    output = output.replace(/%PriceRatio%/g, itemTable[index].PriceRatio);
    output = output.replace(/%SellPrice%/g, itemTable[index].SellPrice);
    output = output.replace(/%RepairPriceRatio%/g, itemTable[index].RepairPriceRatio);

    output = output.replace(/%Desc%/g, tos.parseCaption(itemTable[index].Desc));
    if (itemTable[index].Desc_Sub == undefined){
      output = output.replace(/%Desc_Sub%/g, '');
    } else {
      output = output.replace(/%Desc_Sub%/g, tos.parseCaption(itemTable[index].Desc_Sub));
    }

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  return route;
}