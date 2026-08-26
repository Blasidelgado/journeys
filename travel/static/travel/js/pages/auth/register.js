import getCSRFCookie from "../../utils/csrfHandler.js";

export default function registerPage(navigateTo) {
    const formContainer = document.createElement('section');
    const registrationForm = document.createElement('form');

    registrationForm.innerHTML = `
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-9 col-xl-8">
                    <div class="card auth-bg text-white">
                        <div class="card-body p-5 text-center">
                            <fieldset class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Register</h2>
                                <legend class="text-white-50 mb-5">Please enter your information below!</legend>
                                <div class="form-outline form-white mb-4">
                                    <input type="text" id="username" class="form-control form-control-lg" name="username" />
                                    <label class="form-label" for="username">Username</label>
                                </div>
                                <div class="form-outline form-white mb-4">
                                    <input type="text" id="first-name" class="form-control form-control-lg" name="firstName" />
                                    <label class="form-label" for="first-name">First Name</label>
                                </div>
                                <div class="form-outline form-white mb-4">
                                    <input type="text" id="last-name" class="form-control form-control-lg" name="lastName" />
                                    <label class="form-label" for="last-name">Last Name</label>
                                </div>
                                <div class="form-outline form-white mb-4">
                                    <input type="password" id="password" class="form-control form-control-lg" name="password1" />
                                    <label class="form-label" for="password">Password</label>
                                </div>
                                <div class="form-outline form-white mb-4">
                                    <input type="password" id="confirm-password" class="form-control form-control-lg" name="password2" />
                                    <label class="form-label" for="confirm-password">Confirm Password</label>
                                </div>
                                <div id="validationLoginForm" aria-describedby="validationServerUsernameFeedback" class="invalid-feedback">
                                    Something went wrong. Please try again.
                                </div>        
                                <button class="btn btn-outline-light btn-lg px-5" type="submit">Register</button>  
                            </fieldset>
                            <p class="mb-0">
                                Already have an account? 
                                <a id="signin-btn" class="text-white-50 fw-bold">Sign in</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    formContainer.appendChild(registrationForm);

    // Handle register form submission
    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(registrationForm);

        try {
            const response = await fetch('api/users', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFCookie('csrftoken'),
                },
                body: formData,
            })
            const data = await response.json();

            if (data.success) {
                await navigateTo('/');
            } else {
                console.error('Error de registro:', data.message);
            }
        } catch(error) {
            console.error('Error de red:', error);
        }
    });

    // Sign in link should redirect to login page
    registrationForm.querySelector('#signin-btn').onclick = async () =>  await navigateTo('/login');

    return formContainer;
};
