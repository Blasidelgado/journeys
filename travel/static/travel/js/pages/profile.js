import getCSRFCookie from "../utils/csrfHandler.js";
import fetchData from "../utils/fetchData.js";

export default async function profilePage(navigateTo, user) {

  // State variables
  let isEditing = false;
  let isEditable = false;

  // Root element from page
  const pageContainer = document.createElement("section");

  pageContainer.innerHTML = `
  <section class="main-content">
  <div class="container-fluid mt--7">
    <div class="row">
      <div class="col-xl-8 order-xl-1">
        <div class="card bg-secondary shadow">
          <div class="card-header bg-white border-0">
            <div class="row align-items-center">
              <div class="col-8">
                <h3 class="mb-0">Profile ${user}</h3>
              </div>
            </div>
          </div>
          <div class="card-body">
            <form>
              <h6 class="heading-small text-muted mb-4">
                User information
              </h6>
              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="form-group focused">
                      <label
                        class="form-control-label"
                        for="first_name"
                        >First name</label
                      >
                      <input
                        type="text"
                        id="first_name"
                        class="form-control form-control-alternative"
                        name="first_name"
                        placeholder="First name"
                        value=""
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group focused">
                      <label
                        class="form-control-label"
                        for="last_name"
                        >Last name</label
                      >
                      <input
                        type="text"
                        id="last_name"
                        class="form-control form-control-alternative"
                        name="last_name"
                        placeholder="Last name"
                        value=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <!-- Travel information -->
              <h6 class="heading-small text-muted mb-4">
                Travel information
              </h6>
              <div class="pl-lg-4">
                <!-- License information -->
                <div class="row my-2">
                  <div class="col-md-6">
                    <div class="form-group focused">
                      <label class="form-control-label" for="license"
                        >Driver License
                      </label>
                      <input
                        id="license"
                        class="form-control form-control-alternative"
                        name="license"
                        placeholder="Driver license"
                        value=""
                        type="text"
                        />
                    </div>
                  </div>
                </div>
                <!-- Car information -->
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group focused">
                      <label class="form-control-label" for="brand"
                        >Car brand
                      </label>
                      <input
                        type="text"
                        id="brand"
                        class="form-control form-control-alternative"
                        name="brand"
                        placeholder="Brand"
                        value=""
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group focused">
                      <label class="form-control-label" for="model"
                        >Car model
                      </label>
                      <input
                        type="text"
                        id="model"
                        class="form-control form-control-alternative"
                        name="model"
                        placeholder="Model"
                        value=""
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <label class="form-control-label" for="plate_number"
                        >Plate number
                      </label>
                      <input
                        type="text"
                        id="plate_number"
                        class="form-control form-control-alternative"
                        name="plate_number"
                        placeholder="Plate number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <!-- Description -->
              <h6 class="heading-small text-muted mb-4">About me</h6>
              <div class="pl-lg-4">
                <div class="form-group focused">
                  <label for="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    class="form-control form-control-alternative"
                    name="description"
                    placeholder="A few words about you ..."
                  >
                  </textarea>
                </div>
              </div>
              <div id="control-btns" class="col-4 text-right">
                <button id="submit-profile" class="btn btn-primary my-3" type="submit">
                  Save changes
                </button>
                <button id="edit-profile" class="btn btn-primary my-3" type="button">
                  Edit profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      </div>
      </section>
      `;

  // Toggle status
  const editBtn = pageContainer.querySelector("#edit-profile");
  const submitBtn = pageContainer.querySelector("#submit-profile");
  const inputs = pageContainer.querySelectorAll("input");
  const textarea = pageContainer.querySelector("textarea");

  // Fetch user data and fill user profile information
  fetchandUpdate(user);

  // Set page event listeners
  editBtn.onclick = () => {
    setIsEditing();
    updateView();
  };

  // Edit profile event handler
  pageContainer.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    // JSON object to send
    const form = e.target;
    const userData = {};
    // Loop through form elements
    for (const element of form.elements) {
      // Check if the element has a name and is not a button
      if (element.name && element.type !== "submit") {
        // Add element name and value to the formData object
        userData[element.name] = element.value;
      }
    }
    // Make the request and parse response
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      setIsEditing();
      if (data.success) {
        updateData(data.user, data.isEditable);
      } else {
        fetchandUpdate(user);
        }
    } catch (error) {
      console.error("An error has ocurred:", error);
    }
  });

  return pageContainer;


  async function fetchandUpdate(username) {
    const fetchedData = await fetchData(`/api/users/${username}`);
    if (fetchedData.success) {
      updateData(fetchedData.user, fetchedData.isEditable);
    } else {
      pageContainer.innerHTML = "<h1>Something went wrong. Please try again.</h1>";
    }
  }

  function updateData(userData, editable) {
    for (const [key, value] of Object.entries(userData)) {
      if (key === "car") {
        for (const [carKey, carValue] of Object.entries(value)) {
          const target = pageContainer.querySelector(`#${carKey}`);
          if (target) {
            target.value = carValue ? carValue : null;
          }
        }
      }
      const target = pageContainer.querySelector(`#${key}`);
      if (target) {
        target.value = value ? value : null;
      }
    }
    isEditable = editable;
    updateView();
  }

  function setIsEditing() {
    isEditing = !isEditing;
  }

  function updateView() {
    inputs.forEach((input) => (input.disabled = !isEditing));
    textarea.disabled = !isEditing;
    if (isEditable) {
      editBtn.style.display = isEditing ? "none" : "block";
      submitBtn.style.display = isEditing ? "block" : "none";
    } else {
      pageContainer.querySelector("#control-btns").style.display = "none";
      inputs.forEach(input => input.placeholder = '');
      textarea.placeholder = '';
    }
  }
}
