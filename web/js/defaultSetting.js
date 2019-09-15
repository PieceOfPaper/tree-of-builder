
var topMenuButtons = [];

topMenuButtons['home'] = [];
topMenuButtons['home']["Path"] = ".";
topMenuButtons['home']["Img"] = "../img2/minimap_icons/questinfo_return.png";
topMenuButtons['home']["Name"] = "HOME";

// topMenuButtons['category_board'] = [];
// topMenuButtons['category_board']["Path"] = undefined;
// topMenuButtons['category_board']["Img"] = "";
// topMenuButtons['category_board']["Name"] = "BOARD";

// topMenuButtons['board_free'] = [];
// topMenuButtons['board_free']["Path"] = "BoardFree";
// topMenuButtons['board_free']["Img"] = "../img/icon/itemicon/accessory_hat_poporion.png";
// topMenuButtons['board_free']["Name"] = "Free Board";

topMenuButtons['category_tool'] = [];
topMenuButtons['category_tool']["Path"] = undefined;
topMenuButtons['category_tool']["Img"] = "";
topMenuButtons['category_tool']["Name"] = "TOOL";

topMenuButtons['builder'] = [];
topMenuButtons['builder']["Path"] = "Builder";
topMenuButtons['builder']["Img"] = "../img2/menu_icon/skillpower_icon.png";
topMenuButtons['builder']["Name"] = "Builder";

topMenuButtons['tool_questcalc'] = [];
topMenuButtons['tool_questcalc']["Path"] = "QuestCalculator";
topMenuButtons['tool_questcalc']["Img"] = "../img2/minimap_icons/minimap_1_main.png";
topMenuButtons['tool_questcalc']["Name"] = "Quest Calc";

topMenuButtons['tool_foodcalc'] = [];
topMenuButtons['tool_foodcalc']["Path"] = "FoodCalculator";
topMenuButtons['tool_foodcalc']["Img"] = "../img2/menu_icon/icon_item_bbq.png";
topMenuButtons['tool_foodcalc']["Name"] = "Food Calc";

topMenuButtons['tool_cmsilvercalc'] = [];
topMenuButtons['tool_cmsilvercalc']["Path"] = "CMSilverCalculator";
topMenuButtons['tool_cmsilvercalc']["Img"] = "../img2/menu_icon/icon_item_challengemode_scroll.png";
topMenuButtons['tool_cmsilvercalc']["Name"] = "CM Silver Calc";

topMenuButtons['category_database'] = [];
topMenuButtons['category_database']["Path"] = undefined;
topMenuButtons['category_database']["Img"] = "";
topMenuButtons['category_database']["Name"] = "DATABASE";

topMenuButtons['item'] = [];
topMenuButtons['item']["Path"] = "ItemPage";
topMenuButtons['item']["Img"] = "../img2/menu_icon/accessory_hat_poporion.png";
topMenuButtons['item']["Name"] = "Item";

topMenuButtons['class'] = [];
topMenuButtons['class']["Path"] = "ClassPage";
topMenuButtons['class']["Img"] = "../img2/menu_icon/c_warrior_centurion.png";
topMenuButtons['class']["Name"] = "Class";

topMenuButtons['skill'] = [];
topMenuButtons['skill']["Path"] = "SkillPage";
topMenuButtons['skill']["Img"] = "../img2/menu_icon/icon_warri_tercioformation.png";
topMenuButtons['skill']["Name"] = "Skill";

topMenuButtons['ability'] = [];
topMenuButtons['ability']["Path"] = "AbilityPage";
topMenuButtons['ability']["Img"] = "../img2/menu_icon/ability_warrior_centurion2.png";
topMenuButtons['ability']["Name"] = "Ability";

topMenuButtons['buff'] = [];
topMenuButtons['buff']["Path"] = "BuffPage";
topMenuButtons['buff']["Img"] = "../img2/menu_icon/icon_attack_blessing_up.png";
topMenuButtons['buff']["Name"] = "Buff";

topMenuButtons['monster'] = [];
topMenuButtons['monster']["Path"] = "MonsterPage";
topMenuButtons['monster']["Img"] = "../img2/menu_icon/mon_popolion_blue.png";
topMenuButtons['monster']["Name"] = "Monster";

topMenuButtons['quest'] = [];
topMenuButtons['quest']["Path"] = "QuestPage";
topMenuButtons['quest']["Img"] = "../img2/minimap_icons/minimap_1_sub.png";
topMenuButtons['quest']["Name"] = "Quest";

topMenuButtons['map'] = [];
topMenuButtons['map']["Path"] = "MapPage";
topMenuButtons['map']["Img"] = "../img2/minimap_icons/minimap_complete.png";
topMenuButtons['map']["Name"] = "Map";

topMenuButtons['indun'] = [];
topMenuButtons['indun']["Path"] = "IndunPage";
topMenuButtons['indun']["Img"] = "../img2/menu_icon/icon_item_cube2.png";
topMenuButtons['indun']["Name"] = "Indun";

topMenuButtons['dialog'] = [];
topMenuButtons['dialog']["Path"] = "DialogPage";
topMenuButtons['dialog']["Img"] = "../img2/menu_icon/icon_item_collection_03blue.png";
topMenuButtons['dialog']["Name"] = "Dialog";

topMenuButtons['collection'] = [];
topMenuButtons['collection']["Path"] = "CollectionPage";
topMenuButtons['collection']["Img"] = "../img2/menu_icon/icon_item_box.png";
topMenuButtons['collection']["Name"] = "Collection";

topMenuButtons['category_miscdata'] = [];
topMenuButtons['category_miscdata']["Path"] = undefined;
topMenuButtons['category_miscdata']["Img"] = "";
topMenuButtons['category_miscdata']["Name"] = "MISC DATA";

topMenuButtons['misc_guildevent'] = [];
topMenuButtons['misc_guildevent']["Path"] = "GuildEvent";
topMenuButtons['misc_guildevent']["Img"] = "../img2/menu_icon/icon_item_indunonemoreenter.png";
topMenuButtons['misc_guildevent']["Name"] = "Guild Event";

topMenuButtons['misc_companion'] = [];
topMenuButtons['misc_companion']["Path"] = "Companion";
topMenuButtons['misc_companion']["Img"] = "../img2/menu_icon/icon_item_egg_toucan.png";
topMenuButtons['misc_companion']["Name"] = "Companion";

topMenuButtons['misc_eventbanner'] = [];
topMenuButtons['misc_eventbanner']["Path"] = "EventBanner";
topMenuButtons['misc_eventbanner']["Img"] = "../img2/menu_icon/event_btn.png";
topMenuButtons['misc_eventbanner']["Name"] = "Event Banner";

topMenuButtons['misc_shop'] = [];
topMenuButtons['misc_shop']["Path"] = "Shop";
topMenuButtons['misc_shop']["Img"] = "../img2/menu_icon/icon_item_silver.png";
topMenuButtons['misc_shop']["Name"] = "Shop";

topMenuButtons['misc_ballenceReward'] = [];
topMenuButtons['misc_ballenceReward']["Path"] = "BallenceReward";
topMenuButtons['misc_ballenceReward']["Img"] = "../img2/menu_icon/icon_item_rankreset_paper.png";
topMenuButtons['misc_ballenceReward']["Name"] = "B.R.";


var topAccountButtons = [];



function onInitTopMenu(isHome){
    var topMenuElement = document.getElementsByClassName("top-menu")[0];

    onInitLeftMenu(isHome);
    onInitRightMenu(isHome);

    if (topMenuElement!=undefined) topMenuElement.outerHTML = "";
}

function onInitLeftMenu(isHome){
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
            if (topMenuButtons[param]["Img"] != undefined){
                var nodeButtonImg = document.createElement("img");
                nodeButtonImg.src=topMenuButtons[param].Img;
                nodeButton.appendChild(nodeButtonImg);
            }
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
    var leftMenuButtonText = document.createElement("p");
    leftMenuButtonA.onclick=onclick_leftMenuOpen;
    //leftMenuButton.classList.add("open-button");
    leftMenuButton.id = "left-menu-open-button";
    leftMenuButtonImg.src="../img2/book/nextbtn.png";
    leftMenuButtonText.innerHTML="MENU";
    leftMenuButtonText.style.margin="0";
    leftMenuButtonA.appendChild(leftMenuButtonImg);
    leftMenuButtonA.appendChild(leftMenuButtonText);
    leftMenuButton.appendChild(leftMenuButtonA);
    //leftMenu.appendChild(leftMenuButton);
    document.body.appendChild(leftMenuButton);
}

function onInitRightMenu(isHome){
    var rightMenu = document.createElement("div");
    rightMenu.id = "right-menu";
    document.body.appendChild(rightMenu);

    for(var param in topAccountButtons){
        var nodeDiv = document.createElement("div");
        var nodeButton = document.createElement("a");
        nodeDiv.append(nodeButton);
        if (topAccountButtons[param].Path != undefined){
            nodeDiv.classList.add("node-item");
            //img
            if (topAccountButtons[param]["Img"] != undefined){
                var nodeButtonImg = document.createElement("img");
                nodeButtonImg.src=topAccountButtons[param].Img;
                nodeButton.appendChild(nodeButtonImg);
            }
            //path
            if (isHome) nodeButton.href=topAccountButtons[param].Path;
            else nodeButton.href="../"+topAccountButtons[param].Path;
        } else {
            nodeDiv.classList.add("node-category");
        }
        //text
        var nodeButtonText = document.createElement("p");
        nodeButton.id=param;
        nodeButtonText.innerText=topAccountButtons[param].Name;
        nodeButton.appendChild(nodeButtonText);
        rightMenu.appendChild(nodeDiv);
    }

    var rightMenuButton = document.createElement("div");
    var rightMenuButtonA = document.createElement("a");
    var rightMenuButtonImg = document.createElement("img");
    var rightMenuButtonText = document.createElement("p");
    rightMenuButtonA.onclick=onclick_rightMenuOpen;
    //rightMenuButton.classList.add("open-button");
    rightMenuButton.id = "right-menu-open-button";
    rightMenuButtonImg.src="../img2/book/prevbtn.png";
    rightMenuButtonText.innerHTML="MY";
    rightMenuButtonText.style.margin="0";
    rightMenuButtonA.appendChild(rightMenuButtonImg);
    rightMenuButtonA.appendChild(rightMenuButtonText);
    rightMenuButton.appendChild(rightMenuButtonA);
    //rightMenu.appendChild(rightMenuButton);
    document.body.appendChild(rightMenuButton);
}

function onclick_leftMenuOpen(){
    var leftMenu = document.getElementById("left-menu");
    var rightMenu = document.getElementById("right-menu");
    if (leftMenu.classList.contains("opened")){
        leftMenu.classList.remove("opened");
    } else {
        leftMenu.classList.add("opened");
        rightMenu.classList.remove("opened");
    }
    var leftMenuButton = document.getElementById("left-menu-open-button");
    var rightMenuButton = document.getElementById("right-menu-open-button");
    if (leftMenuButton.classList.contains("opened")){
        leftMenuButton.classList.remove("opened");
    } else {
        leftMenuButton.classList.add("opened");
        rightMenuButton.classList.remove("opened");
    }
}

function onclick_rightMenuOpen(){
    var leftMenu = document.getElementById("left-menu");
    var rightMenu = document.getElementById("right-menu");
    if (rightMenu.classList.contains("opened")){
        rightMenu.classList.remove("opened");
    } else {
        rightMenu.classList.add("opened");
        leftMenu.classList.remove("opened");
    }
    var leftMenuButton = document.getElementById("left-menu-open-button");
    var rightMenuButton = document.getElementById("right-menu-open-button");
    if (rightMenuButton.classList.contains("opened")){
        rightMenuButton.classList.remove("opened");
    } else {
        rightMenuButton.classList.add("opened");
        leftMenuButton.classList.remove("opened");
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

function onChangeTextLimit(input_id, number_id, max){
    console.log('onchange');
    var input = document.getElementById(input_id);
    var number = document.getElementById(number_id);
    number.innerHTML = '('+input.value.length+'/'+max+')';
}