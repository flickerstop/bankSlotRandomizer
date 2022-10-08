

var main = function(){

    let slotList = [];
    let disabledList = [];

    let showCards = [];
    let cardCount = 0;
    let runs = 0;

    function loadFile(){
        fetch("./json/slotList.json").then((res) => {
            return res.json();
          }).then((data) => {


            // Go through the list and check which ones are disabled
            for(let slot of data){

                // Check if this game is disabled
                if(slot.link != "https://gamdom.com/casino/"){
                    slotList.push(slot);
                }else{
                    disabledList.push(slot);
                }
            }

            // Write out number of slots
            dom.text("slotCount",slotList.length);

            // Write out number of disabled slots
            dom.text("disabled",disabledList.length);

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
            
            let cardSlot = container.append("a").class("slotCard");
            
            // Add the background
            cardSlot.append("div").class("background").style("background-image",`url('${randomSlot.image}')`);
            
            // Add the name
            cardSlot.append("div").class("name").text(randomSlot.name.replace("\\",""));

            // Add the likes
            cardSlot.append("div").class("likes").text(`${randomSlot.likes} ♥`);



            cardSlot.attribute("target","_blank");
            cardSlot.attribute("rel","noopener noreferrer");
            cardSlot.attribute("href",randomSlot.link);


            if(showCards.length != cardToShow){
                cardSlot.style("filter","grayscale(100%)");
                cardSlot.style("opacity","0.6");
                cardSlot.style("pointer-events","none");
                // cardSlot.style("width","calc(490px * 0.9)");
                // cardSlot.style("height","calc(368px * 0.9)");
                // cardSlot.style("top","calc(368px * 0.1)");
            }else{
                dom.text("slotNumber",randomNum);
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
        
        runs++;
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