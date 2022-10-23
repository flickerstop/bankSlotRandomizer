

var main = function(){

    let defaultSlotList = [];
    let slotList = [];
    let disabledList = [];

    let showCards = [];
    let cardCount = 0;
    let runs = 0;

    let totalRolls = 0;
    let slotLog = null;
    let rolledCards = [];

    let companyList = [];

    // Settings to put in the settings menu
    let settings = [
        {
            name: "Show Likes:",
            value: true,
            id: "showLikes",
            type: "toggle"
        },{
            name: "No Repeat:",
            value: true,
            id: "noRepeat",
            type: "toggle"
        },{
            name: "Only Top:",
            value: 500,
            id: "top",
            type: "input"
        }
    ]


    let onlyTop = 500;
    

    function loadFile(){
        fetch("./json/slotList_10_22_2022.json").then((res) => {
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

                // Add this company
                if(companyList.find(x=>x.name == slot.company) == undefined){
                    companyList.push({
                        name: slot.company,
                        isActive: true,
                        id: `company${companyList.length}`
                    });
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

            // Go through the slots and number them
            let i = 1;
            for(let slot of slotList){
                slot.id = i;
                i++;
            }


            defaultSlotList = slotList;


            slotLog = new dom.builder("slotLog");
            main.randomSlot(); 

            updateSettingsUI();
            rebuildSlotList();

            

            console.log(`Loaded ${slotList.length} slots from ${companyList.length} companies`)
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


        
        // What card to show
        let cardToShow = cardCount + NUM_OF_CARDS-4;

        // Add to total number of cards
        cardCount += NUM_OF_CARDS;


        // set the width of the container
        container.style("width",`${(cardCount * (WIDTH+GAP))-GAP}px`);



        // Draw the random cards
        for(let i = 0; i < NUM_OF_CARDS; i++){

            // If we've run out of slots to draw
            if(slotList.length == 0){
                // Rebuild the slot list
                rebuildSlotList();
            }

            // Get the random slot number
            let randomNum = getRandomInt(0,slotList.length);


            

            let randomSlot = slotList[randomNum];

            
            //target="_blank" rel="noopener noreferrer"
            
            let cardSlot = container.append("a").class("slotCard");
            
            // Add the background
            cardSlot.append("div").class("background").style("background-image",`url('${randomSlot.image}')`);
            
            // Add the name
            cardSlot.append("div").class("name").text(`${randomSlot.name.replace("\\","")}<br><span class="companyName">${randomSlot.company}</span>`);

            // Add the likes
            if(settings[0].value){
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
                dom.text("slotNumber",randomSlot.id);
                cardSlot.style("width",`${WIDTH}px`);
                cardSlot.style("height",`${HEIGHT}px`);

                // If we shouldn't show this card again in this roll
                if(settings[1].value){
                    // remove it from the slot list
                    slotList.splice(randomNum,1);
                    updateSlotCount();
                }
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

        //rebuildSlotList();

        let settingsPanel = new dom.builder("settings").html(null);
        let rollButton = new dom.builder("rollButton").text("Roll a Slot");

        for(let setting of settings){

            // Create this settings row
            let row = settingsPanel.append("div").class("settingsRow");
            

            // Add the title
            row.append("div").class("settingsTitle").text(setting.name);

            console.log(setting.type)
            // Add the button/value
            if(setting.type == "toggle"){
                // Toggle ON button
                row.append("div").class("settingsButton").id(`${setting.id}_ON`).text("ON").onClick(()=>{
                    setting.value = true;

                    turnButtonOn(`${setting.id}_ON`);
                    turnButtonOFF(`${setting.id}_OFF`);
                });

                // Toggle OFF button
                row.append("div").class("offButton settingsButton").id(`${setting.id}_OFF`).text("OFF").onClick(()=>{
                    setting.value = false;

                    turnButtonOn(`${setting.id}_OFF`);
                    turnButtonOFF(`${setting.id}_ON`);
                });

                // Set which is on
                if(setting.value){
                    turnButtonOn(`${setting.id}_ON`);
                    turnButtonOFF(`${setting.id}_OFF`);
                }else{
                    turnButtonOn(`${setting.id}_OFF`);
                    turnButtonOFF(`${setting.id}_ON`);
                }



            }else if(setting.type == "input"){
                console.log(setting.type == "input")

                rollButton.text(`Roll a Slot (Top ${onlyTop})`);
                
                row.append("input").class("settingsInput").id(`${setting.id}_INPUT`).attribute("type","number").setValue(setting.value).onChange(()=>{
                    let value = new dom.builder(`${setting.id}_INPUT`).getValue(); 
                    setting.value = value;
                    onlyTop = value;

                    rollButton.text(`Roll a Slot (Top ${onlyTop})`);

                    rebuildSlotList();
                });

            }

        }

        // Update company list
        let companyPanel = new dom.builder("companyList").html(null);
        for(let company of companyList){
            // Create this settings row
            let row = companyPanel.append("div").class("companyRow");

            // Add the title
            row.append("div").class("companyTitle").text(company.name);


            // Toggle ON button
            row.append("div").class("companyButton").id(`${company.id}_ON`).text("ON").onClick(()=>{
                company.isActive = true;

                turnButtonOn(`${company.id}_ON`);
                turnButtonOFF(`${company.id}_OFF`);
                rebuildSlotList();
            });

            // Toggle OFF button
            row.append("div").class("offButton companyButton").id(`${company.id}_OFF`).text("OFF").onClick(()=>{
                company.isActive = false;

                turnButtonOn(`${company.id}_OFF`);
                turnButtonOFF(`${company.id}_ON`);
                rebuildSlotList();
            });


            // Set which is on
            if(company.isActive){
                turnButtonOn(`${company.id}_ON`);
                turnButtonOFF(`${company.id}_OFF`);
            }else{
                turnButtonOn(`${company.id}_OFF`);
                turnButtonOFF(`${company.id}_ON`);
            }
        }
    }

    function rebuildSlotList(){

        // Set the slot list to the default
        slotList = defaultSlotList;

        // Only get the top x amount
        slotList = slotList.slice(0,onlyTop);

        // filter out all the companies that we don't want
        slotList = slotList.filter((slot)=>{
            // Loop through the companies
            for(let company of companyList){
                // If this slot is for this company
                if(company.name == slot.company){
                    // If this company is active
                    if(company.isActive){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        })

        updateSlotCount();
    }

    function updateSlotCount(){
        // Write out number of slots
        dom.text("slotCount",slotList.length);
        dom.text("slotCountSettings",slotList.length);

        // Write out number of disabled slots
        dom.text("disabled",(defaultSlotList.length - slotList.length) + disabledList.length);
        dom.text("disabledSlotCountSettings",(defaultSlotList.length - slotList.length) + disabledList.length);
    }

    function toggleAllCompany(isOn){
        for(let company of companyList){
            company.isActive = isOn;
        }
        rebuildSlotList();
        updateSettingsUI();
        updateSlotCount();
    }

    function openOverlay(){
        updateSettingsUI();
        animate.fadeIn("popup");
    }

    function closeOverlay(){
        animate.fadeOut("popup");
    }

    function turnButtonOn(id){
        new dom.builder(id).style("opacity","1.0");
        new dom.builder(id).style("pointer-events","none");
    }

    function turnButtonOFF(id){
        new dom.builder(id).style("opacity","0.2");
        new dom.builder(id).style("pointer-events","all");
    }

    return{
        loadFile,
        randomSlot,
        updateSettingsUI,
        openOverlay,
        closeOverlay,
        toggleAllCompany,
        getSlotArray: function(){return slotList}
    }
}();



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}