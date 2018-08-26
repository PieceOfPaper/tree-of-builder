class TosModule {

    static parseCaption(caption) {
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        return output;
    }
    
    static parseCaptionSkill(caption, skillTable, skillLv){
        var output = TosModule.parseCaption(caption);
        output = output.replace(/#{SkillFactor}#/g, '{스킬계수}');
        output = output.replace(/#{CaptionTime}#/g, '{시간}');
        output = output.replace(/#{CaptionRatio1}#/g, '{수치1}');
        output = output.replace(/#{CaptionRatio2}#/g, '{수치2}');
        output = output.replace(/#{CaptionRatio3}#/g, '{수치3}');
        return output;
    }
}
module.exports = TosModule;