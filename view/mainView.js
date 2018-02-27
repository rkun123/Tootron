console.log("loaded..");
var electron = require("electron");

window.onload = function(){
    //debuging


    var app = new Vue({
        el:"#main",
        data:{
            tootTmp:"",
            message:"Hello,Vue!!",
            HTLToots:[],
            LTLToots:[],
            FTLToots:[],
            currentTL:""
        },
        methods:{
            sendButtonOnClick:function (event){
                console.log(this.tootTmp);
                if(this.tootTmp){
                    electron.ipcRenderer.send("tootSend",this.tootTmp);
                    this.tootTmp = "";
                    //window.setTimeout(this.reloadButtonOnClick,200);
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
                
            }

        }
    });

    //Initial request.
    electron.ipcRenderer.send("TimelineReq");
    //electron.ipcRenderer.send("homeTimelineReq","Request");
    
    //Timeline responce listener.
    electron.ipcRenderer.on("HTL",function(event,arg){
        app.HTLToots.unshift(arg);
        console.log(arg);
    });
    electron.ipcRenderer.on("LTL",function(event,arg){
        app.LTLToots.unshift(arg);
        //console.log(app.LTLToots[0].content);
        console.log(arg.content);
    });
    electron.ipcRenderer.on("FTL",function(event,arg){
        app.FTLToots.unshift(arg);
        console.log(arg);
    });
    electron.ipcRenderer.on("TimelineUpdate",function(event,arg){
        
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
