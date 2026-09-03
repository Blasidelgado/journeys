export default function footerComponent() {
    const footer = document.createElement('div');
    footer.classList = 'bg-body-tertiary p-2';

    footer.innerHTML = `
          <p id="rights" class="text-center bg-body-tertiary p-3 mb-0" aria-label="Copyright">
            Journeys <span id="year">${getYear()}</span>. Made by Blas Ignacio Delgado. For CS50 Web Programming Harvard University.
          </p>
    `

    function getYear() {
      return new Date().getFullYear();
    }

    return footer;
}