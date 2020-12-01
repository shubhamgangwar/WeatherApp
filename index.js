const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html" , "utf-8");

const replaceval = (tempval,orgval) =>{

  let temprature = tempval.replace("{%tempval%}",orgval.main.temp);
  temprature = temprature.replace("{%tempmin%}",orgval.main.temp_min);
  temprature = temprature.replace("{%tempmax%}",orgval.main.temp_max);
  temprature = temprature.replace("{%location%}",orgval.name);
  temprature = temprature.replace("{%country%}",orgval.sys.country); 
  temprature = temprature.replace("{%temstatus%}",orgval.weather[0].main); 
  temprature = temprature.replace("{%weather%}",orgval.weather[0].main);
  

  // console.log(temprature);
  return temprature;

}

const server = http.createServer((req,res)=>{
    if(req.url = "/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Bareilly&appid=9cfb367a5412271a58249169f8c7c09e"
            )
        .on("data", (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrdata = [objdata];
          // console.log(arrdata);
          const temp = arrdata[0].main.temp-32*5/9;
          
          // console.log(temp);

          const realtimedata = arrdata.map((val) => replaceval(homeFile,val)).join("");
          res.end(realtimedata);
          // console.log(arrdata[0].main.temp);
          // console.log(realtimedata);
        })
        .on("end", (err) => {
          if (err) return console.log('connection closed due to errors', err);
         
          console.log("end");
        });
    }
});

server.listen(3000 , "127.0.0.1",()=>{
    console.log("listing on port 3000");
});