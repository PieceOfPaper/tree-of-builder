class DataServerModule {

    static DefaultQueryFilter(tableData, queryString) {
        var filteredArray = [];
        if (queryString != undefined){
            for (var param in queryString) {
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

        return output;
    }

    static SameContains(a, b){
        if (a.indexOf(';')>=0){
            var splited=a.split(';');
            for(var i=0;i<splited.length;i++){
                if(this.SameContains(splited[i],b))
                    return true;
            }
            return false;
        }
        if (b[0] == '@'){
            if (a.indexOf(b.replace('@', '')) >= 0) return true;
            else return false;
        }
        if (a == b) return true;
        else return false;
    }

}
module.exports = DataServerModule;