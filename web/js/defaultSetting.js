
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