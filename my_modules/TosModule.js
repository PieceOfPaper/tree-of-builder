class TosModule {

    static parseCaption(caption) {
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        output = output.replace(/#{SkillSR}#/g, '<span id="SkillSR"></span>');
        output = output.replace(/#{SkillFactor}#/g, '<span id="SkillFactor"></span>');
        output = output.replace(/#{CaptionTime}#/g, '<span id="CaptionTime"></span>');
        output = output.replace(/#{CaptionRatio1}#/g, '<span id="CaptionRatio1"></span>');
        output = output.replace(/#{CaptionRatio2}#/g, '<span id="CaptionRatio2"></span>');
        output = output.replace(/#{CaptionRatio3}#/g, '<span id="CaptionRatio3"></span>');
        return output;
    }

    static Lua2JS(lua_script) {
        var output = '';
        var splited = lua_script.split('\n');
        for (var i = 0; i < splited.length; i ++){
            output += splited[i] + '\n';
            if (i == 0)
                output += '{';
        }

        output = output.replace(/if/g, 'if(');
        output = output.replace(/then/g, '){');
        output = output.replace(/end/g, '}');
        output = output.replace(/local/g, 'var');
        output = output.replace(/math/g, 'Math');
        output = output.replace(/--/g, '\/\/');
        output = output.replace(/~=/g, '!=');
        output = output.replace(/nil/g, 'undefined');


        return output;
    }
}
module.exports = TosModule;