
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