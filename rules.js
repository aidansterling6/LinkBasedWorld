class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    re_create() {
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {

    re_create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        
        if(locationData.Choices.length > 0) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                choice.Parent = key;
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("descend")
        }
    }

    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices.length > 0) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                choice.Parent = key;
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("descend")
        }
    }

    handleChoice(choice) {
        if(choice) {
            var bKey = choice.Target.indexOf("_key") !== -1 && choice.Target.indexOf("_key") === choice.Target.length - 4;
            if(bKey){
                var tmpTarget = choice.Target.substring(0, choice.Target.length - 4);
                if(!Engine.keys.includes(tmpTarget)){
                    Engine.keys.push(tmpTarget);
                }
                while(this.engine.actionsContainer.firstChild) {
                    this.engine.actionsContainer.removeChild(this.engine.actionsContainer.firstChild)
                }
                this.engine.re_gotoScene(Location, choice.Parent);
                
            } else {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
    re_create() {
    }
}

Engine.load(Start, 'myStory.json');