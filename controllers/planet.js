
const puppeteer = require('puppeteer');
const axios = require('axios');

let planets=[];

getSwapiPlanets();
setInterval(getSwapiPlanets,1000*60*60*24*10);

function getSwapiPlanets(){
  axios.get('https://swapi.dev/api/planets')
  .then((res)=>{
    planets = res.data.results;
    let pagesCount = res.data.count/10

    for(let i=2;i< pagesCount +1 ;i++){
      axios.get("https://swapi.dev/api/planets/?page="+i)
        .then((res2)=>{
          planets = planets.concat(res2.data.results)

          if(planets.length == pagesCount*10){
            console.log("SWAPI Planets loaded. Loading Planets images...");
            loadPlanetsImages();
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }
    if(pagesCount<1){
      console.log("SWAPI Planets loaded. Loading Planets images...");
      loadPlanetsImages();
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

function loadPlanetsImages(){
(async ()=>{
  try{
    const _instance = await puppeteer.launch({
      headless:true,
      slowMo:30
    })
    const _context = await _instance.createIncognitoBrowserContext();
    const page = await _context.newPage();

    let i=0;
    while(i<planets.length){

      await page.goto("https://www.google.com/imghp");
      await page.click('.gLFyf');
      await page.type(".gLFyf",planets[i].name);
      await page.keyboard.press("Enter");
      await page.waitForSelector(".Q4LuWd");
      const content = await page.$eval(".Q4LuWd",result=>
        result.getAttribute("src")
      );

      planets[i].imgUrl = content;

      console.log('Loading planets images '+Math.floor((i+1)*100/planets.length)+"%");

      if(i == planets.length-1){
        console.log("planets images loaded");
      }
      i++;
    };

    console.log("planets images Loaded");
  }catch(err){
    console.log(err);
  }

})();
}

// Show Ref
const getPlanets = (req, res) => {
  res.status(200).json(planets);
};

module.exports = {
  getPlanets,
  getSwapiPlanets
};
