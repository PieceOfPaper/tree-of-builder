class TosModule {

    static parseCaption(caption) {
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        output = output.replace(/#{SkillSR}#/g, '<span id="SkillSR"></span>');
        output = output.replace(/#{SkillFactor}#/g, '<span id="SkillFactor"></span>');
        output = output.replace(/#{CaptionTime}#/g, '<span id="CaptionTime"></span>');
        output = output.replace(/#{CaptionRatio}#/g, '<span id="CaptionRatio"></span>');
        output = output.replace(/#{CaptionRatio2}#/g, '<span id="CaptionRatio2"></span>');
        output = output.replace(/#{CaptionRatio3}#/g, '<span id="CaptionRatio3"></span>');
        return output;
    }

    static Lua2JS(lua_script) {
        if (lua_script === undefined)
            return '';

        var output = '';
        var splited = lua_script.split('\n');
        for (var i = 0; i < splited.length; i ++){
            output += splited[i] + '\n';
            if (i == 0)
                output += '{';
        }

        output = output.replace(/if/g, 'if(');
        output = output.replace(/else/g, '}else{');
        output = output.replace(/then/g, '){');
        output = output.replace(/end/g, '}');
        output = output.replace(/local/g, 'var');
        output = output.replace(/math/g, 'Math');
        output = output.replace(/--/g, '\/\/');
        output = output.replace(/~=/g, '!=');
        output = output.replace(/nil/g, 'undefined');
        output = output.replace(/and/g, '&&');
        output = output.replace(/\'YES\'/g, 'true');
        output = output.replace(/\'NO\'/g, 'false');


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

    static JobToJobName(tableData, job){
      for (var i = 0; i < tableData['job'].length; i ++){
        if (tableData['job'][i].EngName === job) return tableData['job'][i].Name;
      }
      return job;
    }
    
    static AttributeToName(tableData, attribute){
      for (var i = 0; i < tableData['skill_attribute'].length; i ++){
        if (tableData['skill_attribute'][i].ClassName === attribute) return tableData['skill_attribute'][i].TextEffectMsg;
      }
      return job;
    }
}
module.exports = TosModule;