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