
var playlists = [];
var playlistIndexes = [];

function audioPlayList_setPlayList(id, playlist){
    playlists[id] = playlist;
    playlistIndexes[id] = 0;

    if (playlist != undefined && playlist.length > 0){
        var audio = document.getElementById(id);
        if (audio != undefined) {
            //audio.children[0].src = playlist[0];
            //audio.onended = function(){ audioPlayList_playNext(id) };
        }
        var playlistElement = document.getElementById(id+"_playlist");
        if (playlistElement != undefined) {
            for(var i=0;i<playlist.length;i++){
                var musicElement = document.createElement("p");
                var splited = playlist[i].split('/');
                var filename = splited[splited.length-1];
                musicElement.innerHTML = "<button onclick=\"audioPlayList_playIndex('"+id+"', "+i+");\" >Play ["+filename+"]</button>";
                playlistElement.appendChild(musicElement);
            }
        }
    }
}

function audioPlayList_playNext(id){
    playlistIndexes[id] ++;
    if (playlistIndexes[id]>=playlists[id].length) playlistIndexes[id]=0;
    audioPlayList_playIndex(id, playlistIndexes[id]);
}

function audioPlayList_playIndex(id, index){
    var audio = document.getElementById(id);
    if (audio != undefined) {
        playlistIndexes[id] = index;
        if (playlistIndexes[id]>=playlists[id].length) playlistIndexes[id]=0;
        audio.children[0].src = playlists[id][playlistIndexes[id]];
        audio.load();
        audio.play();
    }
}