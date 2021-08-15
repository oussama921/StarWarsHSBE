
const puppeteer = require('puppeteer');
const axios = require('axios');

let people=[];

getSwapiPeople();
setInterval(getSwapiPeople,1000*60*60*24*10);

function getSwapiPeople(){
  axios.get('https://swapi.dev/api/people')
  .then((res)=>{
    people = res.data.results;
    let pagesCount = res.data.count/10

    for(let i=2;i< pagesCount +1 ;i++){
      axios.get("https://swapi.dev/api/people/?page="+i)
        .then((res2)=>{
          people = people.concat(res2.data.results)

          if(people.length == pagesCount*10){
            console.log("SWAPI People loaded. Loading People images...");
            loadPeopleImages();
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }
    if(pagesCount<1){
      console.log("SWAPI People loaded. Loading People images...");
      loadPeopleImages();
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

function loadPeopleImages(){
(async ()=>{
  try{
    const _instance = await puppeteer.launch({
      headless:true,
      slowMo:30
    })
    const _context = await _instance.createIncognitoBrowserContext();
    const page = await _context.newPage();

    let i=0;
    while(i<people.length){

      await page.goto("https://www.google.com/imghp");
      await page.click('.gLFyf');
      await page.type(".gLFyf",people[i].name);
      await page.keyboard.press("Enter");
      await page.waitForSelector(".Q4LuWd");
      const content = await page.$eval(".Q4LuWd",result=>
        result.getAttribute("src")
      );

      people[i].imgUrl = content;

      console.log('Loading people images '+Math.floor((i+1)*100/people.length)+"%");

      if(i == people.length-1){
        console.log("people images loaded");
      }
      i++;
    };

    console.log("people images Loaded");
  }catch(err){
    console.log(err);
  }

})();
}

// Show Ref
const getPeople = (req, res) => {
  res.status(200).json(people);
};

module.exports = {
  getPeople,
  getSwapiPeople
};
