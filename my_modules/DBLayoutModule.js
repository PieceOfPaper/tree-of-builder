class DBLayoutModule {

    static CommentTextFilter(text) {
        if (text==undefined) return '';
        var output = text.toString();
        var regURL = new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)","gi");
        var regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+\.[a-z0-9-]+)","gi");
        output = output.replace(regURL,"<a href='$1://$2' target='_blank'>$1://$2</a>");
        //output = output.replace(regEmail,"<a href='mailto:$1'>$1</a>");
        return output;
    }

    static Layout_LoginForm() {
        var output = '';
        output += '<form action="/Login" method="POST" style="margin:0; padding:5px; width:fit-content; display:inline-block; border: 1px solid black;">';
        output +=   '<div style="display:table-row;"><div style="display:table-cell;">Email</div><div style="display:table-cell;"><input type="email" name="email"></div></div>';
        output +=   '<div style="display:table-row;"><div style="display:table-cell;">Pwd</div><div style="display:table-cell;"><input type="password" name="pwd"></div></div>';
        output +=   '<button style="margin:2px; width:calc(100% - 4px);" type="submit">Login</button>';
        output +=   '<button style="margin:2px; width:calc(100% - 4px);" type="button" onclick="location.href=\'./JoinPage\'">Join</button>';
        output += '</form>';

        return output;
    }

    static Layout_LogedIn(userdata) {
        var output = '';
        output += '<div style="margin:0; padding:5px; width:fit-content; display:inline-block; border: 1px solid black;">';
        if (userdata != undefined){
            output += '<p style="width:calc(100%); text-align:center;">Welocme. '+userdata.nickname+'</p>';
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
        output += '<p style="width:calc(100%); text-align:center;"><a href="./Logout">Logout</a></p>';
        output += '</div>';

        return output;
    }

    static Layout_ShortBoard(userdata, results) {
        var output = '';
        output += '<div style="margin:0; padding:5px; width:calc(100vw - 30px); display:inline-block; border: 1px solid black;">';
        if (userdata != undefined && userdata.mail_auth != undefined && userdata.mail_auth == "A"){
            output += '<form action="/BoardShort/ReqWrite" method="POST" >';
            output +=  '<input type="hidden" name="userno" value="'+userdata.userno+'" style="margin:2px; width:calc(100% - 4px);" >';
            output +=  '<textarea name="value" style="margin:2px; width:calc(100vw - 40px);" ></textarea>';
            output +=  '<button type="submit" style="float:right;">Submit</button>';
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
                output += '</div>';
            }
        }

        output += '</div>';
        return output;
    }

}
module.exports = DBLayoutModule;