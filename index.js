const {app,BrowserWindow,ipcMain} = require("electron");
const mastodonlib = require("mastodon");
const config = require("electron-json-config");
const path = require("path");
const ipcInitializer = require("./lib/IpcInitializer");
const streaming = require("./lib/Streaming");
const statusInitialize = require("./lib/StatusInitialize");
//const config = require("electron-json-config");

//datas...

//...datas

//debug


let mainWindow, mastodon, authWindow;


app.on("ready",initialize);

function authorization(){
    //Authorize.
    console.log(config.get("accesstoken"));
    
    if(!config.has("accesstoken") || !config.has("domain")){
        //throw console.error();
        //Make Window to be put AccessToken on by user.
        authWindow = new BrowserWindow({
            width:640,
            height:480,
            modal:true
        });
        authWindow.loadURL(path.join(__dirname,"view/authWindow.html"));

        ipcMain.on("accessToken",function(event,arg){
            config.set("accesstoken",arg.token);
            config.set("domain",arg.domain);
            console.log(config.get("accesstoken")+"@"+config.get("domain"));
            authWindow = null;
            initMastodonObject(arg.token,arg.domain);
        })
    }else{
        initMastodonObject(config.get("domain"),config.get("accesstoken"));
    }
 
}

function initMastodonObject(_domain,_accesstoken){
     //Make mastodon object.
     mastodon = new mastodonlib({
        access_token:_accesstoken,
        timeout_ms:60000,
        api_url:"https://"+_domain+"/api/v1/"
    });
    initMainWindow(_domain,_accesstoken);
}
function initMainWindow(_domain,_accesstoken){
    //Make mainWindow.
    mainWindow = new BrowserWindow({width:480,height:720});
    mainWindow.loadURL(path.join(__dirname,"view/index.html"));
    mainWindow.on("closed",function(){
        mainWindow = null;
    });
    ipcInitializer.init(mastodon);
    
    //init stream
    streaming.initialize(_domain,_accesstoken,mainWindow);

}

function initialize(){
    //authorization() -> initMastodonObject() -> initMainWindow()
    authorization();
}


app.on("window-all-closed",()=>{
    //config.purge();//For debug.

    app.quit()
})


