var searchModule_inited = false;

var url = window.location.href.split('?')[0];
var filterSetting = urlToFilter(decodeURIComponent(window.location.href));

var searchTypes = [];
var resultCols = [];

//------------- 세팅이 필요한 부분 -------------//
var baseTable = undefined;//Require

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


    if (window.location.href.indexOf("?") >= 0){
        searchModule_search();
    }
}

function searchModule_updateFilterSetting(){
    if (baseTable == undefined) return;
    if (searchModule_inited == false) return;

    if (document.getElementById("searchType")!=undefined) filterSetting["SearchType"]=document.getElementById("searchType").value;
    if (document.getElementById("searchName")!=undefined) filterSetting["SearchName"]=document.getElementById("searchName").value;

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

    //set query string
    if (history.pushState) {
        var newurl = url + filterToQueryStr(filterSetting);
        window.history.pushState({path:newurl},'',newurl);
    }
}

function searchModule_search(){
    if (baseTable == undefined) return;
    if (searchModule_inited == false) return;
    var filter = [];

    //set input filter
    if (filterSetting["SearchType"] != undefined && filterSetting["SearchName"] != undefined)
        filter[filterSetting["SearchType"]] = "@"+filterSetting["SearchName"];

    //set select filter
    for (param in filterSetting){
        if (param == undefined) continue;
        if (param == "SearchType" || param == "SearchName") continue;
        if (filterSetting[param] == undefined) continue;
        if (filterSetting[param] == "Default") continue;
        filter[param.split('_')[1]] = filterSetting[param];
    }

    //request
    createLoadingUI();
    console.log(filter);
    requestGetData(baseTable, filter, function(arr){
        console.log(arr);
        searchModule_showResult(arr);
    });
}

var resultNodes = [];
function searchModule_showResult(arr){
    if (arr == undefined) return;
    destroyLoadingUI();
    if (document.getElementById("searchResult") == undefined) return;
    var table=document.getElementById("searchResult").children[0];
    for(var i=0;i<arr.length;i++){
        if (resultNodes.length <= i){
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
                            switch(arr[i].TableName){
                                case "skill":
                                tdstr += '<img src="../img/icon/skillicon/icon_'+arr[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "ability":
                                tdstr += '<img src="../img/icon/skillicon/'+arr[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "buff":
                                var iconName = arr[i][resultCols[j]["datalist"][k]].toLowerCase();
                                if (iconName.indexOf('icon_') < 0) iconName = 'icon_' + iconName;
                                tdstr += '<img src="../img/icon/skillicon/'+iconName+'.png" />';
                                break;
                                case "job":
                                tdstr += '<img src="../img/icon/classicon/'+arr[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                                case "item":
                                case "item_Equip":
                                case "item_Quest":
                                case "item_gem":
                                case "item_premium":
                                case "item_recipe":
                                if (arr[i].EqpType != undefined && arr[i].UseGender != undefined && 
                                    arr[i].EqpType.toLowerCase() == 'outer' && arr[i].UseGender.toLowerCase() == 'both'){
                                    tdstr += '<img src="../img/icon/itemicon/' + arr[i].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + arr[i].Icon.toLowerCase()  + '_f.png"/>';
                                } else if(arr[i].EquipXpGroup != undefined && arr[i].EquipXpGroup.toLowerCase() == 'gem_skill') {
                                    tdstr += '<img src="../img/icon/mongem/' + arr[i].Icon.toLowerCase()  + '.png"/>';
                                } else if(arr[i].Icon != undefined){
                                    tdstr += '<img src="../img/icon/itemicon/' + arr[i].Icon.toLowerCase()  + '.png"/>';
                                } else if(arr[i].Illust != undefined){
                                    tdstr += '<img src="../img/icon/itemicon/' + arr[i].Illust.toLowerCase()  + '.png"/>';
                                } else {
                                    tdstr += '';
                                }
                                break;
                                case "monster":
                                tdstr += '<img src="../img/icon/monillust/'+arr[i][resultCols[j]["datalist"][k]].toLowerCase()+'.png" />';
                                break;
                            }
                            continue;
                        }
                        if (arr[i][resultCols[j]["datalist"][k]] != undefined){
                            tdstr += arr[i][resultCols[j]["datalist"][k]];
                        }
                    }
                }
            } else {
                if (resultCols[j]["datalist"] != undefined){
                    for (var k=0;k<resultCols[j]["datalist"].length;k++){
                        if (k > 0) tdstr += "<br/>";
                        if (arr[i][resultCols[j]["datalist"][k]] != undefined){
                            tdstr += arr[i][resultCols[j]["datalist"][k]];
                        }
                    }
                }
            }
            if (resultCols[j]["link"]){
                switch(arr[i].TableName){
                    case "skill":
                    tdstr = '<a href=../Skill?id='+arr[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "ability":
                    tdstr = '<a href=../Ability?id='+arr[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "item":
                    case "item_Equip":
                    case "item_Quest":
                    case "item_gem":
                    case "item_premium":
                    case "item_recipe":
                    tdstr = '<a href="../Item?table='+arr[i].TableName+'&id='+arr[i].ClassID+'">'+tdstr+'</a>';
                    break;
                    case "buff":
                    tdstr = '<a href=../Buff?id='+arr[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "monster":
                    tdstr = '<a href=../Monster?id='+arr[i].ClassID+'>'+tdstr+'</a>';
                    break;
                    case "questprogresscheck":
                    tdstr = '<a href=../Quest?id='+arr[i].ClassID+'>'+tdstr+'</a>';
                    break;
                }
            }
            resultNodes[i].childNodes[j].innerHTML = tdstr;
        }
    }
    for(var i=arr.length;i<resultNodes.length;i++){
        table.removeChild(resultNodes[i]);
    }
    resultNodes.length = arr.length;
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
    searchModule_updateFilterSetting();
    searchModule_search();
}

function searchModule_onkeydown_search() {
    if (event.keyCode == 13) {
        searchModule_onclick_search();
    }
}