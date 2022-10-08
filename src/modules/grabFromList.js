

// Grab from the viewable list
let outputData = [];
for(let game of document.getElementsByClassName("sc-hhgfTD dnZkbA")[0].children){
    try{
        outputData.push({
            link: game.href,
            image: game.getElementsByClassName("sc-ksjCef bjnVfA")[0].getElementsByTagName("img")[0].src,
            name: game.getElementsByClassName("sc-ksjCef bjnVfA")[0].getElementsByTagName("img")[0].alt,
            likes: game.getElementsByClassName("sc-hQXzsD kcizyh")[0].innerHTML
        })
    }catch(e){
        console.log("Failed on game");
    }
}
console.log(outputData);
JSON.stringify(outputData);



// Spam click the button to load more
for(let i = 0; i < 190; i++){
    setTimeout(()=>{
        document.getElementsByClassName("sc-cyAvAE cGIoos")[0].getElementsByClassName("nbtn")[0].click()
    },i*500)
}