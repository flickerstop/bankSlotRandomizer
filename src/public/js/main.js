

var main = function(){

    let slotList = [];
    let disabledList = [];

    let showCards = [];
    let cardCount = 0;
    let runs = 0;

    let settings = {
        showLikes: true,
        onlyTop500: false
    }

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

            slotList.sort((a, b) => {
                if (parseInt(a.likes) > parseInt(b.likes)) {
                  return -1;
                }
                if (parseInt(a.likes) < parseInt(b.likes)) {
                  return 1;
                }
                return 0;
            });

            // Write out number of slots
            dom.text("slotCount",slotList.length);

            // Write out number of disabled slots
            dom.text("disabled",disabledList.length);

            main.randomSlot();
            updateSettingsUI();
        })
    }

    function randomSlot(){

        const NUM_OF_CARDS = getRandomInt(10,40);
        const WIDTH = 490;
        const HEIGHT = 368;
        const GAP = 10;
        const SIZE_REDUCTION = 0.7;

        let container = new dom.builder("randomSlots");

        // Every 15 restart
        if(runs > 0 && runs%15 == 0){
            cardCount = 0;
            showCards = [];
            runs = 0;

            container = new dom.builder("cardContainer").html(null).append("div").id("randomSlots");
        }


        
        // What card to show
        let cardToShow = cardCount + Math.ceil(NUM_OF_CARDS/2);

        // Add to total number of cards
        cardCount += NUM_OF_CARDS;


        // set the width of the container
        container.style("width",`${(cardCount * (WIDTH+GAP))-GAP}px`);



        // Draw the random cards
        for(let i = 0; i < NUM_OF_CARDS; i++){
            // Get the random slot number
            let randomNum = getRandomInt(0,settings.onlyTop500? 500 : slotList.length);
            let randomSlot = slotList[randomNum];
            //target="_blank" rel="noopener noreferrer"
            
            let cardSlot = container.append("a").class("slotCard");
            
            // Add the background
            cardSlot.append("div").class("background").style("background-image",`url('${randomSlot.image}')`);
            
            // Add the name
            cardSlot.append("div").class("name").text(randomSlot.name.replace("\\",""));

            // Add the likes
            if(settings.showLikes){
                cardSlot.append("div").class("likes").text(`${randomSlot.likes} ♥`);
            }
            



            cardSlot.attribute("target","_blank");
            cardSlot.attribute("rel","noopener noreferrer");
            cardSlot.attribute("href",randomSlot.link);


            if(showCards.length != cardToShow){
                cardSlot.style("filter","grayscale(100%)");
                cardSlot.style("opacity","0.6");
                cardSlot.style("pointer-events","none");
                cardSlot.style("width",`calc(${WIDTH}px * ${SIZE_REDUCTION})`);
                cardSlot.style("height",`calc(${HEIGHT}px * ${SIZE_REDUCTION})`);
                cardSlot.style("top",`calc(${HEIGHT}px * ${1-SIZE_REDUCTION})`);
            }else{
                dom.text("slotNumber",randomNum);
                cardSlot.style("width",`${WIDTH}px`);
                cardSlot.style("height",`${HEIGHT}px`);
            }

            // Add this card to the shown cards
            showCards.push(randomSlot);
        }

        console.log(`Card to show: ${cardToShow}`);
        console.log(showCards[cardToShow]);

        // animate
        setTimeout(()=>{
            container.style("margin-left",`-${((cardToShow * (WIDTH*SIZE_REDUCTION+GAP))-GAP) - (window.innerWidth/2) + WIDTH/2 + (WIDTH*(1-SIZE_REDUCTION)*(runs-1))}px`);
        },250)
        
        runs++;
    }

    function updateSettingsUI(){

        let likesButtons = {
            on: new dom.builder("likesON"),
            off: new dom.builder("likesOFF")
        }

        // show Likes
        if(settings.showLikes){
            likesButtons.on.style("opacity","1.0");
            likesButtons.on.style("pointer-events","none");

            likesButtons.off.style("opacity","0.2");
            likesButtons.off.style("pointer-events","all");
        }else{
            likesButtons.off.style("opacity","1.0");
            likesButtons.off.style("pointer-events","none");

            likesButtons.on.style("opacity","0.2");
            likesButtons.on.style("pointer-events","all");
        }





        let top500 = {
            on: new dom.builder("top500ON"),
            off: new dom.builder("top500OFF")
        }
        if(settings.onlyTop500){
            top500.on.style("opacity","1.0");
            top500.on.style("pointer-events","none");

            top500.off.style("opacity","0.2");
            top500.off.style("pointer-events","all");
        }else{
            top500.off.style("opacity","1.0");
            top500.off.style("pointer-events","none");

            top500.on.style("opacity","0.2");
            top500.on.style("pointer-events","all");
        }
    }

    function setLikesSettings(isOn){
        settings.showLikes = isOn;
        updateSettingsUI();
    }

    function setTop500Settings(isOn){
        settings.onlyTop500 = isOn;
        updateSettingsUI();
    }

    function openOverlay(){
        updateSettingsUI();
        animate.fadeIn("popup");
    }

    function closeOverlay(){
        animate.fadeOut("popup");
    }

    return{
        loadFile,
        randomSlot,
        updateSettingsUI,
        setLikesSettings,
        setTop500Settings,
        openOverlay,
        closeOverlay,
        getSlotArray: function(){return slotList}
    }
}();



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}