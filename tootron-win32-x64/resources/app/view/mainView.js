console.log("loaded..");
var electron = require("electron");

window.onload = function(){
    //debuging


    var app = new Vue({
        el:"#main",
        data:{
            tootTmp:"",
            message:"Hello,Vue!!",
            toots:[],
            currentTL:""
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
            reloadButtonOnClick:function(event){loadTimeline(this.currentTL);},
            favoriteButtonOnClick:function(id){
                console.log("Fav "+id);
                var favNum = electron.ipcRenderer.sendSync("isFavorite",id);
                if(id){
                    if(favNum){
                        electron.ipcRenderer.send("tootUnFavorite",id);
                    }else{
                        electron.ipcRenderer.send("tootFavorite",id);
                    }
                    window.setTimeout(this.reloadButtonOnClick,200);
                }
                
            },
            HTLButtonOnClick:function(){loadTimeline("H");},
            LTLButtonOnClick:function(){loadTimeline("L");},
            FTLButtonOnClick:function(){loadTimeline("F");}

        }
    });

    function loadTimeline(whichTL){
        console.log("Reload...");
        app.toots = [];
        app.currentTL = whichTL;
        console.log(whichTL);
        electron.ipcRenderer.send("TimelineReq", whichTL);
    }
    //Initial request.
    loadTimeline("H");
    //electron.ipcRenderer.send("homeTimelineReq","Request");
    //Timeline responce listener.
    electron.ipcRenderer.on("Timeline",function(event,arg){
        app.toots = [];
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

    //authorization modals event.
    electron.ipcRenderer.on("authRequest",function(event,args){
        
        var remote = require("remote");
        var BrowserWindow = remote.require('browser-window');
        var path = require("path");
        
    })

};
