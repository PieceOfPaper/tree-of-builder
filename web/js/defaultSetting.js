
var topMenuButtons = [];

topMenuButtons['home'] = [];
topMenuButtons['home']["Path"] = ".";
topMenuButtons['home']["Img"] = "../img/minimap_icons/questinfo_return.png";

topMenuButtons['item'] = [];
topMenuButtons['item']["Path"] = "Item";
topMenuButtons['item']["Img"] = "../img/icon/itemicon/accessory_hat_poporion.png";

topMenuButtons['skill'] = [];
topMenuButtons['skill']["Path"] = "SkillPage";
topMenuButtons['skill']["Img"] = "../img/icon/skillicon/icon_warri_tercioformation.png";

topMenuButtons['ability'] = [];
topMenuButtons['ability']["Path"] = "Ability";
topMenuButtons['ability']["Img"] = "../img/icon/skillicon/ability_warrior_centurion2.png";

topMenuButtons['buff'] = [];
topMenuButtons['buff']["Path"] = "Buff";
topMenuButtons['buff']["Img"] = "../img/bufficon/icon_attack_blessing_up.png";

topMenuButtons['builder'] = [];
topMenuButtons['builder']["Path"] = "Builder";
topMenuButtons['builder']["Img"] = "../img/hud_status_icon/skillpower_icon.png";




function onInitTopMenu(isHome){
    var topMenuElements = document.getElementsByClassName("top-menu");
    for (var i=0;i<topMenuElements.length;i++){
        for(var param in topMenuButtons){
            var nodeButton = document.createElement("a");
            var nodeButtonImg = document.createElement("img");
            nodeButton.id=param;
            if (isHome) nodeButton.href=topMenuButtons[param].Path;
            else nodeButton.href="../"+topMenuButtons[param].Path;
            nodeButtonImg.src=topMenuButtons[param].Img;
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
var loadingUI = undefined;

function createLoadingUI(){
    if (loadingUI!=undefined) return;
    loadingUI = document.createElement('div');
    loadingUI.classList.add('req-loading');
    document.body.appendChild(loadingUI);

    var indicator = document.createElement('div');
    indicator.classList.add('indicator');
    loadingUI.appendChild(indicator);
}

function destroyLoadingUI(){
    if (loadingUI==undefined) return;
    document.body.removeChild(loadingUI);
    loadingUI=undefined;
}