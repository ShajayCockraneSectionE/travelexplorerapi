TRAVEL EXPLORER API
This is a Node.js and Express-based backend application that allows users to explore travel destinations,manage bookings, and maintain user profiles.

PHASE TWO
This phase focuses on modularizing the codebase , organizing routes, implementing data models and adding middleware for validation and error handling.

FEATURES IMPLEMENTED
-Created the modular project structure(this phase introduced a clean and organized folder structure separting logic into different modules. It ensures scalability and makes it easier to maintain or extend the application).

-Created the destinations module which manages all travel destination data where we can fetch all destinations, get a destination by name, add a new destination, update destination details and delete destination. Each destination include the name,country,category, ratings, priceperperson and activities. All the data is stored in the destinations.json file.

-Created the users module which manages user registration,profile and account operations, where we can create a new user profile, fetch all users and delete a user account(admin only). Each user includes an email and password and the data is stored in the users.json file.

-Created a custom validation middleware using Express Validator to ensure input validation for both destinations and users. This is to ensure that only valid data is saved to the JSON files.

-Created data models to handle all read/write operations to JSON files using Node's fs module.

-Added global middleware such as parsing JSON requests using express.json(), handling 404(route not found) and handling 500(internal server errors).

-Mounted the API Routes in server.js. The /api prefix distingushes backend API routes from potential frontend routes.

-Postman was used to test all end points




