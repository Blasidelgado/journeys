import JourneyForm from '../components/JourneyForm.js';

export default function newJourneyPage(navigateTo) {
  const container = document.createElement('div'); // Create a container for the page
  container.id = 'new-journey-container'; // Add an ID for styling or debugging
  container.innerHTML = `
    <section class="new-journey">
      <h1>Create a New Journey</h1>
      <div id="journey-form-container">
        <div class="journey-tab-container">
          <div class="tab">Step 1: Journey Day</div>
          <div class="tab">Step 2: Journey Time</div>
          <div class="tab">Step 3: Origin and Destination</div>
          <div class="tab">Step 4: Seats and Price</div>
          <div class="tab">Step 5: Summary</div>
        </div>
        <!-- Step 1: Journey Day -->
        <fieldset class="step">
          <legend>Journey Day</legend>
          <label for="journeyDay" class="form-label">Select a day:</label>
          <input id="journeyDay" type="date" class="form-control" aria-describedby="journey-day" placeholder="mm/dd/yyyy">
          <p id="journeyDayError" class="error-message" role="alert"></p>
        </fieldset>

        <!-- Step 2: Journey Time -->
        <fieldset class="step">
          <legend>Journey Time</legend>
          <label for="travelHour" class="form-label">Journey hour:</label>
          <select id="travelHour" class="form-control">
            <option value="" selected disabled hidden>Select an hour</option>
          </select>
          <label for="travelMinutes" class="form-label">Journey minutes:</label>
          <select id="travelMinutes" class="form-control">
            <option value="" selected disabled hidden>Select the minutes</option>
          </select>
          <small class="text-muted" id="journeyTimeNote" aria-live="polite">
            Note: The journey must be scheduled at least 24 hours in advance.
          </small>
          <p id="journeyTimeError" class="error-message" role="alert">Please select a valid time for the journey</p>
        </fieldset>

        <!-- Step 3: Origin and Destination -->
        <fieldset class="step">
          <legend>Journey Origin and Destination</legend>
          <label for="originCity" class="form-label">Origin:</label>
          <select id="originCity" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
            <option selected hidden disabled>Select city</option>
          </select>
          <label for="destinationCity" class="form-label">Destination:</label>
          <select id="destinationCity" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
            <option selected hidden disabled>Select city</option>
          </select>
          <p id="journeyCitiesError" class="error-message" role="alert">Please select valid origin and destination cities</p>
        </fieldset>

        <!-- Step 4: Seats and Price -->
        <fieldset class="step">
          <legend>Journey Seats and Price</legend>
          <label for="availableSeats" class="form-label">Available Seats:</label>
          <input id="availableSeats" type="number" min="0" max="7" class="form-control">
          <label for="seatPrice" class="form-label">Seat price:</label>
          <input id="seatPrice" type="number" min="0" max="999" class="form-control">
          <p id="journeySeatsError" class="error-message" role="alert">Please select valid seats count and price</p>
        </fieldset>

        <!-- Step 5: Summary -->
        <fieldset class="step">
          <legend>Summary</legend>
          <div id="summaryContent">
            <p><strong>Journey Date and Time:</strong> <span id="summaryJourneyDateTime"></span></p>
            <p><strong>Origin City:</strong> <span id="summaryOriginCity"></span></p>
            <p><strong>Destination City:</strong> <span id="summaryDestinationCity"></span></p>
            <p><strong>Available Seats:</strong> <span id="summaryAvailableSeats"></span></p>
            <p><strong>Seat Price:</strong> <span id="summarySeatPrice"></span></p>
          </div>
          <p id="summaryError" class="error-message" role="alert">Please review your inputs and try again.</p>
        </fieldset>
      </div>
    </section>
  `;

  const formContainer = container.querySelector('#journey-form-container');
  new JourneyForm(formContainer, navigateTo); // Initialize the JourneyForm inside the container

  return container; // Return the container to be appended
}