var searchModule_inited = false;

var url = window.location.href.split('?')[0];
var filterSetting = urlToFilter(decodeURIComponent(window.location.href));

var searchTypes = [];
var resultCols = [];

var pageNum = 1;
var pageMax = 1;

//------------- 세팅이 필요한 부분 -------------//
var baseTable = undefined;//Require

var itemCount = 10; //한 페이지당 보여주는 아이템 수

var checkboxFilterSetting = [];
//각 페이지마다 하드코딩 필요한 부분 (아래는 예시)
//checkboxFilterSetting["CanMakeSimony"]="YES";

var customFilterSettingMethods = [];
//------------- 세팅이 필요한 부분 -------------//

function searchModule_init(){
    if (baseTable == undefined) return;
    if (searchModule_inited) return;
    searchModule_inited = true;

    //search event set
    if (document.getElementById("searchBtn")!=undefined) document.getElementById("searchBtn").onclick=searchModule_onclick_search;
    if (document.getElementById("searchName")!=undefined) document.getElementById("searchName").onkeydown=searchModule_onkeydown_search;

    //serch type set
    if (document.getElementById("searchType")!=undefined){
        for (param in document.getElementById("searchType").children){
            var typename = document.getElementById("searchType").children[param].innerHTML;
            searchTypes.push(typename);
        }
    }
    if (document.getElementById("searchType")!=undefined){
        if (filterSetting["SearchType"] == undefined){
            document.getElementById("searchType").value=document.getElementById("searchType").children[0].innerHTML;
        } else {
            document.getElementById("searchType").value=filterSetting["SearchType"];
        }
    }
    if (document.getElementById("searchName")!=undefined){
        if (filterSetting["SearchName"] == undefined){
            document.getElementById("searchName").value="";
        } else {
            document.getElementById("searchName").value=filterSetting["SearchName"];
        }
    }

    //search result set
    if (document.getElementById("searchResult")!=undefined){
        for (param in document.getElementById("searchResult").children[0].children[1].children){
            var element = document.getElementById("searchResult").children[0].children[1].children[param];
            if (element == undefined || element.tagName == undefined) continue;
            var dataSet = [];
            if (element.classList.contains("result-link")) dataSet["link"]=true;
            else dataSet["link"]=false;
            if (element.classList.contains("result-img")) dataSet["img"]=true;
            else dataSet["img"]=false;
            dataSet["datalist"] = element.innerHTML.split(";");
            resultCols.push(dataSet);
        }
        document.getElementById("searchResult").children[0].removeChild(document.getElementById("searchResult").children[0].children[1]);
    }

    //set select filter
    var selectFilters = document.getElementsByClassName("selectFilter");
    for (param in selectFilters){
        if (selectFilters[param] == undefined || selectFilters[param].tagName == undefined) continue;
        if (selectFilters[param].classList.contains("customFilter") == true) continue;
        if (selectFilters[param].classList.contains("settedFilter") == true) continue;
        //if (selectFilters[param].value == "Default") continue;
        searchModule_settingSelectFilter(selectFilters[param].id);
    }

    //set checkbox filter
    var checkboxFilters = document.getElementsByClassName("checkboxFilter");
    for (param in checkboxFilters){
        if (checkboxFilters[param] == undefined || checkboxFilters[param].tagName == undefined) continue;
        if (checkboxFilters[param].classList.contains("customFilter") == true) continue;
        if (checkboxFilters[param].classList.contains("settedFilter") == true) continue;
        //if (checkboxFilters[param].checked == false) continue;
        if (filterSetting[checkboxFilters[param].id]!=undefined) checkboxFilters[param].checked=filterSetting[checkboxFilters[param].id];
    }

    //set order event
    if (document.getElementById("orderAttribute")!=undefined){
        if (filterSetting["orderAttr"]!=undefined) document.getElementById("orderAttribute").value=filterSetting["orderAttr"];
        //document.getElementById("orderAttribute").onchange=searchModule_onchange_order;
    }
    if (document.getElementById("orderType")!=undefined){
        if (filterSetting["orderType"]!=undefined) document.getElementById("orderType").value=filterSetting["orderType"];
        //document.getElementById("orderType").onchange=searchModule_onchange_order;
    }

    //set pageNum
    if (filterSetting["itemCount"]!=undefined) itemCount=filterSetting["itemCount"];
    if (filterSetting["pageNum"]!=undefined) pageNum=filterSetting["pageNum"];


    if (window.location.href.indexOf("?") >= 0){
        searchModule_search();
    }
}

function searchModule_updateFilterSetting(){
    if (baseTable == undefined) return;
    if (searchModule_inited == false) return;

    if (document.getElementById("searchType")!=undefined && document.getElementById("searchName")!=undefined &&
        document.getElementById("searchName").value.length > 0){
        filterSetting["SearchType"]=document.getElementById("searchType").value;
        filterSetting["SearchName"]=document.getElementById("searchName").value;
    } else {
        filterSetting["SearchType"]=undefined;
        filterSetting["SearchName"]=undefined;
    }

    var selectFilters = document.getElementsByClassName("selectFilter");
    for (param in selectFilters){
        if (selectFilters[param] == undefined || selectFilters[param].tagName == undefined) continue;
        if (selectFilters[param].classList.contains("customFilter") == true) continue;
        if (selectFilters[param].value == "Default") {
            filterSetting[selectFilters[param].id]=undefined;
        } else {
            filterSetting[selectFilters[param].id]=selectFilters[param].value;
        }
    }

    var checkboxFilters = document.getElementsByClassName("checkboxFilter");
    for (param in checkboxFilters){
        if (checkboxFilters[param] == undefined || checkboxFilters[param].tagName == undefined) continue;
        if (checkboxFilters[param].classList.contains("customFilter") == true) continue;
        if (checkboxFilters[param].checked == false) {
            filterSetting[checkboxFilters[param].id]=undefined;
        } else {
            filterSetting[checkboxFilters[param].id]=checkboxFilterSetting[checkboxFilters[param].id];
        }
    }

    for (param in customFilterSettingMethods){
        if (customFilterSettingMethods[param] == undefined) continue;
        customFilterSettingMethods[param](filterSetting);
    }

    if (itemCount != 999999) filterSetting["itemCount"]=itemCount;
    else filterSetting["itemCount"]=undefined;
    filterSetting["pageNum"]=pageNum;
    if (document.getElementById("orderAttribute")!=undefined) filterSetting["orderAttr"]=document.getElementById("orderAttribute").value;
    else filterSetting["orderAttr"]=undefined;
    if (document.getElementById("orderType")!=undefined) filterSetting["orderType"]=document.getElementById("orderType").value;
    else filterSetting["orderType"]=undefined;

    //set query string
    if (history.pushState) {
        var newurl = url + filterToQueryStr(filterSetting);
        window.history.pushState({path:newurl},'',newurl);
    }
}

var searchedItems;
function searchModule_search(){
    if (baseTable == undefined) return;
    if (searchModule_inited == false) return;
    var filter = [];

    //set select filter
    var hasFilter = false;
    for (param in filterSetting){
        if (param == undefined) continue;
        if (param=="SearchType" || param=="SearchName") continue;
        //if (param.indexOf('filter_') < 0) continue;
        if (filterSetting[param] == undefined) continue;
        if (filterSetting[param] == "Default") continue;
        if (param.indexOf('filter_') > -1){
            filter[param.split('_')[1]] = filterSetting[param];
            hasFilter = true;
        } else {
            if (param=="pageNum"&&filterSetting[param]==1) continue;
            if (param=="orderAttr"&&filterSetting[param]=="ClassID") continue;
            if (param=="orderType"&&filterSetting[param]==1) continue;
            filter[param] = filterSetting[param];
        }
    }

    if (hasFilter == false && 
        (filterSetting["SearchName"] == undefined || filterSetting["SearchName"].length == 0)){
            pageNum = 1;
            searchedItems = [];
            searchModule_showResult();
            searchModule_updatePageNum();
            return;
        }

    //set input filter
    if (filterSetting["SearchType"] != undefined && filterSetting["SearchName"] != undefined)
        filter[filterSetting["SearchType"]] = "@"+filterSetting["SearchName"];

    //request
    createLoadingUI();
    console.log(filter);
    requestGetData(baseTable, filter, function(arr, pm){
        console.log(arr);
        searchedItems = arr;
        pageMax = pm;
        searchModule_updateOrder();
        searchModule_showResult();
        searchModule_updatePageNum();
    });
}

function searchModule_updateOrder(){
    var orderAttr = "ClassID";
    var orderType = 1;
    if (document.getElementById("orderAttribute")!=undefined &&
        document.getElementById("orderAttribute").value != "Default"){
        orderAttr=document.getElementById("orderAttribute").value;
    }
    if (document.getElementById("orderType")!=undefined){
        orderType=document.getElementById("orderType").value;
    }
    searchedItems.sort(function(a,b){
        if (a[orderAttr] != b[orderAttr]){
            if (a[orderAttr] == undefined) return -1 * orderType;
            else if (b[orderAttr] == undefined) return 1 * orderType;
            else {
                if ((typeof a[orderAttr])=="number" && (typeof b[orderAttr])=="number"){
                    if (a[orderAttr] < b[orderAttr]) return -1 * orderType;
                    else return 1 * orderType;
                }
                else if ((typeof a[orderAttr])=="string" && (typeof b[orderAttr])=="string"){
                    return a[orderAttr].localeCompare(b[orderAttr]) * orderType;
                }
                else if ((typeof a[orderAttr])=="boolean" && (typeof b[orderAttr])=="boolean"){
                    if (a[orderAttr]) return -1 * orderType;
                    else return 1 * orderType;
                }
            }
        }
        return 0;
    });
}

var pageNodes = [];
function searchModule_updatePageNum(){
    if (searchedItems == undefined) return;
    // var pageMax = Math.floor((searchedItems.length - 1)/itemCount) + 1;
    // if (pageMax <= 0) pageMax = 1;
    var pageArea = document.getElementById("pageNumbers");
    if (pageArea == null) return;
    for (var i = 1; i <= pageMax; i++){
        if (pageNodes.length <= (i-1)){
            var num = document.createElement("span");
            pageNodes.push(num);
            pageArea.appendChild(num);
        }
        if (pageNum == i){
            pageNodes[(i-1)].innerHTML = ' <button class="selected" onclick="searchModule_onclick_page('+i+')">'+i+'</butto > ';
        } else {
            pageNodes[(i-1)].innerHTML = ' <button onclick="searchModule_onclick_page('+i+')">'+i+'</butto > ';
        }
    }
    for(var i=pageMax;i<pageNodes.length;i++){
        pageArea.removeChild(pageNodes[i]);
    }
    pageNodes.length = pageMax;
}

var resultNodes = [];
function searchModule_showResult(){
    if (searchedItems == undefined) return;
    destroyLoadingUI();
    if (document.getElementById("searchResult") == undefined) return;
    var table=document.getElementById("searchResult").children[0];
    var nodeIndex = 0;
    var nodeCount = 0;
    //for(var i=(pageNum-1)*itemCount;i<pageNum*itemCount;i++){
    for(var i=0;i<searchedItems.length;i++){
        if (i >= searchedItems.length) break;
        nodeIndex = i%itemCount;
        if (resultNodes.length <= nodeIndex){
            var row = document.createElement("tr");
            resultNodes.push(row);
            table.appendChild(row);
            for (var j=0;j<resultCols.length;j++){
                var col = document.createElement("td");
                row.appendChild(col);
            }
        }
        for (var j=0;j<resultCols.length;j++){
            var tdstr = "";
            if (resultCols[j]["img"]){
                if (resultCols[j]["datalist"] != undefined){
                    for (var k=0;k<resultCols[j]["datalist"].length;k++){
                        if (k > 0) tdstr += "<br/>";
                        if (k == 0){
                            switch(searchedItems[i].TableName){
                                case "skill":
                                tdstr += '<img src="../img/icon/skillicon/icon_'+searchedItems[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "ability":
                                tdstr += '<img src="../img/icon/skillicon/'+searchedItems[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "buff":
                                var iconName = searchedItems[i][resultCols[j]["datalist"][k]].toLowerCase();
                                if (iconName.indexOf('icon_') < 0) iconName = 'icon_' + iconName;
                                tdstr += '<img src="../img/icon/skillicon/'+iconName+'.png" />';
                                break;
                                case "job":
                                tdstr += '<img src="../img/icon/classicon/'+searchedItems[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "item":
                                case "item_Equip":
                                case "item_Quest":
                                case "item_gem":
                                case "item_premium":
                                case "item_recipe":
                                if (searchedItems[i].EqpType != undefined && searchedItems[i].UseGender != undefined && 
                                    searchedItems[i].EqpType.toLowerCase() == 'outer' && searchedItems[i].UseGender.toLowerCase() == 'both'){
                                    tdstr += '<img src="../img/icon/itemicon/' + searchedItems[i].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + searchedItems[i].Icon.toLowerCase()  + '_f.png"/>';
                                } else if(searchedItems[i].EquipXpGroup != undefined && searchedItems[i].EquipXpGroup.toLowerCase() == 'gem_skill') {
                                    tdstr += '<img src="../img/icon/mongem/' + searchedItems[i].Icon.toLowerCase()  + '.png"/>';
                                } else if(searchedItems[i].Icon != undefined){
                                    tdstr += '<img src="../img/icon/itemicon/' + searchedItems[i].Icon.toLowerCase()  + '.png"/>';
                                } else if(searchedItems[i].Illust != undefined){
                                    tdstr += '<img src="../img/icon/itemicon/' + searchedItems[i].Illust.toLowerCase()  + '.png"/>';
                                } else {
                                    tdstr += '';
                                }
                                break;
                                case "monster":
                                tdstr += '<img src="../img/icon/monillust/'+searchedItems[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "questprogresscheck":
                                if (resultCols[j]["datalist"][k]=="QuestMode"){
                                    switch(searchedItems[i][resultCols[j]["datalist"][k]]){
                                        case "MAIN":
                                        tdstr += '<img style="width:42px;height:42px" src="../img/minimap_icons/minimap_1_main.png" />';
                                        break;
                                        case "SUB":
                                        tdstr += '<img style="width:42px;height:42px" src="../img/minimap_icons/minimap_1_sub.png" />';
                                        break;
                                        case "REPEAT":
                                        tdstr += '<img style="width:42px;height:42px" src="../img/minimap_icons/minimap_1_repeat.png" />';
                                        break;
                                        case "PARTY":
                                        tdstr += '<img style="width:42px;height:42px" src="../img/minimap_icons/minimap_1_party.png" />';
                                        break;
                                        case "KEYITEM":
                                        tdstr += '<img style="width:42px;height:42px" src="../img/minimap_icons/minimap_1_keyquest.png" />';
                                        break;
                                    }
                                }
                                break;
                            }
                            continue;
                        }
                        if (searchedItems[i][resultCols[j]["datalist"][k]] != undefined){
                            tdstr += searchedItems[i][resultCols[j]["datalist"][k]];
                        }
                    }
                }
            } else {
                if (resultCols[j]["datalist"] != undefined){
                    for (var k=0;k<resultCols[j]["datalist"].length;k++){
                        if (k > 0) tdstr += "<br/>";
                        if (searchedItems[i][resultCols[j]["datalist"][k]] != undefined){
                            tdstr += searchedItems[i][resultCols[j]["datalist"][k]];
                        }
                    }
                }
            }
            if (resultCols[j]["link"]){
                switch(searchedItems[i].TableName){
                    case "skill":
                    tdstr = '<a href=../Skill?id='+searchedItems[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "ability":
                    tdstr = '<a href=../Ability?id='+searchedItems[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "item":
                    case "item_Equip":
                    case "item_Quest":
                    case "item_gem":
                    case "item_premium":
                    case "item_recipe":
                    tdstr = '<a href="../Item?table='+searchedItems[i].TableName+'&id='+searchedItems[i].ClassID+'">'+tdstr+'</a>';
                    break;
                    case "buff":
                    tdstr = '<a href=../Buff?id='+searchedItems[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "monster":
                    tdstr = '<a href=../Monster?id='+searchedItems[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "questprogresscheck":
                    tdstr = '<a href=../Quest?id='+searchedItems[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "map2":
                    tdstr = '<a href=../Map?id='+searchedItems[i].ClassID+'>'+tdstr+'</a>';
                    break;
                }
            }
            resultNodes[nodeIndex].childNodes[j].innerHTML = tdstr;
        }
        nodeCount ++;
    }
    for(var i=nodeCount;i<resultNodes.length;i++){
        table.removeChild(resultNodes[i]);
    }
    resultNodes.length = nodeCount;
}

function searchModule_settingSelectFilter(id){
    var filter = document.getElementById(id);
    requestGetData(baseTable+"/type/"+filter.id.split('_')[1], undefined, function(arr){
        for(var i=0;i<arr.length;i++){
            var option=document.createElement("option");
            option.value=arr[i];
            option.innerText=arr[i];
            filter.appendChild(option);
        }
        if (filterSetting[filter.id]!=undefined) {
            filter.value=filterSetting[filter.id];
        }
    });
}


function searchModule_onclick_search(){
    pageNum = 1;
    searchModule_updateFilterSetting();
    searchModule_search();
}

function searchModule_onkeydown_search() {
    if (event.keyCode == 13) {
        searchModule_onclick_search();
    }
}

function searchModule_onclick_page(index) {
    pageNum = index;
    searchModule_updateFilterSetting();
    // searchModule_showResult();
    // searchModule_updatePageNum();
    searchModule_search();
}

function searchModule_onchange_order() {
    //pageNum = 1;
    //searchModule_updateFilterSetting();
    // searchModule_updateOrder();
    // searchModule_showResult();
    // searchModule_updatePageNum();
    //searchModule_search();
}