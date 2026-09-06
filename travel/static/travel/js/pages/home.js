export default async function homePage(sessionStatus, navigateTo) {
    const homeContainer = document.createElement('section');

    homeContainer.innerHTML = `
    <div id="hero-image">
        <div id="banner-content">
            <h1 id="hero-title">Travel with us!</h1>
            <p>Find your fit journeys</p>
        </div>
    </div>
    <div class="container my-5">
        <div class="row">
            <div class="col-lg-4 item-container">
                <div class="item">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="kirk-icon animated" role="img" aria-hidden="true" style="fill: var(--_1gzv7bhc);">
                        <g color="var(--_1gzv7bhc)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 11h-3.175L16.567 8.17c-.365-.82-1.23-1.348-2.181-1.348H7.615c-.952 0-1.817.527-2.182 1.348L4.175 11H3a1 1 0 00-1 1v4a1 1 0 001 1h1.55a2.5 2.5 0 004.9 0h5.1a2.5 2.5 0 004.9 0H21a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 3a2.5 2.5 0 00-2.45 2h-5.1a2.5 2.5 0 00-4.9 0H3v-4h18v4h-1.55A2.5 2.5 0 0017 14zm-5.5-3h5.23l-1.077-2.425c-.2-.448-.7-.754-1.267-.754H11.5v3.18zm-1-3.179v3.18H5.27l1.077-2.426c.2-.448.7-.754 1.268-.754H10.5zm-2 8.68a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 18A1.5 1.5 0 1017 15a1.5 1.5 0 000 3z" fill="currentColor"></path>
                        </g>
                    </svg>
                    <p>Discover the world in a unique way with our personalized travel system. Design your own routes, choose like-minded travel companions, and create unforgettable memories in destinations tailored just for you.</p>
                </div>
            </div>
            <div class="col-lg-4 item-container">
                <div class="item">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="kirk-icon animated" role="img" aria-hidden="true" style="fill: var(--_1gzv7bhc);">
                        <g color="var(--_1gzv7bhc)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 11h-3.175L16.567 8.17c-.365-.82-1.23-1.348-2.181-1.348H7.615c-.952 0-1.817.527-2.182 1.348L4.175 11H3a1 1 0 00-1 1v4a1 1 0 001 1h1.55a2.5 2.5 0 004.9 0h5.1a2.5 2.5 0 004.9 0H21a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 3a2.5 2.5 0 00-2.45 2h-5.1a2.5 2.5 0 00-4.9 0H3v-4h18v4h-1.55A2.5 2.5 0 0017 14zm-5.5-3h5.23l-1.077-2.425c-.2-.448-.7-.754-1.267-.754H11.5v3.18zm-1-3.179v3.18H5.27l1.077-2.426c.2-.448.7-.754 1.268-.754H10.5zm-2 8.68a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 18A1.5 1.5 0 1017 15a1.5 1.5 0 000 3z" fill="currentColor"></path>
                        </g>
                    </svg>        
                    <p>Forget about rigid itineraries. With our system, flexibility is your best friend. Change your destination, adjust your schedule, and travel at your own pace. The freedom to customize every detail gives you complete control over your travel experience.</p>                
                </div>
            </div>
            <div class="col-lg-4 item-container">
                <div class="item">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="kirk-icon animated" role="img" aria-hidden="true" style="fill: var(--_1gzv7bhc);">
                        <g color="var(--_1gzv7bhc)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 11h-3.175L16.567 8.17c-.365-.82-1.23-1.348-2.181-1.348H7.615c-.952 0-1.817.527-2.182 1.348L4.175 11H3a1 1 0 00-1 1v4a1 1 0 001 1h1.55a2.5 2.5 0 004.9 0h5.1a2.5 2.5 0 004.9 0H21a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 3a2.5 2.5 0 00-2.45 2h-5.1a2.5 2.5 0 00-4.9 0H3v-4h18v4h-1.55A2.5 2.5 0 0017 14zm-5.5-3h5.23l-1.077-2.425c-.2-.448-.7-.754-1.267-.754H11.5v3.18zm-1-3.179v3.18H5.27l1.077-2.426c.2-.448.7-.754 1.268-.754H10.5zm-2 8.68a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 18A1.5 1.5 0 1017 15a1.5 1.5 0 000 3z" fill="currentColor"></path>
                        </g>
                    </svg>  
                    <p>Our system not only takes you to amazing destinations but also connects you with incredible people. Meet travelers with similar interests, share stories, and build lasting friendships while exploring the world in an authentic and personalized way.</p>                      
                </div>
            </div>
        </div>
    </div>
    `

    const callToAction = document.createElement('section');
        callToAction.innerHTML = `
        <div class="cta-container">
            <h3>Embark on Your Next Adventure!</h3>
            <p>Discover new horizons, create lasting memories, and make every journey an extraordinary experience.</p>
            <button id="cta-btn" type="button" class="btn btn-primary">Start Your Journey</button>
        </div>
        `;

        if (sessionStatus) {
            callToAction.querySelector("#cta-btn").onclick = () => navigateTo('/travel');
        } else {
            callToAction.querySelector("#cta-btn").onclick = () => navigateTo('/login');
        }
    homeContainer.appendChild(callToAction);

    return homeContainer;
}