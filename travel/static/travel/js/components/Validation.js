export default class Validation {

  static getMinJourneyDateTime() {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }
  
  static validateDate(date) {
    // Check if the date is provided
    if (!date) {
      return { valid: false, message: "Please select a valid journey day." };
    }

    // Check if the date is at least 1 day in advance
    const minDate = Validation.getMinJourneyDateTime().split('T')[0]; // Get the date part only
    if (date < minDate) return { valid: false, message: "The journey must be scheduled at least 1 day in advance." };
  
    // If all checks pass, return valid
    return { valid: true };
  }

  static validateTime(hourLabel, minutes, date) {
    if (!hourLabel || !minutes || !date) {
      return { valid: false, message: "Please select a valid time for the journey." };
    }

    const [rawHour, period] = hourLabel.split(" ");
    const hourInt = parseInt(rawHour, 10);
    let hour24Int;
    if (period === "PM" && hourInt < 12) {
      hour24Int = hourInt + 12;
    } else if (period === "AM" && hourInt === 12) {
      hour24Int = 0;
    } else {
      hour24Int = hourInt;
    }

    const hour24 = hour24Int.toString().padStart(2, '0');

    // Return the combined date and time in ISO format for further processing, without timezone conversion
    return { valid: true, date: `${date}T${hour24}:${minutes}:00` };
  }

  static validateCities(origin, destination) {
    if (!origin || !destination) return { valid: false, message: "Please select valid origin and destination cities." };
    if (origin === destination) return { valid: false, message: "Origin and destination cannot be the same." };
    return { valid: true };
  }

  static validateSeats(seats) {
    if (!seats || seats <= 0 || seats > 7) return { valid: false, message: "Please select a valid number of seats (1-7)." };
    return { valid: true };
  }

  static validatePrice(price) {
    if (!price || price <= 0 || price > 999) return { valid: false, message: "Please select a valid price (1-999)." };
    return { valid: true };
  }
}