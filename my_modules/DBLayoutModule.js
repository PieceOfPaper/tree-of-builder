class DBLayoutModule {

    static BOARD_SHORT_WRITE_PERMISSION() { return 1; }
    static COMMENT_WRITE_PERMISSION() { return 1; }

    static MASTER_PERMISSION() { return 10000; }

    static CommentTextFilter(text) {
        if (text==undefined) return '';
        var output = text.toString();
        var regURL = new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)","gi");
        var regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+\.[a-z0-9-]+)","gi");
        output = output.replace(regURL,"<a href='$1://$2' target='_blank'>$1://$2</a>");
        //output = output.replace(regEmail,"<a href='mailto:$1'>$1</a>");
        return output;
    }

    static GetPageLinkString(serverData, page, page_arg1, page_arg2){
        var tableName = '';
        switch(page)
        {
            case 'Class':
                tableName = 'job';
                break;
            case 'Item':
                tableName = page_arg1;
                break;
            default: tableName = page.toString().toLowerCase();
        }
        var linkName = page + ' Page';
        if (serverData['tableData'][tableName]!=undefined){
            for(var i=0;i<serverData['tableData'][tableName].length;i++){
                if (serverData['tableData'][tableName][i]['ClassID']==Number(page_arg2)){
                    linkName = serverData['tableData'][tableName][i]['Name'];
                    break;
                }
            }
        }

        var pageQuery = '';
        if (page == 'Item') pageQuery = 'table='+page_arg1+'&id='+page_arg2;
        else pageQuery = 'id='+page_arg2;
        return '<a href="/'+page+'?'+pageQuery+'">['+page+'] '+linkName+'</a>';
    }

    static CommentTextMin(text) {
        if (text==undefined) return '';
        var output = text.toString();
        output = output.replace(/\n/g,' ');
        output = output.replace(/\t/g,' ');
        output = output.replace(/\r/g,' ');
        return output;
    }

    static Layout_LoginForm() {
        var output = '';
        output += '<form action="/Account/Login" method="POST" style="margin:0; padding:5px; width:fit-content; display:inline-block; border: 1px solid black;">';
        output +=   '<div style="display:table-row;"><div style="display:table-cell;">Email</div><div style="display:table-cell;"><input type="email" name="email"></div></div>';
        output +=   '<div style="display:table-row;"><div style="display:table-cell;">Pwd</div><div style="display:table-cell;"><input type="password" name="pwd"></div></div>';
        output +=   '<button style="margin:2px; width:calc(100% - 4px);" type="submit">Login</button>';
        output +=   '<button style="margin:2px; width:calc(100% - 4px);" type="button" onclick="location.href=\'./JoinPage\'">Join</button>';
        output +=   '<button style="margin:2px; width:calc(100% - 4px);" type="button" onclick="location.href=\'./ForgotPwdPage\'">Forgot Password</button>';
        output += '</form>';

        return output;
    }

    static Layout_LogedIn(userdata) {
        var output = '';
        output += '<div style="margin:0; padding:5px; width:fit-content; display:inline-block; border: 1px solid black;">';
        if (userdata != undefined){
            output += '<p style="width:calc(100%); text-align:center;">Welocme. '+userdata.nickname+'</p>';
            output += '<p style="width:calc(100%); text-align:center;"><a href="./Account">My Info</a></p>';
            output += '<br/>';
            if (userdata.mail_auth == undefined || userdata.mail_auth != "A"){
                output += '<p style="width:calc(100%); text-align:center;">No Authenticated User.</p>';
                output += '<p style="width:calc(100%); text-align:center;"><a href="./ReqJoinMail?email='+userdata.email+'">Request Auth Mail</a></p>';
                output += '<br/>';
            }
        } else {
            output += '<p style="width:calc(100%); text-align:center;">Longin Error</p>';
            output += '<br/>';
        }
        output += '<p style="width:calc(100%); text-align:center;"><a href="./Account/Logout">Logout</a></p>';
        output += '</div>';

        return output;
    }

    static Layout_ShortBoard(userdata, results) {
        var output = '';
        output += '<div style="margin:0; padding:5px; width:calc(100vw - 30px); display:inline-block; border: 1px solid black;">';
        if (userdata != undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A" && userdata.permission >= this.BOARD_SHORT_WRITE_PERMISSION()){
            output += '<form action="/BoardShort/ReqWrite" method="POST" >';
            output +=  '<input type="hidden" name="userno" value="'+userdata.userno+'" style="margin:2px; width:calc(100% - 4px);" >';
            output +=  '<textarea id="shortboard-value" name="value" onkeyup="onChangeTextLimit(\'shortboard-value\',\'shortboard-number\',100)" style="margin:2px; width:calc(100vw - 40px);" ></textarea>';
            output +=  '<button type="submit" style="float:right;">Submit</button>';
            output +=  '<p id="shortboard-number" style="margin:0; float:right;">(0/100)</p>';
            output += '</form>';
            output += '<br>';
        }
        if (results != undefined){
            //console.log(JSON.stringify(results));
            for (var i=0;i<results.length;i++){
                var date = new Date(results[i].time);
                output += '<div style="margin-top:10px; margin-bottom:5px; text-align:left;">';
                output +=  '<p style="margin:2px;"><b>['+results[i].nickname+']</b><span style="float:right; font-size:0.5em;">'+date.toLocaleString()+'</span></p>';

                if (results[i].value!=undefined && results[i].value.length>0)
                    output +=  '<p style="margin:2px;">'+this.CommentTextFilter(results[i].value)+'</p>';

                output +=  '<p style="margin:2px; float:right;">';
                if (userdata!=undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A"){
                    if (results[i].userno==userdata.userno)
                        output +=  '<a href="#" title="Delete" onclick="Comment_ReqDelete('+results[i].idx+');"><img style="height:1em; vertical-align:middle;" src="img2/button/button_chat_w_exit.png"></a>';
                    if (results[i].userno!=userdata.userno)
                        output +=  '<a href="#" title="Report" onclick="Comment_ReqReport('+results[i].idx+');"><img style="height:1.5em; vertical-align:middle;" src="img2/button/button_chat_system_cursoron.png"></a>';
                }
                output +=  '</p>';
                
                output += '</div>';
                output += '<br>';
            }
        }
        output += '</div>';
        output += '<script>';
        output += 'function Comment_ReqDelete(idx){';
        output +=   'post_to_url("/BoardShort/ReqDelete",{ index:idx },"post");';
        output += '}';
        output += 'function Comment_ReqReport(idx){';
        output +=   'post_to_url("/BoardShort/ReqReport",{ index:idx },"post");';
        output += '}';
        output += '</script>';
        return output;
    }

    static Layout_Comment(userdata, page, arg1, arg2, results) {
        var output = '';
        output += '<div style="margin:0; padding:5px; width:calc(100vw - 30px); display:inline-block; border: 1px solid black;">';
        if (userdata != undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A" && userdata.permission >= this.COMMENT_WRITE_PERMISSION()){
            output += '<form action="/Comment/ReqWrite" method="POST" >';
            output +=  '<input type="hidden" name="userno" value="'+userdata.userno+'" >';
            output +=  '<input type="hidden" name="page" value="'+page+'" >';
            output +=  '<input type="hidden" name="page_arg1" value="'+arg1+'" >';
            output +=  '<input type="hidden" name="page_arg2" value="'+arg2+'" >';
            output +=  '<textarea id="shortboard-value" name="value" onkeyup="onChangeTextLimit(\'shortboard-value\',\'shortboard-number\',100)" style="margin:2px; width:calc(100vw - 40px);" ></textarea>';
            output +=  '<button type="submit" style="float:right;">Submit</button>';
            output +=  '<p id="shortboard-number" style="margin:0; float:right;">(0/100)</p>';
            output += '</form>';
            output += '<br>';
        }
        if (results != undefined){
            var showMax = 10;
            output += '<div id="comments-recent" style="padding:0; margin:0;">';
            for (var i=0;i<showMax;i++){
                if (i >= results.length) break;
                var date = new Date(results[i].time);
                output += '<div style="margin-top:10px; margin-bottom:5px; text-align:left;">';
                output +=  '<p style="margin:2px;"><b>['+results[i].nickname+']</b><span style="float:right; font-size:0.5em;">'+date.toLocaleString()+'</span></p>';

                if (results[i].value!=undefined && results[i].value.length>0)
                    output +=  '<p style="margin:2px;">'+this.CommentTextFilter(results[i].value)+'</p>';

                output +=  '<p style="margin:2px; float:right;">';
                if (userdata!=undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A"){
                    if (results[i].userno==userdata.userno || userdata.permission >= this.MASTER_PERMISSION())
                        output +=  '<a href="#" title="Delete" onclick="ShortBoard_ReqDelete('+results[i].idx+',\''+this.CommentTextMin(results[i].value)+'\');"><img style="height:1em; vertical-align:middle;" src="img2/button/button_chat_w_exit.png"></a>';
                    if (results[i].userno!=userdata.userno)
                        output +=  '<a href="#" title="Report" onclick="ShortBoard_ReqReport('+results[i].idx+',\''+this.CommentTextMin(results[i].value)+'\');"><img style="height:1.5em; vertical-align:middle;" src="img2/button/button_chat_system_cursoron.png"></a>';
                }
                output +=  '</p>';
                
                output += '</div>';
                output += '<br>';
            }
            output += '</div>';
            if (results.length > showMax){
                output += '<button id="show-comments-old" onclick="document.getElementById(\'comments-old\').style.display=\'block\'; document.getElementById(\'show-comments-old\').style.display=\'none\';">Old Comments</button>';
                output += '<div id="comments-old" style="padding:0; margin:0; display:none;">';
                for (var i=showMax;i<results.length;i++){
                    var date = new Date(results[i].time);
                    output += '<div style="margin-top:10px; margin-bottom:5px; text-align:left;">';
                    output +=  '<p style="margin:2px;"><b>['+results[i].nickname+']</b><span style="float:right; font-size:0.5em;">'+date.toLocaleString()+'</span></p>';
    
                    if (results[i].value!=undefined && results[i].value.length>0)
                        output +=  '<p style="margin:2px;">'+this.CommentTextFilter(results[i].value)+'</p>';
    
                    output +=  '<p style="margin:2px; float:right;">';
                    if (userdata!=undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A"){
                        if (results[i].userno==userdata.userno || userdata.permission >= this.MASTER_PERMISSION())
                            output +=  '<a href="#" title="Delete" onclick="ShortBoard_ReqDelete('+results[i].idx+',\''+this.CommentTextMin(results[i].value)+'\');"><img style="height:1em; vertical-align:middle;" src="img2/button/button_chat_w_exit.png"></a>';
                        if (results[i].userno!=userdata.userno)
                            output +=  '<a href="#" title="Report" onclick="ShortBoard_ReqReport('+results[i].idx+',\''+this.CommentTextMin(results[i].value)+'\');"><img style="height:1.5em; vertical-align:middle;" src="img2/button/button_chat_system_cursoron.png"></a>';
                    }
                    output +=  '</p>';
                    
                    output += '</div>';
                    output += '<br>';
                }
                output += '</div>';
            }
        }
        output += '</div>';
        output += '<script>';
        output += 'function ShortBoard_ReqDelete(idx, value){';
        output +=   'if(confirm("Are you sure you want to delete this comment? message:"+value)) post_to_url("/Comment/ReqDelete",{ index:idx },"post");';
        output += '}';
        output += 'function ShortBoard_ReqReport(idx, value){';
        output +=   'if(confirm("Are you sure you want to report this comment? message:"+value)) post_to_url("/Comment/ReqReport",{ index:idx },"post");';
        output += '}';
        output += '</script>';
        return output;
    }

    static Layout_CommentAll(serverData, userdata, results) {
        var output = '';
        output += '<div style="margin:0; padding:5px; width:calc(100vw - 30px); display:inline-block; border: 1px solid black;">';
        if (results != undefined){
            //console.log(JSON.stringify(results));
            for (var i=0;i<results.length;i++){
                var date = new Date(results[i].time);
                output += '<div style="margin-top:10px; margin-bottom:5px; text-align:left;">';
                output +=  '<p style="margin:2px;"><b>['+results[i].nickname+']</b><span style="float:right; font-size:0.5em;">'+date.toLocaleString()+'</span></p>';

                if (results[i].value!=undefined && results[i].value.length>0)
                    output +=  '<p style="margin:2px;">'+this.CommentTextFilter(results[i].value)+'</p>';

                // var pageQuery = '';
                // if (results[i].page == 'Item') pageQuery = 'table='+results[i].page_arg1+'&id='+results[i].page_arg2;
                // else pageQuery = 'id='+results[i].page_arg2;
                // output +=  '<p style="margin:2px; padding-left:1em;"><a href="/'+results[i].page+'?'+pageQuery+'">'+results[i].page+' Page</a></p>';
                output +=  '<p style="margin:2px; padding-left:1em;">'+this.GetPageLinkString(serverData,results[i].page,results[i].page_arg1,results[i].page_arg2)+'</p>';
    
                output +=  '<p style="margin:2px; float:right;">';
                if (userdata!=undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A"){
                    if (results[i].userno==userdata.userno || userdata.permission >= this.MASTER_PERMISSION())
                        output +=  '<a href="#" title="Delete" onclick="ShortBoard_ReqDelete('+results[i].idx+',\''+this.CommentTextMin(results[i].value)+'\');"><img style="height:1em; vertical-align:middle;" src="img2/button/button_chat_w_exit.png"></a>';
                    if (results[i].userno!=userdata.userno)
                        output +=  '<a href="#" title="Report" onclick="ShortBoard_ReqReport('+results[i].idx+',\''+this.CommentTextMin(results[i].value)+'\');"><img style="height:1.5em; vertical-align:middle;" src="img2/button/button_chat_system_cursoron.png"></a>';
                }
                output +=  '</p>';
                
                output += '</div>';
                output += '<br>';
            }
        }
        output += '</div>';
        output += '<script>';
        output += 'function ShortBoard_ReqDelete(idx, value){';
        output +=   'if(confirm("Are you sure you want to delete this comment? message:"+value)) post_to_url("/Comment/ReqDelete",{ index:idx },"post");';
        output += '}';
        output += 'function ShortBoard_ReqReport(idx, value){';
        output +=   'if(confirm("Are you sure you want to report this comment? message:"+value)) post_to_url("/Comment/ReqReport",{ index:idx },"post");';
        output += '}';
        output += '</script>';
        return output;
    }

}
module.exports = DBLayoutModule;