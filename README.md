# YardSale E-Commerce - Backend 🏡

This is the backend application for YardSale, a modern e-commerce web application. This backend is responsible for handling user information and authentication, managing products serving and updating information, processing orders and individual shopping cart states.

## Take a look at the project online 👇
🔗 [YardSale E-Commerce](https://yardsale-ecommerce.netlify.app)

## Features

#### Routing /api/v1:
- #### /users:

  Establishes the routes and controllers for user-related operations, implementing authentication, data validation, and calls to the corresponding services to interact with user data in the database.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/932c156c-fa7a-43ac-86ba-232235efbae6" width="200px">

- #### /customers:

  Sets up the services to provide necessary information from users with a customer role, as well as create new profiles (signup) letting buy products and serving new functionalities only for customers.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/83fab72b-9f10-489a-9cc3-c3833ba96468" width="200px">

- #### /products:

  Provides different options for serving products information and description, adding the params to filter the results by a range of prices or by a specific category.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/a176a779-e336-44ae-a5b2-302532583935" width="600px">

- #### /categories:

  Mainly used to provide the existing categories for any request, but some services are reserved for admin user for functionalities like create, update or delete categories.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/a4bc041d-c196-445c-9217-9a0b5c50560e" width="200px">

- #### /shopping-cart:

  Gives a special services for existing customer so as to save in a list the products potencially found interesting to buy. This can be accessed login with one individual account.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/ca1183d8-b542-48b5-8ec0-372bf00d0b8a" width="200px">

- #### /orders:

  Reseved for customers that create a new order by purchasing products, they can only be access by their individual owner, delete or modify orders is only avaliable for admin users in some cases.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/222880c9-ccd0-4d4a-b4af-83e907614799" width="500px">

- #### /auth:

  Here users are permitted to login or recover their passwords by sending an email with its corresponding JWT to verify later with the new password within 15 minutes of range.
  
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/a2e5d122-c8bd-42d7-9763-3fac24d697c7" width="200px">
  <img src="https://github.com/VictorCar86/YardSale-E-Commerce-Backend/assets/96636507/9e0989b6-9256-4d10-95a7-cad2e2873e4d" width="600px">

#### Note: 🍪
Most of the request requires a JWT (Json Web Token) previously provided by the auth endpoint in order to work properly, this token is saved in the cookie called as "session" that is avaliable for 1 hour.

## Technologies Used
YardSale Backend is built using the following technologies:

- <img src="https://skills.thijs.gg/icons?i=nodejs" width="18px"> Node.js: A JavaScript runtime environment used for executing server-side code.
- <img src="https://skills.thijs.gg/icons?i=express" width="18px"> Express.js: A fast and minimal web application framework for Node.js, used for handling HTTP requests and building APIs.
- <img src="https://skills.thijs.gg/icons?i=sequelize" width="18px"> Sequelize: A promise-based ORM (Object-Relational Mapping) for Node.js, used for database management and query operations.
- <img src="https://skills.thijs.gg/icons?i=postgresql" width="18px"> PostgreSQL: A powerful and open-source relational database used for storing product information, user profiles, and order details.
- 👮‍ Passport: A middleware for handling user authentication strategies, including local and JWT (JSON Web Token) authentication.
- 🔐 Bcrypt: A library used for password hashing and salting to enhance security.
- 📚 Dotenv: A module used for managing environment variables, such as database credentials and API keys.
- 📩 Nodemailer: A module used for sending transactional emails, such as order confirmations and password reset emails.
- 🔎 Cors: A middleware used for enabling Cross-Origin Resource Sharing (CORS) to handle requests from the frontend.

## Installation
To run the YardSale Backend locally, follow these steps:

1. Clone the repository:

```sh
git clone https://github.com/VictorCar86/YardSale-E-Commerce-Backend.git
```

2. Install the necessary dependencies:

```sh
npm install
```

3. Set up the environment variables by creating a .env file and filling in the required values.

4. Run database migrations:

```sh
npm run migrations:run
```

5. Launch the application:

```sh
npm run start
```

The backend server will be running at http://localhost:8080 if there's no other setted port.

#### Note:
Make sure you have Node.js and PostgreSQL installed on your system. It is recommended to use Docker for a better experience.

## Contact
If you have questions, suggestions or comments, do not hesitate to contact me or follow on my social networks:

<img src="https://skills.thijs.gg/icons?i=linkedin" width="18px"> LinkedIn: [/in/victorcar86](https://www.linkedin.com/in/victorcar86/)

<img src="https://skills.thijs.gg/icons?i=twitter" width="18px"> Twitter: [@victorcar86_](https://www.twitter.com/victorcar86_/)
