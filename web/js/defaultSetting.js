
var topMenuButtons = [];

topMenuButtons['home'] = [];
topMenuButtons['home']["Path"] = ".";
topMenuButtons['home']["Img"] = "../img/minimap_icons/questinfo_return.png";
topMenuButtons['home']["Name"] = "HOME";

topMenuButtons['category_database'] = [];
topMenuButtons['category_database']["Path"] = undefined;
topMenuButtons['category_database']["Img"] = "";
topMenuButtons['category_database']["Name"] = "DATABASE";

topMenuButtons['item'] = [];
topMenuButtons['item']["Path"] = "Item";
topMenuButtons['item']["Img"] = "../img/icon/itemicon/accessory_hat_poporion.png";
topMenuButtons['item']["Name"] = "Item";

topMenuButtons['class'] = [];
topMenuButtons['class']["Path"] = "ClassPage";
topMenuButtons['class']["Img"] = "../img/icon/classicon/c_warrior_centurion.png";
topMenuButtons['class']["Name"] = "Class";

topMenuButtons['skill'] = [];
topMenuButtons['skill']["Path"] = "SkillPage";
topMenuButtons['skill']["Img"] = "../img/icon/skillicon/icon_warri_tercioformation.png";
topMenuButtons['skill']["Name"] = "Skill";

topMenuButtons['ability'] = [];
topMenuButtons['ability']["Path"] = "Ability";
topMenuButtons['ability']["Img"] = "../img/icon/skillicon/ability_warrior_centurion2.png";
topMenuButtons['ability']["Name"] = "Ability";

topMenuButtons['buff'] = [];
topMenuButtons['buff']["Path"] = "Buff";
topMenuButtons['buff']["Img"] = "../img/bufficon/icon_attack_blessing_up.png";
topMenuButtons['buff']["Name"] = "Buff";

topMenuButtons['monster'] = [];
topMenuButtons['monster']["Path"] = "MonsterPage";
topMenuButtons['monster']["Img"] = "../img/icon/monillust/mon_popolion_blue.png";
topMenuButtons['monster']["Name"] = "Monster";

topMenuButtons['quest'] = [];
topMenuButtons['quest']["Path"] = "QuestPage";
topMenuButtons['quest']["Img"] = "../img/icon/itemicon/icon_item_collection_03blue.png";
topMenuButtons['quest']["Name"] = "Quest";

topMenuButtons['category_tool'] = [];
topMenuButtons['category_tool']["Path"] = undefined;
topMenuButtons['category_tool']["Img"] = "";
topMenuButtons['category_tool']["Name"] = "TOOL";

topMenuButtons['builder'] = [];
topMenuButtons['builder']["Path"] = "Builder";
topMenuButtons['builder']["Img"] = "../img/hud_status_icon/skillpower_icon.png";
topMenuButtons['builder']["Name"] = "Builder";




function onInitTopMenu(isHome){
    var topMenuElement = document.getElementsByClassName("top-menu")[0];

    var leftMenu = document.createElement("div");
    leftMenu.id = "left-menu";
    document.body.appendChild(leftMenu);

    for(var param in topMenuButtons){
        var nodeDiv = document.createElement("div");
        var nodeButton = document.createElement("a");
        nodeDiv.append(nodeButton);
        if (topMenuButtons[param].Path != undefined){
            nodeDiv.classList.add("node-item");
            //img
            var nodeButtonImg = document.createElement("img");
            nodeButtonImg.src=topMenuButtons[param].Img;
            nodeButton.appendChild(nodeButtonImg);
            //path
            if (isHome) nodeButton.href=topMenuButtons[param].Path;
            else nodeButton.href="../"+topMenuButtons[param].Path;
        } else {
            nodeDiv.classList.add("node-category");
        }
        //text
        var nodeButtonText = document.createElement("p");
        nodeButton.id=param;
        nodeButtonText.innerText=topMenuButtons[param].Name;
        nodeButton.appendChild(nodeButtonText);
        leftMenu.appendChild(nodeDiv);
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