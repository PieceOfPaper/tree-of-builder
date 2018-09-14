module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-item.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  
  var equipStatList = [ 'ADD_MINATK','ADD_MAXATK', 'ADD_DEF', 'CRTHR', 'CRTATK', 'CRTDR', 'ADD_HR', 'ADD_DR', 'STR', 'DEX', 'CON', 'INT', 'MNA', 'SR', 'SDR', 'ADD_MHR', 'ADD_MDEF', 'MGP', 'AddSkillMaxR', 'SkillRange', 'SkillAngle', 'Luck', 'BlockRate', 'BLK', 'BLK_BREAK', 'Revive', 'HitCount', 'BackHit', 'SkillPower', 'ASPD', 'MSPD', 'KDPow', 'MHP', 'MSP', 'MSTA', 'RHP', 'RSP', 'RSPTIME', 'RSTA', 'ADD_CLOTH', 'ADD_LEATHER', 'ADD_CHAIN', 'ADD_IRON', 'ADD_GHOST', 'ADD_SMALLSIZE', 'ADD_MIDDLESIZE', 'ADD_LARGESIZE', 'ADD_FORESTER', 'ADD_WIDLING', 'ADD_VELIAS', 'ADD_PARAMUNE', 'ADD_KLAIDA', 'ADD_FIRE', 'ADD_ICE', 'ADD_POISON', 'ADD_LIGHTNING', 'ADD_EARTH', 'ADD_SOUL', 'ADD_HOLY', 'ADD_DARK' ];

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
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === request.query.id){
            itemEquipDetailPage(request.query.table, i, request, response);
            return;
          }
        }

      // } else if (request.query.table == 'item_premium') {

      // } else if (request.query.table == 'item_Quest') {

      // } else if (request.query.table == 'item_gem') {

      } else if (request.query.table == 'item_recipe') {
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === request.query.id){
            itemRecipeDetailPage(request.query.table, i, request, response);
            return;
          }
        }
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
  var layout_itemEquip_detail = fs.readFileSync('./web/Layout/index-itemdetail-equip.html');
  var layout_itemPremium_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemQuest_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemGem_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemRecipe_detail = fs.readFileSync('./web/Layout/index-itemdetail-recipe.html');

  function itemDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];

    var icon = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_f.png"/>';
      tooltipImg = '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_f.png"/>';
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
      tooltipImg = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Icon != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '.png"/>';
      tooltipImg = '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Illust != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Illust.toLowerCase()  + '.png"/>';
    } else {
      icon = 'No Img';
    }

    var output = layout_item_detail.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, icon);
    if (itemTable[index].TooltipImage == undefined){
      output = output.replace(/%TooltipImage%/g, '');
    } else if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'card'){
      output = output.replace(/%TooltipImage%/g, '<img src="../img/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
    } else {
      output = output.replace(/%TooltipImage%/g, '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
    }
    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);

    output = output.replace(/%ItemType%/g, itemTable[index].ItemType);
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(tableData, itemTable[index].GroupName));
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

  function itemEquipDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];

    var icon = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_f.png"/>';
      tooltipImg = '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_f.png"/>';
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
      tooltipImg = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Icon != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '.png"/>';
      tooltipImg = '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Illust != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Illust.toLowerCase()  + '.png"/>';
    } else {
      icon = 'No Img';
    }



    var statListString = '';
    for (var i = 0; i < equipStatList.length; i ++){
      if (itemTable[index][equipStatList[i]] == undefined || Math.abs(itemTable[index][equipStatList[i]]) == 0) continue;
      statListString += '- ' + tos.ClassName2Lang(tableData, equipStatList[i]) + (Number(itemTable[index][equipStatList[i]]) > 0 ? '▲' : '▼') + itemTable[index][equipStatList[i]] + '<br/>';
    }
    // if (Math.abs(itemTable[index].ADD_MINATK) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_MINATK') + (Number(itemTable[index].ADD_MINATK) > 0 ? '▲' : '▼') + itemTable[index].ADD_MINATK + '<br/>';
    // if (Math.abs(itemTable[index].ADD_MAXATK) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_MAXATK') + (Number(itemTable[index].ADD_MAXATK) > 0 ? '▲' : '▼') + itemTable[index].ADD_MAXATK + '<br/>';
    // if (Math.abs(itemTable[index].ADD_DEF) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_DEF') + (Number(itemTable[index].ADD_DEF) > 0 ? '▲' : '▼') + itemTable[index].ADD_DEF + '<br/>';
    // if (Math.abs(itemTable[index].CRTHR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'CRTHR') + (Number(itemTable[index].CRTHR) > 0 ? '▲' : '▼') + itemTable[index].CRTHR + '<br/>';
    // if (Math.abs(itemTable[index].CRTATK) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'CRTATK') + (Number(itemTable[index].CRTATK) > 0 ? '▲' : '▼') + itemTable[index].CRTATK + '<br/>';
    // if (Math.abs(itemTable[index].CRTDR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'CRTDR') + (Number(itemTable[index].CRTDR) > 0 ? '▲' : '▼') + itemTable[index].CRTDR + '<br/>';
    // if (Math.abs(itemTable[index].ADD_HR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_HR') + (Number(itemTable[index].ADD_HR) > 0 ? '▲' : '▼') + itemTable[index].ADD_HR + '<br/>';
    // if (Math.abs(itemTable[index].ADD_DR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_DR') + (Number(itemTable[index].ADD_DR) > 0 ? '▲' : '▼') + itemTable[index].ADD_DR + '<br/>';
    // if (Math.abs(itemTable[index].STR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'STR') + (Number(itemTable[index].STR) > 0 ? '▲' : '▼') + itemTable[index].STR + '<br/>';
    // if (Math.abs(itemTable[index].DEX) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'DEX') + (Number(itemTable[index].DEX) > 0 ? '▲' : '▼') + itemTable[index].DEX + '<br/>';
    // if (Math.abs(itemTable[index].CON) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'CON') + (Number(itemTable[index].CON) > 0 ? '▲' : '▼') + itemTable[index].CON + '<br/>';
    // if (Math.abs(itemTable[index].INT) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'INT') + (Number(itemTable[index].INT) > 0 ? '▲' : '▼') + itemTable[index].INT + '<br/>';
    // if (Math.abs(itemTable[index].MNA) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'MNA') + (Number(itemTable[index].MNA) > 0 ? '▲' : '▼') + itemTable[index].MNA + '<br/>';
    // if (Math.abs(itemTable[index].SR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'SR') + (Number(itemTable[index].SR) > 0 ? '▲' : '▼') + itemTable[index].SR + '<br/>';
    // if (Math.abs(itemTable[index].SDR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'SDR') + (Number(itemTable[index].SDR) > 0 ? '▲' : '▼') + itemTable[index].SDR + '<br/>';
    // if (Math.abs(itemTable[index].ADD_MHR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_MHR') + (Number(itemTable[index].ADD_MHR) > 0 ? '▲' : '▼') + itemTable[index].ADD_MHR + '<br/>';
    // if (Math.abs(itemTable[index].ADD_MDEF) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_MDEF') + (Number(itemTable[index].ADD_MDEF) > 0 ? '▲' : '▼') + itemTable[index].ADD_MDEF + '<br/>';
    // if (Math.abs(itemTable[index].MGP) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'MGP') + (Number(itemTable[index].MGP) > 0 ? '▲' : '▼') + itemTable[index].MGP + '<br/>';
    // if (Math.abs(itemTable[index].AddSkillMaxR) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'AddSkillMaxR') + (Number(itemTable[index].AddSkillMaxR) > 0 ? '▲' : '▼') + itemTable[index].AddSkillMaxR + '<br/>';
    // if (Math.abs(itemTable[index].SkillRange) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'SkillRange') + (Number(itemTable[index].SkillRange) > 0 ? '▲' : '▼') + itemTable[index].SkillRange + '<br/>';
    // if (Math.abs(itemTable[index].SkillAngle) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'SkillAngle') + (Number(itemTable[index].SkillAngle) > 0 ? '▲' : '▼') + itemTable[index].SkillAngle + '<br/>';
    // if (Math.abs(itemTable[index].Luck) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'Luck') + (Number(itemTable[index].Luck) > 0 ? '▲' : '▼') + itemTable[index].Luck + '<br/>';
    // if (Math.abs(itemTable[index].BlockRate) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'BlockRate') + (Number(itemTable[index].BlockRate) > 0 ? '▲' : '▼') + itemTable[index].BlockRate + '<br/>';
    // if (Math.abs(itemTable[index].BLK) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'BLK') + (Number(itemTable[index].BLK) > 0 ? '▲' : '▼') + itemTable[index].BLK + '<br/>';
    // if (Math.abs(itemTable[index].BLK_BREAK) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'BLK_BREAK') + (Number(itemTable[index].BLK_BREAK) > 0 ? '▲' : '▼') + itemTable[index].BLK_BREAK + '<br/>';
    // if (Math.abs(itemTable[index].Revive) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'Revive') + (Number(itemTable[index].Revive) > 0 ? '▲' : '▼') + itemTable[index].Revive + '<br/>';
    // if (Math.abs(itemTable[index].HitCount) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'HitCount') + (Number(itemTable[index].HitCount) > 0 ? '▲' : '▼') + itemTable[index].HitCount + '<br/>';
    // if (Math.abs(itemTable[index].BackHit) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'BackHit') + (Number(itemTable[index].BackHit) > 0 ? '▲' : '▼') + itemTable[index].BackHit + '<br/>';
    // if (Math.abs(itemTable[index].SkillPower) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'SkillPower') + (Number(itemTable[index].SkillPower) > 0 ? '▲' : '▼') + itemTable[index].SkillPower + '<br/>';
    // if (Math.abs(itemTable[index].ASPD) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ASPD') + (Number(itemTable[index].ASPD) > 0 ? '▲' : '▼') + itemTable[index].ASPD + '<br/>';
    // if (Math.abs(itemTable[index].MSPD) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'MSPD') + (Number(itemTable[index].MSPD) > 0 ? '▲' : '▼') + itemTable[index].MSPD + '<br/>';
    // if (Math.abs(itemTable[index].KDPow) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'KDPow') + (Number(itemTable[index].KDPow) > 0 ? '▲' : '▼') + itemTable[index].KDPow + '<br/>';
    // if (Math.abs(itemTable[index].MHP) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'MHP') + (Number(itemTable[index].MHP) > 0 ? '▲' : '▼') + itemTable[index].MHP + '<br/>';
    // if (Math.abs(itemTable[index].MSP) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'MSP') + (Number(itemTable[index].MSP) > 0 ? '▲' : '▼') + itemTable[index].MSP + '<br/>';
    // if (Math.abs(itemTable[index].MSTA) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'MSTA') + (Number(itemTable[index].MSTA) > 0 ? '▲' : '▼') + itemTable[index].MSTA + '<br/>';
    // if (Math.abs(itemTable[index].RHP) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'RHP') + (Number(itemTable[index].RHP) > 0 ? '▲' : '▼') + itemTable[index].RHP + '<br/>';
    // if (Math.abs(itemTable[index].RSP) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'RSP') + (Number(itemTable[index].RSP) > 0 ? '▲' : '▼') + itemTable[index].RSP + '<br/>';
    // if (Math.abs(itemTable[index].RSPTIME) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'RSPTIME') + (Number(itemTable[index].RSPTIME) > 0 ? '▲' : '▼') + itemTable[index].RSPTIME + '<br/>';
    // if (Math.abs(itemTable[index].RSTA) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'RSTA') + (Number(itemTable[index].RSTA) > 0 ? '▲' : '▼') + itemTable[index].RSTA + '<br/>';
    // if (Math.abs(itemTable[index].ADD_CLOTH) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_CLOTH') + (Number(itemTable[index].ADD_CLOTH) > 0 ? '▲' : '▼') + itemTable[index].ADD_CLOTH + '<br/>';
    // if (Math.abs(itemTable[index].ADD_LEATHER) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_LEATHER') + (Number(itemTable[index].ADD_LEATHER) > 0 ? '▲' : '▼') + itemTable[index].ADD_LEATHER + '<br/>';
    // if (Math.abs(itemTable[index].ADD_CHAIN) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_CHAIN') + (Number(itemTable[index].ADD_CHAIN) > 0 ? '▲' : '▼') + itemTable[index].ADD_CHAIN + '<br/>';
    // if (Math.abs(itemTable[index].ADD_IRON) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'ADD_IRON') + (Number(itemTable[index].ADD_IRON) > 0 ? '▲' : '▼') + itemTable[index].ADD_IRON + '<br/>';
    // if (Math.abs(itemTable[index].INT) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'INT') + (Number(itemTable[index].INT) > 0 ? '▲' : '▼') + itemTable[index].INT + '<br/>';
    // if (Math.abs(itemTable[index].INT) > 0) statListString += '- ' + tos.ClassName2Lang(tableData, 'INT') + (Number(itemTable[index].INT) > 0 ? '▲' : '▼') + itemTable[index].INT + '<br/>';
    if (itemTable[index].OptDesc != undefined && itemTable[index].OptDesc.length > 0)  statListString += tos.parseCaption(itemTable[index].OptDesc);

    var output = layout_itemEquip_detail.toString();

    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, icon);
    output = output.replace(/%TooltipImage%/g, tooltipImg);
    output = output.replace(/%StatList%/g, statListString);

    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);

    output = output.replace(/%ItemType%/g, tos.ClassName2Lang(tableData, itemTable[index].ItemType));
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(tableData, itemTable[index].GroupName));
    output = output.replace(/%Weight%/g, itemTable[index].Weight);
    output = output.replace(/%MaxStack%/g, itemTable[index].MaxStack);

    output = output.replace(/%ItemGrade%/g, itemTable[index].ItemGrade);
    output = output.replace(/%UseLv%/g, itemTable[index].UseLv);
    output = output.replace(/%Dur%/g, itemTable[index].Dur);
    output = output.replace(/%MaxDur%/g, itemTable[index].MaxDur);
    output = output.replace(/%ReqToolTip%/g, itemTable[index].ReqToolTip);
    output = output.replace(/%ClassType%/g, tos.ClassName2Lang(tableData, itemTable[index].ClassType));
    output = output.replace(/%ClassType2%/g, tos.ClassName2Lang(tableData, itemTable[index].ClassType2));
    output = output.replace(/%AttachType%/g, tos.ClassName2Lang(tableData, itemTable[index].AttachType));
    output = output.replace(/%UseJob%/g, itemTable[index].UseJob);
    output = output.replace(/%UseGender%/g, itemTable[index].UseGender);

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
  function itemRecipeDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];

    var icon = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_f.png"/>';
      tooltipImg = '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_f.png"/>';
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
      tooltipImg = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Icon != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '.png"/>';
      tooltipImg = '<img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Illust != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Illust.toLowerCase()  + '.png"/>';
    } else {
      icon = 'No Img';
    }
  
    var output = layout_itemRecipe_detail.toString();
  
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, icon);
    output = output.replace(/%TooltipImage%/g, tooltipImg);
    
    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);
  
    output = output.replace(/%ItemType%/g, itemTable[index].ItemType);
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(tableData, itemTable[index].GroupName));
    output = output.replace(/%Weight%/g, itemTable[index].Weight);
    output = output.replace(/%MaxStack%/g, itemTable[index].MaxStack);
  
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
