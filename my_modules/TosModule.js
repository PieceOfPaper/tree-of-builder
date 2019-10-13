class TosModule {

    static RequestLog(request){
        var date = new Date();
        console.log(date.toISOString()+' [ReqPageLog] '+request.ip+' '+request.originalUrl);
    }

    static parseCaption(caption) {
        if (caption == undefined) return caption;
        if (caption.length == 0) return '';
        var output = caption.toString();
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
        output = output.replace(/}\n/g, '};\n');
        output = output.replace(/]\n/g, '];\n');

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

    static ClassName2Lang(serverData, className){
        if (className == undefined || className.length == 0 || serverData['tableData']['language'] == undefined || serverData['tableData']['language'][className] == undefined)
            return className;
        return serverData['tableData']['language'][className];
    }

    static GetJobData(serverData, num1, num2){
        for (var i = 0; i < serverData['tableData']['job'].length; i ++){
            if (serverData['tableData']['job'][i].ClassName === 'Char' + num1 + '_' + num2)
                return serverData['tableData']['job'][i];
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


    static JobClassNameToJobName(serverData, job){
        for (var i = 0; i < serverData['tableData']['job'].length; i ++){
          if (serverData['tableData']['job'][i].ClassName === job) return serverData['tableData']['job'][i].Name;
        }
        return job;
    }

    static JobToJobName(serverData, job){
      for (var i = 0; i < serverData['tableData']['job'].length; i ++){
        if (serverData['tableData']['job'][i].EngName === job) return serverData['tableData']['job'][i].Name;
      }
      return job;
    }

    static SkillClassNameToSkillName(serverData, skill){
        for (var i = 0; i < serverData['tableData']['skill'].length; i ++){
          if (serverData['tableData']['skill'][i].ClassName === skill) return serverData['tableData']['skill'][i].Name;
        }
        return job;
    }
    
    static AttributeToName(serverData, attribute){
      for (var i = 0; i < serverData['tableData']['skill_attribute'].length; i ++){
        if (serverData['tableData']['skill_attribute'][i].ClassName === attribute) return serverData['tableData']['skill_attribute'][i].TextEffectMsg;
      }
      return attribute;
    }

    static StanceToName(serverData, stance){
        for (var i = 0; i < serverData['tableData']['stance'].length; i ++){
          if (serverData['tableData']['stance'][i].ClassName === stance) return serverData['tableData']['stance'][i].Name;
        }
        return stance;
    }
    static StanceToIcon(serverData, stance){
        for (var i = 0; i < serverData['tableData']['stance'].length; i ++){
          if (serverData['tableData']['stance'][i].ClassName === stance) return serverData['tableData']['stance'][i].Icon;
        }
        return stance;
    }

    static GradeToName(serverData, grade){
        for (var i = 0; i < serverData['tableData']['item_grade'].length; i ++){
          if (serverData['tableData']['item_grade'][i].Grade === grade) return serverData['tableData']['item_grade'][i].Name;
        }
        return grade;
    }

    static ClassIDToClassName(serverData, tableName, classID){
        for (var i = 0; i < serverData['tableData'][tableName].length; i ++){
          if (serverData['tableData'][tableName][i].ClassID === Number(classID)) return serverData['tableData'][tableName][i].ClassName;
        }
        return undefined;
    }

    static GetCurrentGrade(serverData, grade){
        for (var i = 0; i < serverData['tableData']['item_grade'].length; i ++){
          if (serverData['tableData']['item_grade'][i].Grade === grade) return serverData['tableData']['item_grade'][i];
        }
        return undefined;
    }

    static FindDataClassName(serverData, tableName, className){
        if (serverData['tableData'][tableName] == undefined) return undefined;
        for (var i = 0; i < serverData['tableData'][tableName].length; i ++){
          if (serverData['tableData'][tableName][i].ClassName === className) return serverData['tableData'][tableName][i];
        }
        return undefined;
    }
    static FindDataClassID(serverData, tableName, classID){
        if (serverData['tableData'][tableName] == undefined) return undefined;
        for (var i = 0; i < serverData['tableData'][tableName].length; i ++){
          if (Number(serverData['tableData'][tableName][i].ClassID) === Number(classID)) return serverData['tableData'][tableName][i];
        }
        return undefined;
    }

    static Skilltree2Job(serverData, className){
        return this.FindDataClassName(serverData, 'job', 'Char' + this.GetJobNumber1(className) + '_' + this.GetJobNumber2(className));
    }

    static GetSkilltree(serverData, className){
        for (var i = 0; i < serverData['tableData']['skilltree'].length; i ++){
            if (serverData['tableData']['skilltree'][i].SkillName == className){
                return serverData['tableData']['skilltree'][i];
            }
        }
        return undefined;
    }

    static GetSkillMaxLevel(serverData, className){
        var skillMaxLevel = 1;
        for (var i = 0; i < serverData['tableData']['skilltree'].length; i ++){
            if (serverData['tableData']['skilltree'][i].SkillName == className){
                skillMaxLevel = serverData['tableData']['skilltree'][i].MaxLevel;
                break;
            }
        }
        return skillMaxLevel;
    }

    static GetItemImgString(serverData, className){
        var itemData = undefined;
        var icon = '';
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_Equip',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_Quest',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_gem',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_premium',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_recipe',className);
        if (itemData == undefined) return icon;
        
        if (itemData.EqpType != undefined && itemData.UseGender != undefined && itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
            icon = this.GetImageStringByImageName(serverData, itemData.Icon+'_m', 32)+this.GetImageStringByImageName(serverData, itemData.Icon+'_f', 32);
          } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
              icon = this.GetImageStringByImageName(serverData, itemData.TooltipImage, 32);
          } else if(itemData.Icon != undefined){
              icon = this.GetImageStringByImageName(serverData, itemData.Icon, 32);
          } else if(itemData.Illust != undefined){
              icon = this.GetImageStringByImageName(serverData, itemData.Illust, 32);
          }
        return icon;
    }

    static GetItemResultString(serverData, className, itemcount){
        var itemData = undefined;
        var output = '';
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_Equip',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_Quest',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_gem',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_premium',className);
        if (itemData == undefined) itemData=this.FindDataClassName(serverData,'item_recipe',className);
        if (itemData != undefined){
            // output += '<p>';
            var icon = this.GetItemImgString(serverData, className);
          output += '<a href="../Item?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + icon + ' ' + itemData.Name + '</a>';
          if (itemcount != undefined){
            output += ' x '+itemcount;
          }
        //   output += '</p>';
        }
        return output;
    }

    static GetQuestModeImgString(serverData, className){
        var output = '';

        var questData=this.FindDataClassName(serverData,'questprogresscheck',className);
        if (questData!=undefined){
            switch(questData.QuestMode){
                case "MAIN":
                output += '<img class="item-material-icon" src="../img2/minimap_icons/minimap_1_main.png" />';
                break;
                case "SUB":
                output += '<img class="item-material-icon" src="../img2/minimap_icons/minimap_1_sub.png" />';
                break;
                case "REPEAT":
                output += '<img class="item-material-icon" src="../img2/minimap_icons/minimap_1_repeat.png" />';
                break;
                case "PARTY":
                output += '<img class="item-material-icon" src="../img2/minimap_icons/minimap_1_party.png" />';
                break;
                case "KEYITEM":
                output += '<img class="item-material-icon" src="../img2/minimap_icons/minimap_1_keyquest.png" />';
                break;
            }
        }

        return output;
    }

    static GetMapString(serverData, className){
        var output = '';
        var mapData=this.FindDataClassName(serverData, 'map2', className);
        if (mapData!=undefined){
            output += '<a href="../Map?id='+mapData.ClassID+'">['+mapData.Grimreaper+'] '+mapData.Name+' (Lv.'+mapData.QuestLevel+')</a>';
        }
        return output;
    }

    static GetMonsterString(serverData, className){
        var output = '';
        var monData=this.FindDataClassName(serverData, 'monster', className);
        if (monData!=undefined){
            output += '<a href="../Monster?id='+monData.ClassID+'">'+this.GetImageStringByImageName(serverData,monData.Icon,32)+''+monData.Name+' (Lv.'+monData.Level+')</a>';
        }
        return output;
    }

    static GetQuestString(serverData, className){
        var output = '';
        var questData=this.FindDataClassName(serverData, 'questprogresscheck', className);
        if (questData!=undefined){
            output += this.GetQuestModeImgString(serverData,className)+'<a href="../Quest?id='+questData.ClassID+'">'+questData.Name+'</a>';
        }
        return output;
    }

    static GetDialogString(serverData, className, readText){
        if (readText == undefined) readText='Read Dialog';
        var output = '';
        var dialogData=this.FindDataClassName(serverData, 'dialogtext', className);
        if (dialogData!=undefined){
            output += '<a href="../Dialog?id='+dialogData.ClassID+'">'+readText+'</a>';
        }
        return output;
    }

    static GetMinigameString(className, readText){
        if (readText == undefined) readText = className;
        var output = '';
        output += '<a href="../Minigame?id='+className+'">'+readText+'</a>';
        return output;
    }

    static GetCollectionString(serverData, className){
        var output = '';
        var data=this.FindDataClassName(serverData, 'collection', className);
        if (data!=undefined){
            output += '<a href="../Collection?id='+data.ClassID+'">'+data.Name+'</a>';
        }
        return output;
    }

    static GetSkillString(serverData, className){
        var output = '';
        var skillData=this.FindDataClassName(serverData, 'skill', className);
        if (skillData!=undefined){
            output += '<a href="../Skill?id='+skillData.ClassID+'">'+this.GetImageStringByImageName(serverData,'icon_'+skillData.Icon,32)+''+skillData.Name+'</a>';
        }
        return output;
    }

    static GetImageStringByClassName(serverData, tableName, className, arg, height, addParameter){
        var data=this.FindDataClassName(serverData, tableName, className);
        if (data != undefined) {
            return this.GetImageStringByImageName(serverData, data[arg], height, addParameter);
        }
        return '';
    }

    static GetImageStringByImageName(serverData, imageName, height, addParameter){
        if (imageName == undefined) return '';
        var data=serverData['imagePath'][imageName.toString().toLowerCase()];
        if (data != undefined){
            return this.ImagePathToHTML(data, height, addParameter);
        }
        return '';
    }

    static ImagePathToHTML(imagePathData, height, addParameter){
        if (imagePathData == undefined) return '<div style="height:'+height+'px; padding:0; margin:0; display:inline-block; vertical-align: middle; overflow:hidden;" ></div>';

        var rect = [];
        if (imagePathData.imgrect != undefined){
            var splited = imagePathData.imgrect.split(' ');
            if (splited != undefined){
                for (var i=0;i<splited.length;i++) rect.push(Number(splited[i]));
            }
        }

        var generated = this.generateID();
        var canvasId = generated+'_canvas';
        if (height == undefined) height = rect[3];
        var scale = height / rect[3];
        var extention = this.getExtention(imagePathData.path).toLowerCase();
        
        var output = '<div style="width:'+(rect[2]*scale)+'px; height:'+(rect[3]*scale)+'px; max-width:calc(100vw - 20px); padding:0; margin:0; display:inline-block; vertical-align: middle; overflow:hidden;" ';
        if (addParameter != undefined){
            output += addParameter;
            output += ' ';
        }
        output += ' >';
        if (extention == 'tga'){
            output += '<canvas id="'+canvasId+'" width="'+rect[2]+'" height="'+rect[3]+'" style="margin:0; padding:0; margin-left: -'+(rect[2]*(1-scale)*0.5)+'px; margin-top: -'+(rect[3]*(1-scale)*0.5)+'px; transform:scale('+scale+');"></canvas>';
        } else {
            output += '<img id="'+canvasId+'" src="'+imagePathData.path+'" style="margin:0; padding:0; margin-left: -'+(rect[2]*(1-scale)*0.5)+'px; margin-top: -'+(rect[3]*(1-scale)*0.5)+'px; transform:scale('+scale+');"></img>';
        }
        output += '</div>';


        if (extention == 'tga'){
            output += '<script>';
            output += generated+'_method();';
            output += 'function '+generated+'_method(){';
            output +=   'var '+generated+'_tga = new TGA();';
            output +=   ''+generated+'_tga.open("'+imagePathData.path+'", function() {';
            output +=       'var ctx = document.getElementById("'+canvasId+'").getContext("2d");';
            output +=       'var imageData = ctx.createImageData('+generated+'_tga.header.width, '+generated+'_tga.header.height);';
            output +=       'ctx.putImageData('+generated+'_tga.getImageData(imageData), -'+rect[0]+', -'+rect[1]+'); });';
            output += '}';
            output += '</script>';
        } else {

        }

        return output;
    }

    static ImagePathToHTML_KeepWidth(imagePathData, height, addParameter){
        if (imagePathData == undefined) return '<div style="height:'+height+'px; padding:0; margin:0; display:inline-block; vertical-align: middle; overflow:hidden;" ></div>';

        var rect = [];
        if (imagePathData.imgrect != undefined){
            var splited = imagePathData.imgrect.split(' ');
            if (splited != undefined){
                for (var i=0;i<splited.length;i++) rect.push(Number(splited[i]));
            }
        }

        if (height == undefined) height = rect[3];
        var scale = height / rect[3];
        var extention = this.getExtention(imagePathData.path).toLowerCase();

        if (extention == 'tga'){
            return this.ImagePathToHTML(imagePathData, height, addParameter);
        }

        return '<img style="width:'+(rect[2]*scale)+'; max-width:calc(100vw - 20px);" src="'+imagePathData.path+'" />';
    }

    static getExtention(filepath){
        if (filepath === undefined || filepath.length === 0)
          return filepath;
      
        var splited = filepath.split('.');
        return splited[splited.length - 1];
    }

    static generateID(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    static getImageData(serverData, imageName){
        if (imageName == undefined) return undefined;
        var data=serverData['imagePath'][imageName.toString().toLowerCase()];
        if (data != undefined){
            return serverData['imagePath'][imageName.toString().toLowerCase()];
        }
        return undefined;
    }

    static getImagePath(serverData, imageName){
        var data = this.getImageData(serverData, imageName);
        if (data == undefined) return '';
        return data.path;
    }
}
module.exports = TosModule;