import Step from './Step.js';
import fetchData from '../utils/fetchData.js';
import { sendNewJourney } from '../utils/sendNewJourney.js';

export default class JourneyForm {
  constructor(container, navigateTo) {
    this.container = container;
    this.navigateTo = navigateTo;
    this.newJourneyData = {
      date: null,
      origin: null,
      destination: null,
      available_seats: null,
      seat_price: null,
    };
    this.steps = [];
    this.currentStep = 0;

    this.init();
  }

  async init() {
    console.log('Initializing JourneyForm...');
    await this.populateTime();
    await this.populateCities();

    // Dynamically add buttons if they don't exist
    if (!this.container.querySelector('.wizard-buttons')) {
      const buttonsHTML = `
        <div class="wizard-buttons">
          <button id="prevBtn" disabled>Previous</button>
          <button id="nextBtn">Next</button>
        </div>
      `;
      this.container.insertAdjacentHTML('beforeend', buttonsHTML);
    }

    this.initSteps();
    this.showStep(this.currentStep);
  }

  async populateTime() {
    const hourSelect = this.container.querySelector('#travelHour');
    const minuteSelect = this.container.querySelector('#travelMinutes');
  
    // Populate hours in 12-hour US format with AM/PM
    const periods = ['AM', 'PM'];
    for (const period of periods) {
      for (let hour = 0; hour < 12; hour++) {
        const displayHour = hour === 0 ? 12 : hour; // 0 becomes 12 for 12-hour format
        const option = document.createElement('option');
        option.value = `${displayHour} ${period}`;
        option.textContent = `${displayHour} ${period}`;
        hourSelect.appendChild(option);
      }
    }
  
    // Populate minutes in increments of 15
    for (let minute = 0; minute < 60; minute += 15) {
      const option = document.createElement('option');
      option.value = minute.toString().padStart(2, '0'); // Ensure 2-digit format
      option.textContent = minute.toString().padStart(2, '0');
      minuteSelect.appendChild(option);
    }
  }

  async populateCities() {
    const response = await fetchData('api/cities');
    if (response.success) {
      const selects = this.container.querySelectorAll('.select-city');
      selects.forEach((select) => {
        response.cities.forEach((city) => {
          const option = document.createElement('option');
          option.value = option.innerText = city;
          select.appendChild(option);
        });
      });
    } else {
      console.error(response.message);
      this.container.innerHTML = '<h2>Something went wrong, please reload the page</h2>';
    }
  }

  initSteps() {
    const stepElements = this.container.querySelectorAll('.step');
    if (stepElements.length === 0) {
      console.error('No steps found in the DOM.');
      return;
    }

    stepElements.forEach((stepElement, index) => {
      const step = new Step(stepElement, index, this);
      this.steps.push(step);
    });

    this.prevBtn = this.container.querySelector('#prevBtn');
    this.nextBtn = this.container.querySelector('#nextBtn');

    if (!this.prevBtn || !this.nextBtn) {
      console.error('Previous or Next button not found in the DOM.');
      return;
    }

    this.prevBtn.addEventListener('click', () => this.prevStep());
    this.nextBtn.addEventListener('click', () => this.nextStep());
  }

  showStep(stepIndex) {
    const step = this.steps[stepIndex];
    if (!step) {
      console.error(`Step at index ${stepIndex} does not exist.`);
      return;
    }

    this.steps.forEach((step) => step.hide());
    step.show();

    this.prevBtn.disabled = stepIndex === 0;
    this.nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finish' : 'Next';
  }

  async nextStep() {
    const currentStep = this.steps[this.currentStep];

    if (!currentStep.validate()) {
      return; // Validation failed, do not proceed to the next step
    }

    if (this.currentStep === this.steps.length - 1) {
      await this.submit();
    } else {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  async submit() {
    try {
      const journey = await sendNewJourney(this.newJourneyData);
      this.navigateTo('/journey', journey.id);
    } catch (error) {
      console.error('Error submitting journey:', error);
      this.steps[this.currentStep].showError(error.message);
    }
  }
}