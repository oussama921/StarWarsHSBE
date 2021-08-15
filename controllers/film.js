
const puppeteer = require('puppeteer');
const axios = require('axios');

let films=[];

getSwapiFilms();
setInterval(getSwapiFilms,1000*60*60*24*10);

function getSwapiFilms(){
  axios.get('https://swapi.dev/api/films')
  .then((res)=>{
    films = res.data.results;
    let pagesCount = res.data.count/10

    for(let i=2;i< pagesCount +1 ;i++){
      axios.get("https://swapi.dev/api/films/?page="+i)
        .then(async (res2)=>{
          films = films.concat(res2.data.results)

          if(films.length == pagesCount*10){
            console.log("SWAPI Films loaded. Loading Films images...");
            loadFilmsImages();
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }
    if(pagesCount<1){
      console.log("SWAPI Films loaded. Loading Films images...");
      loadFilmsImages();
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

function loadFilmsImages(){
(async ()=>{
  try{
    const _instance = await puppeteer.launch({
      headless:true,
      slowMo:30
    })
    const _context = await _instance.createIncognitoBrowserContext();
    const page = await _context.newPage();

    let i=0;
    while(i<films.length){

      await page.goto("https://www.google.com/imghp");
      await page.click('.gLFyf');
      await page.type(".gLFyf",films[i].title + " filetype:png");
      await page.keyboard.press("Enter");
      await page.waitForSelector(".Q4LuWd");
      const content = await page.$eval(".Q4LuWd",result=>
        result.getAttribute("src")
      );

      films[i].imgUrl = content;
      console.log('Loading films images '+Math.floor((i+1)*100/films.length)+"%");

      if(i == films.length-1){
        console.log("films images loaded");
      }
      i++;
    };

    console.log("films images Loaded");
  }catch(err){
    console.log(err);
  }

})();
}

// Show Ref
const getFilms = (req, res) => {
  res.status(200).json(films);
};

module.exports = {
  getFilms,
  getSwapiFilms
};
