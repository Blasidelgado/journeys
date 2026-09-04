# Journeys

**Journeys** is a carpooling platform: drivers publish trips they are already making, and travellers claim the seats those cars would otherwise carry empty.

## Motivation

The idea comes from watching the same problem in two countries. In Argentina, my home country, my social feeds were full of people trying to solve a scheduling puzzle that scheduled transport could not: people, mainly students, hoping to reach their home town for a holiday or weekend. The route existed. The departure time, or available transport capacity, did not.

Moving to Costa Rica in 2026 showed me the same gap wearing different clothes. This is a country of 5.4 million people in 51,000 km² — smaller than West Virginia, and it would rank 42nd by area if it were a US state. You can drive from the Caribbean coast to the Pacific in a morning. And yet its registered fleet passed two million vehicles in 2025 after growing by more than 170,000 in a single year: roughly one vehicle for every 2.6 inhabitants. Congestion in the Greater Metropolitan Area is estimated to cost around 4% of GDP, road infrastructure has not kept pace, and public transport outside the bus network thins out quickly. The distances are short. The traffic is not.

What makes this worth building is a detail that congestion statistics tend to bury: **the roads are not only full of cars, they are full of empty seats.** Average vehicle occupancy sits near 1.5, with drivers travelling alone on roughly two thirds of trips. The spare capacity is already moving — it simply is not visible to the person standing at the bus terminal. Journeys is an attempt to make that capacity findable.

The application ships seeded with Californian cities, a single-timezone corridor that a US reader can picture immediately. California is roughly eight times Costa Rica in both area and population, and the same dynamic — full roads, empty seats — scales in either direction.

## Distinctiveness and Complexity

### Why this is distinct from the other projects in the course

The most likely misreading of this project is that a trip with a seat price is a product with a price, which would make it a variation on the auction site from Project 2. It is not, and the difference is structural rather than cosmetic. There is no cart, no checkout, no payment flow, no bidding, and nothing is transferred from one party to another. What a passenger claims is not an item but **a seat on a scheduled event with finite capacity**, and the same seat becomes available again the moment they release it. The unit of the domain is an appointment, not a listing.

That distinction produces a data model the course projects do not have. A `JourneyDetails` row is a **future event**: it exists on a timeline, it expires, and the rules that govern it depend on when it is happening rather than on who owns it. Journeys must be scheduled at least twenty-four hours ahead. Every listing query filters on `date__gt=now`, so the catalogue is not a table of records but a moving window. Nothing in the wiki, the auction site, the mail client, or the social network has a time dimension that gates behaviour this way.

The role model is also bidirectional in a way a social network's is not. A user is not a "driver" or a "passenger" as an account type; they are a driver *on one journey* and a passenger *on another*, simultaneously. `UserProfile` therefore carries two distinct relationships to the same table — `driven_journeys` as a foreign key and `journeys_as_passenger` as a many-to-many — and most of the interface logic exists to answer "what am I to *this* journey?" before deciding what to render.

Seat capacity adds a third element the other projects lack: **shared mutable state under contention**. `available_seats` decrements when a passenger joins and increments when they leave, guarded server-side so a full journey cannot be oversold. Joining is a toggle rather than a create, so the same endpoint must reason about the user's current relationship to the row before deciding what the request even means.

Finally, publishing a journey is gated on **profile completeness rather than authentication**. Being logged in is not enough; a driver must have registered a licence and a car. This is a domain rule expressed through the data model — `UserProfile.has_license()` and `has_car()` — and it means the same authenticated user sees a different application depending on what they have filled in.

### Why it is complex

The front end is roughly two thousand lines of hand-written JavaScript with no framework and no build step. The core of it is a **client-side router** in `index.js` that maps the browser's path to a page function. It supports dynamic segments (`/journey/:id`, `/profile/:username`) by compiling each route into a regular expression, drives navigation with `history.pushState` so URLs are real and shareable, and listens for `popstate` so the browser's back and forward buttons behave correctly. Django cooperates by serving the same template for every view route while the client decides what to render, and the API surface — eleven JSON endpoints — is kept entirely separate under `/api/`.

The most involved piece is the **multi-step journey wizard**, built from three classes with separate responsibilities: `JourneyForm` orchestrates state and navigation, `Step` encapsulates a single step's rendering and validation, and `Validation` is a stateless collection of rules. Each step validates before the wizard will advance, the summary step re-renders on every entry so returning to fix an earlier answer never shows stale data, and submission failures surface through the same error mechanism the steps already use.

Handling time correctly turned out to be the subtlest problem in the project, and it is documented under design decisions below because the naive approach fails silently.

Validation is deliberately layered, and only the server is authoritative. The same rule appears in an input's `min` attribute for immediate affordance, in the client validator for fast feedback, and in the model for enforcement: seat counts and prices carry field validators, the twenty-four-hour rule is checked again in the view, and publishing is gated behind a permission check that returns `403` if the driver has no licence or car. A request crafted outside this interface is held to exactly the same rules. The client's copy is a convenience, and the wizard's step-by-step gating is the reason it exists: revalidating every step against the network would make the form unusable offline and sluggish online.

The backend contributes a relational model with four tables, a many-to-many relationship, a `UniqueConstraint` preventing a driver from being in two places at once, model-level validation through `clean()`, pagination across three separate listing views, and a **data migration** that seeds the city catalogue so the application is usable immediately after `migrate` with no manual setup.

## What's in each file

### Backend

- **`travel/models.py`** — Four models. `UserProfile` extends Django's `User` one-to-one with a licence, a car and a description, and exposes `has_license()` / `has_car()` for the publishing gate. `Car` holds plate, brand and model. `City` is the curated catalogue used for origins and destinations. `JourneyDetails` is the core entity: date, driver, origin, destination, seat price, available seats, passengers, and an active flag, with a `UniqueConstraint` on date and driver and a `clean()` method rejecting journeys whose origin and destination are the same.
- **`travel/views.py`** — All view logic. `index` serves the single template for every client route. The API is organised around method-dispatching handlers (`handle_users`, `handle_travel`, `handle_session`) that delegate to focused functions for retrieval, creation, joining, leaving and cancelling. Listing views are paginated and filter out journeys already in the past.
- **`travel/urls.py`** — Ten client routes all pointing at `index`, so a deep link or a page refresh works, and eleven `/api/` routes for data.
- **`travel/migrations/0016_seed_california_cities.py`** — A `RunPython` data migration seeding the city catalogue idempotently, with a reverse function so it can be rolled back.
- **`travelproject/settings.py`** — Standard Django configuration, with `USE_TZ` disabled deliberately (see below).

### Frontend

- **`js/index.js`** — Router, application state and page dispatch.
- **`js/pages/`** — One module per screen: `home`, `travel` (the driver/passenger entry point), `journeys`, `myJourneys`, `journeyDetail`, `newJourney`, `profile`, and `auth/` for login, register and logout.
- **`js/components/`** — Reusable pieces: `JourneyForm`, `Step` and `Validation` make up the wizard; `navBar`, `footer`, `pageButtons` and `searchJourney` are shared UI.
- **`js/utils/`** — `fetchData` wraps GET requests, `csrfHandler` reads Django's CSRF cookie, `handleSession` reports the current user, `parseJourneys` renders journey cards and formats dates and prices, and `sendNewJourney` posts a new journey.
- **`templates/travel/index.html`** — The single page shell, loading Bootstrap and the entry-point module.
- **`static/travel/css/styles.css`** — Custom styling layered over Bootstrap.

## How to run

The project requires **Python 3.12**. Django 4.2 LTS does not support Python 3.13 or newer, and the admin fails at runtime on those versions.

```bash
python3.12 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate          # also seeds the city catalogue
python manage.py runserver
```

The application is then available at `http://127.0.0.1:8000/`. Register an account through the interface to begin. To publish a journey you must first add a licence and a car to your profile — the interface will prompt you. Optionally, `python manage.py createsuperuser` gives access to the Django admin at `/admin/`.

## Design decisions

**Journey times are timezone-free labels, not global instants.** A departure time is only meaningful at its origin: a carpool leaving "8:00 AM" leaves at eight o'clock where the car is, and no passenger needs that re-expressed in another zone. The application therefore captures, stores, transmits and displays the datetime as a literal wall-clock string, with `USE_TZ` disabled so Django persists it unchanged. This sounds like a simplification but requires discipline: any code that wraps the value in a JavaScript `Date` reintroduces conversion against the *viewer's* clock, so a journey created in one timezone would display shifted in another. Scoping the seeded cities to a single state removes the conversion problem entirely rather than solving it.

**Cities are curated reference data.** Users choose from a catalogue seeded at migration time and manageable through the Django admin, rather than typing free text. This keeps origins and destinations consistent — no competing spellings of the same city fragmenting search results.

## Future work

Estimated arrival time was designed and deliberately deferred: modelling it as a duration rather than an absolute arrival avoids a midnight-crossing edge case, but it was outside the scope of this submission. Seat prices are informational — the platform helps travellers agree on a contribution, it does not process payments, and adding settlement would be the largest single change to the domain. The automated test suite is not yet written; correctness was verified through manual testing against the running application.
