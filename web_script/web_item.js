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
    var myGrade = tos.GetCurrentGrade(tableData, itemTable[index].ItemGrade);

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
    if (itemTable[index].OptDesc != undefined && itemTable[index].OptDesc.length > 0)  statListString += tos.parseCaption(itemTable[index].OptDesc);


    var captionScript = '';
    captionScript += '<script>';

    captionScript += 'var itemData = {';
    captionScript +=  'UseLv:' + itemTable[index].UseLv  + ',';
    captionScript +=  'ItemLv:' + itemTable[index].ItemLv  + ',';
    captionScript +=  'ItemGrade:' + itemTable[index].ItemGrade  + ',';
    captionScript +=  'DefaultEqpSlot:"' + itemTable[index].DefaultEqpSlot  + '",';
    captionScript +=  'DamageRange:' + itemTable[index].DamageRange  + ',';
    captionScript +=  'ClassType:"' + itemTable[index].ClassType  + '",';
    captionScript +=  'ClassID:"' + itemTable[index].ClassID  + '",';
    captionScript +=  'ClassName:"' + itemTable[index].ClassName  + '",';
    captionScript +=  'ItemStar:"' + itemTable[index].ClassType  + '",';
    captionScript +=  'BasicTooltipProp:"' + itemTable[index].BasicTooltipProp  + '",';
    captionScript +=  'ItemStar:"' + itemTable[index].ItemStar  + '",';
    captionScript +=  'Material:"' + itemTable[index].Material  + '",';
    captionScript +=  'MAXATK:"' + 0  + '",';
    captionScript +=  'MINATK:"' + 0  + '",';
    captionScript +=  'MAXATK_AC:"' + 0 + '",';
    captionScript +=  'MINATK_AC:"' + 0 + '",';
    captionScript +=  'MATK:"' + 0 + '",';
    captionScript +=  'Level:"' + 0 + '",';
    captionScript +=  'HR:"' + 0  + '",';
    captionScript +=  'DR:"' + 0  + '",';
    captionScript +=  'DEF:"' + 0  + '",';
    captionScript +=  'MHR:"' + 0 + '",';
    captionScript +=  'MDEF:"' + 0  + '",';
    captionScript +=  'DefRatio:"' + 0  + '",';
    captionScript +=  'MDefRatio:"' + 0  + '",';
    captionScript +=  'Transcend:"' + 0  + '",';
    captionScript +=  'Reinforce_2:"' + 0  + '",';
    captionScript +=  'ReinforceRatio:"' + itemTable[index].ReinforceRatio  + '",';
    captionScript +=  'BuffValue:"' + 0  + '",';
    captionScript += '};';


    captionScript += 'function SCR_GET_ITEM_GRADE_RATIO(grade, prop){';
    if (myGrade != undefined){
      captionScript +=  'if (prop == "BasicRatio") return ' + myGrade.BasicRatio/100 + ';';
      captionScript +=  'if (prop == "ReinforceRatio") return ' + myGrade.ReinforceRatio/100 + ';';
      captionScript +=  'if (prop == "ReinforceCostRatio") return ' + myGrade.ReinforceCostRatio/100 + ';';
      captionScript +=  'if (prop == "TranscendCostRatio") return ' + myGrade.TranscendCostRatio/100 + ';';
    }
    captionScript +=  'return 0;';
    captionScript += '}';

    captionScript += 'function GetAbility(pc, ability){';
    captionScript +=  'if(document.getElementById("Ability_" + ability)!=undefined){';
    captionScript +=     'var abilitySetting = {';
    captionScript +=      'Level:Number(document.getElementById("Ability_" + ability).value),';
    captionScript +=    '};';
    captionScript +=    'return abilitySetting;';
    captionScript +=  '}';
    captionScript +=  'return undefined;';
    captionScript += '}';

    captionScript += 'function TryGetProp(data, prop){ ';
    captionScript +=  'if (data[prop] === undefined) return 0;'; 
    captionScript +=  'return data[prop];'; 
    captionScript += '}';

    captionScript += 'function StringSplit(base, code){ ';
    captionScript +=  'if (base === undefined || code === undefined) return base;'; 
    captionScript +=  'return base.split(code);'; 
    captionScript += '}';
    
    captionScript += 'function GetClassByType(tablename, value){ ';
    captionScript +=  'if (tablename === "ItemTranscend") return { ClassName:value, AtkRatio:(value*10) };'; 
    captionScript +=  'return undefined;'; 
    captionScript += '}';

    captionScript += 'function IsBuffApplied(pc, buff){ return false; }\n';
    captionScript += 'function IGetSumOfEquipItem(pc, equip){ return 0; }\n';
    captionScript += 'function IsPVPServer(pc){ return 0; }\n';
    captionScript += 'function GetServerNation(){ return 0; }\n';
    captionScript += 'function GetServerGroupID(){ return 0; }\n';
    captionScript += 'function SRC_KUPOLE_GROWTH_ITEM(item, num){ return 0; }\n';
    captionScript += 'function CALC_PCBANG_GROWTH_ITEM_LEVEL(item){ return undefined; }\n';
    captionScript += 'function INIT_WEAPON_PROP(item, data){ return 0; }\n';
    captionScript += 'function INIT_ARMOR_PROP(item, data){ return 0; }\n';
    captionScript += 'function GET_ITEM_LEVEL(item){ return item.ItemLv; }\n';
    captionScript += 'function APPLY_OPTION_SOCKET(item){ return 0; }\n';
    captionScript += 'function APPLY_AWAKEN(item){ return 0; }\n';
    captionScript += 'function APPLY_ENCHANTCHOP(item){ return 0; }\n';
    captionScript += 'function APPLY_RANDOM_OPTION(item){ return 0; }\n';
    captionScript += 'function APPLY_RARE_RANDOM_OPTION(item){ return 0; }\n';
    captionScript += 'function MakeItemOptionByOptionSocket(item){ return 0; }\n';
    captionScript += 'function GetItemOwner(item){ return undefined; }\n';


    captionScript += 'var basicValue=document.getElementById("BasicValue");';
    captionScript += 'updateBasicValue();';
    captionScript += 'function updateBasicValue(){';
    captionScript +=  'SCR_REFRESH_' + itemTable[index].ToolTipScp + '(itemData, 0, 0, 0);';
    captionScript +=  'console.log(itemData);';
    captionScript +=  'if (basicValue != undefined){';
    captionScript +=    'var valueStr="";';
    captionScript +=    'if (itemData.MAXATK > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'PATK') + ' " + itemData.MINATK + " - " + itemData.MAXATK + "</h2>";';
    captionScript +=    'if (itemData.MATK > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'MATK') + ' " + itemData.MATK + "</h2>";';
    captionScript +=    'if (itemData.DEF > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'DEF') + ' " + itemData.DEF + "</h2>";';
    captionScript +=    'if (itemData.MDEF > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'MDEF') + ' " + itemData.MDEF + "</h2>";';
    captionScript +=    'if (itemData.HR > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'HR') + ' " + itemData.HR + "</h2>";';
    captionScript +=    'if (itemData.DR > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'DR') + ' " + itemData.DR + "</h2>";';
    captionScript +=    'if (itemData.DefRatio > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'DefRatio') + ' " + itemData.DefRatio + "</h2>";';
    captionScript +=    'if (itemData.MDefRatio > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'MDefRatio') + ' " + itemData.MDefRatio + "</h2>";';
    captionScript +=    'if (itemData.MHR > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'MHR') + ' " + itemData.MHR + "</h2>";';
    captionScript +=    'basicValue.innerHTML=valueStr';
    captionScript +=  '}';
    captionScript += '}';

    captionScript += tos.Lua2JS(scriptData['GET_BASIC_ATK']).replace('return maxAtk, minAtk', 'return [maxAtk, minAtk]');
    captionScript += tos.Lua2JS(scriptData['GET_BASIC_MATK']);
    captionScript += tos.Lua2JS(scriptData['SCR_REFRESH_WEAPON']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('item.MAXATK, item.MINATK = GET_BASIC_ATK(item);', 'var atkPair=GET_BASIC_ATK(item);console.log(atkPair);\nitem.MAXATK=atkPair[0];\nitem.MINATK=atkPair[1];');
    captionScript += tos.Lua2JS(scriptData['SCR_REFRESH_ARMOR']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){');
    captionScript += tos.Lua2JS(scriptData['SCR_REFRESH_ACC']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('{"ADD_FIRE"}','["ADD_FIRE"]');
    captionScript += tos.Lua2JS(scriptData['GET_UPGRADE_ADD_ATK_RATIO']);
    captionScript += tos.Lua2JS(scriptData['GET_UPGRADE_ADD_DEF_RATIO']);
    captionScript += tos.Lua2JS(scriptData['GET_UPGRADE_ADD_MDEF_RATIO']);
    captionScript += tos.Lua2JS(scriptData['GET_REINFORCE_ADD_VALUE']);
    captionScript += tos.Lua2JS(scriptData['GET_REINFORCE_ADD_VALUE_ATK']);
    captionScript += '</script>';


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

    output = output.replace(/%ItemGrade%/g, tos.GradeToName(tableData, itemTable[index].ItemGrade));
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

    output = output.replace(/%AddCaptionScript%/g, captionScript);
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
