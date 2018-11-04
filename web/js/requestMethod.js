

function requestGetData(tableName, filter, callback){
    var xmlhttp = new XMLHttpRequest();
    var url = "../data/" + tableName;

    var queryString = filterToQueryStr(filter);
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            callback(myArr);
        }
    };

    xmlhttp.open("GET", url + queryString, true);
    xmlhttp.send();
}

function requestPostScript(method, callback, arg1, arg2, arg3, arg4, arg5){
    var xmlhttp = new XMLHttpRequest();
    var url = "../Lua";

    var data = {};
    data["method"] = method;
    if (arg1 != undefined) data['arg1'] = arg1;
    if (arg2 != undefined) data['arg2'] = arg2;
    if (arg3 != undefined) data['arg3'] = arg3;
    if (arg4 != undefined) data['arg4'] = arg4;
    if (arg5 != undefined) data['arg5'] = arg5;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };

    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    //console.log(JSON.stringify(data));
    xmlhttp.send(JSON.stringify(data));
}

function filterToQueryStr(filter){
    var queryString = "";
    if (filter != undefined){
        var index = 0;
        for (var param in filter) {
            if (filter[param]==undefined) continue;
            if (index == 0) queryString += "?";
            else queryString += "&";
            queryString += param + "=" + filter[param];
            index ++;
        }
    }
    return queryString;
}

function urlToFilter(url){
    var splited = url.split('?');
    if (splited < 2) return [];
    return queryStrToFilter(splited[1]);
}

function queryStrToFilter(query){
    var filter = [];
    if (query==undefined) return filter;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        filter[pair[0]] = pair[1];
    }
    return filter;
}