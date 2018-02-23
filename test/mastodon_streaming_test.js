const ws = require("ws");

const DOMAIN = "mstdn.maud.io";
const url = "wss://"+DOMAIN+"/api/v1/streaming?stream=public:local";
console.log("Endpoint:"+url);


let wso = new ws(url);

wso.on("open",()=>{
    console.log("Conection Opened");
})

wso.on("message",(data)=>{
    var status = JSON.parse(JSON.parse(data).payload);
    console.log(status.account.username+" : "+status.content);
})