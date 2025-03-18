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
let plot_id = 0;

function addOnclicks() {
    var elements = document.getElementsByClassName("grid_item")
    for (var i = 0; i < elements.length; i++){
        elements[i].onclick = function(){
            if (document.querySelector(`[data-somevalue="${this.dataset.somevalue}"]`).classList.contains("planted")){
                document.getElementById("plant_actions").classList.add("show");
            } else{
                document.getElementById("create_plant").classList.add("show");
                plot_id = this.dataset.somevalue;
            }
        }
    }
}
addOnclicks()

function createPlant(){
    document.getElementById("create_plant").classList.remove("show");
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

    //localStorage.setItem(plot_id, plant_obj);

    document.querySelector(`[data-somevalue="${plot_id}"]`).classList.add("planted");
}

document.getElementById("create_plant_submit").onclick = () => {createPlant()}
document.getElementById("create_plant_exit").onclick = () => {document.getElementById("create_plant").classList.remove("show")}
document.getElementById("plant_actions_exit").onclick = () => {document.getElementById("plant_actions").classList.remove("show")}
document.getElementById("delete_confirm_exit").onclick = () => {document.getElementById("delete_confirm").classList.remove("show")}
document.getElementById("delete_plant_btn").onclick = function() {
    document.getElementById("delete_confirm").classList.add("show");
    document.getElementById("plant_actions").classList.remove("show");
}

function handleDelete() {

}