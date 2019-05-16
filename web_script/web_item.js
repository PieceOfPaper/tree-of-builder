module.exports = function(app, serverSetting, serverData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

  var tos = require('../my_modules/TosModule');
  var dbLayout = require('../my_modules/DBLayoutModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-item.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  
  var equipStatList = [ 'ADD_MINATK','ADD_MAXATK', 'ADD_DEF', 'CRTHR', 'CRTATK', 'CRTDR', 'ADD_HR', 'ADD_DR', 'STR', 'DEX', 'CON', 'INT', 'MNA', 'SR', 'SDR', 'ADD_MHR', 'ADD_MDEF', 'MGP', 'AddSkillMaxR', 'SkillRange', 'SkillAngle', 'Luck', 'BlockRate', 'BLK', 'BLK_BREAK', 'Revive', 'HitCount', 'BackHit', 'SkillPower', 'ASPD', 'MSPD', 'KDPow', 'MHP', 'MSP', 'MSTA', 'RHP', 'RSP', 'RSPTIME', 'RSTA', 'ADD_CLOTH', 'ADD_LEATHER', 'ADD_CHAIN', 'ADD_IRON', 'ADD_GHOST', 'ADD_SMALLSIZE', 'ADD_MIDDLESIZE', 'ADD_LARGESIZE', 'ADD_FORESTER', 'ADD_WIDLING', 'ADD_VELIAS', 'ADD_PARAMUNE', 'ADD_KLAIDA', 'ADD_FIRE', 'ADD_ICE', 'ADD_POISON', 'ADD_LIGHTNING', 'ADD_EARTH', 'ADD_SOUL', 'ADD_HOLY', 'ADD_DARK' ];

  route.get('/', function (request, response) {
    tos.RequestLog(request);
    
    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.table != undefined && request.query.id != undefined){
      if (request.query.table == 'item_Equip' && serverData['tableData'][request.query.table] != undefined) {
        for (var i = 0; i < serverData['tableData'][request.query.table].length; i ++){
          if (serverData['tableData'][request.query.table][i].ClassID === Number(request.query.id)){
            itemEquipDetailPage(request.query.table, i, request, response);
            return;
          }
        }

      // } else if (request.query.table == 'item_premium') {

      // } else if (request.query.table == 'item_Quest') {

      } else if (request.query.table == 'item_gem' && serverData['tableData'][request.query.table] != undefined) {
        for (var i = 0; i < serverData['tableData'][request.query.table].length; i ++){
          if (serverData['tableData'][request.query.table][i].ClassID === Number(request.query.id)){
            itemGemDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      } else if (request.query.table == 'item_recipe' && serverData['tableData'][request.query.table] != undefined) {
        for (var i = 0; i < serverData['tableData'][request.query.table].length; i ++){
          if (serverData['tableData'][request.query.table][i].ClassID === Number(request.query.id)){
            itemRecipeDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      } else if (serverData['tableData'][request.query.table] != undefined) {
        for (var i = 0; i < serverData['tableData'][request.query.table].length; i ++){
          if (serverData['tableData'][request.query.table][i].ClassID === Number(request.query.id)){
            itemDetailPage(request.query.table, i, request, response);
            return;
          }
        }
      }
    }

    response.send('no data');
  });

  var layout_item_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemEquip_detail = fs.readFileSync('./web/Layout/index-itemdetail-equip.html');
  var layout_itemPremium_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemQuest_detail = fs.readFileSync('./web/Layout/index-itemdetail.html');
  var layout_itemGem_detail = fs.readFileSync('./web/Layout/index-itemdetail-gem.html');
  var layout_itemRecipe_detail = fs.readFileSync('./web/Layout/index-itemdetail-recipe.html');

  function itemDetailPage(tableName, index, request, response) {
    var itemTable = serverData['tableData'][tableName];

    var icon = '';
    var iconPath = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_f']);
      iconPath = serverData['imagePath'][itemData.Icon.toLowerCase()+'_m'].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()+'_f']);
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Icon != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Icon.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Illust != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Illust.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Illust.toLowerCase()].path;
    } else {
      icon = 'No Img';
    }

    var dialogString = undefined;
    if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'book'){
      // var dialogData = tos.FindDataClassName(serverData, 'dialogtext', itemTable[index].ClassName);
      // if (dialogData != undefined) {
      //   dialogString = tos.parseCaption(dialogData.Text);
      // }
      dialogString = tos.GetDialogString(serverData,itemTable[index].ClassName);
    }

    var output = layout_item_detail.toString();
    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%Icon%/g, icon);
    if (itemTable[index].TooltipImage == undefined){
      output = output.replace(/%TooltipImage%/g, '');
    } else if (itemTable[index].GroupName != undefined && itemTable[index].GroupName.toLowerCase() == 'card' && serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()] != undefined){
      output = output.replace(/%TooltipImage%/g, '<img style="max-width:calc(100vw - 20px);" src="' + serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()].path + '" />');
      iconPath = serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()].path;
    } else {
      output = output.replace(/%TooltipImage%/g, tooltipImg);
    }
    output = output.replace(/%IconPath%/g, iconPath);
    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);

    output = output.replace(/%ItemType%/g, itemTable[index].ItemType);
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(serverData, itemTable[index].GroupName));
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
    output = output.replace(/%Shops%/g, getShopString(tableName,index));
    output = output.replace(/%Collections%/g, getCollectionString(tableName,index));
    output = output.replace(/%IndunRewards%/g, getIndunRewardString(tableName,index));
    output = output.replace(/%GachaDetail%/g, getGachaDetailString(tableName,index));

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    output = output.replace(/%Comment%/g, getCommentString(request));

    response.send(output);
  }

  function itemEquipDetailPage(tableName, index, request, response) {
    var itemTable = serverData['tableData'][tableName];
    var sealOption = tos.FindDataClassName(serverData, 'item_seal_option', itemTable[index].ClassName)
    var myGrade = tos.GetCurrentGrade(serverData, itemTable[index].ItemGrade);

    //set data
    var setItemTable = serverData['tableData']['setitem'];
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
    for(var i = 0; i < serverData['tableData']['legend_setitem'].length; i ++){
      if (serverData['tableData']['legend_setitem'][i].LegendGroup == itemTable[index].LegendGroup){
        legendSetList.push(serverData['tableData']['legend_setitem'][i]);
      }
    }

    var icon = '';
    var iconPath = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_f']);
      iconPath = serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_m'].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()+'_f']);
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Icon != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Icon.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Illust != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Illust.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Illust.toLowerCase()].path;
    } else {
      icon = 'No Img';
    }



    var statListString = '';
    for (var i = 0; i < equipStatList.length; i ++){
      if (itemTable[index][equipStatList[i]] == undefined || Math.abs(itemTable[index][equipStatList[i]]) == 0) continue;
      statListString += '- ' + tos.ClassName2Lang(serverData, equipStatList[i]) + (Number(itemTable[index][equipStatList[i]]) > 0 ? '▲' : '▼') + itemTable[index][equipStatList[i]] + '<br/>';
    }
    if (itemTable[index].OptDesc != undefined && itemTable[index].OptDesc.length > 0)  statListString += tos.parseCaption(itemTable[index].OptDesc);
    if (sealOption != undefined){
      statListString += '<h3>Seal Option</h3>';
      for (var i=1;i<=sealOption.MaxReinforceCount;i++){
        // if(sealOption['SealOption_'+i]==undefined) continue;
        // if(sealOption['SealOption_'+i].length==0) continue;
        // if(sealOption['SealOptionValue_'+i]==undefined) continue;
        // if(sealOption['SealOptionValue_'+i]==0) continue;
        if(sealOption['SealOption_'+i]==undefined || sealOption['SealOption_'+i].length==0){
          statListString += i +' Step. ??? <br/>';
          continue;
        }
        var statStr = tos.parseCaption(tos.ClassName2Lang(serverData, sealOption['SealOption_'+i]));
        if (statStr.indexOf('{value}') > -1){
          var value = Number(sealOption['SealOptionValue_'+i]);
          if (sealOption['SealOption_'+i].indexOf('Rate') > -1) value *= 0.1;
          statListString += i +' Step. ' + statStr.replace('{value}',value) + '<br/>';
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
        setDataString += tos.GetItemResultString(serverData, setList[setIndex]['ItemName_' + i]);
        setDataString += '<br/>';
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
        if ((legendSetList[i]['EffectDesc_' + j] == undefined || legendSetList[i]['EffectDesc_' + j].length == 0) &&
          (legendSetList[i]['SetItemSkill_' + j] == undefined || legendSetList[i]['SetItemSkill_' + j].length == 0)) {
            continue;
        }

        legendSetDataString += '<p style="margin-top:0px; margin-bottom:0px;"><b>' + j + ' Set.</b></p>';
        if (legendSetList[i]['EffectDesc_' + j] != undefined && legendSetList[i]['EffectDesc_' + j].length > 0) {
          legendSetDataString += '<p style="margin-top:0px; margin-bottom:0px;">' + tos.parseCaption(legendSetList[i]['EffectDesc_' + j]) + '</p>';
        }
        if (legendSetList[i]['SetItemSkill_' + j] != undefined && legendSetList[i]['SetItemSkill_' + j].length > 0) {
          legendSetDataString += tos.GetSkillString(serverData, legendSetList[i]['SetItemSkill_' + j]);
          legendSetDataString += '<br/>';
        }
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

    // captionScript += 'var itemData = {';
    // captionScript +=  'UseLv:' + itemTable[index].UseLv  + ',';
    // captionScript +=  'ItemLv:' + itemTable[index].ItemLv  + ',';
    // captionScript +=  'ItemGrade:' + itemTable[index].ItemGrade  + ',';
    // captionScript +=  'DefaultEqpSlot:"' + itemTable[index].DefaultEqpSlot  + '",';
    // captionScript +=  'DamageRange:' + itemTable[index].DamageRange  + ',';
    // captionScript +=  'ClassType:"' + itemTable[index].ClassType  + '",';
    // captionScript +=  'ClassID:' + itemTable[index].ClassID  + ',';
    // captionScript +=  'ClassName:"' + itemTable[index].ClassName  + '",';
    // captionScript +=  'ItemStar:"' + itemTable[index].ClassType  + '",';
    // captionScript +=  'BasicTooltipProp:"' + itemTable[index].BasicTooltipProp  + '",';
    // captionScript +=  'ItemStar:' + itemTable[index].ItemStar  + ',';
    // if (itemTable[index].Material != undefined && itemTable[index].Material.length > 0)
    //   captionScript +=  'Material:"' + itemTable[index].Material  + '",';
    // captionScript +=  'GroupName:"' + itemTable[index].GroupName  + '",';
    // captionScript +=  'MAXATK:' + 0  + ',';
    // captionScript +=  'MINATK:' + 0  + ',';
    // captionScript +=  'MAXATK_AC:' + 0 + ',';
    // captionScript +=  'MINATK_AC:' + 0 + ',';
    // captionScript +=  'MATK:' + 0 + ',';
    // captionScript +=  'Level:' + 0 + ',';
    // captionScript +=  'HR:' + 0  + ',';
    // captionScript +=  'DR:' + 0  + ',';
    // captionScript +=  'DEF:' + 0  + ',';
    // captionScript +=  'MHR:' + 0 + ',';
    // captionScript +=  'MDEF:' + 0  + ',';
    // captionScript +=  'DefRatio:' + 0  + ',';
    // captionScript +=  'MDefRatio:' + 0  + ',';
    // captionScript +=  'Transcend:' + 0  + ',';
    // captionScript +=  'Reinforce_2:' + 0  + ',';
    // captionScript +=  'ReinforceRatio:' + itemTable[index].ReinforceRatio  + ',';
    // captionScript +=  'BuffValue:' + 0  + ',';
    // captionScript +=  'StringArg:"' + itemTable[index].StringArg + '",';
    // captionScript += '};';
    captionScript += 'var itemData='+JSON.stringify(itemTable[index])+';';
    captionScript += 'itemData["Reinforce_2"]=0;';
    captionScript += 'itemData["Transcend"]=0;';
    captionScript += 'itemData["BuffValue"]=0;';
    captionScript += 'itemData["MAXATK_AC"]=0;';
    captionScript += 'itemData["MINATK_AC"]=0;';
    captionScript += 'document.getElementById("UseLv").value=itemData.UseLv;';
    captionScript += 'document.getElementById("UseLv").onchange=function(){';
    captionScript +=  'itemData.UseLv=Number(document.getElementById("UseLv").value);';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateReinforceSilverCount();';
    captionScript +=  'updateTranscendMaterialCount();';
    captionScript += '}\n';

    captionScript += 'var dummyMoru = {';
    captionScript +=  'StringArg:"",';
    captionScript += '};';

    captionScript += 'var dummyMoruDia = {';
    captionScript +=  'StringArg:"DIAMOND",';
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
    captionScript +=  'if (tablename === "item_grade") return ' + JSON.stringify(serverData['tableData']['item_grade']) + ';'; 
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
    captionScript += 'function IS_MORU_DISCOUNT_50_PERCENT(item){ return false; }\n';
    captionScript += 'function IS_MORU_FREE_PRICE(item){ return false; }\n';
    captionScript += 'function IsServerSection(){ return 0; }\n';
    captionScript += 'function SCR_EVENT_1903_WEEKEND_CHECK(str,boo){ return false; }\n';

    captionScript += 'function onChangeReinforceLevel(){';
    captionScript +=  'if(document.getElementById("ReinforceLevel")!=undefined) itemData.Reinforce_2=Number(document.getElementById("ReinforceLevel").value);';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateReinforceSilverCount();';
    captionScript += '}\n';
    captionScript += 'function onChangeTranscendLevel(){';
    captionScript +=  'if(document.getElementById("TranscendLevel")!=undefined) itemData.Transcend=Number(document.getElementById("TranscendLevel").value);';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateTranscendMaterialCount();';
    captionScript += '}\n';

    captionScript += 'function onClickReinforceLevelUp(){';
    captionScript +=  'itemData.Reinforce_2 ++;';
    captionScript +=  'if(itemData.Reinforce_2>40) itemData.Reinforce_2=40;';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateReinforceSilverCount();';
    captionScript += '}\n';
    captionScript += 'function onClickReinforceLevelDown(){';
    captionScript +=  'itemData.Reinforce_2 --;';
    captionScript +=  'if(itemData.Reinforce_2<0) itemData.Reinforce_2=0;';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateReinforceSilverCount();';
    captionScript += '}\n';

    captionScript += 'function onClickTranscendLevelUp(){';
    captionScript +=  'itemData.Transcend ++;';
    captionScript +=  'if(itemData.Transcend>10) itemData.Transcend=10;';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateTranscendMaterialCount();';
    captionScript += '}\n';
    captionScript += 'function onClickTranscendLevelDown(){';
    captionScript +=  'itemData.Transcend --;';
    captionScript +=  'if(itemData.Transcend<0) itemData.Transcend=0;';
    captionScript +=  'updateBasicValue();';
    captionScript +=  'updateTranscendMaterialCount();';
    captionScript += '}\n';

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
    //captionScript +=  'console.log(itemData);';
    captionScript +=  'if (basicValue != undefined){';
    captionScript +=    'var valueStr="";';
    captionScript +=    'if (itemData.MAXATK > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'PATK') + ' " + itemData.MINATK + " - " + itemData.MAXATK + "</h2>";';
    captionScript +=    'if (itemData.MATK > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'MATK') + ' " + itemData.MATK + "</h2>";';
    captionScript +=    'if (itemData.DEF > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'DEF') + ' " + itemData.DEF + "</h2>";';
    captionScript +=    'if (itemData.MDEF > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'MDEF') + ' " + itemData.MDEF + "</h2>";';
    captionScript +=    'if (itemData.HR > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'HR') + ' " + itemData.HR + "</h2>";';
    captionScript +=    'if (itemData.DR > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'DR') + ' " + itemData.DR + "</h2>";';
    captionScript +=    'if (itemData.DefRatio > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'DefRatio') + ' " + itemData.DefRatio + "</h2>";';
    captionScript +=    'if (itemData.MDefRatio > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'MDefRatio') + ' " + itemData.MDefRatio + "</h2>";';
    captionScript +=    'if (itemData.MHR > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'MHR') + ' " + itemData.MHR + "</h2>";';
    captionScript +=    'if (itemData.ADD_FIRE > 0) valueStr+="<h2>' + tos.ClassName2Lang(serverData, 'ADD_FIRE') + ' " + itemData.ADD_FIRE + "</h2>";';
    captionScript +=    'basicValue.innerHTML=valueStr';
    captionScript +=  '}';
    captionScript +=  'if(document.getElementById("ReinforceLevel")!=undefined) document.getElementById("ReinforceLevel").value=itemData.Reinforce_2;';
    captionScript +=  'if(document.getElementById("TranscendLevel")!=undefined) document.getElementById("TranscendLevel").value=itemData.Transcend;';
    captionScript += '}';

    captionScript += 'updateTranscendMaterialCount();';
    captionScript += 'function updateTranscendMaterialCount(){';
    captionScript +=  'var totalcnt=Number(0);';
    captionScript +=  'for(var i=0;i<itemData.Transcend;i++){ totalcnt+=Number(GET_TRANSCEND_MATERIAL_COUNT(itemData,i)); }';
    captionScript +=  'document.getElementById("transcendMatCnt").innerText=GET_TRANSCEND_MATERIAL_COUNT(itemData,itemData.Transcend-1);';
    captionScript +=  'document.getElementById("transcendMatTotalCnt").innerText=totalcnt;';
    captionScript += '}';

    captionScript += 'updateReinforceSilverCount();';
    captionScript += 'function updateReinforceSilverCount(){';
    captionScript +=  'document.getElementById("reinforceSilver").innerText=GET_REINFORCE_PRICE(itemData,dummyMoru,undefined).toLocaleString();';
    captionScript +=  'document.getElementById("reinforceSilverDia").innerText=GET_REINFORCE_PRICE(itemData,dummyMoruDia,undefined).toLocaleString();';
    captionScript += '}';

    captionScript += tos.Lua2JS(serverData['scriptData']['GET_BASIC_ATK']).replace('return maxAtk, minAtk', 'return [maxAtk, minAtk]').replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_BASIC_MATK']).replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','');
    captionScript += tos.Lua2JS(serverData['scriptData']['SCR_REFRESH_WEAPON']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('item.MAXATK, item.MINATK = GET_BASIC_ATK(item);', 'var atkPair=GET_BASIC_ATK(item);\nitem.MAXATK=atkPair[0];\nitem.MINATK=atkPair[1];');
    captionScript += tos.Lua2JS(serverData['scriptData']['SCR_REFRESH_ARMOR']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','');
    captionScript += tos.Lua2JS(serverData['scriptData']['SCR_REFRESH_ACC']).replace('for i = 1, #basicTooltipPropList do', 'for(var i=0; i<basicTooltipPropList.length; i++){').replace('for i = 1, #PropName do', 'for(var i=0; i<PropName.length; i++){').replace('{"ADD_FIRE"}','["ADD_FIRE"]').replace('lv, grade = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade);','').replace('var equipMaterial = TryGetProp(item, "Material")','var equipMaterial = "None"');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_UPGRADE_ADD_ATK_RATIO']).replace('value = SCR_PVP_ITEM_TRANSCEND_SET(item, value);','');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_UPGRADE_ADD_DEF_RATIO']).replace('value = SCR_PVP_ITEM_TRANSCEND_SET(item, value);','');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_UPGRADE_ADD_MDEF_RATIO']).replace('value = SCR_PVP_ITEM_TRANSCEND_SET(item, value);','');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_REINFORCE_ADD_VALUE']).replace('lv, grade, reinforceValue = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade, reinforceValue);', '');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_REINFORCE_ADD_VALUE_ATK']).replace('lv, grade, reinforceValue, reinforceRatio = SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET(item, lv, grade, reinforceValue, reinforceRatio);', '');
    //captionScript += tos.Lua2JS(serverData['scriptData']['SCR_PVP_ITEM_LV_GRADE_REINFORCE_SET']);
    //captionScript += tos.Lua2JS(serverData['scriptData']['SCR_PVP_ITEM_TRANSCEND_SET']);
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_TRANSCEND_MATERIAL_COUNT']).replace('lv ^ (0.2 + ((Math.floor(transcendCount / 3) * 0.03)) + (transcendCount * 0.05))','Math.pow(lv,(0.2 + ((Math.floor(transcendCount / 3) * 0.03)) + (transcendCount * 0.05)))');
    captionScript += tos.Lua2JS(serverData['scriptData']['GET_REINFORCE_PRICE']).replace("var value, value_diamond = 0, 0","var value=0; var value_diamond=0;").replace('lv ^ 1.1','Math.pow(lv,1.1)').replace('lv ^ 1.1','Math.pow(lv,1.1)');
    captionScript += '</script>';

    var reinforceSilverItemString = '';
    reinforceSilverItemString += '<p>'+tos.GetItemImgString(serverData,'Moru_W_01')+'  '+tos.GetItemImgString(serverData,'Vis')+'<span id="reinforceSilver">0</span></p>';
    reinforceSilverItemString += '<p>'+tos.GetItemImgString(serverData,'Moru_Diamond')+'  '+tos.GetItemImgString(serverData,'Vis')+'<span id="reinforceSilverDia">0</span></p>';

    var transcendMaterialItemString = tos.GetItemResultString(serverData, 'Premium_item_transcendence_Stone', '<span id="transcendMatCnt">0</span> (Total:<span id="transcendMatTotalCnt">0</span>)');

    var output = layout_itemEquip_detail.toString();

    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%Icon%/g, icon);
    output = output.replace(/%IconPath%/g, iconPath);
    output = output.replace(/%TooltipImage%/g, tooltipImg);
    output = output.replace(/%StatList%/g, statListString);

    output = output.replace(/%ReinforceSilverItem%/g, reinforceSilverItemString);
    output = output.replace(/%TranscendMaterialItem%/g, transcendMaterialItemString);

    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);

    output = output.replace(/%ItemType%/g, tos.ClassName2Lang(serverData, itemTable[index].ItemType));
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(serverData, itemTable[index].GroupName));
    output = output.replace(/%Weight%/g, itemTable[index].Weight);
    output = output.replace(/%MaxStack%/g, itemTable[index].MaxStack);

    output = output.replace(/%ItemGrade%/g, tos.GradeToName(serverData, itemTable[index].ItemGrade));
    //output = output.replace(/%UseLv%/g, itemTable[index].UseLv);
    output = output.replace(/%Dur%/g, itemTable[index].Dur);
    output = output.replace(/%MaxDur%/g, itemTable[index].MaxDur);
    output = output.replace(/%ReqToolTip%/g, itemTable[index].ReqToolTip);
    output = output.replace(/%ClassType%/g, tos.ClassName2Lang(serverData, itemTable[index].ClassType));
    output = output.replace(/%ClassType2%/g, tos.ClassName2Lang(serverData, itemTable[index].ClassType2));
    output = output.replace(/%AttachType%/g, tos.ClassName2Lang(serverData, itemTable[index].AttachType));
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
    output = output.replace(/%Shops%/g, getShopString(tableName,index));
    output = output.replace(/%Collections%/g, getCollectionString(tableName,index));
    output = output.replace(/%IndunRewards%/g, getIndunRewardString(tableName,index));
    output = output.replace(/%GachaDetail%/g, getGachaDetailString(tableName,index));

    output = output.replace(/%Comment%/g, getCommentString(request));

    response.send(output);
  }
  function itemRecipeDetailPage(tableName, index, request, response) {
    var itemTable = serverData['tableData'][tableName];
    var recipeData = tos.FindDataClassName(serverData,'recipe',itemTable[index].ClassName);

    var icon = '';
    var iconPath = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_f']);
      iconPath = serverData['imagePath'][itemData.Icon.toLowerCase()+'_m'].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()+'_f']);
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Icon != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Icon.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Illust != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Illust.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Illust.toLowerCase()].path;
    } else {
      icon = 'No Img';
    }

    var targetString = '';
    if (recipeData != undefined){
      var itemData = undefined;
      if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_Equip',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_Quest',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_gem',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_premium',recipeData.TargetItem);
      if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_recipe',recipeData.TargetItem);
      if (itemData != undefined){
        var materialIcon = '';
        if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
          itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
          materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_m'], 32)+tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_f'], 32);
        } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
          materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.TooltipImage.toLowerCase()], 32);
        } else if(itemData.Icon != undefined){
          materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()], 32);
        } else if(itemData.Illust != undefined){
          materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Illust.toLowerCase()], 32);
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
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_Equip',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_Quest',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_gem',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_premium',recipeData['Item_' + i + '_1']);
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_recipe',recipeData['Item_' + i + '_1']);
        if (itemData != undefined){
          var materialIcon = '';
          if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
            itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_m'], 32)+tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_f'], 32);
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.TooltipImage.toLowerCase()], 32);
          } else if(itemData.Icon != undefined){
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()], 32);
          } else if(itemData.Illust != undefined){
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Illust.toLowerCase()], 32);
          }
          materialString += '<a href="?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
          materialString += ' x' + recipeData['Item_' + i + '_1_Cnt'] + '<br/>';
        }
      }
    }
  
    var output = layout_itemRecipe_detail.toString();
  
    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%Icon%/g, icon);
    output = output.replace(/%IconPath%/g, iconPath);
    output = output.replace(/%TooltipImage%/g, tooltipImg);
    
    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);
  
    output = output.replace(/%ItemType%/g, itemTable[index].ItemType);
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(serverData, itemTable[index].GroupName));
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
    output = output.replace(/%Shops%/g, getShopString(tableName,index));
    output = output.replace(/%Collections%/g, getCollectionString(tableName,index));
    output = output.replace(/%IndunRewards%/g, getIndunRewardString(tableName,index));
    output = output.replace(/%GachaDetail%/g, getGachaDetailString(tableName,index));

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    output = output.replace(/%Comment%/g, getCommentString(request));
  
    response.send(output);
  }

  function itemGemDetailPage(tableName, index, request, response) {
    var itemTable = serverData['tableData'][tableName];
    var skillTable = serverData['tableData']['skill'];

    var icon = '';
    var iconPath = '';
    var tooltipImg = '';
    if (itemTable[index].EqpType != undefined && itemTable[index].UseGender != undefined && 
      itemTable[index].EqpType.toLowerCase() == 'outer' && itemTable[index].UseGender.toLowerCase() == 'both'){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_f']);
      iconPath = serverData['imagePath'][itemTable[index].Icon.toLowerCase()+'_m'].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage+'_m'])+tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage+'_f']);
    } else if(itemTable[index].EquipXpGroup != undefined && itemTable[index].EquipXpGroup.toLowerCase() == 'gem_skill') {
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()] == undefined ? '' : serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Icon != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Icon.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Icon.toLowerCase()] == undefined ? '' : serverData['imagePath'][itemTable[index].Icon.toLowerCase()].path;
      tooltipImg = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].TooltipImage.toLowerCase()]);
    } else if(itemTable[index].Illust != undefined){
      icon = tos.ImagePathToHTML(serverData['imagePath'][itemTable[index].Illust.toLowerCase()]);
      iconPath = serverData['imagePath'][itemTable[index].Illust.toLowerCase()] == undefined ? '' : serverData['imagePath'][itemTable[index].Illust.toLowerCase()].path;
    } else {
      icon = 'No Img';
    }

    var baseSkillString = '';
    for(param in skillTable){
      if (('Gem_'+skillTable[param].ClassName)==itemTable[index].ClassName ||
        ('GEM_'+skillTable[param].ClassName)==itemTable[index].ClassName){
        //baseSkillString += '<p><a href="../Skill?id='+skillTable[param].ClassID+'">'+skillTable[param].Name+'</a></p>';
        baseSkillString += tos.GetSkillString(serverData, skillTable[param].ClassName);
      }
    }

    var output = layout_itemGem_detail.toString();
    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%Icon%/g, icon);
    output = output.replace(/%IconPath%/g, iconPath);
    output = output.replace(/%TooltipImage%/g, tooltipImg);
    output = output.replace(/%Name%/g, itemTable[index].Name);
    output = output.replace(/%ClassName%/g, itemTable[index].ClassName);
    output = output.replace(/%ClassID%/g, itemTable[index].ClassID);

    output = output.replace(/%ItemType%/g, itemTable[index].ItemType);
    output = output.replace(/%Journal%/g, itemTable[index].Journal);
    output = output.replace(/%GroupName%/g, tos.ClassName2Lang(serverData, itemTable[index].GroupName));
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
    output = output.replace(/%Shops%/g, getShopString(tableName,index));
    output = output.replace(/%Collections%/g, getCollectionString(tableName,index));
    output = output.replace(/%IndunRewards%/g, getIndunRewardString(tableName,index));
    output = output.replace(/%GachaDetail%/g, getGachaDetailString(tableName,index));

    output = output.replace(/%Comment%/g, getCommentString(request));

    response.send(output);
  }

  function getCanRecipeString(tableName, index){
    var itemTable = serverData['tableData'][tableName];
    var recipeData = tos.FindDataClassName(serverData,'recipe',itemTable[index].ClassName);

    var itemList = [];
    for (param in serverData['tableData']['recipe']){
      if (serverData['tableData']['recipe'][param].TargetItem == itemTable[index].ClassName){
        itemList.push(serverData['tableData']['recipe'][param].ClassName);
        continue;
      }
      for(var i=2;i<=5;i++){
        if (serverData['tableData']['recipe'][param]['Item_' + i + '_1'] == undefined) continue;
        if (serverData['tableData']['recipe'][param]['Item_' + i + '_1'] == itemTable[index].ClassName){
          itemList.push(serverData['tableData']['recipe'][param].ClassName);
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
        if (itemData == undefined) itemData=tos.FindDataClassName(serverData,'item_recipe',itemList[i]);
        if (itemData != undefined){
          var materialIcon = '';
          if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
            itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_m'], 32)+tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()+'_f'], 32);
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.TooltipImage.toLowerCase()], 32);
          } else if(itemData.Icon != undefined){
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Icon.toLowerCase()], 32);
          } else if(itemData.Illust != undefined){
            materialIcon = tos.ImagePathToHTML(serverData['imagePath'][itemData.Illust.toLowerCase()], 32);
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
    var itemTable = serverData['tableData'][tableName];
    var questTable = serverData['tableData']['questprogresscheck'];
    var questAutoTable = serverData['tableData']['questprogresscheck_auto'];

    var questList = [];
    for (param in questAutoTable){
      for(var i=1;i<=4;i++){
        if (questAutoTable[param]['Success_ItemName' + i] == undefined) continue;
        if (questAutoTable[param]['Success_ItemName' + i]==serverData['tableData'][tableName][index].ClassName){
          if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
        }
      }
      for(var i=1;i<=4;i++){
        if (questAutoTable[param]['Success_SelectItemName' + i] == undefined) continue;
        if (questAutoTable[param]['Success_SelectItemName' + i]==serverData['tableData'][tableName][index].ClassName){
          if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
        }
      }
      for(var i=1;i<=4;i++){
        if (questAutoTable[param]['Success_JobItem_Name' + i] == undefined) continue;
        if (questAutoTable[param]['Success_JobItem_Name' + i]==serverData['tableData'][tableName][index].ClassName){
          if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
        }
      }

      var propertyRewardData = tos.FindDataClassName(serverData,'reward_property',questAutoTable[param].ClassName);
      if (propertyRewardData!=undefined){
        for (var i=1;i<10;i++){
          if (propertyRewardData['RewardItem'+i]==undefined || propertyRewardData['RewardItem'+i].length==0) continue;
          if (propertyRewardData['RewardItem'+i]==serverData['tableData'][tableName][index].ClassName){
            if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
          }
        }
      }
  
      var jsQuestRewardData = tos.FindDataClassName(serverData,'reward_property','JS_Quest_Reward_'+questAutoTable[param].ClassName);
      if (jsQuestRewardData!=undefined){
        for (var i=1;i<10;i++){
          if (jsQuestRewardData['RewardItem'+i]==undefined || jsQuestRewardData['RewardItem'+i].length==0) continue;
          if (jsQuestRewardData['RewardItem'+i]==serverData['tableData'][tableName][index].ClassName){
            if (questList.includes(questAutoTable[param].ClassName)==false) questList.push(questAutoTable[param].ClassName);
          }
        }
      }
    }

    var output = '';
    if (questList.length>0){
      output += '<h3>Quest Rewards</h3>';
      for (var i=0;i<questList.length;i++){
        var quest=tos.FindDataClassName(serverData,'questprogresscheck',questList[i]);
        if (quest==undefined) continue;
        var imgstr = '';
        switch(quest.QuestMode){
          case "MAIN":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img2/minimap_icons/minimap_1_main.png" />';
          break;
          case "SUB":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img2/minimap_icons/minimap_1_sub.png" />';
          break;
          case "REPEAT":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img2/minimap_icons/minimap_1_repeat.png" />';
          break;
          case "PARTY":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img2/minimap_icons/minimap_1_party.png" />';
          break;
          case "KEYITEM":
          imgstr += '<img style="width:21px;height:21px;vertical-align:middle;" src="../img2/minimap_icons/minimap_1_keyquest.png" />';
          break;
        }
        output += '<p><a href="../Quest?id='+quest.ClassID+'">'+imgstr+quest.Name+'</a></p>';
      }
    }

    return output;
  }

  function getShopString(tableName, index){
    var itemData = serverData['tableData'][tableName][index];
    var shopTable = serverData['tableData']['shop'];

    if (itemData==undefined) return '';

    var shoplist = [];
    for (param in shopTable){
      if (shopTable[param]==undefined) continue;
      if (shopTable[param]['ItemName']==itemData.ClassName) {
        if (shoplist.includes(shopTable[param]['ShopName'])==false) shoplist.push(shopTable[param]['ShopName']);
      }
    }

    var output = '';
    if (shoplist.length > 0){
      output += '<h3>Shop</h3>';
      for (var i=0;i<shoplist.length;i++){
        output += '<p><a href="../Shop?id='+shoplist[i]+'">'+shoplist[i]+'</a></p>';
      }
    }

    return output;
  }

  function getCollectionString(tableName, index){
    var itemData = serverData['tableData'][tableName][index];
    var collectionTable = serverData['tableData']['collection'];
    if (itemData==undefined) return '';

    var collectionArray = [];
    for (param in collectionTable){
      for (var i=1;i<=9;i++){
        if (collectionTable[param]['ItemName_'+i]==undefined) continue;
        if (collectionTable[param]['ItemName_'+i].length==0) continue;
        if (collectionTable[param]['ItemName_'+i]!=itemData.ClassName) continue;
        if (collectionArray.includes(collectionTable[param].ClassName)==false) collectionArray.push(collectionTable[param].ClassName);
        break;
      }
    }

    var output = '';
    //output += '<h3>Collection</h3>';
    var hasStr = false;
    for (param in collectionTable){
      if (collectionTable[param].ClassName==itemData.ClassName){
        output += '<p>Base. '+tos.GetCollectionString(serverData,collectionTable[param].ClassName)+'</p>';
        hasStr = true;
      }
    }
    for (param in collectionArray){
      output += '<p>'+tos.GetCollectionString(serverData,collectionArray[param])+'</p>';
      hasStr = true;
    }
    if (hasStr)
      output = '<h3>Collection</h3>' + output;

    return output;
  }

  function getIndunRewardString(tableName, index){
    var output = '';
    var itemData = serverData['tableData'][tableName][index];
    var indunRewardItemList = [];
    if (itemData!=undefined && itemData.StringArg!=undefined){
        for (var j=0;j<serverData['tableData']['reward_indun'].length;j++){
            if(serverData['tableData']['reward_indun'][j].Group==itemData.StringArg){
                indunRewardItemList.push(serverData['tableData']['reward_indun'][j].ItemName);
            }
        }
    }
    if (indunRewardItemList.length > 0) output += '<h3>Indun Rewards</h3>';
    for (var j=0;j<indunRewardItemList.length;j++){
        output += '<p>'+tos.GetItemResultString(serverData,indunRewardItemList[j]);
    }
    return output;
  }

  function getGachaDetailString(tableName, index){
    var output = '';
    var itemData = serverData['tableData'][tableName][index];
    if (itemData!=undefined){
      var gachaData = undefined;
      for (var i=0;i<serverData['tableData']['gacha_detail'].length;i++){
        if (serverData['tableData']['gacha_detail'][i]['ItemClassName']!=undefined &&
          serverData['tableData']['gacha_detail'][i]['ItemClassName']==itemData.ClassName){
            gachaData = serverData['tableData']['gacha_detail'][i].RewardGroup;
            break;
          }
      }
      var itemList = [];
      if (gachaData!=undefined){
        for (var i=0;i<serverData['tableData']['Package_Item_List'].length;i++){
          if (serverData['tableData']['Package_Item_List'][i]['Group']!=undefined &&
            serverData['tableData']['Package_Item_List'][i]['Group'].toLowerCase().trim()==gachaData.toLowerCase().trim()){
              itemList.push(serverData['tableData']['Package_Item_List'][i]['ItemName']);
            }
        }
      }
      if (itemList.length > 0) {
        output += '<h3>Gacha Details</h3><p>Group: '+gachaData+'</p>';
      }
      for (var i=0;i<itemList.length;i++){
        output += tos.GetItemResultString(serverData,itemList[i]);
      }
    }
    return output;
  }

  function getCommentString(request){
    var output = '';
    var connection = new mysqls(serverSetting['dbconfig']);
    var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Item" AND page_arg1="'+request.query.table+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
    if (comment_results != undefined){
      for (param in comment_results){
        var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
        if (nickname_results!=undefined && nickname_results.length>0){
          comment_results[param]["nickname"]=nickname_results[0].nickname;
        }
      }
    }
    if (request.session.login_userno == undefined){
      output = dbLayout.Layout_Comment(undefined,'Item',request.query.table,request.query.id,comment_results);
    } else {
      var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
      output = dbLayout.Layout_Comment(user_results[0],'Item',request.query.table,request.query.id,comment_results);
    }
    connection.dispose();
    
    return output;
  }

  return route;
}
