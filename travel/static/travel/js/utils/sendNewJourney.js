import getCSRFCookie from "./csrfHandler.js";


function normalizeMessage(message) {
  if (!message) {
    return 'An unknown error occurred.';
  }
  if (typeof message === 'string') {
    return message;
  }
  return Object.values(message).flat().join(' ');
}

/**
 * Sends a new journey to the API for creation.
 *
 * Signals failure by throwing, never by returning a status object,
 * so callers must wrap this call in try/catch.
 *
 * @param {Object} journeyData Payload for the new journey. Its `date` must be a
 *                             timezone-free wall-clock string (YYYY-MM-DDTHH:MM:SS).
 * @returns {Promise<Object>} The journey created by the API.
 * @throws {Error} On network failure, a non-JSON response, or a rejection from
 *                 the API (success: false). The error message will be normalized to a string.
 */
export async function sendNewJourney(journeyData) {
    const response = await fetch('/api/travel', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(journeyData),
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(normalizeMessage(data.message));
    }

    return data.journey; // Return the newly created journey data
}

