class TosModule {

    static parseCaption(caption) {
        if (caption == undefined) return caption;
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        output = output.replace(/{img tooltip_speedofatk}/g, '<img src="../img/tooltip_speedofatk.png" style="height:1em; vertical-align:middle;" />');
        output = output.replace(/{#DD5500}/g, '<span style="color:#DD5500;">');
        output = output.replace(/{#7AE4FF}/g, '<span style="color:#7AE4FF;">');
        output = output.replace(/{#993399}/g, '<span style="color:#993399;">');
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

        output = output.replace(/if/g, 'if(');
        output = output.replace(/else/g, '}else{');
        output = output.replace(/then/g, '){');
        output = output.replace(/end\n/g, '}\n');
        output = output.replace(/local/g, 'var');
        output = output.replace(/math/g, 'Math');
        output = output.replace(/--/g, '\/\/');
        output = output.replace(/~=/g, '!=');
        output = output.replace(/nil/g, 'undefined');
        output = output.replace(/ and /g, '&&');
        output = output.replace(/\'YES\'/g, 'true');
        output = output.replace(/\'NO\'/g, 'false');

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
}
module.exports = TosModule;