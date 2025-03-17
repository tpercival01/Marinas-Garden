

document.getElementById("welcome_window_button").onclick = function getName(){
    var name = document.getElementById("welcome_window_input").value;
    localStorage.setItem("name", name)

    if (name.length > 0) {
        document.getElementById("welcome_window").classList.remove("show");
    }
}

document.getElementById("instructions_window_button").onclick = function instructions(){
    var temp = document.getElementById("instructions");

    if (temp.classList.contains("show")){
        temp.classList.remove("show");
    }
}

function addOnclicks() {
    var elements = document.getElementsByClassName("grid_item")
    for (var i = 0; i < elements.length; i++){
        elements[i].onclick = function(){createPlant(this.dataset.somevalue)}
    }
}
addOnclicks()

function createPlant(plot_id){
    document.getElementById("create_plant").classList.add("show");
}