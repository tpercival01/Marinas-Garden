// --- CONFIGURATION ---
const API_URL = "http://127.0.0.1:5000/api";
let plot_id = 0; // Stores the currently selected plot ID

// This is static data, so it can remain on the frontend
const plantData = [{ name: "Monstera" }, { name: "Spider" }, { name: "Orchid" }];

// --- API SERVICE LAYER ---
// A set of functions dedicated to communicating with our Flask backend.

async function getPlants() {
  try {
    const response = await fetch(`${API_URL}/plants`);
    if (!response.ok) throw new Error("Failed to fetch plants");
    return await response.json();
  } catch (error) {
    console.error("getPlants Error:", error);
    return []; // Return an empty array on failure
  }
}

async function createPlantAPI(plantObject) {
  try {
    const response = await fetch(`${API_URL}/plants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plantObject),
    });
    if (!response.ok) throw new Error("Failed to create plant");
    return await response.json();
  } catch (error) {
    console.error("createPlantAPI Error:", error);
  }
}

async function updatePlantAPI(plantId, plantObject) {
  try {
    const response = await fetch(`${API_URL}/plants/${plantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plantObject),
    });
    if (!response.ok) throw new Error("Failed to update plant");
    return await response.json();
  } catch (error) {
    console.error("updatePlantAPI Error:", error);
  }
}

async function deletePlantAPI(plantId) {
  try {
    const response = await fetch(`${API_URL}/plants/${plantId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete plant");
    return await response.json();
  } catch (error) {
    console.error("deletePlantAPI Error:", error);
  }
}

// --- UI RENDERING ---

function renderGarden(plants) {
  console.log("Rendering garden with data:", plants);
  // First, reset all plots to their empty state
  document.querySelectorAll(".grid_item.planted").forEach((plot) => {
    plot.classList.remove("planted", "parched");
    plot.classList.add("empty");
    plot.removeAttribute("data-type");
    plot.removeAttribute("data-stage");
    plot.title = "";
  });

  // Now, render the plants we received from the backend
  plants.forEach((plant) => {
    const plotElement = document.querySelector(
      `[data-somevalue="${plant.plot_id}"]`
    );
    if (plotElement) {
      plotElement.setAttribute("data-type", plant.plant_type);
      plotElement.setAttribute("data-stage", plant.plant_stage);
      plotElement.classList.add("planted");
      plotElement.classList.remove("empty");
      plotElement.title = plant.name;
    }
  });
  checkDate(plants); // Check watering status after rendering
}

// --- APPLICATION LOGIC ---

// Main function to start the application
async function initializeApp() {
  console.log("Initializing application...");
  const plants = await getPlants();
  renderGarden(plants);
  addOnclicks(); // Set up plot click handlers
}

// Creates onclicks for all plots
function addOnclicks() {
  document.querySelectorAll(".grid_item").forEach((element) => {
    element.onclick = function () {
      plot_id = this.dataset.somevalue; // Always set the current plot_id
      if (this.classList.contains("planted")) {
        document.getElementById("plant_actions").classList.add("show");
      } else {
        openPlantWindow("create");
      }
    };
  });
}

async function handleCreatePlant() {
  const plant_obj = {
    plot_id: plot_id,
    name: document.getElementById("plant_name").value,
    plant_type: document.getElementById("plant_type").value,
    last_watered: document.getElementById("last_watered").value,
    plant_start: document.getElementById("plant_start").value,
    plant_room: document.getElementById("plant_room").value,
    plant_stage: document.getElementById("plant_stage").value,
  };

  await createPlantAPI(plant_obj);
  document.getElementById("plant_container").classList.remove("show", "create");
  initializeApp(); // Reload the garden from the server to show the new plant
}

async function handleEditPlant() {
  const plants = await getPlants();
  const targetPlant = plants.find((p) => p.plot_id === plot_id);
  if (!targetPlant) return;

  const new_plant_obj = {
    name: document.getElementById("plant_name").value,
    plant_type: document.getElementById("plant_type").value,
    last_watered: document.getElementById("last_watered").value,
    plant_start: document.getElementById("plant_start").value,
    plant_room: document.getElementById("plant_room").value,
    plant_stage: document.getElementById("plant_stage").value,
  };

  await updatePlantAPI(targetPlant.id, new_plant_obj);
  document.getElementById("plant_container").classList.remove("show", "edit");
  initializeApp(); // Reload the garden to show changes
}

async function handleDelete() {
  const plants = await getPlants();
  const targetPlant = plants.find((p) => p.plot_id === plot_id);
  if (!targetPlant) return;

  await deletePlantAPI(targetPlant.id);
  document.getElementById("delete_confirm").classList.remove("show");
  initializeApp(); // Reload the garden
}

async function handleWaterPlant() {
  const plants = await getPlants();
  const targetPlant = plants.find((p) => p.plot_id === plot_id);
  if (!targetPlant) return;

  // Update only the last_watered field
  targetPlant.last_watered = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format is more standard

  await updatePlantAPI(targetPlant.id, targetPlant);
  document.getElementById("plant_actions").classList.remove("show");
  initializeApp(); // Reload the garden
}

// --- UI HELPER FUNCTIONS & EVENT LISTENERS ---

// This function remains mostly the same, but now operates on data passed to it
function checkDate(plants) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

  plants.forEach((plant) => {
    if (plant.last_watered) {
      const lastWateredDate = new Date(plant.last_watered);
      if (lastWateredDate <= sevenDaysAgo) {
        document
          .querySelector(`[data-somevalue="${plant.plot_id}"]`)
          .classList.add("parched");
      }
    }
  });
}

function openPlantWindow(mode) {
  const window = document.getElementById("plant_container");
  const title = document.getElementById("plant_title");
  const submitButton = document.getElementById("plant_submit");
  populateDropDown();
  populateDropDownStage();

  // Reset form and classes
  document.getElementById("plant_form").reset();
  window.className = "plant_bg";

  if (mode === "create") {
    title.innerText = "Create your plant!";
    submitButton.innerText = "Create!";
    window.classList.add("show", "create");
  } else {
    title.innerText = "Edit your plant!";
    submitButton.innerText = "Save Changes!";
    // We need to fetch the specific plant's data to populate the form
    getPlants().then((plants) => {
      const temp_obj = plants.find((p) => p.plot_id === plot_id);
      if (temp_obj) {
        document.getElementById("plant_name").value = temp_obj.name || "";
        document.getElementById("plant_type").value = temp_obj.plant_type || "";
        document.getElementById("last_watered").value =
          temp_obj.last_watered || "";
        document.getElementById("plant_start").value = temp_obj.plant_start || "";
        document.getElementById("plant_room").value = temp_obj.plant_room || "";
        document.getElementById("plant_stage").value = temp_obj.plant_stage || "";
      }
    });
    window.classList.add("show", "edit");
  }
}

// These functions are for UI and don't need to change
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

// --- INITIALIZE ---
// All event listeners are set up here
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();

  // Welcome/Instructions windows (no change needed)
  document.getElementById("welcome_window_button").onclick = function () {
    // ... your existing code
  };
  document.getElementById("instructions_window_button").onclick = function () {
    // ... your existing code
  };

  // Main form submission handler
  document.getElementById("plant_submit").onclick = function () {
    const window = document.getElementById("plant_container");
    if (window.classList.contains("create")) {
      handleCreatePlant();
    } else {
      handleEditPlant();
    }
  };

  // All other button clicks
  document.getElementById("plant_exit").onclick = () =>
    (document.getElementById("plant_container").className = "plant_bg");
  document.getElementById("plant_actions_exit").onclick = () =>
    (document.getElementById("plant_actions").className = "plant_bg");
  document.getElementById("delete_confirm_exit").onclick = () =>
    (document.getElementById("delete_confirm").className = "plant_bg");
  document.getElementById("delete_plant_btn").onclick = () => {
    document.getElementById("delete_confirm").classList.add("show");
    document.getElementById("plant_actions").classList.remove("show");
  };
  document.getElementById("edit_plant_btn").onclick = () => {
    openPlantWindow("edit");
    document.getElementById("plant_actions").classList.remove("show");
  };
  document.getElementById("confirm_delete").onclick = handleDelete;
  document.getElementById("water_plant_btn").onclick = handleWaterPlant;
});