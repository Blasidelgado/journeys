import checkSessionStatus from "./utils/handleSession.js";
import homePage from "./pages/home.js";
import loginPage from "./pages/auth/login.js";
import registerPage from "./pages/auth/register.js";
import navBar from "./components/navBar.js";
import travelPage from "./pages/travel.js";
import profilePage from "./pages/profile.js";
import footerComponent from "./components/footer.js";
import allJourneys from "./pages/journeys.js";
import journeyDetail from "./pages/journeyDetail.js";
import myJourneys from "./pages/myJourneys.js";
import searchJourney from "./components/searchJourney.js";
import newJourneyPage from "./pages/newJourney.js";
import logout from "./pages/auth/logout.js";

export const appState = {
    sessionStatus: false,
    userId: null,
    username: null,
};

document.addEventListener('DOMContentLoaded', function() {
    // Create and append elements after DOMContentLoaded
    const root = document.getElementById('root');

    const header = document.createElement('header');
    const main = document.createElement('main');
    const footer = document.createElement('footer');

    root.appendChild(header);
    root.appendChild(main);
    root.appendChild(footer);

    // Define the routing table after elements are added to DOM
    const routes = {
        '/': () => loadPage('/'),
        '/journeys': (page) => loadPage('/journeys', page),
        '/profile/:username': (username) => loadPage('/profile', username),
        '/travel': () => loadPage('/travel'),
        '/new-journey': () => loadPage('/new-journey'),
        '/my-journeys': (page) => loadPage('/my-journeys', page),
        '/search-journey': () => loadPage('/search-journey'),
        '/journey/:id': (id) => loadPage('/journey', id),
        '/login': () => loadPage('/login'),
        '/register': () => loadPage('/register'),
        '/logout': () => loadPage('/logout'),
    };

    // Handle URL change and update the content
    async function navigateTo(url, payload) {
        let dynamicUrl = url;
        if (dynamicUrl.startsWith('/profile') || dynamicUrl === '/journey') {
            dynamicUrl = `${url}/${payload}`;
        }
        if (dynamicUrl.startsWith('/journeys') && payload || dynamicUrl.startsWith('/my-journeys') && payload) {
            dynamicUrl = `${url}?page=${payload}`
        }
        history.pushState({ url: dynamicUrl, payload }, '', dynamicUrl);
        router();
    }

    async function router() {
        const path = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const pageParam = searchParams.get('page');
        
        const route = Object.keys(routes).find(route => {
            // Match static paths
            if (route === path) return true;
            
            // Match dynamic paths
            const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '([^/]+)')}$`);
            return routeRegex.test(path);
        });
    
        if (!route) {
            console.error('Route not found');
            return;
        }
    
        // Extract dynamic parameters from the path
        const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '([^/]+)')}$`);
        const match = path.match(routeRegex);    
        // Call the route handler with the extracted parameters
        if (match && match.length > 1) {
            routes[route](match[1]);
        } else {
            routes[route](pageParam);
        }
    }

    // Event listener for navigation links
    document.addEventListener('click', (event) => {
        if (event.target.matches('[data-page')) {
            event.preventDefault();
            navigateTo(
                event.target.dataset.page,
                event.target.dataset.page === '/profile' ? 
                    appState.username :
                    null
            )
        }
    });

    // Handle back/forward button navigation
    window.addEventListener('popstate', router);

    // Initialize the router when the page loads
    router();

    async function loadPage(page, payload) {
        const header = document.querySelector("header");
        const body = document.querySelector("main");
        const footer = document.querySelector("footer");
        if (!header || !body || !footer) {
            console.error("Header, main, or footer not found in the DOM");
            return;
        }
    
        header.innerHTML = null;
        body.innerHTML = null;
        footer.innerHTML = null;
    
        await updateSessionStatus();
        header.appendChild(navBar(appState.sessionStatus));
        footer.appendChild(footerComponent());
        
        switch(page) {
            case '/':
                body.appendChild(await homePage(appState.sessionStatus, navigateTo));
                break;
            case '/travel':
                body.appendChild(await travelPage(navigateTo, appState));
                break;
            case '/search-journey':
                body.appendChild(await searchJourney());
                break;
            case '/new-journey':
                body.appendChild(newJourneyPage(navigateTo));
                break;
            case '/journeys':
                body.appendChild(await allJourneys(navigateTo, payload));
                break;
            case '/my-journeys':
                body.appendChild(await myJourneys(navigateTo, payload));
                break;
            case '/profile':
                body.appendChild(await profilePage(appState.sessionStatus, payload));
                break;
            case '/journey':
                body.appendChild(await journeyDetail(payload, navigateTo, appState));
                break;
            case '/login':
                if (!appState.sessionStatus) {
                    body.appendChild(await loginPage(navigateTo));
                    break;
                } else {
                    body.appendChild(await homePage(appState.sessionStatus, navigateTo));
                    break;
                }
            case '/register':
                body.appendChild(registerPage(navigateTo));
                break;
            case '/logout':
                await logout(navigateTo);
                break;
        }
    }
});


async function updateSessionStatus() {
    const sessionData = await checkSessionStatus();
    appState.sessionStatus = sessionData.success;
    appState.userId = sessionData.userId ?? null;
    appState.username = sessionData.username ?? null;
}
