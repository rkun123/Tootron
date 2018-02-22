console.log("loaded..");
var electron = require("electron");
window.onload = function(){
    
    var app = new Vue({
        el:"#main",
        data:{
            tootTmp:"",
            message:"Hello,Vue!!",
            toots:[]
        },
        methods:{
            sendButtonOnClick:function (event){
                console.log(this.tootTmp);
                if(this.tootTmp){
                    electron.ipcRenderer.send("tootSend",this.tootTmp);
                    this.tootTmp = "";
                    window.setTimeout(this.reloadButtonOnClick,200);
                }
                
            },
            reloadButtonOnClick:function(event){
                console.log("Reload...");
                this.toots = [];
                electron.ipcRenderer.send("homeTimelineReq","Request");
            },
            favoriteButtonOnClick:function(id){
                console.log("Fav "+id);
                if(id){
                    electron.ipcRenderer.send("tootFavorite",id);
                    window.setTimeout(this.reloadButtonOnClick,200);
                }
                
            }
        }
    });
    //Initial request.
    electron.ipcRenderer.send("homeTimelineReq","Request");
    //Timeline responce listener.
    electron.ipcRenderer.on("homeTimeline",function(event,arg){
        for(toot of arg){
            //favorite icon property replace.
            if(toot.favourited){
                toot.favIcon = "favorite";
            }else{
                toot.favIcon = "favorite_border";
            }
            app.toots.push(toot);
        }
        console.log(arg);
    })

    //Ctrl+Enter send event listener
    this.addEventListener("keydown",function(event){
        console.log(event);
        if(event.keyCode == 13 && event.ctrlKey){
            app.sendButtonOnClick();
        }
    })

};
