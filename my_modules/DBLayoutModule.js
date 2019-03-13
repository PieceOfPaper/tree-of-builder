class DBLayoutModule {

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
            output += '<form action="/Login" method="POST" >';
            output +=  '<input type="hidden" name="userno" value="'+userdata.userno+'" style="margin:2px; width:calc(100% - 4px);" >';
            output +=  '<input type="normal" name="value" style="margin:2px; width:calc(100vw - 40px);" >';
            output +=  '<button type="submit">Submit</button>';
            output += '</form>';
        }
        if (results != undefined){
            for (var i=0;i<results.length;i++){
                output += '<div style="display:table-row;"><div style="display:table-cell;">'+results[i].nickname+'</div><div style="display:table-cell;">'+results[i].value+'</div></div>';
            }
        }

        output += '</div>';
        return output;
    }

}
module.exports = DBLayoutModule;