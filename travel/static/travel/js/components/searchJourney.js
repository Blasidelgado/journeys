import fetchData from "../utils/fetchData.js";
import { parseJourneys } from "../utils/parseJourneys.js";
import pageButtons from "./pageButtons.js";

/**
 * 
 * Function to query journeys selecting cities
 * 
 */
export default async function searchJourneyPage(navigateTo) {
    const container = document.createElement("section");
    container.innerHTML = '<h1 class="h1 text-center">Please select your origin and destination city</h1>'

    const formContainer = document.createElement('section');
    const journeysContainer = document.createElement('section');

    // Fill in the query form
    formContainer.innerHTML = `
    <div class="input-group mb-3">
        <label class="input-group-text" for="origin">Origin</label>
        <select class="form-select select-city" id="origin">
            <option selected hidden disabled>Select city</option>
        </select>
    </div>

    <div class="input-group mb-5">
        <select class="form-select select-city" id="destination">
            <option selected hidden disabled>Select city</option>
        </select>
        <label class="input-group-text" for="destination">Destination</label>
    </div>

    <div class="input-group mb-3 d-flex justify-content-center">
        <button id="search" class="btn btn-primary py-3 px-5" type="button"><strong fs-2 text>Search</strong></button>
    </div>
    `

    formContainer.classList = "selectCityForm";

    container.appendChild(formContainer);
    container.appendChild(journeysContainer)

    // Populate select with cities
    const response = await fetchData('api/cities');
    if (response.success) {
        const selects = formContainer.querySelectorAll('.select-city');
        
        selects.forEach(select => {
            response.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = option.innerText = city;
                select.appendChild(option);
            });
        });
    } else {
        console.log(response.message);
        journeysContainer.innerHTML = '<h2>Something went wrong, please reload the page</h2>';
    }
    
    // Make button do a get request to get query cities
    const btn = formContainer.querySelector('#search');

    // Capture the changes and update state
    const selectedOrigin = formContainer.querySelector('#origin');
    const selectedDestination = formContainer.querySelector('#destination');

    btn.onclick = async () => showJourneys(1, selectedOrigin.value, selectedDestination.value);        

    return container;

    
    async function showJourneys(page, origin, destination) {
        journeysContainer.innerHTML = null;

        // Nav element to navigate through pages
        const navBtns = pageButtons();
        
        // Fetch journeys that match queried data
        const response = await fetchData(`api/travel/${origin}/${destination}?page=${page}`);

        if (response.success) {
            const {journeys, hasNext, hasPrev} = response;
            const info = parseJourneys(journeys, navigateTo);
            if (info.length > 0) {
                // Fill container with journeys
                info.forEach(elem => journeysContainer.appendChild(elem));
                

                // Add corresponding action to journey buttons
                journeysContainer.querySelectorAll('.action-btn').forEach(async btn => {
                    btn.onclick = () => navigateTo('/journey', btn.dataset.id) 
                })

                // Attach event listener to prev and next buttons
                const prevBtn = navBtns.querySelector('#prevPage')
                const nextBtn = navBtns.querySelector('#nextPage')
                
                if (!hasPrev) prevBtn.setAttribute('disabled', hasPrev);
                if (!hasNext) nextBtn.setAttribute('disabled', hasNext);
    
                prevBtn.onclick = () => showJourneys(page - 1, origin, destination);
                nextBtn.onclick = () => showJourneys(page + 1, origin, destination);
                journeysContainer.appendChild(navBtns);
            } else {
                journeysContainer.innerHTML = '<p class="text-center">Could not find any journeys</p>'
            }
        } else {
            console.error(response.message);
        }
    }
}
