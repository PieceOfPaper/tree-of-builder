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

    var equipClassTypeTable = tableData['item_equip_classtype'];
    var equipDefaultTable = tableData['item_equip_default'];

    // 종합테이블 세팅
    var itemAllTable = [];
    for (var i = 0; i < itemTable.length; i ++) itemAllTable.push(itemTable[i]);
    for (var i = 0; i < itemEquipTable.length; i ++) itemAllTable.push(itemEquipTable[i]);
    for (var i = 0; i < itemPremiumTable.length; i ++) itemAllTable.push(itemPremiumTable[i]);
    for (var i = 0; i < itemQuestTable.length; i ++) itemAllTable.push(itemQuestTable[i]);
    for (var i = 0; i < itemGemTable.length; i ++) itemAllTable.push(itemGemTable[i]);
    for (var i = 0; i < itemRecipeTable.length; i ++) itemAllTable.push(itemRecipeTable[i]);

    var equipClassTypeFilterTable = [];
    for (var i = 0; i < equipClassTypeTable.length; i ++) {
      var hasClass = false;
      for (var j = 0; j < equipClassTypeFilterTable.length; j ++){
        if (equipClassTypeFilterTable[j].ClassName == equipClassTypeTable[i].ClassName){
          hasClass = true;
          break;
        }
      }
      if (!hasClass) equipClassTypeFilterTable.push(equipClassTypeTable[i]);
    }
    for (var i = 0; i < equipDefaultTable.length; i ++) {
      var hasClass = false;
      for (var j = 0; j < equipClassTypeFilterTable.length; j ++){
        if (equipClassTypeFilterTable[j].ClassName == equipDefaultTable[i].ClassName){
          hasClass = true;
          break;
        }
      }
      if (!hasClass) equipClassTypeFilterTable.push(equipDefaultTable[i]);
    }

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.table != undefined && request.query.id != undefined){
      if (request.query.table == 'item_Equip') {
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === Number(request.query.id)){
            itemEquipDetailPage(request.query.table, i, request, response);
            return;
          }
        }

      // } else if (request.query.table == 'item_premium') {

      // } else if (request.query.table == 'item_Quest') {

      } else if (request.query.table == 'item_gem') {
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === Number(request.query.id)){
            itemGemDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      } else if (request.query.table == 'item_recipe') {
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === Number(request.query.id)){
            itemRecipeDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      } else {
        for (var i = 0; i < tableData[request.query.table].length; i ++){
          if (tableData[request.query.table][i].ClassID === Number(request.query.id)){
            itemDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      }
    }

    var filteredItemTable = [];

    var resultArray = [];

    // Item
    for (var i = 0; i < itemAllTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemTable.length; j ++){
        if (filteredItemTable[j] === itemAllTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      // 필터 - Equip ClassType
      if (request.query.equipClassTypeFilter != undefined && request.query.equipClassTypeFilter != ''){
        if (itemAllTable[i].ClassType == undefined || itemAllTable[i].ClassType != request.query.equipClassTypeFilter) continue;
      }

      // 필터 - Equip UseLv
      if (request.query.useLvMinFilter != undefined && request.query.useLvMinFilter != '' &&
        request.query.useLvMaxFilter != undefined && request.query.useLvMaxFilter != ''){
        if (itemAllTable[i].UseLv == undefined || Number(itemAllTable[i].UseLv) < Number(request.query.useLvMinFilter) || Number(itemAllTable[i].UseLv) > Number(request.query.useLvMaxFilter)) continue;
      }

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemAllTable[i].Name.indexOf(request.query.searchName) > -1)){
        if (request.query.table == undefined || (request.query.table.length > 0 && itemAllTable[i].TableName.toLowerCase() == request.query.table.toLowerCase()))
          resultArray.push(itemAllTable[i]);
      }
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemAllTable[i].ClassName.indexOf(request.query.searchName) > -1)){
        if (request.query.table == undefined || (request.query.table.length > 0 && itemAllTable[i].TableName.toLowerCase() == request.query.table.toLowerCase()))
          resultArray.push(itemAllTable[i]);
      }
    }

    // 최종 소팅
    // resultArray.sort(function(a,b){
    //   if (Number(a.ClassID) > Number(b.ClassID)) return 1;
    //   else if (Number(a.ClassID) < Number(b.ClassID)) return -1;
    //   else return 0;
    // });

    var equipClassTypeFilterString = '';
    equipClassTypeFilterString += '<option value="">ClassType</option>';
    for (var i = 0; i < equipClassTypeFilterTable.length; i ++){
      equipClassTypeFilterString += '<option value="' + equipClassTypeFilterTable[i].ClassName + '">' + tos.ClassName2Lang(tableData, equipClassTypeFilterTable[i].ClassName) + '</option>';
    }
    equipClassTypeFilterString += '<option value="' + 'Armband' + '">' + tos.ClassName2Lang(tableData, 'Armband') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Cannon' + '">' + tos.ClassName2Lang(tableData, 'Cannon') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Dagger' + '">' + tos.ClassName2Lang(tableData, 'Dagger') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Hair' + '">' + tos.ClassName2Lang(tableData, 'Hair') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Helmet' + '">' + tos.ClassName2Lang(tableData, 'Helmet') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Lens' + '">' + tos.ClassName2Lang(tableData, 'Lens') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Neck' + '">' + tos.ClassName2Lang(tableData, 'Neck') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Ring' + '">' + tos.ClassName2Lang(tableData, 'Ring') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Outer' + '">' + tos.ClassName2Lang(tableData, 'Outer') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Hat' + '">' + tos.ClassName2Lang(tableData, 'Hat') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'Artefact' + '">' + tos.ClassName2Lang(tableData, 'Artefact') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'SpecialCostume' + '">' + tos.ClassName2Lang(tableData, 'SpecialCostume') + '</option>';
    equipClassTypeFilterString += '<option value="' + 'EffectCostume' + '">' + tos.ClassName2Lang(tableData, 'EffectCostume') + '</option>';

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
    output = output.replace(/style.css/g, '../style.css');

    output = output.replace(/%EquipClassTypeFilter%/g, equipClassTypeFilterString);

    output = output.replace(/%SearchResult%/g, resultString);

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  });

  var layout_item_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemEquip_detail = fs.readFileSync('./web/Layout/index-itemdetail-equip.html');
  var layout_itemPremium_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemQuest_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemGem_detail = fs.readFileSync('./web/Layout/index-itemdetail-gem.html');
  var layout_itemRecipe_detail = fs.readFileSync('./web/Layout/index-itemdetail-recipe.html');

  function itemDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];

    var icon = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_f.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_f.png"/>';
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Icon != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Illust != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Illust.toLowerCase()  + '.png"/>';
    } else {
      icon = 'No Img';
    }

    var dialogString = undefined;
    if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'book'){
      var dialogData = tos.FindDataClassName(tableData, 'dialogtext', itemTable[index].ClassName);
      if (dialogData != undefined) {
        dialogString = tos.parseCaption(dialogData.Text);
      }
    }

    var output = layout_item_detail.toString();
    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%Icon%/g, icon);
    if (itemTable[index].TooltipImage == undefined){
      output = output.replace(/%TooltipImage%/g, '');
    } else if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'card'){
      output = output.replace(/%TooltipImage%/g, '<img style="max-width:calc(100vw - 20px);" src="../img/bosscard2/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
    } else {
      output = output.replace(/%TooltipImage%/g, '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
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
    output = output.replace(/%Recipes%/g, getCanRecipeString(tableName, index));

    output = output.replace(/%Desc%/g, tos.parseCaption(itemTable[index].Desc));
    if (itemTable[index].Desc_Sub == undefined){
      output = output.replace(/%Desc_Sub%/g, '');
    } else {
      output = output.replace(/%Desc_Sub%/g, tos.parseCaption(itemTable[index].Desc_Sub));
    }

    if (dialogString == undefined){
      output = output.replace(/%DialogString%/g, '');
    } else {
      output = output.replace(/%DialogString%/g, dialogString);
    }

    //console.log(itemTable[index].SpineTooltipImage);
    if (itemTable[index].SpineTooltipImage == undefined || itemTable[index].SpineTooltipImage.length == 0){
      output = output.replace(/%SpineString%/g, '');
    } else {
      var spineString = '<button onclick="onClick_showSpine()">Show Spine</button><script>';//'<canvas id="spine_canvas"></canvas><script>';
      spineString += 'spine_json="https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/kr/spine.ipf/' + itemTable[index].SpineTooltipImage + '/' + itemTable[index].SpineTooltipImage + '.json";';
      spineString += 'spine_atlas="https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/kr/spine.ipf/' + itemTable[index].SpineTooltipImage + '/' + itemTable[index].SpineTooltipImage + '.atlas";';
      spineString += 'spine_png="https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/kr/spine.ipf/' + itemTable[index].SpineTooltipImage + '/' + itemTable[index].SpineTooltipImage + '.png";';
      spineString += 'spine_skelName="' + itemTable[index].SpineTooltipImage + '";';
      spineString += 'spine_animName="animation";';
      spineString += '</script>';
      output = output.replace(/%SpineString%/g, spineString);
    }

    output = output.replace(/%QuestRewards%/g, getCanQuestRewardString(tableName,index));

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  function itemEquipDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];
    var sealOption = tos.FindDataClassName(tableData, 'item_seal_option', itemTable[index].ClassName)
    var myGrade = tos.GetCurrentGrade(tableData, itemTable[index].ItemGrade);


    //set data
    var setItemTable = tableData['setitem'];
    var setList = [];
    for (var i = 0; i < setItemTable.length; i ++){
      for (var j = 1; j <= 7; j ++){
        if (setItemTable[i]['ItemName_' + j] == itemTable[index].ClassName){
          setList.push(setItemTable[i]);
          break;
        }
      }
    }

    //legend set data
    var legendSetList = [];
    for(var i = 0; i < tableData['legend_setitem'].length; i ++){
      if (tableData['legend_setitem'][i].LegendGroup == itemTable[index].LegendGroup){
        legendSetList.push(tableData['legend_setitem'][i]);
      }
    }

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
    if (sealOption != undefined){
      statListString += '<h3>Seal Option</h3>';
      for (var i=1;i<=5;i++){
        if(sealOption['SealOption_'+i]==undefined) continue;
        if(sealOption['SealOption_'+i].length==0) continue;
        if(sealOption['SealOptionValue_'+i]==undefined) continue;
        if(sealOption['SealOptionValue_'+i]==0) continue;
        var statStr = tos.ClassName2Lang(tableData, sealOption['SealOption_'+i]);
        if (statStr.indexOf('{value}') > -1){
          statListString += i +' Step. ' + tos.parseCaption(statStr).replace('{value}',sealOption['SealOptionValue_'+i]) + '<br/>';
        } else {
          statListString += i +' Step. ' + statStr + (Number(sealOption['SealOptionValue_'+i]) > 0 ? '▲' : '▼') + sealOption['SealOptionValue_'+i] + '<br/>';
        }
      }
    }


    var setDataString = '';
    setDataString += '<div>';
    if (setList.length > 0) {
      setDataString += '<h2>Set</h2>';
    }
    for (var setIndex = 0; setIndex < setList.length; setIndex ++){
      setDataString += '<div>';
      setDataString += '<h3>' + setList[setIndex].Name + '</h3>';
      //desc
      for(var i=1;i<=7;i++){
        if (setList[setIndex]['EffectDesc_' + i] == undefined || setList[setIndex]['EffectDesc_' + i].length == 0) continue;
        setDataString += '<p><b>' + i + ' Set.</b><br>' + tos.parseCaption(setList[setIndex]['EffectDesc_' + i]) + '</p>';
      }
      //material
      for(var i=1;i<=7;i++){
        if (setList[setIndex]['ItemName_' + i] == undefined || setList[setIndex]['ItemName_' + i ].length == 0) continue;
        var itemData = undefined;
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item',setList[setIndex]['ItemName_' + i]);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Equip',setList[setIndex]['ItemName_' + i]);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Quest',setList[setIndex]['ItemName_' + i]);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_gem',setList[setIndex]['ItemName_' + i]);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_premium',setList[setIndex]['ItemName_' + i]);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',setList[setIndex]['ItemName_' + i]);
        if (itemData != undefined){
          var materialIcon = '';
          if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
            itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
              materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
          } else if(itemData.Icon != undefined){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
          } else if(itemData.Illust != undefined){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
          }
          setDataString += '<a href="?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
          setDataString += '<br/>';
        }
      }
      setDataString += '</div>';
      setDataString += '<hr>';
    }
    setDataString += '</div>';

    var legendSetDataString = '';
    legendSetDataString += '<div>';
    if (legendSetList.length > 0) {
      legendSetDataString += '<h2>Legend Set</h2>';
    }
    for (var i = 0; i < legendSetList.length; i ++){
      legendSetDataString += '<div>';
      legendSetDataString += '<h3>' + legendSetList[i].Name + '</h3>';
      //desc
      for(var j=1;j<=5;j++){
        if (legendSetList[i]['EffectDesc_' + j] == undefined || legendSetList[i]['EffectDesc_' + j].length == 0) continue;
        legendSetDataString += '<p><b>' + j + ' Set.</b><br>' + tos.parseCaption(legendSetList[i]['EffectDesc_' + j]) + '</p>';
      }
      //skill
      for(var j=1;j<=5;j++){
        if (legendSetList[i]['SetItemSkill_' + j] == undefined || legendSetList[i]['SetItemSkill_' + j].length == 0) continue;
        var skillData = tos.FindDataClassName(tableData,'skill',legendSetList[i]['SetItemSkill_' + j]);
        if (skillData == null) continue;
        var materialIcon = '<img class="item-material-icon" src="../img/icon/skillicon/icon_' + skillData.Icon.toLowerCase()  + '.png"/>';
        legendSetDataString += '<a href="../Skill/?id=' + skillData.ClassID + '">' + materialIcon  + ' ' + skillData.Name + '</a>';
        legendSetDataString += '<br/>';
      }
      legendSetDataString += '</div>';
      legendSetDataString += '<hr>';
    }
    legendSetDataString += '</div>';

    var captionScript = '';
    captionScript += '<script>';

    captionScript += 'var _G = [];';
    captionScript += '_G["GetItemOwner"]=undefined;';

    captionScript += 'var itemData = {';
    captionScript +=  'UseLv:' + itemTable[index].UseLv  + ',';
    captionScript +=  'ItemLv:' + itemTable[index].ItemLv  + ',';
    captionScript +=  'ItemGrade:' + itemTable[index].ItemGrade  + ',';
    captionScript +=  'DefaultEqpSlot:"' + itemTable[index].DefaultEqpSlot  + '",';
    captionScript +=  'DamageRange:' + itemTable[index].DamageRange  + ',';
    captionScript +=  'ClassType:"' + itemTable[index].ClassType  + '",';
    captionScript +=  'ClassID:' + itemTable[index].ClassID  + ',';
    captionScript +=  'ClassName:"' + itemTable[index].ClassName  + '",';
    captionScript +=  'ItemStar:"' + itemTable[index].ClassType  + '",';
    captionScript +=  'BasicTooltipProp:"' + itemTable[index].BasicTooltipProp  + '",';
    captionScript +=  'ItemStar:' + itemTable[index].ItemStar  + ',';
    if (itemTable[index].Material != undefined && itemTable[index].Material.length > 0)
      captionScript +=  'Material:"' + itemTable[index].Material  + '",';
    captionScript +=  'MAXATK:' + 0  + ',';
    captionScript +=  'MINATK:' + 0  + ',';
    captionScript +=  'MAXATK_AC:' + 0 + ',';
    captionScript +=  'MINATK_AC:' + 0 + ',';
    captionScript +=  'MATK:' + 0 + ',';
    captionScript +=  'Level:' + 0 + ',';
    captionScript +=  'HR:' + 0  + ',';
    captionScript +=  'DR:' + 0  + ',';
    captionScript +=  'DEF:' + 0  + ',';
    captionScript +=  'MHR:' + 0 + ',';
    captionScript +=  'MDEF:' + 0  + ',';
    captionScript +=  'DefRatio:' + 0  + ',';
    captionScript +=  'MDefRatio:' + 0  + ',';
    captionScript +=  'Transcend:' + 0  + ',';
    captionScript +=  'Reinforce_2:' + 0  + ',';
    captionScript +=  'ReinforceRatio:' + itemTable[index].ReinforceRatio  + ',';
    captionScript +=  'BuffValue:' + 0  + ',';
    captionScript +=  'StringArg:"' + itemTable[index].StringArg + '",';
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
    captionScript +=  'if (data[prop] === undefined) return undefined;'; 
    captionScript +=  'return data[prop];'; 
    captionScript += '}';

    captionScript += 'function StringSplit(base, code){ ';
    captionScript +=  'if (base === undefined || code === undefined) return base;'; 
    captionScript +=  'return base.split(code);'; 
    captionScript += '}';
    
    captionScript += 'function GetClassByType(tablename, value){ ';
    captionScript +=  'if (tablename === "ItemTranscend") return { ClassName:value, AtkRatio:Number(value)*10, DefRatio:Number(value)*10, MdefRatio:Number(value)*10 };'; 
    captionScript +=  'return undefined;'; 
    captionScript += '}';
    
    captionScript += 'function GetClassList(tablename){ ';
    captionScript +=  'if (tablename === "item_grade") return ' + JSON.stringify(tableData['item_grade']) + ';'; 
    captionScript +=  'return undefined;'; 
    captionScript += '}';
    
    captionScript += 'function GetClassByNameFromList(baseClass, className){ ';
    captionScript +=  'if (baseClass != undefined) {';
    captionScript +=    'for(var i=0;i<baseClass.length;i++){';
    captionScript +=      'if (baseClass[i].ClassName == className){ return baseClass[i]; }';
    captionScript +=    '}';
    captionScript +=  '}'; 
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
    captionScript += 'function GetItemOwner(item){ return 0; }\n';
    captionScript += 'function MAKE_ITEM_OPTION_BY_OPTION_SOCKET(item){ return; }\n';

    captionScript += 'function onChangeReinforceLevel(){';
    captionScript +=  'if(document.getElementById("ReinforceLevel")!=undefined) itemData.Reinforce_2=Number(document.getElementById("ReinforceLevel").value);';
    captionScript +=  'updateBasicValue();';
    captionScript += '}';
    captionScript += 'function onChangeTranscendLevel(){';
    captionScript +=  'if(document.getElementById("TranscendLevel")!=undefined) itemData.Transcend=Number(document.getElementById("TranscendLevel").value);';
    captionScript +=  'updateBasicValue();';
    captionScript += '}';

    captionScript += 'function onClickReinforceLevelUp(){';
    captionScript +=  'itemData.Reinforce_2 ++;';
    captionScript +=  'if(itemData.Reinforce_2>40) itemData.Reinforce_2=40;';
    captionScript +=  'updateBasicValue();';
    captionScript += '}';
    captionScript += 'function onClickReinforceLevelDown(){';
    captionScript +=  'itemData.Reinforce_2 --;';
    captionScript +=  'if(itemData.Reinforce_2<0) itemData.Reinforce_2=0;';
    captionScript +=  'updateBasicValue();';
    captionScript += '}';

    captionScript += 'function onClickTranscendLevelUp(){';
    captionScript +=  'itemData.Transcend ++;';
    captionScript +=  'if(itemData.Transcend>10) itemData.Transcend=10;';
    captionScript +=  'updateBasicValue();';
    captionScript += '}';
    captionScript += 'function onClickTranscendLevelDown(){';
    captionScript +=  'itemData.Transcend --;';
    captionScript +=  'if(itemData.Transcend<0) itemData.Transcend=0;';
    captionScript +=  'updateBasicValue();';
    captionScript += '}';

    captionScript += 'var basicValue=document.getElementById("BasicValue");';
    captionScript += 'updateBasicValue();';
    captionScript += 'function updateBasicValue(){';
    if (itemTable[index].GroupName == "Weapon" || itemTable[index].GroupName == "SubWeapon") {
      captionScript +=  'SCR_REFRESH_WEAPON(itemData, 0, 0, 0);';
    }
    else if (itemTable[index].GroupName == "Armor") {
      if (itemTable[index].EquipGroup != undefined && itemTable[index].EquipGroup.length > 0)
        captionScript +=  'SCR_REFRESH_ARMOR(itemData, 0, 0, 0);';
      else
        captionScript +=  'SCR_REFRESH_ACC(itemData, 0, 0, 0);';
    }
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
    captionScript +=    'if (itemData.ADD_FIRE > 0) valueStr+="<h2>' + tos.ClassName2Lang(tableData, 'ADD_FIRE') + ' " + itemData.ADD_FIRE + "</h2>";';
    captionScript +=    'basicValue.innerHTML=valueStr';
    captionScript +=  '}';
    captionScript +=  'if(document.getElementById("ReinforceLevel")!=undefined) document.getElementById("ReinforceLevel").value=itemData.Reinforce_2;';
    captionScript +=  'if(document.getElementById("TranscendLevel")!=undefined) document.getElementById("TranscendLevel").value=itemData.Transcend;';
    captionScript += '}';

    captionScript += tos.Lua2JS(scriptData['GET_BASIC_ATK']).replace('return maxAtk, minAtk', 'return [maxAtk, minAtk]').replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','');
    captionScript += tos.Lua2JS(scriptData['GET_BASIC_MATK']).replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','');
    captionScript += tos.Lua2JS(scriptData['SCR_REFRESH_WEAPON']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('item.MAXATK, item.MINATK = GET_BASIC_ATK(item);', 'var atkPair=GET_BASIC_ATK(item);console.log(atkPair);\nitem.MAXATK=atkPair[0];\nitem.MINATK=atkPair[1];');
    captionScript += tos.Lua2JS(scriptData['SCR_REFRESH_ARMOR']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','');
    captionScript += tos.Lua2JS(scriptData['SCR_REFRESH_ACC']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('{"ADD_FIRE"}','["ADD_FIRE"]').replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','').replace('var equipMaterial = TryGetProp(item, "Material")','var equipMaterial = "None"');
    captionScript += tos.Lua2JS(scriptData['GET_UPGRADE_ADD_ATK_RATIO']).replace('value = SCR_PVP_ITEM_TRANSCEND_SET(item, value);','');
    captionScript += tos.Lua2JS(scriptData['GET_UPGRADE_ADD_DEF_RATIO']).replace('value = SCR_PVP_ITEM_TRANSCEND_SET(item, value);','');
    captionScript += tos.Lua2JS(scriptData['GET_UPGRADE_ADD_MDEF_RATIO']).replace('value = SCR_PVP_ITEM_TRANSCEND_SET(item, value);','');
    captionScript += tos.Lua2JS(scriptData['GET_REINFORCE_ADD_VALUE']).replace('lv, grade, reinforceValue = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade, reinforceValue);', '');
    captionScript += tos.Lua2JS(scriptData['GET_REINFORCE_ADD_VALUE_ATK']).replace('lv, grade, reinforceValue, reinforceRatio = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade, reinforceValue, reinforceRatio);', '');
    //captionScript += tos.Lua2JS(scriptData['SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET']);
    //captionScript += tos.Lua2JS(scriptData['SCR_PVP_ITEM_TRANSCEND_SET']);
    captionScript += '</script>';


    var output = layout_itemEquip_detail.toString();

    output = output.replace(/style.css/g, '../style.css');
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
    output = output.replace(/%MaxSocket_COUNT%/g, itemTable[index].MaxSocket_COUNT);
    output = output.replace(/%MaxPR%/g, itemTable[index].MaxPR);

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

    output = output.replace(/%SetData%/g, setDataString);
    output = output.replace(/%LegendSetData%/g, legendSetDataString);
    output = output.replace(/%Recipes%/g, getCanRecipeString(tableName, index));

    output = output.replace(/%AddCaptionScript%/g, captionScript);
    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    output = output.replace(/%QuestRewards%/g, getCanQuestRewardString(tableName,index));

    response.send(output);
  }
  function itemRecipeDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];
    var recipeData = tos.FindDataClassName(tableData,'recipe',itemTable[index].ClassName);

    var icon = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_f.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_f.png"/>';
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Icon != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Illust != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Illust.toLowerCase()  + '.png"/>';
    } else {
      icon = 'No Img';
    }

    var targetString = '';
    if (recipeData != undefined){
      var itemData = undefined;
      if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Equip',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Quest',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_gem',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_premium',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',recipeData.TargetItem);
      if (itemData != undefined){
        var materialIcon = '';
        if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
          itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
        } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
          materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
        } else if(itemData.Icon != undefined){
          materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
        } else if(itemData.Illust != undefined){
          materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
        }
        targetString += '<a href="?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
        targetString += ' x' + recipeData.TargetItemCnt + '<br/>';
      }
    }

    var materialString = '';
    if (recipeData != undefined){
      for(var i=2;i<=5;i++){
        if (recipeData['Item_' + i + '_1'] == undefined) continue;
        var itemData = undefined;
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Equip',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Quest',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_gem',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_premium',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',recipeData['Item_' + i + '_1']);
        if (itemData != undefined){
          var materialIcon = '';
          if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
            itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
              materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
          } else if(itemData.Icon != undefined){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
          } else if(itemData.Illust != undefined){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
          }
          materialString += '<a href="?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
          materialString += ' x' + recipeData['Item_' + i + '_1_Cnt'] + '<br/>';
        }
      }
    }
  
    var output = layout_itemRecipe_detail.toString();
  
    output = output.replace(/style.css/g, '../style.css');
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

    output = output.replace(/%Target%/g, targetString);
    output = output.replace(/%Materials%/g, materialString);
    output = output.replace(/%Recipes%/g, getCanRecipeString(tableName, index));
  
    output = output.replace(/%Desc%/g, tos.parseCaption(itemTable[index].Desc));
    if (itemTable[index].Desc_Sub == undefined){
      output = output.replace(/%Desc_Sub%/g, '');
    } else {
      output = output.replace(/%Desc_Sub%/g, tos.parseCaption(itemTable[index].Desc_Sub));
    }
  
    output = output.replace(/%QuestRewards%/g, getCanQuestRewardString(tableName,index));

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());
  
    response.send(output);
  }

  function itemGemDetailPage(tableName, index, request, response) {
    var itemTable = tableData[tableName];
    var skillTable = tableData['skill'];

    var icon = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '_f.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '_f.png"/>';
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = '<img src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/mongem/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Icon != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Icon.toLowerCase()  + '.png"/>';
      tooltipImg = '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase()  + '.png"/>';
    } else if(itemTable[index].Illust != undefined){
      icon = '<img src="../img/icon/itemicon/' + itemTable[index].Illust.toLowerCase()  + '.png"/>';
    } else {
      icon = 'No Img';
    }

    var baseSkillString = '';
    for(param in skillTable){
      if (('Gem_'+skillTable[param].ClassName)==itemTable[index].ClassName ||
        ('GEM_'+skillTable[param].ClassName)==itemTable[index].ClassName){
        baseSkillString += '<p><a href="../Skill?id='+skillTable[param].ClassID+'">'+skillTable[param].Name+'</a></p>';
      }
    }

    var output = layout_itemGem_detail.toString();
    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%Icon%/g, icon);
    if (itemTable[index].TooltipImage == undefined){
      output = output.replace(/%TooltipImage%/g, '');
    } else if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'card'){
      output = output.replace(/%TooltipImage%/g, '<img style="max-width:calc(100vw - 20px);" src="../img/bosscard2/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
    } else {
      output = output.replace(/%TooltipImage%/g, '<img style="max-width:calc(100vw - 20px);" src="../img/icon/itemicon/' + itemTable[index].TooltipImage.toLowerCase() + '.png" />');
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
    output = output.replace(/%Recipes%/g, getCanRecipeString(tableName, index));

    output = output.replace(/%Desc%/g, tos.parseCaption(itemTable[index].Desc));
    if (itemTable[index].Desc_Sub == undefined){
      output = output.replace(/%Desc_Sub%/g, '');
    } else {
      output = output.replace(/%Desc_Sub%/g, tos.parseCaption(itemTable[index].Desc_Sub));
    }

    output = output.replace(/%BaseSkillString%/g, baseSkillString);
    if (itemTable[index].EnableEquipParts==undefined){
      output = output.replace(/%EnableEquipParts%/g, '');
    } else {
      output = output.replace(/%EnableEquipParts%/g, itemTable[index].EnableEquipParts.replace(/\//g,', '));
    }

    output = output.replace(/%QuestRewards%/g, getCanQuestRewardString(tableName,index));

    response.send(output);
  }

  function getCanRecipeString(tableName, index){
    var itemTable = tableData[tableName];
    var recipeData = tos.FindDataClassName(tableData,'recipe',itemTable[index].ClassName);

    var itemList = [];
    for (param in tableData['recipe']){
      if (tableData['recipe'][param].TargetItem == itemTable[index].ClassName){
        itemList.push(tableData['recipe'][param].ClassName);
        continue;
      }
      for(var i=2;i<=5;i++){
        if (tableData['recipe'][param]['Item_' + i + '_1'] == undefined) continue;
        if (tableData['recipe'][param]['Item_' + i + '_1'] == itemTable[index].ClassName){
          itemList.push(tableData['recipe'][param].ClassName);
          break;
        }
      }
    }

    if (itemList.length > 0){
      var resultString = '';
      resultString += '<h3>Recipes</h3>';
      for(var i=0;i<=itemList.length;i++){
        if (itemList[i] == undefined) continue;
        var itemData = undefined;
        if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',itemList[i]);
        if (itemData != undefined){
          var materialIcon = '';
          if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
            itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
              materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
          } else if(itemData.Icon != undefined){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
          } else if(itemData.Illust != undefined){
            materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
          }
          resultString += '<a href="?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a><br/>';
        }
      }
      return resultString;
    } else {
      return '';
    }
  }

  function getCanQuestRewardString(tableName, index){
    var itemTable = tableData[tableName];
    var questTable = tableData['questprogresscheck'];
    var questAutoTable = tableData['questprogresscheck_auto'];

    var questList = [];
    for (param in questAutoTable){
      for(var i=1;i<=4;i++){
        if (questAutoTable[param]['Success_ItemName' + i] == undefined) continue;
        if (questAutoTable[param]['Success_ItemName' + i]==tableData[tableName][index].ClassName){
          if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
        }
      }
      for(var i=1;i<=4;i++){
        if (questAutoTable[param]['Success_SelectItemName' + i] == undefined) continue;
        if (questAutoTable[param]['Success_SelectItemName' + i]==tableData[tableName][index].ClassName){
          if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
        }
      }
      for(var i=1;i<=4;i++){
        if (questAutoTable[param]['Success_JobItem_Name' + i] == undefined) continue;
        if (questAutoTable[param]['Success_JobItem_Name' + i]==tableData[tableName][index].ClassName){
          if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
        }
      }
    }

    var output = '';
    if (questList.length>0){
      output += '<h3>Quest Rewards</h3>';
      for (var i=0;i<questList.length;i++){
        var quest=tos.FindDataClassName(tableData,'questprogresscheck',questList[i]);
        if (quest==undefined) continue;
        var imgstr = '';
        switch(quest.QuestMode){
          case "MAIN":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img/minimap_icons/minimap_1_main.png" />';
          break;
          case "SUB":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img/minimap_icons/minimap_1_sub.png" />';
          break;
          case "REPEAT":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img/minimap_icons/minimap_1_repeat.png" />';
          break;
          case "PARTY":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img/minimap_icons/minimap_1_party.png" />';
          break;
          case "KEYITEM":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img/minimap_icons/minimap_1_keyquest.png" />';
          break;
        }
        output += '<p><a href="../Quest?id='+quest.ClassID+'">'+imgstr+quest.Name+'</a></p>';
      }
    }

    return output;
  }

  return route;
}
