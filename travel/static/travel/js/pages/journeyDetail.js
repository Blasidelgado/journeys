import getCSRFCookie from "../utils/csrfHandler.js";
import fetchData from "../utils/fetchData.js";
import { parseJourney } from "../utils/parseJourneys.js";

export default async function journeyDetail(journey_id, navigateTo, appState) {
  const container = document.createElement('section');

  if (!appState.sessionStatus) {
    navigateTo('/login');
    return container;
  }

  const response = await fetchData(`/api/travel/${journey_id}/`);
  if (response.success) {
    const journey = response.journey

    const journeyArt = parseJourney(journey, navigateTo);
    
    const driverStatus = isDriver(journey.driver, appState.username);
    const passengerStatus = isPassenger(journey.passengers, appState.userId);
    
    const actionBtn = journeyArt.querySelector('.action-btn');

    // If journey is not active, do not display action button
    if (!journey.isActive) {
      journeyArt.querySelector('.card-body').removeChild(actionBtn);
    } else {
      defineJourney();
    }
    container.appendChild(journeyArt);
    
    return container;


    /**
     * Handler function to attach events to the action button
     * 
     * 
     */
    function defineJourney() {
        if (driverStatus) {
            actionBtn.innerText = 'Cancel journey';
            actionBtn.onclick = async () => cancelJourney(journey.id, navigateTo);
        }
        else if (passengerStatus) {
            actionBtn.innerText = 'Leave';
            actionBtn.onclick = async () => updateJourney(journey.id, navigateTo);
        }
        else {
            actionBtn.innerText = 'Join';
            actionBtn.onclick = async () => updateJourney(journey.id, navigateTo);
        }
    }
  }
  else if (response.message === "User not authenticated") {
    navigateTo('/login');
    return container;
  }
  else {
    console.error(response.message);
    container.innerHTML = `<p class="alert alert-danger">Could not load this journey</p>`;
    return container;
  }
}

/**
 * Function to parse journey objects into HTML Elements
 * @param {object[]} journeys  
 * @returns {HTMLElement[]}
 */
export function parseJourneys(journeys, navigateTo) {
    return journeys.map(journey => parseJourney(journey, navigateTo));
}

/**
 * Function to change the passengers status
 * @param {number} journeyId
 * @param {function} navigateTo Function to navigate to a different page
 */
async function updateJourney(journeyId, navigateTo) {
        const action = {'action': 'update'}
        const response = await fetch(`/api/travel/${journeyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(action)
      });
      const data = await response.json();

      if (data.success) {
        // Take user back to /userJourneys page
        navigateTo('/userJourneys');
      } else {
        console.error(data.message);
      }
}

/**
 * Function to cancel a journey
 * @param {number} journeyId 
 * @param {function} navigateTo Function to navigate to a different page
 */
async function cancelJourney(journeyId, navigateTo) {
    const action = {'action': 'cancel'}
    const response = await fetch(`/api/travel/${journeyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(action)
      });
      const data = await response.json();

      if (data.success) {
        // Take user back to /userJourneys page
        navigateTo('/userJourneys');
      } else {
        console.error(data.message);
      }
}

/**
 * Function to check if current user is a driver of a journey
 * @param {string} driver Driver's username 
 * @param {string} username Current user's username
 * @returns {boolean} 
 */
export function isDriver(driver, username) {
    return driver === username
}

/**
 * Function to check if current is passenger of a journey
 * @param {number[]} passengers Passengers' userIds
 * @param {number} userId Current user's userId
 * @returns {boolean}
 */
export function isPassenger(passengers, userId) {
    const findUser = passengers.find(id => id === userId)
    return !!findUser
}
