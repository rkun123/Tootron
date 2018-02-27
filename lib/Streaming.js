const ws = require("ws");
const statusInitialize = require("./StatusInitialize");
const url = require("url");

module.exports = {
    initialize:function(_domain,_token,_mainWindow){
        this.mainWindow = _mainWindow;
        this.HTLStreamingInit(_domain,_mainWindow,_token);
        this.LTLStreamingInit(_domain,_mainWindow);
        this.FTLStreamingInit(_domain,_mainWindow);
    },
    HTLStreamingInit:function(_domain,_mainWindow,_token){
        var url =  "wss://"+_domain+"/api/v1/streaming?access_token="+_token+"&stream=home";
        console.log(url)
        var wso = new ws(url);
        wso.on("open",()=>{
            console.log("Conection Opened");
        })
        
        wso.on("message",function(data){
            try{
                var rawStatus = JSON.parse(data).payload;
                var statusTxt = decodeURIComponent(rawStatus);
                var status = JSON.parse(statusTxt);
                _mainWindow.webContents.send("HTL",statusInitialize(status));
            }catch(e){
                console.log("errored");
            }
        })
    },
    LTLStreamingInit:function(_domain,_mainWindow){
        var url =  "wss://"+_domain+"/api/v1/streaming?stream=public:local";
        console.log(url)
        var wso = new ws(url);
        wso.on("open",()=>{
            console.log("Conection Opened");
        })
        
        wso.on("message",function(data){
            try{
                var rawStatus = JSON.parse(data).payload;
                var statusTxt = decodeURIComponent(rawStatus);
                var status = JSON.parse(statusTxt);
                _mainWindow.webContents.send("LTL",statusInitialize(status));
            }catch(e){
                console.log("errored");
            }
            //console.log(status.account.username+" : "+status.content);
        })
    },
    FTLStreamingInit:function(_domain,_mainWindow){
        var url =  "wss://"+_domain+"/api/v1/streaming?stream=public";
        console.log(url)
        var wso = new ws(url);
        wso.on("open",()=>{
            console.log("Conection Opened");
        })
        
        wso.on("message",function(data){
            try{
                var rawStatus = JSON.parse(data).payload;
                var statusTxt = decodeURIComponent(rawStatus);
                var status = JSON.parse(statusTxt);
                _mainWindow.webContents.send("FTL",statusInitialize(status));
            }catch(e){
                console.log("errored");
            }
        })
    }
};