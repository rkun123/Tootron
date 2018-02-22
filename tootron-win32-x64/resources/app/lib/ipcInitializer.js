const ipcObj = require("electron").ipcMain;

var func = function(mastodon){
        //Make ipc listener of mainWindow.
        ipcObj.on("TimelineReq",(event,arg) => {
            //HometimelineRequest.
            switch(arg){
                case "H"://HTL
                    mastodon.get("timelines/home",{}).then(resp => event.sender.send("Timeline",resp.data));
                    break;
                case "L"://LTL
                    mastodon.get("timelines/public",{"local":true}).then(resp => event.sender.send("Timeline",resp.data));
                    break;
                case "F"://FTL
                    mastodon.get("timelines/public",{}).then(resp => event.sender.send("Timeline",resp.data));
                    break;

            }
            
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
    };
    module.exports.init = func;