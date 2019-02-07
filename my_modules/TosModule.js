class TosModule {

    static RequestLog(request){
        console.log('[ReqPageLog] '+request.originalUrl);
        console.log('ip:'+request.ip);
        console.log('ips:'+request.ips);
    }

    static parseCaption(caption) {
        if (caption == undefined) return caption;
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        output = output.replace(/{img tooltip_speedofatk}/g, '<img src="../img/tooltip_speedofatk.png" style="height:1em; vertical-align:middle;" />');
        output = output.replace(/{img green_up_arrow 16 16}/g, '▲');
        output = output.replace(/{img red_down_arrow 16 16}/g, '▼');
        output = output.replace(/{#DD5500}/g, '<span style="color:#DD5500;">');
        output = output.replace(/{#7AE4FF}/g, '<span style="color:#7AE4FF;">');
        output = output.replace(/{#993399}/g, '<span style="color:#993399;">');
        output = output.replace(/{#339999}/g, '<span style="color:#339999;">');
        output = output.replace(/{#00113F}/g, '<span style="color:#00113F;">');
        output = output.replace(/{ol}/g, '<span style="font-weight:bold;">');
        output = output.replace(/{\/}/g, '</span>');

        output = output.replace(/#{SkillSR}#/g, '<span id="SkillSR"></span>');
        output = output.replace(/#{SkillFactor}#/g, '<span id="SkillFactor"></span>');
        output = output.replace(/#{CaptionTime}#/g, '<span id="CaptionTime"></span>');
        output = output.replace(/#{CaptionRatio}#/g, '<span id="CaptionRatio"></span>');
        output = output.replace(/#{CaptionRatio2}#/g, '<span id="CaptionRatio2"></span>');
        output = output.replace(/#{CaptionRatio3}#/g, '<span id="CaptionRatio3"></span>');
        output = output.replace(/#{SpendItemCount}#/g, '<span id="SpendItemCount"></span>');
        return output;
    }

    static Lua2JS(lua_script) {
        if (lua_script === undefined)
            return '';

        var output = lua_script;

        output = output.replace(/ if/g, 'if(');
        output = output.replace(/	if/g, 'if(');
        output = output.replace(/else /g, '}else{');
        output = output.replace(/else\n/g, '}else{');
        output = output.replace(/elseif/g, '}else if(');
        output = output.replace(/then/g, '){');
        output = output.replace(/end\n/g, '}\n');
        output = output.replace(/end \n/g, '}\n');
        output = output.replace(/  end  /g, '}');
        output = output.replace(/local/g, 'var');
        output = output.replace(/class/g, ' classData');
        output = output.replace(/math/g, 'Math');
        output = output.replace(/SyncFloor/g, 'Math.round');
        output = output.replace(/--/g, '\/\/');
        output = output.replace(/~=/g, '!=');
        //output = output.replace(/nil/g, 'undefined');
        output = output.replace(/ nil/g, ' undefined');
        output = output.replace(/nil /g, 'undefined ');
        output = output.replace(/nil\n/g, 'undefined\n');
        output = output.replace(/ and /g, '&&');
        output = output.replace(/ or /g, '||');
        output = output.replace(/\'YES\'/g, 'true');
        output = output.replace(/\'NO\'/g, 'false');
        output = output.replace(/\.\./g, '+');

        if (output.lastIndexOf('end') == output.length - 3){
            output = output.substring(0, output.length - 3);
            output += '}';
        }

        var splited = output.split('\n');
        output = '';
        for (var i = 0; i < splited.length; i ++){
            splited[i] = splited[i].trim();
            output += splited[i];
            if (i == 0)
                output += '{';
            // if (i > 0 && splited[i].length > 0 &&
            //     splited[i][splited[i].length - 1] != ' ' &&
            //     splited[i][splited[i].length - 1] != '{' &&
            //     splited[i][splited[i].length - 1] != '}' &&
            //     splited[i][splited[i].length - 1] != ';'){
            //     output += ';';
            // }
            output += '\n';
        }

        return output;
    }

    static ClassName2Lang(tableData, className){
        if (className == undefined || className.length == 0 || tableData['language'] == undefined || tableData['language'][className] == undefined)
            return className;
        return tableData['language'][className];
    }

    static GetJobData(tableData, num1, num2){
        for (var i = 0; i < tableData['job'].length; i ++){
            if (tableData['job'][i].ClassName === 'Char' + num1 + '_' + num2)
                return tableData['job'][i];
        }
        return undefined;
    }

    static GetJobNumber1(className) {
        var replaced = className.replace('Char', '');
        var splited = replaced.split('_');
        return Number(splited[0]);
    }

    static GetJobNumber2(className) {
        var replaced = className.replace('Char', '');
        var splited = replaced.split('_');
        if (splited.length < 2) return 0;
        return Number(splited[1]);
    }


    static JobClassNameToJobName(tableData, job){
        for (var i = 0; i < tableData['job'].length; i ++){
          if (tableData['job'][i].ClassName === job) return tableData['job'][i].Name;
        }
        return job;
    }

    static JobToJobName(tableData, job){
      for (var i = 0; i < tableData['job'].length; i ++){
        if (tableData['job'][i].EngName === job) return tableData['job'][i].Name;
      }
      return job;
    }

    static SkillClassNameToSkillName(tableData, skill){
        for (var i = 0; i < tableData['skill'].length; i ++){
          if (tableData['skill'][i].ClassName === skill) return tableData['skill'][i].Name;
        }
        return job;
    }
    
    static AttributeToName(tableData, attribute){
      for (var i = 0; i < tableData['skill_attribute'].length; i ++){
        if (tableData['skill_attribute'][i].ClassName === attribute) return tableData['skill_attribute'][i].TextEffectMsg;
      }
      return attribute;
    }

    static StanceToName(tableData, stance){
        for (var i = 0; i < tableData['stance'].length; i ++){
          if (tableData['stance'][i].ClassName === stance) return tableData['stance'][i].Name;
        }
        return stance;
    }
    static StanceToIcon(tableData, stance){
        for (var i = 0; i < tableData['stance'].length; i ++){
          if (tableData['stance'][i].ClassName === stance) return tableData['stance'][i].Icon;
        }
        return stance;
    }

    static GradeToName(tableData, grade){
        for (var i = 0; i < tableData['item_grade'].length; i ++){
          if (tableData['item_grade'][i].Grade === grade) return tableData['item_grade'][i].Name;
        }
        return grade;
    }

    static GetCurrentGrade(tableData, grade){
        for (var i = 0; i < tableData['item_grade'].length; i ++){
          if (tableData['item_grade'][i].Grade === grade) return tableData['item_grade'][i];
        }
        return undefined;
    }

    static FindDataClassName(tableData, tableName, className){
        if (tableData[tableName] == undefined) return undefined;
        for (var i = 0; i < tableData[tableName].length; i ++){
          if (tableData[tableName][i].ClassName === className) return tableData[tableName][i];
        }
        return undefined;
    }
    static FindDataClassID(tableData, tableName, classID){
        if (tableData[tableName] == undefined) return undefined;
        for (var i = 0; i < tableData[tableName].length; i ++){
          if (Number(tableData[tableName][i].ClassID) === Number(classID)) return tableData[tableName][i];
        }
        return undefined;
    }

    static Skilltree2Job(tableData, className){
        return this.FindDataClassName(tableData, 'job', 'Char' + this.GetJobNumber1(className) + '_' + this.GetJobNumber2(className));
    }

    static GetItemImgString(tableData, className){
        var itemData = undefined;
        var icon = '';
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_Equip',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_Quest',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_gem',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_premium',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_recipe',className);
        if (itemData == undefined) return icon;
          if (itemData.EqpType != undefined && itemData.UseGender != undefined && itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
            icon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
            icon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
          } else if(itemData.Icon != undefined){
            icon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
          } else if(itemData.Illust != undefined){
            icon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
          }
        return icon;
    }

    static GetItemResultString(tableData, className, itemcount){
        var itemData = undefined;
        var output = '';
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_Equip',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_Quest',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_gem',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_premium',className);
        if (itemData == undefined) itemData=this.FindDataClassName(tableData,'item_recipe',className);
        if (itemData != undefined){
            output += '<p>';
            var icon = this.GetItemImgString(tableData,className);
          output += '<a href="../Item?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + icon + ' ' + itemData.Name + '</a>';
          if (itemcount != undefined){
            output += ' x '+itemcount;
          }
          output += '</p>';
        }
        return output;
    }

    static GetQuestModeImgString(tableData, className){
        var output = '';

        var questData=this.FindDataClassName(tableData,'questprogresscheck',className);
        if (questData!=undefined){
            switch(questData.QuestMode){
                case "MAIN":
                output += '<img class="item-material-icon" src="../img/minimap_icons/minimap_1_main.png" />';
                break;
                case "SUB":
                output += '<img class="item-material-icon" src="../img/minimap_icons/minimap_1_sub.png" />';
                break;
                case "REPEAT":
                output += '<img class="item-material-icon" src="../img/minimap_icons/minimap_1_repeat.png" />';
                break;
                case "PARTY":
                output += '<img class="item-material-icon" src="../img/minimap_icons/minimap_1_party.png" />';
                break;
                case "KEYITEM":
                output += '<img class="item-material-icon" src="../img/minimap_icons/minimap_1_keyquest.png" />';
                break;
            }
        }

        return output;
    }

    static GetMapString(tableData, className){
        var output = '';
        var mapData=this.FindDataClassName(tableData, 'map2', className);
        if (mapData!=undefined){
            output += '<a href="../Map?id='+mapData.ClassID+'">'+mapData.Name+'</a>';
        }
        return output;
    }

    static GetMonsterString(tableData, className){
        var output = '';
        var monData=this.FindDataClassName(tableData, 'monster', className);
        if (monData!=undefined){
            output += '<a href="../Monster?id='+monData.ClassID+'">'+monData.Name+'</a>';
        }
        return output;
    }

    static GetQuestString(tableData, className){
        var output = '';
        var questData=this.FindDataClassName(tableData, 'questprogresscheck', className);
        if (questData!=undefined){
            output += this.GetQuestModeImgString(tableData,className)+'<a href="../Quest?id='+questData.ClassID+'">'+questData.Name+'</a>';
        }
        return output;
    }

    static GetDialogString(tableData, className, readText){
        if (readText == undefined) readText='Read Dialog';
        var output = '';
        var dialogData=this.FindDataClassName(tableData, 'dialogtext', className);
        if (dialogData!=undefined){
            output += '<a href="../Dialog?id='+dialogData.ClassID+'">'+readText+'</a>';
        }
        return output;
    }
}
module.exports = TosModule;