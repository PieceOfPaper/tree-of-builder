
var topMenuButtons = [];
topMenuButtons['home'] = ".";
topMenuButtons['item'] = "Item";
topMenuButtons['skill'] = "SkillPage";
topMenuButtons['ability'] = "Ability";
topMenuButtons['buff'] = "Buff";
topMenuButtons['builder'] = "Builder";


function onInitTopMenu(isHome){
    var topMenuElements = document.getElementsByClassName("top-menu");
    for (var i=0;i<topMenuElements.length;i++){
        for(var param in topMenuButtons){
            var nodeButton = document.createElement("a");
            var nodeButtonImg = document.createElement("img");
            nodeButton.id=param;
            if (isHome) nodeButton.href=topMenuButtons[param];
            else nodeButton.href="../"+topMenuButtons[param];
            topMenuElements[i].appendChild(nodeButton).appendChild(nodeButtonImg);
        }
    }
}

function parseCaption(caption) {
    if (caption == undefined) return caption;
    var output = caption;
    output = output.replace(/{np}|{nl}/g, '<br/>');
    output = output.replace(/{img tooltip_speedofatk}/g, '<img src="../img/tooltip_speedofatk.png" style="height:1em; vertical-align:middle;" />');
    output = output.replace(/{img green_up_arrow 16 16}/g, '▲');
    output = output.replace(/{img red_down_arrow 16 16}/g, '▼');
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