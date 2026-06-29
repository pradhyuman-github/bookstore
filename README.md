# BookVerse

A full stack E-commerce web application with responsive design, seamless frontend-backend integration, user authentication, cart management, order handling and admin dashboard.
Demo Link: [Click here](https://bookstore-frontend-al1q.onrender.com)

## Tech Stack
- Frontend: React.js, Tailwind CSS, React Router, Motion, Remix Icons
- Backend: Node.js, Express.js, MongoDB Atlas, JSON Web Token (JWT), CORS, Multer, Cookie parser, Express Rate Limit

## Key Features
### Customer Features
- Responsive and mobile-friendly user interface
- Dynamic book carousel and promotional offers
- Best seller and recommended books sections
- Product listing with filtering and sorting
- Shopping cart functionality:
  - Update quantities
  - Add/Remove items
  - Product details view
- User authentication & user profile management
- Order handling:
  - Order history
  - Order cancellation and return functionality
- Coupon based discount
- Invoice generation and PDF download

### Admin Features
- Secure admin authentication
- Admin Dashboard
- Complete Book management (Create/Read/Update/Delete)
- Coupon management system
- Order management
- Full administrative control over platform resources

## Installation
- Clone the Repository
  ```
  git clone <repository-url>
  cd bookverse
  ```
- Install Dependencies
  - Frontend:
    ```
    cd client
    npm install
    ```
  - Backend:
    ```
    cd server
    npm install
    ```

- Configure Environment Variables
  - Create a .env file in the server directory:
    ```
    PORT=
    MONGODB_URI=
    JWT_SECRET=
    CLIENT_URL=
    ```

- Run the Application
  - Backend: ``` npm start ```
  - Frontend: ``` npm run dev ```
