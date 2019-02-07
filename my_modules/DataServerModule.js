class DataServerModule {

    static RequestLog(request){
        console.log('[ReqDataLog] '+request.originalUrl);
    }

    static DefaultQueryFilter(tableData, queryString) {
        var filteredArray = [];
        var itemCount = 999999;
        var pageNum = 1;
        var orderAttr = "ClassID";
        var orderType = 1;
        if (queryString != undefined){
            for (var param in queryString) {
                if (param=="itemCount"){
                    itemCount = Number(queryString[param]);
                    continue;
                }
                if (param=="pageNum"){
                    pageNum = Number(queryString[param]);
                    continue;
                }
                if (param=="orderAttr"){
                    orderAttr = queryString[param];
                    continue;
                }
                if (param=="orderType"){
                    orderType = Number(queryString[param]);
                    continue;
                }
                //if (tableData[0][param]!=undefined){
                    if (queryString[param].indexOf(';') >= 0){
                        // list
                        var splited = queryString[param].split(';');
                        for (var i = 0; i < tableData.length; i ++){
                            var isHas = false;
                            if (tableData[i][param]!=undefined){
                                for (var j = 0; j < splited.length; j ++){
                                    if (this.SameContains(tableData[i][param],splited[j])){
                                        isHas = true;
                                        break;
                                    }
                                }
                            }
                            if (isHas == false){
                                if (!filteredArray.includes(tableData[i])) filteredArray.push(tableData[i]);
                            }
                        }
                    } else if (queryString[param].indexOf('[') >= 0) {
                        // range
                        var splited = queryString[param].replace('[', '').replace(']', '').split(',');
                        if (splited.length > 1){
                            var min = Number(splited[0]);
                            var max = Number(splited[1]);
                            for (var i = 0; i < tableData.length; i ++){
                                if (tableData[i][param]==undefined || Number(tableData[i][param]) < min || Number(tableData[i][param]) > max){
                                    if (!filteredArray.includes(tableData[i])) filteredArray.push(tableData[i]);
                                }
                            }
                        }
                    } else { 
                        // default
                        for (var i = 0; i < tableData.length; i ++){
                            if (tableData[i][param]==undefined || this.SameContains(tableData[i][param],queryString[param])==false){
                                if (!filteredArray.includes(tableData[i])) filteredArray.push(tableData[i]);
                            }
                        }
                    }
                }
            // }
        }


        var output = [];
        if (tableData != undefined){
            for (var i = 0; i < tableData.length; i ++){
                var isFiltered = false;
                for (var j = 0; j < filteredArray.length; j ++){
                    if (filteredArray[j] == tableData[i]){
                        isFiltered = true;
                        break;
                    }
                }
                if (isFiltered) continue;
                output.push(tableData[i]);
            }
        }

        //sort
        output.sort(function(a,b){
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

        var output2 = [];
        for(var i=(pageNum-1)*itemCount;i<pageNum*itemCount;i++){
            if (i >= output.length) break;
            output2.push(output[i]);
        }

        var outDataPackage = {};
        outDataPackage["pageMax"] = Math.floor((output.length - 1)/itemCount) + 1;
        outDataPackage["datalist"] = output2;

        //console.log(JSON.stringify(outDataPackage));

        return outDataPackage;
    }

    static SameContains(a, b){
        var strA = a == undefined ? '' : a.toString();
        var strB = b == undefined ? '' : b.toString();
        if (strA.indexOf(';')>=0){
            var splited=strA.split(';');
            for(var i=0;i<splited.length;i++){
                if(this.SameContains(splited[i],b))
                    return true;
            }
            return false;
        }
        if (strB[0] == '@'){
            if (strA.indexOf(b.replace('@', '')) >= 0) return true;
            else return false;
        }
        if (a == b) return true;
        else return false;
    }

}
module.exports = DataServerModule;