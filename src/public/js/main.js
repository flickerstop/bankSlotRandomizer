

var main = function(){

    let slotList = null;

    let showCards = [];
    let cardCount = 0;

    function loadFile(){
        fetch("./json/slotList.json").then((res) => {
            return res.json();
          }).then((data) => {
            slotList = data;
            console.log(slotList);
            console.log("list loaded");

            dom.text("slotCount",slotList.length);
            main.randomSlot();
        })
    }

    function randomSlot(){

        const NUM_OF_CARDS = 7;


        
        // What card to show
        let cardToShow = cardCount + Math.ceil(NUM_OF_CARDS/2);

        // Add to total number of cards
        cardCount += NUM_OF_CARDS;

        


        let container = new dom.builder("randomSlots");
        // set the width of the container
        container.style("width",`${(cardCount * 500)-10}px`);



        // Draw the random cards
        for(let i = 0; i < NUM_OF_CARDS; i++){
            // Get the random slot number
            let randomNum = getRandomInt(0,slotList.length);
            let randomSlot = slotList[randomNum];
            //target="_blank" rel="noopener noreferrer"
            let cardSlot = container.append("a").class("slotCard").html(`<div class="background" style="background-image:url('${randomSlot.image}')"></div><div class="name">${randomSlot.name}</div>`);
            
            cardSlot.attribute("target","_blank");
            cardSlot.attribute("rel","noopener noreferrer");
            cardSlot.attribute("href",randomSlot.link);


            if(showCards.length != cardToShow){
                cardSlot.style("filter","grayscale(100%)");
                cardSlot.style("opacity","0.6");
                cardSlot.style("pointer-events","none");
            }

            // Add this card to the shown cards
            showCards.push(randomSlot);
        }

        console.log(`Card to show: ${cardToShow}`);
        console.log(showCards[cardToShow]);

        // animate
        setTimeout(()=>{
            container.style("margin-left",`-${((cardToShow * 500)-10) - (window.innerWidth/2) + 490/2}px`);
        },250)
        
        
    }

    return{
        loadFile,
        randomSlot
    }
}();



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}