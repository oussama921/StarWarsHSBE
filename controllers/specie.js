
const puppeteer = require('puppeteer');
const axios = require('axios');

let species=[];

getSwapiSpecies();
setInterval(getSwapiSpecies,1000*60*60*24*10);

function getSwapiSpecies(){
  axios.get('https://swapi.dev/api/species')
  .then((res)=>{
    species = res.data.results;
    let pagesCount = res.data.count/10

    for(let i=2;i< pagesCount +1 ;i++){
      axios.get("https://swapi.dev/api/species/?page="+i)
        .then((res2)=>{
          species = species.concat(res2.data.results)

          if(species.length == pagesCount*10){
            console.log("SWAPI Species loaded. Loading Species images...");
            loadSpeciesImages();
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }
    if(pagesCount<1){
      console.log("SWAPI Species loaded. Loading Species images...");
      loadSpeciesImages();
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

function loadSpeciesImages(){
(async ()=>{
  try{
    const _instance = await puppeteer.launch({
      headless:true,
      slowMo:30
    })
    const _context = await _instance.createIncognitoBrowserContext();
    const page = await _context.newPage();

    let i=0;
    while(i<species.length){

      await page.goto("https://www.google.com/imghp");
      await page.click('.gLFyf');
      await page.type(".gLFyf",species[i].name);
      await page.keyboard.press("Enter");
      await page.waitForSelector(".Q4LuWd");
      const content = await page.$eval(".Q4LuWd",result=>
        result.getAttribute("src")
      );

      species[i].imgUrl = content;
      console.log('Loading species images '+Math.floor((i+1)*100/species.length)+"%");

      if(i == species.length-1){
        console.log("species images loaded");
      }
      i++;
    };

    console.log("species images Loaded");
  }catch(err){
    console.log(err);
  }

})();
}

// Show Ref
const getSpecies = (req, res) => {
  res.status(200).json(species);
};

module.exports = {
  getSpecies,
  getSwapiSpecies
};
