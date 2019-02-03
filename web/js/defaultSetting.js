
var topMenuButtons = [];

topMenuButtons['home'] = [];
topMenuButtons['home']["Path"] = ".";
topMenuButtons['home']["Img"] = "../img/minimap_icons/questinfo_return.png";
topMenuButtons['home']["Name"] = "HOME";

// topMenuButtons['category_board'] = [];
// topMenuButtons['category_board']["Path"] = undefined;
// topMenuButtons['category_board']["Img"] = "";
// topMenuButtons['category_board']["Name"] = "BOARD";

// topMenuButtons['board_free'] = [];
// topMenuButtons['board_free']["Path"] = "BoardFree";
// topMenuButtons['board_free']["Img"] = "../img/icon/itemicon/accessory_hat_poporion.png";
// topMenuButtons['board_free']["Name"] = "Free Board";

topMenuButtons['category_database'] = [];
topMenuButtons['category_database']["Path"] = undefined;
topMenuButtons['category_database']["Img"] = "";
topMenuButtons['category_database']["Name"] = "DATABASE";

topMenuButtons['item'] = [];
topMenuButtons['item']["Path"] = "ItemPage";
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
topMenuButtons['ability']["Path"] = "AbilityPage";
topMenuButtons['ability']["Img"] = "../img/icon/skillicon/ability_warrior_centurion2.png";
topMenuButtons['ability']["Name"] = "Ability";

topMenuButtons['buff'] = [];
topMenuButtons['buff']["Path"] = "BuffPage";
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

topMenuButtons['map'] = [];
topMenuButtons['map']["Path"] = "MapPage";
topMenuButtons['map']["Img"] = "../img/minimap_icons/minimap_complete.png";
topMenuButtons['map']["Name"] = "Map";

topMenuButtons['dialog'] = [];
topMenuButtons['dialog']["Path"] = "DialogPage";
topMenuButtons['dialog']["Img"] = "../img/icon/itemicon/icon_item_paper.png";
topMenuButtons['dialog']["Name"] = "Dialog";

topMenuButtons['category_miscdata'] = [];
topMenuButtons['category_miscdata']["Path"] = undefined;
topMenuButtons['category_miscdata']["Img"] = "";
topMenuButtons['category_miscdata']["Name"] = "MISC DATA";

topMenuButtons['misc_guildevent'] = [];
topMenuButtons['misc_guildevent']["Path"] = "GuildEvent";
topMenuButtons['misc_guildevent']["Img"] = "../img/icon/itemicon/icon_item_indunonemoreenter.png";
topMenuButtons['misc_guildevent']["Name"] = "Guild Event";

topMenuButtons['misc_companion'] = [];
topMenuButtons['misc_companion']["Path"] = "Companion";
topMenuButtons['misc_companion']["Img"] = "../img/icon/itemicon/icon_item_egg_toucan.png";
topMenuButtons['misc_companion']["Name"] = "Companion";

topMenuButtons['category_tool'] = [];
topMenuButtons['category_tool']["Path"] = undefined;
topMenuButtons['category_tool']["Img"] = "";
topMenuButtons['category_tool']["Name"] = "TOOL";

topMenuButtons['builder'] = [];
topMenuButtons['builder']["Path"] = "Builder";
topMenuButtons['builder']["Img"] = "../img/hud_status_icon/skillpower_icon.png";
topMenuButtons['builder']["Name"] = "Builder";

topMenuButtons['tool_questcalc'] = [];
topMenuButtons['tool_questcalc']["Path"] = "QuestCalculator";
topMenuButtons['tool_questcalc']["Img"] = "../img/minimap_icons/minimap_1_sub.png";
topMenuButtons['tool_questcalc']["Name"] = "Quest Calc";

topMenuButtons['tool_foodcalc'] = [];
topMenuButtons['tool_foodcalc']["Path"] = "FoodCalculator";
topMenuButtons['tool_foodcalc']["Img"] = "../img/icon/itemicon/icon_item_bbq.png";
topMenuButtons['tool_foodcalc']["Name"] = "Food Calc";




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

    var leftMenuButton = document.createElement("div");
    var leftMenuButtonA = document.createElement("a");
    var leftMenuButtonImg = document.createElement("img");
    leftMenuButtonA.onclick=onclick_leftMenuOpen;
    //leftMenuButton.classList.add("open-button");
    leftMenuButton.id = "left-menu-open-button";
    leftMenuButtonImg.src="../img/book/nextbtn.png";
    leftMenuButtonA.appendChild(leftMenuButtonImg);
    leftMenuButton.appendChild(leftMenuButtonA);
    //leftMenu.appendChild(leftMenuButton);
    document.body.appendChild(leftMenuButton);
}

function onclick_leftMenuOpen(){
    var leftMenu = document.getElementById("left-menu");
    if (leftMenu.classList.contains("opened")){
        leftMenu.classList.remove("opened");
    } else {
        leftMenu.classList.add("opened");
    }
    var leftMenuButton = document.getElementById("left-menu-open-button");
    if (leftMenuButton.classList.contains("opened")){
        leftMenuButton.classList.remove("opened");
    } else {
        leftMenuButton.classList.add("opened");
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

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});