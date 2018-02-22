const {app,BrowserWindow,ipcMain} = require("electron");
const mastodonlib = require("mastodon");
const config = require("electron-json-config");
const path = require("path");
//const ipcInitializer = ("./lib/ipcInitializer.js");
//const config = require("electron-json-config");

//datas...

//...datas


let mainWindow;
let mastodon;

app.on("ready",authorization);

function authorization(){
    //Authorize.
    console.log(config.get("accesstoken"));
    if(!config.get("accesstoken")){
        //Make Window to be put AccessToken on by user.  
        let authWindow;
        authWindow = new BrowserWindow({width:640,height:480});
        authWindow.loadURL(path.join(__dirname,"view/authWindow.html"));
        ipcMain.on("accessToken",function(event,arg){
            config.set("accesstoken",arg);
            console.log(config.get("accesstoken"));
            authWindow = null;
            initialize();
        })
    }else{
        initialize();
    }
}

function initialize(){
    //Make mainWindow.
    mainWindow = new BrowserWindow({width:480,height:720});
    mainWindow.loadURL(path.join(__dirname,"view/index.html"));
    mainWindow.on("closed",function(){
        mainWindow = null;
    })

    //Make mastodon object.
    mastodon = new mastodonlib({
        access_token:config.get("accesstoken"),
        timeout_ms:60000,
        api_url:"https://mstdn.jp/api/v1/"
    });

    ipcInitializer(ipcMain,mastodon);

}

function ipcInitializer(ipcObj,mastodonObj){
    //Make ipc listener of mainWindow.
    ipcObj.on("homeTimelineReq",(event,arg) => {
        //HometimelineRequest.
        mastodonObj.get("timelines/home",{}).then(resp => event.sender.send("homeTimeline",resp.data));
            //console.log(data);
    });

    ipcObj.on("tootSend",function(event,arg){
        //Send toot.
        console.log({status:arg});
        mastodonObj.post("statuses",{status:arg});
    });
    ipcObj.on("tootFavorite",function(event,arg){
        mastodonObj.post("statuses/"+arg+"/favourite");
    });
}
