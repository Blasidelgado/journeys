import fetchData from "../utils/fetchData.js";

export default async function travelPage(navigateTo, appState) {
    const container = document.createElement("section");
    container.innerHTML = `
    <div class="py-lg-16 py-10 bg-gray-200">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-md-9 col-12">
                    <h2 class="display-4">Explore the World with Our Community</h2>
                    <p class="lead px-lg-12 mb-6">Embark on a journey of discovery with our vibrant community of travelers. Learning a new skill is hard work—our platform makes it easier for you to connect and share experiences.</p>
                    <div class="d-grid d-md-block">
                        <button id="travel-passenger" class="btn btn-primary mb-3 mb-md-0 mx-md-5">Search for Journeys</button>
                        <button id="travel-driver" class="btn btn-info">Start Your Journey</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    container.querySelector("#travel-passenger").onclick = async () => {
        const response = await fetchData("api/permissions");
        const { hasLicense } = response.permissions;
        if (hasLicense) {
            return navigateTo('/search-journey');
        } else {
          showIncompleteInfoModal('license');
        }
    };

    container.querySelector("#travel-driver").onclick = async () => {
      const response = await fetchData("api/permissions");
      const { hasLicense, hasCar } = response.permissions;
      if (!hasLicense) {
        showIncompleteInfoModal('license');
      } else if (!hasCar) {
        showIncompleteInfoModal('car');
      } else {
        return navigateTo('/new-journey');
      }
    };

    return container;

    function showIncompleteInfoModal(missingData) {
      const modalContent = document.createElement("div");
      modalContent.classList = "modal fade";
      modalContent.setAttribute("id", "myModal");
      let message;
      if (missingData === "license") {
        message = "Please add your driver license first.";
      } else {
        message = "Please complete your car information first.";
      }
    
      modalContent.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">${message}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="load-profile" type="button" class="btn btn-primary" data-bs-dismiss="modal">Go to profile</button>
                </div>
            </div>
        </div>
    `;
    
      modalContent.querySelector("#load-profile").onclick = () => {
          navigateTo('/profile', appState.username);
      }
    
      return new bootstrap.Modal(modalContent, {
        backdrop: "static",
        keyboard: true,
      }).show();
    }
}