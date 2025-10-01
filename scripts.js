let plot_id = 0;
let userdata = {};
// This will store the plant data for the timings and auto completing fields.

const plantData = [
  {
    name: "Monstera",
  },
  {
    name: "Spider",
  },
  {
    name: "Orchid",
  },
];


function generateGrid() {
  PLOT_COUNT = 15;

  const grid = document.getElementById("plantable_grid");
  grid.innerHTML = "";

  for (let i = 1; i <= PLOT_COUNT; i++) {
    const div = document.createElement("div");
    div.classList.add("grid_item", "empty");
    div.dataset.somevalue = i;
    grid.appendChild(div);
  }

  handlePlantClick();
}

window.onload = () => {
  /*
    userdata = {
        16: {
            id: "16",
            last_watered: "20/03/2025",
            name: "Esmerelda",
            plant_room: "Living Room",
            plant_stage: "Sprout",
            plant_start: "20/03/2025",
            plant_type: "Ficus"
        },
        2: {
            id: "2",
            last_watered: "20/03/2025",
            name: "Beatrice",
            plant_room: "Living Room",
            plant_stage: "Sprout",
            plant_start: "20/03/2025",
            plant_type: "Ficus"
        },
        20: {
            id: "20",
            last_watered: "20/03/2025",
            name: "Asmodeus",
            plant_room: "Living Room",
            plant_stage: "Mature",
            plant_start: "20/03/2025",
            plant_type: "Monstera"
        },
        10: {
            id: "10",
            last_watered: "20/03/2025",
            name: "Bartholomew",
            plant_room: "Living Room",
            plant_stage: "Mature",
            plant_start: "20/03/2025",
            plant_type: "Orchid"
        },
        5: {
            id: "5",
            last_watered: "20/03/2025",
            name: "Marina",
            plant_room: "Living Room",
            plant_stage: "Teen",
            plant_start: "20/03/2025",
            plant_type: "Monstera"
        },
        19: {
            id: "19",
            last_watered: "20/03/2025",
            name: "Thomas",
            plant_room: "Living Room",
            plant_stage: "Mature",
            plant_start: "20/03/2025",
            plant_type: "Spider"
        }
    }*/
  generateGrid();
  userdata = JSON.parse(localStorage.getItem("userdata"));
  if (userdata) {
    if (Object.keys(userdata).length > 0) {
      console.log("data found - loading data");
      handleSaveData(userdata);
      checkDate();
    } else {
      console.log("data found but empty - starting new");
      localStorage.setItem("userdata", JSON.stringify({}));
    }
  } else {
    console.log("no data found - starting new");
    localStorage.setItem("userdata", JSON.stringify({}));
  }
};

window.onresize = () => {
  const newCount = 15;
  if (newCount !== PLOT_COUNT) {
    PLOT_COUNT = newCount;
    generateGrid(PLOT_COUNT);
    handleSaveData(userdata);
  }
};

function handleSaveData(userdata) {
  console.log(userdata);
  if (userdata) {
    document.getElementById("welcome_window").classList.remove("show");
    document.getElementById("instructions").classList.remove("show");
  }
  for (const key in userdata) {
    if (userdata.hasOwnProperty(key)) {
      const user = userdata[key];

      var plant = document.querySelector(`[data-somevalue="${user.id}"]`);
      plant.setAttribute("data-type", user.plant_type);
      plant.setAttribute("data-stage", user.plant_stage);
      plant.classList.add("planted");
      plant.classList.remove("empty");
      plant.title = user.name;
    }
  }
}

// Shows the welcome window
// Asks for users name and stores it for future use.
// Will only be seen on first use of website.

document.getElementById("welcome_window_button").onclick = function getName() {
  var name = document.getElementById("welcome_window_input").value;
  localStorage.setItem("name", name);

  if (name.length > 0) {
    document.getElementById("welcome_window").classList.remove("show");
    document.getElementById("instructions").classList.add("show");
  }
};

// Same as above, except instructions window.
// Will show the first time then only when user clicks to open instructions.

document.getElementById("instructions_window_button").onclick =
  function instructions() {
    var temp = document.getElementById("instructions");

    if (temp.classList.contains("show")) {
      temp.classList.remove("show");
    }
  };

// Creates onclicks for all plots
// Opens window to create a plant and store it in localstorage.

function handlePlantClick() {
  var elements = document.getElementsByClassName("grid_item");
  for (var i = 0; i < elements.length; i++) {
    elements[i].onclick = function () {
      plot_id = this.dataset.somevalue;
      if (this.classList.contains("planted")) {
        document.getElementById("plant_actions").classList.add("show");
        const display = userdata[plot_id]["last_watered"].split("-").reverse().join("-");
        document.getElementById("last_watered_date").innerText = `Last watered: ${display}`;
      } else {
        openPlantWindow("create");
      }
    };
  }
}
handlePlantClick();

function formatDateForInput(d = new Date()){
  return d.toISOString().split("T")[0];
}

function openPlantWindow(mode) {
  const window = document.getElementById("plant_container");
  const title = document.getElementById("plant_title");
  const submitButton = document.getElementById("plant_submit");
  populateDropDown();
  populateDropDownStage();

  if (mode === "create") {
    title.innerText = "Create your plant!";
    submitButton.innerText = "Create!";

    document.getElementById("plant_name").value = "";
    document.getElementById("plant_type").value = "";
    document.getElementById("last_watered").value = "";
    document.getElementById("plant_start").value = "";
    document.getElementById("plant_room").value = "";
    document.getElementById("plant_stage").value = "";

    window.classList.add("show");
    window.classList.add("create");
  } else {
    title.innerText = "Edit your plant!";
    submitButton.innerText = "Save Changes!";

    var temp_obj = userdata[plot_id];

    document.getElementById("plant_name").value = temp_obj["name"] || "";
    document.getElementById("plant_type").value = temp_obj["plant_type"] || "";
    document.getElementById("last_watered").value =
      temp_obj["last_watered"] || "";
    document.getElementById("plant_start").value =
      temp_obj["plant_start"] || "";
    document.getElementById("plant_room").value = temp_obj["plant_room"] || "";
    document.getElementById("plant_stage").value =
      temp_obj["plant_stage"] || "";

    window.classList.add("show");
    window.classList.add("edit");
  }
}

function populateDropDown() {
  const selectElement = document.getElementById("plant_type");
  if (!selectElement) return;

  selectElement.options.length = 1;

  plantData.forEach((element) => {
    const option = document.createElement("option");
    option.value = element.name;
    option.textContent = element.name;
    selectElement.appendChild(option);
  });
}

function populateDropDownStage() {
  const selectElementStage = document.getElementById("plant_stage");
  if (!selectElementStage) return;

  selectElementStage.options.length = 1;

  const stages = ["Sprout", "Teen", "Mature"];

  stages.forEach((element) => {
    const optionStage = document.createElement("option");
    optionStage.value = element;
    optionStage.textContent = element;
    selectElementStage.appendChild(optionStage);
  });
}

function createPlant() {
  document.getElementById("plant_container").classList.remove("show");
  const plant_obj = {
    id: plot_id,
    name: document.getElementById("plant_name").value,
    plant_type: document.getElementById("plant_type").value,
    last_watered: document.getElementById("last_watered").value,
    plant_start: document.getElementById("plant_start").value,
    plant_room: document.getElementById("plant_room").value,
    plant_stage: document.getElementById("plant_stage").value,
  };

  document.getElementById("plant_name").value = "";
  document.getElementById("plant_type").value = "";
  document.getElementById("last_watered").value = "";
  document.getElementById("plant_start").value = "";
  document.getElementById("plant_room").value = "";
  document.getElementById("plant_stage").value = "";

  userdata[plot_id] = plant_obj;
  localStorage.setItem("userdata", JSON.stringify(userdata));

  var plant = document.querySelector(`[data-somevalue="${plot_id}"]`);
  plant.classList.add("planted");
  plant.classList.remove("empty");
  plant.title = plant_obj["name"];
  plant.setAttribute("data-type", plant_obj.plant_type);
  plant.setAttribute("data-stage", plant_obj.plant_stage);
}

// Mostly handles all of the various onclicks for windows showing and disappearing

document.getElementById("plant_submit").onclick = function () {
  var window = document.getElementById("plant_container");
  if (window.classList.contains("create")) {
    window.classList.remove("create");
    createPlant();
  } else {
    window.classList.remove("edit");
    editPlant();
  }
};

document.getElementById("plant_exit").onclick = () => {
  document.getElementById("plant_container").classList = "plant_bg";
};
document.getElementById("plant_actions_exit").onclick = () => {
  document.getElementById("plant_actions").classList = "plant_bg";
};
document.getElementById("delete_confirm_exit").onclick = () => {
  document.getElementById("delete_confirm").classList = "plant_bg";
};
document.getElementById("delete_plant_btn").onclick = function () {
  document.getElementById("delete_confirm").classList.add("show");
  document.getElementById("plant_actions").classList.remove("show");
};
document.getElementById("edit_plant_btn").onclick = function () {
  openPlantWindow("edit");
  document.getElementById("plant_actions").classList.remove("show");
};

// handles plants being deleted
document.getElementById("confirm_delete").onclick = () => {
  handleDelete();
};

function handleDelete() {
  var plant = document.querySelector(`[data-somevalue="${plot_id}"]`);
  plant.classList.remove("planted");
  plant.classList.add("empty");
  plant.removeAttribute("data-stage");
  plant.removeAttribute("data-type");
  plant.title = "";

  document.getElementById("delete_confirm").classList.remove("show");
  document.getElementById("plant_container").classList = "plant_bg";

  if (userdata[plot_id]) {
    delete userdata[plot_id];
    localStorage.setItem("userdata", JSON.stringify(userdata));
  } else {
    console.log("nope");
  }
}

// handles editing plants

function editPlant() {
  document.getElementById("plant_container").classList.remove("show");

  const new_plant_obj = {
    id: plot_id,
    name: document.getElementById("plant_name").value,
    plant_type: document.getElementById("plant_type").value,
    last_watered: document.getElementById("last_watered").value,
    plant_start: document.getElementById("plant_start").value,
    plant_room: document.getElementById("plant_room").value,
    plant_stage: document.getElementById("plant_stage").value,
  };

  var plant = document.querySelector(`[data-somevalue="${plot_id}"]`);
  plant.setAttribute("data-stage", new_plant_obj.plant_stage);
  plant.setAttribute("data-type", new_plant_obj.plant_type);

  if (userdata[plot_id]) {
    userdata[plot_id] = new_plant_obj;
    localStorage.setItem("userdata", JSON.stringify(userdata));
  } else {
    console.log("nope");
  }
}

function checkDate() {
  const plantData = localStorage.getItem("userdata");
  if (!plantData) return;

  const plantsObject = JSON.parse(plantData);
  const plants = Object.values(plantsObject);

  var now = new Date().getTime();
  
  plants.forEach((plant) => {
    let lastWateredTime;
    var waitDays = 7;
    var timeThreshold = now - waitDays * 24 * 60 * 60 * 1000;
    timeThreshold = new Date(timeThreshold);

    if (plant.last_watered) {
      lastWateredTime = new Date(plant.last_watered);

      if (lastWateredTime < timeThreshold) {
        console.log(`Plant ${plant.name} is due for watering`);
        document
          .querySelector(`[data-somevalue="${plant.id}"]`)
          .classList.add("parched");
      } else {
        document.querySelector(`[data-somevalue="${plant.id}"]`)
        .classList.remove("parched");
        document.querySelector(`[data-somevalue="${plant.id}"]`)
        .classList.add("paused");
      }
    }
  });
}

document.getElementById("water_plant_btn").onclick = () => {
  document.getElementById("plant_actions").classList.remove("show");

  const currentPlant = document.querySelector(
    `[data-somevalue="${[plot_id]}"]`
  );
  currentPlant.classList.add("paused");
  currentPlant.classList.remove("parched");

  if (userdata[plot_id]) {
    var temp = userdata[plot_id];
    temp.last_watered = formatDateForInput(new Date());
    localStorage.setItem("userdata", JSON.stringify(userdata));
  }
};

document.getElementById("water_all_button").onclick = () => {
    for (let i = 1; i <= Object.keys(userdata).length; i++){
      const currentPlant = document.querySelector(
        `[data-somevalue="${[userdata[i]["id"]]}"]`
      );
      currentPlant.classList.add("paused");
      currentPlant.classList.remove("parched");

      if (userdata[plot_id]) {
        userdata[plot_id].last_watered = formatDateForInput(new Date());
        localStorage.setItem("userdata", JSON.stringify(userdata));
      }
    }
}

const intervalID = setInterval(checkDate, 60000);
// clearInterval(intervalID);