
var topMenuButtons = [];

topMenuButtons['home'] = [];
topMenuButtons['home']["Path"] = ".";
topMenuButtons['home']["Img"] = "../img/minimap_icons/questinfo_return.png";
topMenuButtons['home']["Name"] = "HOME";

topMenuButtons['item'] = [];
topMenuButtons['item']["Path"] = "Item";
topMenuButtons['item']["Img"] = "../img/icon/itemicon/accessory_hat_poporion.png";
topMenuButtons['item']["Name"] = "ITEM";

topMenuButtons['class'] = [];
topMenuButtons['class']["Path"] = "ClassPage";
topMenuButtons['class']["Img"] = "../img/icon/classicon/c_warrior_centurion.png";
topMenuButtons['class']["Name"] = "CLASS";

topMenuButtons['skill'] = [];
topMenuButtons['skill']["Path"] = "SkillPage";
topMenuButtons['skill']["Img"] = "../img/icon/skillicon/icon_warri_tercioformation.png";
topMenuButtons['skill']["Name"] = "SKILL";

topMenuButtons['ability'] = [];
topMenuButtons['ability']["Path"] = "Ability";
topMenuButtons['ability']["Img"] = "../img/icon/skillicon/ability_warrior_centurion2.png";
topMenuButtons['ability']["Name"] = "ABIL";

topMenuButtons['buff'] = [];
topMenuButtons['buff']["Path"] = "Buff";
topMenuButtons['buff']["Img"] = "../img/bufficon/icon_attack_blessing_up.png";
topMenuButtons['buff']["Name"] = "BUFF";

topMenuButtons['monster'] = [];
topMenuButtons['monster']["Path"] = "MonsterPage";
topMenuButtons['monster']["Img"] = "../img/icon/monillust/mon_popolion_blue.png";
topMenuButtons['monster']["Name"] = "OBJ";

topMenuButtons['quest'] = [];
topMenuButtons['quest']["Path"] = "QuestPage";
topMenuButtons['quest']["Img"] = "../img/icon/itemicon/icon_item_collection_03blue.png";
topMenuButtons['quest']["Name"] = "QUEST";

topMenuButtons['builder'] = [];
topMenuButtons['builder']["Path"] = "Builder";
topMenuButtons['builder']["Img"] = "../img/hud_status_icon/skillpower_icon.png";
topMenuButtons['builder']["Name"] = "BUILD";




function onInitTopMenu(isHome){
    var topMenuElements = document.getElementsByClassName("top-menu");
    for (var i=0;i<topMenuElements.length;i++){
        for(var param in topMenuButtons){
            var nodeButton = document.createElement("a");
            var nodeButtonImg = document.createElement("img");
            var nodeButtonText = document.createElement("p");
            nodeButton.id=param;
            if (isHome) nodeButton.href=topMenuButtons[param].Path;
            else nodeButton.href="../"+topMenuButtons[param].Path;
            nodeButtonImg.src=topMenuButtons[param].Img;
            nodeButtonText.innerText=topMenuButtons[param].Name;
            nodeButton.appendChild(nodeButtonImg);
            nodeButton.appendChild(nodeButtonText);
            topMenuElements[i].appendChild(nodeButton);
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