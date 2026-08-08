import Validation from './Validation.js';

export default class Step {
  constructor(stepElement, index, form) {
    this.stepElement = stepElement;
    this.index = index;
    this.form = form;

    // Initialize the step (e.g., set default values for inputs)
    this.init();
  }

  init() {
    if (this.index === 0) {
      // Step 1: Journey Day - Set minimum date and placeholder
      const dateInput = this.stepElement.querySelector('#journeyDay');

      const minDate = Validation.getMinJourneyDateTime().split('T')[0]; // Get the minimum journey date (1 day in advance)
      dateInput.min = minDate;
      dateInput.placeholder = 'mm/dd/yyyy'; // Show placeholder instead of default value
      dateInput.value = ''; // Ensure no default value is selected
    }
  }

  show() {
    this.stepElement.classList.add('active');
    this.stepElement.style.display = 'block';
  }

  hide() {
    this.stepElement.classList.remove('active');
    this.stepElement.style.display = 'none';
  }

  validate() {
    let validationResult;

    switch (this.index) {
      case 0: // Step 1: Journey Day
        const dateInput = this.stepElement.querySelector('#journeyDay');
        validationResult = Validation.validateDate(dateInput.value);
        if (!validationResult.valid) {
          this.showError(validationResult.message);
          return false;
        }
        this.form.journeyDay = dateInput.value;
        break;

      case 1: // Step 2: Journey Time
        const hourInput = this.stepElement.querySelector('#travelHour');
        const minuteInput = this.stepElement.querySelector('#travelMinutes');
        validationResult = Validation.validateTime(hourInput.value, minuteInput.value, this.form.journeyDay);  
        if (!validationResult.valid) {
          this.showError(validationResult.message);
          return false;
        }
        this.form.newJourneyData.date = validationResult.date; // Update the date with the selected time
        break;

      case 2: // Step 3: Origin and Destination
        const originInput = this.stepElement.querySelector('#originCity');
        const destinationInput = this.stepElement.querySelector('#destinationCity');
        validationResult = Validation.validateCities(originInput.value, destinationInput.value);
        if (!validationResult.valid) {
          this.showError(validationResult.message);
          return false;
        }
        this.form.newJourneyData.origin = originInput.value;
        this.form.newJourneyData.destination = destinationInput.value;
        break;

      case 3: // Step 4: Seats and Price
        const seatsInput = this.stepElement.querySelector('#availableSeats');
        const priceInput = this.stepElement.querySelector('#seatPrice');
        validationResult = Validation.validateSeats(seatsInput.value);
        if (!validationResult.valid) {
          this.showError(validationResult.message);
          return false;
        }
        validationResult = Validation.validatePrice(priceInput.value);
        if (!validationResult.valid) {
          this.showError(validationResult.message);
          return false;
        }
        this.form.newJourneyData.available_seats = seatsInput.value;
        this.form.newJourneyData.seat_price = priceInput.value;
        break;

      default:
        break;
    }

    this.clearError();
    return true;
  }

  showError(message) {
    const errorElement = this.stepElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message; // Set the error message
      errorElement.style.visibility = 'visible'; // Make the error message visible
    }
  }

  clearError() {
    const errorElement = this.stepElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = ''; // Clear the error message
      errorElement.style.visibility = 'hidden'; // Hide the error message but keep its space
    }
  }
}