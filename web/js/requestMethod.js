

function requestGetData(tableName, filter, callback){
    var xmlhttp = new XMLHttpRequest();
    var url = "../data/" + tableName;

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
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            callback(myArr);
        }
    };

    xmlhttp.open("GET", url + queryString, true);
    xmlhttp.send();
}