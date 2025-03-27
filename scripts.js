window.onload = () => {
    var userdata = localStorage.getItem("userdata");

    if (userdata) {
        console.log(userdata)
        console.log("nice")
        handleSaveData(userdata)
    } else {
        localStorage.setItem("userdata", {})
        userdata = {}
    }
}

function handleSaveData(userdata){
    
}


var test = {};
let plot_id = 0;

// Shows the welcome window
// Asks for users name and stores it for future use.
// Will only be seen on first use of website.

document.getElementById("welcome_window_button").onclick = function getName(){
    var name = document.getElementById("welcome_window_input").value;
    localStorage.setItem("name", name)

    if (name.length > 0) {
        document.getElementById("welcome_window").classList.remove("show");
    }
}

// Same as above, except instructions window.
// Will show the first time then only when user clicks to open instructions.

document.getElementById("instructions_window_button").onclick = function instructions(){
    var temp = document.getElementById("instructions");

    if (temp.classList.contains("show")){
        temp.classList.remove("show");
    }
}

// Creates onclicks for all plots
// Opens window to create a plant and store it in localstorage.

function addOnclicks() {
    var elements = document.getElementsByClassName("grid_item")
    for (var i = 0; i < elements.length; i++){
        elements[i].onclick = function(){
            if (document.querySelector(`[data-somevalue="${this.dataset.somevalue}"]`).classList.contains("planted")){
                document.getElementById("plant_actions").classList.add("show");
                plot_id = this.dataset.somevalue;
            } else{
                plot_id = this.dataset.somevalue;
                openPlantWindow("create");
            }
        }
    }
}
addOnclicks()

function openPlantWindow(mode){
    const window = document.getElementById("plant_container");
    const title = document.getElementById("plant_title");
    const submitButton = document.getElementById("plant_submit");

    if (mode === "create"){
        title.innerText = "Create your plant!";
        submitButton.innerText = "Create!";

        document.getElementById("plant_name").value = ""
        document.getElementById("plant_type").value = ""
        document.getElementById("last_watered").value = ""
        document.getElementById("plant_start").value = ""
        document.getElementById("plant_room").value = ""
        document.getElementById("plant_stage").value = ""

        window.classList.add("show");
        window.classList.add("create");
    } else{
        title.innerText = "Edit your plant!"
        submitButton.innerText = "Save Changes!"

        var temp_obj = test[plot_id];

        document.getElementById("plant_name").value = temp_obj["name"] || ""
        document.getElementById("plant_type").value = temp_obj["plant_type"] || ""
        document.getElementById("last_watered").value = temp_obj["last_watered"] || ""
        document.getElementById("plant_start").value = temp_obj["plant_start"] || ""
        document.getElementById("plant_room").value = temp_obj["plant_room"] || ""
        document.getElementById("plant_stage").value = temp_obj["plant_stage"] || ""

        window.classList.add("show");
        window.classList.add("edit");
    }
}

function createPlant(){
    document.getElementById("plant_container").classList.remove("show");
    const plant_obj = {
        id: plot_id,
        name: document.getElementById("plant_name").value,
        plant_type: document.getElementById("plant_type").value,
        last_watered: document.getElementById("last_watered").value,
        plant_start: document.getElementById("plant_start").value,
        plant_room: document.getElementById("plant_room").value,
        plant_stage: document.getElementById("plant_stage").value
    }

    document.getElementById("plant_name").value = ""
    document.getElementById("plant_type").value = ""
    document.getElementById("last_watered").value = ""
    document.getElementById("plant_start").value = ""
    document.getElementById("plant_room").value = ""
    document.getElementById("plant_stage").value = ""

    console.log(plant_obj);
    test[plot_id] = plant_obj;
    console.log(test);

    //localStorage.setItem(plot_id, plant_obj);

    document.querySelector(`[data-somevalue="${plot_id}"]`).classList.add("planted");
    document.querySelector(`[data-somevalue="${plot_id}"]`).title = plant_obj["name"];
}

// Mostly handles all of the various onclicks for windows showing and disappearing

document.getElementById("plant_submit").onclick = function(){
    var window = document.getElementById("plant_container");
    if (window.classList.contains("create")){
        window.classList.remove("create")
        createPlant()
    } else {
        window.classList.remove("edit");
        editPlant()
    }
}

document.getElementById("plant_exit").onclick = () => {document.getElementById("plant_container").classList = "plant_bg"}
document.getElementById("plant_actions_exit").onclick = () => {document.getElementById("plant_actions").classList = "plant_bg"}
document.getElementById("delete_confirm_exit").onclick = () => {document.getElementById("delete_confirm").classList = "plant_bg"}
document.getElementById("delete_plant_btn").onclick = function() {
    document.getElementById("delete_confirm").classList.add("show");
    document.getElementById("plant_actions").classList.remove("show");
}
document.getElementById("edit_plant_btn").onclick = function(){
    openPlantWindow("edit");
    document.getElementById("plant_actions").classList.remove("show");
}

// handles plants being deleted
document.getElementById("confirm_delete").onclick = () => {handleDelete()}

function handleDelete() {
    document.querySelector(`[data-somevalue="${plot_id}"]`).classList.remove("planted");
    document.getElementById("delete_confirm").classList.remove("show");
    document.getElementById("plant_container").classList = "plant_bg";

    if (test[plot_id]){
        delete test[plot_id]
    } else{
        console.log("nope")
    }
}

// handles editing plants

function editPlant(){
    document.getElementById("plant_container").classList.remove("show");

    const new_plant_obj = {
        id: plot_id,
        name: document.getElementById("plant_name").value,
        plant_type: document.getElementById("plant_type").value,
        last_watered: document.getElementById("last_watered").value,
        plant_start: document.getElementById("plant_start").value,
        plant_room: document.getElementById("plant_room").value,
        plant_stage: document.getElementById("plant_stage").value
    }

    if (test[plot_id]){
        test[plot_id] = new_plant_obj;
    } else{
        console.log("nope")
    }
}