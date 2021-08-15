
const puppeteer = require('puppeteer');
const axios = require('axios');

let starships=[];

getSwapiStarships();
setInterval(getSwapiStarships,1000*60*60*24*10);

function getSwapiStarships(){
  axios.get('https://swapi.dev/api/starships')
  .then((res)=>{
    starships = res.data.results;
    let pagesCount = res.data.count/10


    for(let i=2;i< pagesCount +1 ;i++){
      axios.get("https://swapi.dev/api/starships/?page="+i)
        .then(async (res2)=>{
          starships = starships.concat(res2.data.results)

          if(starships.length == pagesCount*10){
            console.log("SWAPI Starships loaded. Loading Starships images...");
            loadStarshipsImages();
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }
    if(pagesCount<1){
      console.log("SWAPI Starships loaded. Loading Starships images...");
      loadStarshipsImages();
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

function loadStarshipsImages(){
(async ()=>{
  try{
    const _instance = await puppeteer.launch({
      headless:true,
      slowMo:30
    })
    const _context = await _instance.createIncognitoBrowserContext();
    const page = await _context.newPage();

    let i=0;
    while(i<starships.length){

      await page.goto("https://www.google.com/imghp");
      await page.click('.gLFyf');
      await page.type(".gLFyf",starships[i].name + " filetype:png");
      await page.keyboard.press("Enter");
      await page.waitForSelector(".Q4LuWd");
      const content = await page.$eval(".Q4LuWd",result=>
        result.getAttribute("src")
      );

      starships[i].imgUrl = content;
      console.log('Loading starships images '+Math.floor((i+1)*100/starships.length)+"%");

      if(i == starships.length-1){
        console.log("starships images loaded");
      }
      i++;
    };

    console.log("starships images Loaded");
  }catch(err){
    console.log(err);
  }

})();
}

// Show Ref
const getStarships = (req, res) => {
  res.status(200).json(starships);
};

module.exports = {
  getStarships,
};
