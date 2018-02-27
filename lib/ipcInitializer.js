const ipcObj = require("electron").ipcMain;
const streaming = require("./Streaming");
const statusInitialize = require("./StatusInitialize");

var func = {
    init : function(mastodon){
        //Make ipc listener of mainWindow.
        ipcObj.on("TimelineReq",(event) => {
            //timelines request.
                    mastodon.get("timelines/home",{}).then(resp => {
                        for(var i=resp.data.length-1;i>-1;i--){
                            event.sender.send("HTL",statusInitialize(resp.data[i]));
                        }
                    });
                    mastodon.get("timelines/public",{"local":true}).then(resp => {
                        for(var i=resp.data.length-1;i>-1;i--){
                            event.sender.send("LTL",statusInitialize(resp.data[i]));
                        }
                    });
                    mastodon.get("timelines/public",{}).then(resp => {
                        for(data in resp.data){
                            event.sender.send("FTL",statusInitialize(resp.data[data]));
                        }
                    });
                //console.log(data);
        });

        ipcObj.on("tootSend",function(event,arg){
            //Send toot.
            console.log({status:arg});
            mastodon.post("statuses",{status:arg});
        });
        ipcObj.on("tootFavorite",function(event,arg){
            //Favorite toot by id.
            mastodon.post("statuses/"+arg+"/favourite");
            mastodon.get("statuses/"+arg+"/favourited_by",{}).then(resp => console.log(resp.data.length));
        });
        ipcObj.on("tootUnFavorite",function(event,arg){
            //unFavorite toot by id.
            mastodon.post("statuses/"+arg+"/unfavourite");
            mastodon.get("statuses/"+arg+"/favourited_by",{}).then(resp => console.log(resp.data.length));
        });
        ipcObj.on("isFavorite",function(event,arg){
            //get isFavorite toot by id.
            let favNum = 0;
            mastodon.get("statuses/"+arg+"/favourited_by",{}).then(resp => favNum = resp.data.length);
            event.returnValue = favNum;
        });
    }
        
};
    module.exports = func;