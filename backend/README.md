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


PHASE THREE
In this phase the Travel Explorer API was upgraded from using the local JSON files to a fully integrated MongoDB Atlas database. It will now support  persistent storage, real-time CRUD operations, and enchanced querying capabilities.

FEATURES IMPLEMENTED

1. MongoDB Atlas Integration

-Configured a MongoDB Atlas cluster for cloud-based data storage.

-Added a secure .env file to store the connection URI.

-Created a database connection middleware (shared/middlewares/connect-db.js) using Mongoose to handle database connectivity efficiently.

-Ensured .env is added to .gitignore to prevent credentials from being pushed to GitHub.

2. Environment Configuration

-Installed and configured dotenv for environment variable management.

-Added environment variables for MongoDB URI and server port.

3. Mongoose Schemas & Models

Created Mongoose models for each data module:

-Destination schema includes: name, country, category, rating, pricePerPerson, and activities.

-User schema includes: email, password, favorites, and bookings.

-Added appropriate field types, validation, and unique constraints.

4. CRUD Operations with Mongoose

Replaced all file-based JSON logic with real MongoDB operations:

-Create: Add new destinations and users.

-Read: Retrieve all records or individual entries.

-Update: Modify existing destination details.

-Delete: Remove destinations and users from the database.

5. Search, Sort, and Pagination

Enhanced GET routes with dynamic query support:

-Search destinations by name (?search=paris).

-Sort results by any field (?sort=rating).

-Paginate results using page and limit query parameters.


6. API Testing with Postman

Verified all endpoints via Postman for correct CRUD functionality:

-/api/destinations routes for travel data.

-/api/users routes for user management (signup, view, delete).

-Confirmed database updates appear live in MongoDB Compass and Atlas.

7. Error Handling & 404 Responses

Implemented middleware to handle:

-Invalid routes (404 “Route not found”)

-Server errors (500 “Internal Server Error”)

-Validation errors via express-validator



