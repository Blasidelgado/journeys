import getCSRFCookie from "../../utils/csrfHandler.js";

export default async function loginPage(navigateTo) {

    const formContainer = document.createElement('section');
    const loginForm = document.createElement('form');

    loginForm.innerHTML = `
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-9 col-xl-8">
                    <div class="card auth-bg text-white">
                        <div class="card-body p-5 text-center">
                            <fieldset class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                <legend class="text-white-50 mb-5">Please enter your login and password!</legend>
                                <div class="form-outline form-white mb-4">
                                    <input type="text" id="username" class="form-control form-control-lg" name="username" />
                                    <label class="form-label" for="username">Username</label>
                                </div>
                                <div class="form-outline form-white mb-4">
                                    <input type="password" id="password" class="form-control form-control-lg" name="password" />
                                    <label class="form-label" for="password">Password</label>
                                </div>
                                <div id="validationLoginForm" aria-describedby="validationServerUsernameFeedback" class="invalid-feedback">
                                    Incorrect credentials.
                                </div>        
                                <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>  
                                </fieldset>
                                <p class="mb-0">
                                    Don't have an account? 
                                    <a id="signup-btn" class="text-white-50 fw-bold">Sign Up</a>
                                </p>
                            <div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    formContainer.appendChild(loginForm);

    // Submit handler function
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formFields = this.querySelectorAll('input');
        const errorMesssage = this.querySelector('#validationLoginForm');
        const formData = new FormData(loginForm);

        try {
            const response = await fetch('api/login', {
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
                formFields.forEach(input => input.classList.add('is-invalid'));
                errorMesssage.style.display = 'block';
            }
        } catch(error) {
            console.error('Network error:', error);
        }
    });

    // Sign up link should redirect to register page
    loginForm.querySelector('#signup-btn').onclick = async () =>  {
        await navigateTo('/register');
    }
    
    return formContainer;
};
