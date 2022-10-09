

var main = function(){

    let slotList = [];
    let disabledList = [];

    let showCards = [];
    let cardCount = 0;
    let runs = 0;

    let totalRolls = 0;
    let slotLog = null;
    let rolledCards = [];

    let settings = {
        showLikes: true,
        onlyTop500: false,
        onlyTop100: true,
        noRepeat: true
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

            slotLog = new dom.builder("slotLog");
            main.randomSlot(); 
            updateSettingsUI();
        })
    }

    function randomSlot(){

        const NUM_OF_CARDS = getRandomInt(10,20);
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



        /////////////////////////////////
        // REDOING
        
        // What card to show
        let cardToShow = cardCount + NUM_OF_CARDS-4;

        // Add to total number of cards
        cardCount += NUM_OF_CARDS;


        // set the width of the container
        container.style("width",`${(cardCount * (WIDTH+GAP))-GAP}px`);



        // Draw the random cards
        for(let i = 0; i < NUM_OF_CARDS; i++){
            // Get the random slot number
            let randomNum = getRandomInt(0,slotList.length);

            // check if top only 500
            if(settings.onlyTop500){
                randomNum = getRandomInt(0,500);
                if(rolledCards.length >= 499){
                    rolledCards = [];
                }
            }

            // Check if only top 100
            if(settings.onlyTop100){
                randomNum = getRandomInt(0,100);
                if(rolledCards.length >= 99){
                    rolledCards = [];
                }
            }

            // Check if this is the card to show
            if(showCards.length == cardToShow && settings.noRepeat){
                // Check if random number is rolled
                if(rolledCards.includes(randomNum)){
                    i--;
                    continue;
                }
            }



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
                rolledCards.push(randomNum);
                dom.text("slotNumber",randomNum);
                cardSlot.style("width",`${WIDTH}px`);
                cardSlot.style("height",`${HEIGHT}px`);
            }

            // Add this card to the shown cards
            showCards.push(randomSlot);
        }

        

        // animate
        setTimeout(()=>{
            container.style("margin-left",`-${((cardToShow * (WIDTH*SIZE_REDUCTION+GAP))-GAP) - (window.innerWidth/2) + WIDTH/2 + (WIDTH*(1-SIZE_REDUCTION)*(runs-1))}px`);
        },250)
        
        runs++;
        totalRolls++;

        console.log(`Card to show: ${cardToShow}`);
        console.log(showCards[cardToShow]);
        console.log(`Total Rolls: ${totalRolls}`);
        console.log(rolledCards);

        // Add to the slot log
        slotLog.append("a")
            .attribute("target","_blank")
            .attribute("rel","noopener noreferrer")
            .attribute("href",showCards[cardToShow].link)
            .append("div")
            .text(`#${totalRolls} -> #${cardToShow} ${showCards[cardToShow].name.replace("\\","")}`);
    }

    function updateSettingsUI(){

        let rollButton = new dom.builder("rollButton").text("Roll a Slot");

        if(settings.onlyTop500){
            rollButton.text("Roll a Slot (Top 500)");
        }else if(settings.onlyTop100){
            rollButton.text("Roll a Slot (Top 100)");
        }

        let settingsIds = [
            ["likes",settings.showLikes],
            ["top500",settings.onlyTop500],
            ["top100",settings.onlyTop100],
            ["noRepeat",settings.noRepeat]
        ];


        for(let setting of settingsIds){
            let buttons = {
                on: new dom.builder(`${setting[0]}ON`),
                off: new dom.builder(`${setting[0]}OFF`)
            }
    
            // show Likes
            if(setting[1]){
                buttons.on.style("opacity","1.0");
                buttons.on.style("pointer-events","none");
    
                buttons.off.style("opacity","0.2");
                buttons.off.style("pointer-events","all");
            }else{
                buttons.off.style("opacity","1.0");
                buttons.off.style("pointer-events","none");
    
                buttons.on.style("opacity","0.2");
                buttons.on.style("pointer-events","all");
            }
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

    function setTop100Settings(isOn){
        settings.onlyTop100 = isOn;
        updateSettingsUI();
    }
    
    function setNoRepeatSettings(isOn){
        settings.noRepeat = isOn;
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
        setTop100Settings,
        openOverlay,
        closeOverlay,
        getSlotArray: function(){return slotList},
        setNoRepeatSettings
    }
}();



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}