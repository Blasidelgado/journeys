import checkSessionStatus from "./handleSession.js";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

/**
 * 
 * @param {Object} journey 
 * @returns {HTMLElement} Journey
 */
export function parseJourney(journey, navigateTo) {
    const wrapper = document.createElement('article');
    wrapper.dataset.id = journey.id;
    wrapper.dataset.origin = journey.origin;
    wrapper.dataset.destination = journey.destination;
    wrapper.dataset.seats = journey.available_seats;

    wrapper.innerHTML = `
        <div class="card text-center">
            <div class="card-header">
                ${journey.origin} to ${journey.destination}
            </div>
            <div class="card-body ${journey.isActive? 'bg-light' : 'bg-danger'}">
                <h5 class="card-title">${parseDate(journey.date)}</h5>
                <p class="card-text">Driver: <span class="driver-profile">${journey.driver}</span></p>
                <p class="card-text">Seat price: ${formatPrice(journey.seat_price)}</p>
                <p class="card-text">Status: ${journey.isActive ? "active" : "cancelled"}</p>
                <btn data-id=${journey.id} type='button' class="action-btn btn btn-primary"></btn>
            </div>
            <div class="card-footer text-muted">
                ${journey.isActive ? `${journey.available_seats} available seats`: ''}
            </div>
        </div>
    `;

    wrapper.querySelector('.driver-profile').onclick = async () =>
                                                await checkSessionStatus() ? navigateTo('/profile', journey.driver)
                                                : navigateTo('/login')
    const actionBtn = wrapper.querySelector('.action-btn');

    actionBtn.innerText = 'See details';

    return wrapper;
}

/**
 * 
 * @param {Array} journeys  
 * @returns {Array} HTML Element journeys
 */
export function parseJourneys(journeys, navigateTo) {
    return journeys.map(journey => parseJourney(journey, navigateTo));
}

/**
 * 
 * @param {*} unformattedDate YYYY-MM-DDTHH:MM:SS
 * @returns {string} Formatted date - Example: 2:30 PM Jan 15, 2024
 */
export function parseDate(unformattedDate) {
    const [date, time] = unformattedDate.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minutes] = time.split(':');

    // Convert hour to 12-hour format with AM/PM
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12; // Convert 0 to 12 for midnight

    const formattedDate = `${hour12}:${minutes} ${period}, ${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;

    return formattedDate;
}

/**
 * 
 * @param {number} value 
 * @returns {string} Formatted price - Example: $10.00
 */
export function formatPrice(value) {
    return priceFormatter.format(value);
}