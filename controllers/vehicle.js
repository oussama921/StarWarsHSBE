
const puppeteer = require('puppeteer');
const axios = require('axios');

let vehicles=[];

getSwapiVehicles();
setInterval(getSwapiVehicles,1000*60*60*24*10);

function getSwapiVehicles(){
  axios.get('https://swapi.dev/api/vehicles')
  .then((res)=>{
    vehicles = res.data.results;
    let pagesCount = res.data.count/10

    for(let i=2;i< pagesCount +1 ;i++){
      axios.get("https://swapi.dev/api/vehicles/?page="+i)
        .then((res2)=>{
          vehicles = vehicles.concat(res2.data.results)

          if(vehicles.length == pagesCount*10){
            console.log("SWAPI Vehicles loaded. Loading Vehicles images...");
            loadVehiclesImages();
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }
    if(pagesCount<1){
      console.log("SWAPI Vehicles loaded. Loading Vehicles images...");
      loadVehiclesImages();
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

function loadVehiclesImages(){
(async ()=>{
  try{
    const _instance = await puppeteer.launch({
      headless:true,
      slowMo:30
    })
    const _context = await _instance.createIncognitoBrowserContext();
    const page = await _context.newPage();

    let i=0;
    while(i<vehicles.length){

      await page.goto("https://www.google.com/imghp");
      await page.click('.gLFyf');
      await page.type(".gLFyf",vehicles[i].name);
      await page.keyboard.press("Enter");
      await page.waitForSelector(".Q4LuWd");
      const content = await page.$eval(".Q4LuWd",result=>
        result.getAttribute("src")
      );

      vehicles[i].imgUrl = content;
      console.log('Loading vehicles images '+Math.floor((i+1)*100/vehicles.length)+"%");

      if(i == vehicles.length-1){
        console.log("vehicles images loaded");
      }
      i++;
    };

    console.log("vehicles images Loaded");
  }catch(err){
    console.log(err);
  }

})();
}

// Show Ref
const getVehicles = (req, res) => {
  res.status(200).json(vehicles);
};

module.exports = {
  getVehicles,
  getSwapiVehicles
};
