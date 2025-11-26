# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


PHASE FOUR

In Phase Four, the project evolved from a backend-only API into a fully functional full-stack web application with a modern React frontend. This phase focused on connecting the existing Express/MongoDB backend with a new React user interface, implementing real API communication, and enhancing the user experience using Material UI.

1. React Frontend Created Using Vite

Initialized a new frontend using vite.

Project structured into pages, components, and API folders.

Axios client configured to interact with the backend API.

2. Full CRUD Integration (API-Driven Only)

All frontend operations now communicate directly with the backend:

Create new destinations and users

Read destinations and user data from MongoDB

Update destination details

Delete users and destinations


3. Authentication Page (Login / Signup)

Users can sign up through the API (POST /users/signup).

Login is simulated (backend has no login route).

Successful login redirects users to the Destinations page.

Background image added for a modern UI.

4. Navigation Bar with Protected Routes

NavBar shows Destinations and Users only after logging in.

React Router used for:

/ → Login/Signup

/destinations → Destination List

/destinations/add → Add Destination

/destinations/edit/:name → Edit Destination

/users → User Profile Page

5. Improved Destinations Page

Search bar with server-side search.

“Add New Destination” button added.

Edit and Delete operations fully integrated with API.

Background image applied to the page.

6. Redesigned Users Page (User Profile Dashboard)

Dynamic user data loaded from MongoDB:

“USER PROFILE” heading

Personalized greeting: “Welcome back, user@email.com
”

Split layout showing:

Favorites list

Bookings list

Buttons added:

“Remove Favourites”

“Remove Bookings”

Background image applied for visual consistency.

8