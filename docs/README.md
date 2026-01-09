# KaliSukaar 

KaliSukaar is an e-commerce platform for various products.

## Project Structure

```
/your-project
├── /backend
│   ├── /controllers
│   │   ├── productController.js
│   │   └── userController.js
│   ├── /models
│   │   ├── productModels.js
│   │   └── userModels.js
│   ├── /routes
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── /middleware
│   │   └── authMiddleware.js
│   ├── /lib
│   │   └── db.js
│   └── server.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kaliskaar.git
```

2. Navigate to the project directory:

```bash
cd kaliskaar
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

5. Start the server:

```bash
npm start
```

The server will start on `http://localhost:5010`.

## API Documentation

### Summary of Endpoints

#### User Endpoints

| Method | Endpoint                         | Description               |
|--------|----------------------------------|---------------------------|
| POST   | /api/users/register              | Register a new user       |
| POST   | /api/users/login                 | Login a user              |
| GET    | /api/users/:userId              | Get user profile          |
| PUT    | /api/users/:userId/complete-profile | Complete user profile |

#### Product Endpoints

| Method | Endpoint                                        | Description              |
|--------|-------------------------------------------------|--------------------------|
| POST   | /api/products/:userId/products                  | Upload a new product     |
| GET    | /api/products                                   | Get all products         |
| GET    | /api/products/:productId                        | Get product by ID        |
| PUT    | /api/products/:userId/products/:productId       | Update a product         |
| DELETE | /api/products/:userId/products/:productId       | Delete a product         |
| GET    | /api/products/:productId/related?page=1&limit=4 | Get related products     |

### User API Endpoints

#### Register a new user

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "123"
  }
  ```

- **Success Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

- **Error Response:**
  ```json
  {
    "message": "Username or email already exists"
  }
  ```

#### Login a user

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "123"
  }
  ```

- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "token": "your_jwt_token",
    "userId": "user_id"
  }
  ```

- **Error Response:**
  ```json
  {
    "message": "User not found" or "Invalid credentials"
  }
  ```

#### Get user profile

- **URL:** `/api/users/:userId`
- **Method:** `GET`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Success Response:**
  ```json
  {
    "username": "john_doe",
    "email": "john.doe@example.com",
    ...
  }
  ```

#### Complete user profile

- **URL:** `/api/users/:userId/complete-profile`
- **Method:** `PUT`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Body:** JSON object with the user details to be updated
- **Success Response:**
  ```json
  {
    "username": "john_doe",
    "email": "john.doe@example.com",
    ...
  }
  ```

### Product API Endpoints

#### Upload a new product

- **URL:** `/api/products/:userId/products`
- **Method:** `POST`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Body:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    "tags": ["tag1", "tag2"]
  }
  ```

- **Success Response:**
  ```json
  {
    "message": "Product uploaded successfully"
  }
  ```

#### Get all products

- **URL:** `/api/products`
- **Method:** `GET`
- **Success Response:**
  ```json
  [
    {
      "name": "Product Name",
      "description": "Product Description",
      "price": 19.99,
      ...
    },
    ...
  ]
  ```

#### Get product by ID

- **URL:** `/api/products/:productId`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    ...
  }
  ```

#### Update a product

- **URL:** `/api/products/:userId/products/:productId`
- **Method:** `PUT`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Body:** JSON object with the product details to be updated
- **Success Response:**
  ```json
  {
    "message": "Product updated successfully"
  }
  ```

#### Delete a product

- **URL:** `/api/products/:userId/products/:productId`
- **Method:** `DELETE`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Success Response:**
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

#### Like a product

- **URL:** `/api/products/:productId/like`
- **Method:** `POST`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Success Response:**
  ```json
  {
    "message": "Product liked"
  }
  ```

#### Dislike a product

- **URL:** `/api/products/:productId/dislike`
- **Method:** `POST`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Success Response:**
  ```json
  {
    "message": "Product disliked"
  }
  ```

#### Favorite a product

- **URL:** `/api/products/:productId/favorite`
- **Method:** `POST`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Success Response:**
  ```json
  {
    "message": "Product added to favorites"
  }
  ```

#### Get related products

- **URL:** `/api/products/:productId/related?page=1&limit=4`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "relatedProducts": [
      {
        "name": "Related Product Name",
        "description": "Related Product Description",
        "price": 19.99,
        ...
      },
      ...
    ],
    "totalPages": 2
  }
  ```

### cURL Examples

#### Like a Product
```bash
curl -X POST http://localhost:5010/api/products/66927793f5d3ec3c6ed2cea6/like \
-H "Authorization: Bearer your_jwt_token"
```

#### Dislike a Product
```bash
curl -X POST http://localhost:5010/api/products/66927793f5d3ec3c6ed2cea6/dislike \
-H "Authorization: Bearer your_jwt_token"
```

#### Favorite a Product
```bash
curl -X POST http://localhost:5010/api/products/66927793f5d3ec3c6ed2cea6/favorite \
-H "Authorization: Bearer your_jwt_token"
```

## Contributing

We welcome contributions to improve this project. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.