class TosModule {
    static parseCaption(caption) {
        var output = caption;
        output = output.replace(/{np}|{nl}/g, '<br/>');
        return output;
    }
}
module.exports = TosModule;