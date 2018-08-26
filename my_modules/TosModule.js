class TosModule {

    static parseCaption(caption) {
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        output = output.replace(/#{SkillFactor}#/g, '<span name="SkillFactor"></span>');
        output = output.replace(/#{CaptionTime}#/g, '<span name="CaptionTime"></span>');
        output = output.replace(/#{CaptionRatio1}#/g, '<span name="CaptionRatio1"></span>');
        output = output.replace(/#{CaptionRatio2}#/g, '<span name="CaptionRatio2"></span>');
        output = output.replace(/#{CaptionRatio3}#/g, '<span name="CaptionRatio3"></span>');
        return output;
    }
}
module.exports = TosModule;