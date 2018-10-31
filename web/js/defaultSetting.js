
var topMenuButtons = [];
topMenuButtons['home'] = ".";
topMenuButtons['item'] = "Item";
topMenuButtons['skill'] = "Skill";
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