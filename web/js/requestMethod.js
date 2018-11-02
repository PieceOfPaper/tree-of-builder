

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

function filterToQueryStr(filter){
    var queryString = "";
    if (filter != undefined){
        var index = 0;
        for (var param in filter) {
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