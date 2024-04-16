class Engine {

    static keys = [];


    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
        console.log(Engine.keys);
    }
    re_gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.re_create(data);
    }

    addChoice(action, data) {
        if(data){
            var bKey = data.Target.indexOf("_key") !== -1 && data.Target.indexOf("_key") === data.Target.length - 4;
            if(data.Type === "Button"){
                let button = this.actionsContainer.appendChild(document.createElement("button"));
                button.innerText = action;
                button.onclick = () => {
                    if(!bKey){
                        while(this.actionsContainer.firstChild) {
                            this.actionsContainer.removeChild(this.actionsContainer.firstChild)
                        }
                    }
                    this.scene.handleChoice(data);
                }
            }
            else if(data.Type === "LockedButton"){
                var bLocked = false;
                for(var i = 0; i < data.keys.length; i++){
                    if(!Engine.keys.includes(data.keys[i])){
                        bLocked = true;
                    }
                }
                var buttonTxt = action;
                //if(bLocked){
                //    buttonTxt = data.LockedText;
                //}
                let button = this.actionsContainer.appendChild(document.createElement("button"));
                button.innerText = buttonTxt;
                button.onclick = () => {
                    var bLocked = false;
                    var nkeys = 0;
                    for(var i = 0; i < data.keys.length; i++){
                        if(!Engine.keys.includes(data.keys[i])){
                            bLocked = true;
                        } else{
                            nkeys++;
                        }
                    }
                    if(!bLocked){
                        if(!bKey){
                            while(this.actionsContainer.firstChild) {
                                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
                            }
                        }
                        this.scene.handleChoice(data);
                    }
                    else{
                        this.show("&gt; "+data.LockedText[nkeys]);
                    }
                }
            }
            else if(data.Type === "Input"){
                let input = this.actionsContainer.appendChild(document.createElement("INPUT"));
                input.type = "text";
                input.maxLength = data.Code.length;
                input.style.width = "" + data.Code.length * 10 + "px";
                let button = this.actionsContainer.appendChild(document.createElement("button"));
                button.innerText = action;
                if(bKey){
                    var tmpTarget = data.Target.substring(0, data.Target.length - 4);
                }
                button.onclick = () => {
                    if(input.value.toLowerCase() === data.Code.toLowerCase()){
                        if(!bKey){
                            while(this.actionsContainer.firstChild) {
                                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
                            }
                        } else{
                            if(!Engine.keys.includes(tmpTarget)){
                                this.show("&gt; "+data.CorrectMessage);
                            } else{
                                this.show("&gt; "+data.CorrectMessage2);
                            }
                        }
                        this.scene.handleChoice(data);
                    }
                    else{
                        if(bKey && Engine.keys.includes(tmpTarget)){
                            this.show("&gt; "+data.CorrectMessage2);
                        } else {
                            this.show("&gt; "+data.WrongMessage);
                        }
                    }
                }
            } 
        } 
        else {
            let button = this.actionsContainer.appendChild(document.createElement("button"));
            button.innerText = action;
            button.onclick = () => {
                while(this.actionsContainer.firstChild) {
                    this.actionsContainer.removeChild(this.actionsContainer.firstChild)
                }
                this.scene.handleChoice(data);
            }
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}